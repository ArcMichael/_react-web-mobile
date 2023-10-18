import configAuth from "../../../etc/configAuth.json";
import AuthRedirect from "./AuthRedirect";
import device_inMiniProgramsEnvironment from "../device/device_inMiniProgramsEnvironment";
import GetSingleCookie from "./GetSingleCookie";
import configWhite from "../../../etc/configWhiteList.json";
import globalToast from "./globalToast";
import isBrowser from "../../Utils/utils/isBrowser";

/*
 * A.如果API返回STATUS == 401 重定向到 登录页
 * B.如果路由在安全区，并且无Token 重定向到 登录页
 * @param json
 * @return {*}
 * @constructor
 *
 */
function GetConfirmation(json) {
  /** @type {any[]} - description */
  const _AuthList = configAuth.url;

  /** @type {any[]} - description */
  const _AuthUser = configAuth.user;

  const _PathName = window.location.pathname;

  let _Token;
  if (device_inMiniProgramsEnvironment()) {
    _Token = json.ajaxOptions.headers.Token;
  } else {
    _Token = GetSingleCookie(window.document.cookie, "Token");
  }
  const _tpId = GetSingleCookie(window.document.cookie, "tpId");
  const _bindId = GetSingleCookie(window.document.cookie, "bindId");

  const _AuthWhite = configWhite.url;
  const ajaxOptions = json && json.ajaxOptions;
  // 无论是否需要验证的接口 首先判断是否被限流 如果被限流跳转到限流页面,未被限流继续走流程

  if (
    (json && json.jQueryStatus && json.jQueryStatus.status === 429) ||
    (json && json.status === 429)
  ) {
    if (!(json.ajaxOptions && json.ajaxOptions.url.indexOf("/v1/marketing/availability") > -1))
      window.location.href = `/v2/html/currentLimiting?prePage=${encodeURIComponent(
        window.location.href,
      )}`;
  }
  if (
    (json && json.jQueryStatus && json.jQueryStatus.status === 423) ||
    (json && json.status === 423)
  )
    return globalToast({
      message:
        (json && json.jQueryStatus && json.jQueryStatus.message) || "网络开小差了，请过会重试",
    });
  if (
    (json && json.jQueryStatus && json.jQueryStatus.status === 421) ||
    (json && json.status === 421)
  ) {
    window.location.href = `/v2/html/rewardsBoutiqueLimit`;
  }
  // FLAG => 页面级别
  let match = false;

  // USER => 接口级别
  let user = false;

  // IS_CLIENT && WHITE
  if (isBrowser()) {
    _AuthList.forEach((data) => {
      if (window.location.pathname.match(new RegExp(data))) {
        match = true;
      }
    });
  }

  // 当前接口公共页面 但是必须有Token 才能够被访问
  if (ajaxOptions) {
    _AuthUser.forEach((data) => {
      if (ajaxOptions.url.indexOf(data) > -1) {
        user = true;
      }
    });
  }

  if (!match && !user) {
    return json;
  }
  // jQuery 接口 || nodeFetch 接口 401 Token 过期逻辑

  if ((json && json.jQueryStatus && json.jQueryStatus.status === 401) || json.status === 401) {
    if (_AuthWhite.indexOf(_PathName) > -1 && (_tpId || _bindId)) {
      return json;
    }
    AuthRedirect(window.location);
  }

  // 安全类页面没有Token
  if (_AuthList.indexOf(_PathName) > -1 && !_Token) {
    if (_AuthWhite.indexOf(_PathName) > -1 && (_tpId || _bindId)) {
      return json;
    }
    AuthRedirect(window.location);
  }
  return json;
}

export default GetConfirmation;
