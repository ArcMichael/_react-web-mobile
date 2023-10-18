import $ from "jquery";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import getConfigs from "isomorphisms/getConfigs";
import isBrowser from "@/Utils/utils/isBrowser";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import configAuth from "../../etc/configAuth.json";
import * as url from "./url";
import { userLogout } from "./BLL";
import configWhite from "../../etc/configWhiteList.json";
import * as device from "./device";

const configs = getConfigs();

// 更改加密方式
export function GetSingleCookie2V2({ key = false }) {
  if (!window) return false;
  if (!window.document) return false;
  if (!window.document.cookie) return false;
  if (!key) return false;

  let List;
  const Reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
  if ((List = document.cookie.match(Reg))) {
    return decodeURIComponent(List[2]);
  }
  return false;
}
export function SetSingleCookie2({
  key = false,
  value = false,
  time = false,
  domain = false,
  path = "/",
}) {
  if (!window) return false;
  if (!window.document) return false;
  if (!window.document.cookie) return false;
  if (!key) return false;
  // if (!value) return false;

  const _strSecond = time || 1000 * 60 * 60 * 24 * 365 * 20;
  const _exp = new Date();
  _exp.setTime(_exp.getTime() + _strSecond * 1);

  let _setCookie = `${key}=${escape(value)};`;
  _setCookie += ` expires=${_exp.toUTCString()};`;
  if (domain) _setCookie += ` domain=${domain};`;
  _setCookie += ` path=${path};`;
  window.document.cookie = _setCookie;
}

export function SetSingleCookie2V2({
  key = false,
  value = false,
  time = false,
  domain = false,
  path = "/",
}) {
  if (!window) return false;
  if (!window.document) return false;
  if (!window.document.cookie) return false;
  if (!key) return false;
  if (!value) return false;

  const _str_second = time || 1000 * 60 * 60 * 24 * 365 * 20;
  const _exp = new Date();
  _exp.setTime(_exp.getTime() + _str_second * 1);

  let _set_cookie = `${key}=${encodeURIComponent(value)};`;
  _set_cookie += ` expires=${_exp.toUTCString()};`;
  if (domain) _set_cookie += ` domain=${domain};`;
  _set_cookie += ` path=${path};`;
  window.document.cookie = _set_cookie;
}

export function DelSingleCookie2({ key = false, domain = false, path = "/" }) {
  if (!window) return false;
  if (!window.document) return false;
  if (!window.document.cookie) return false;
  if (!key) return false;

  const _exp = new Date();
  _exp.setTime(_exp.getTime() - 1);
  let _set_cookie = `${key}=` + `` + `;` + `expires=` + `-1` + `;`;
  if (domain) _set_cookie += ` domain=${domain};`;
  _set_cookie += ` path=${path};`;
  window.document.cookie = _set_cookie;
}

export function typeofString(data) {
  return typeofPrototype(data) === "[object String]";
}

// sprint9 当接口返回423时，展示全局的toast
export function globalToast({ message }) {
  window.ifShow = true;
  if (window.ifShow) {
    if (
      document.getElementsByClassName("homePopUp") &&
      document.getElementsByClassName("homePopUp").length > 0
    )
      return;
    const html = document.createElement("div");
    html.className = "homePopUp";
    html.innerHTML = `<div class="centerText" style=>${message}</div>`;
    document.getElementById("root").appendChild(html);
    setTimeout(() => {
      document.getElementById("root").removeChild(html);
      window.ifShow = false;
    }, 3000);
  }
}
export function typeofPrototype(data) {
  return Object.prototype.toString.call(data);
}
/*
 * A.如果API返回STATUS == 401 重定向到 登录页
 * B.如果路由在安全区，并且无Token 重定向到 登录页
 * @param json
 * @return {*}
 * @constructor
 *
 */
export function GetConfirmation(json) {
  const _AuthList = configAuth.url;

  const _AuthUser = configAuth.user;

  const _PathName = window.location.pathname;

  let _Token;
  if (device.device_inMiniProgramsEnvironment()) {
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
    if (
      !(
        json.ajaxOptions &&
        json.ajaxOptions.url.indexOf("/v1/marketing/availability") > -1
      )
    )
      window.location.href = `/v2/html/currentLimiting?prePage=${encodeURIComponent(
        window.location.href
      )}`;
  }
  if (
    (json && json.jQueryStatus && json.jQueryStatus.status === 423) ||
    (json && json.status === 423)
  )
    return globalToast({
      message:
        (json && json.jQueryStatus && json.jQueryStatus.message) ||
        "网络开小差了，请过会重试",
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
    _AuthList.map((data) => {
      if (window.location.pathname.match(new RegExp(data))) {
        match = true;
      }
    });
  }

  // 当前接口公共页面 但是必须有Token 才能够被访问
  if (ajaxOptions) {
    _AuthUser.map((data) => {
      if (ajaxOptions.url.indexOf(data) > -1) {
        user = true;
      }
    });
  }

  if (!match && !user) {
    return json;
  }
  // jQuery 接口 || nodeFetch 接口 401 Token 过期逻辑

  if (
    (json && json.jQueryStatus && json.jQueryStatus.status === 401) ||
    json.status === 401
  ) {
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

export function AuthRedirect(WL) {
  WL.href = `/login?historyLocation=${
    encodeURIComponent(WL.pathname.replace("/", "")) +
    WL.search.replace("?", "&")
  }`;
}

export function GetCookie(params, callback) {
  // prototype 设定默认CookieId 和 CookieToken
  // let relCookieID = 'ghost';
  let relCookieID = null;
  let relCookieToken = null;

  if (!params.Cookie) {
    // NO Cookie Callback Ghost
    return callback(relCookieID, relCookieToken);
  }

  if (GetSingleCookie(params.Cookie, "Token")) {
    relCookieToken = GetSingleCookie(params.Cookie, "Token");
  }

  if (GetSingleCookie(params.Cookie, "UID")) {
    relCookieID = GetSingleCookie(params.Cookie, "UID");
  }

  // NO match Callback Ghost
  return callback(relCookieID, relCookieToken);
}

/**
 *
 * @param {import('express').Request} req
 * @param {*} res
 * @param {*} url
 * @param {*} params
 * @param {*} callback
 */
export function GetFetch(req, res, url, params, callback) {
  const cookies = req.headers.cookie ? req.headers.cookie.split("; ") : "";
  let relCookieToken;
  let relCookieUserId;
  if (params && params.headers && params.headers.UID) {
    relCookieUserId = params.headers.UID;
  }
  for (let i = 0; i < cookies.length; i++) {
    const tmpCookie = cookies[i].split("=");
    if (tmpCookie[0].match(/^Token\d*/)) {
      relCookieToken = tmpCookie[1];
    }
    if (tmpCookie[0].match(/^UID\d*/)) {
      relCookieUserId = tmpCookie[1];
    }
  }

  if (
    !url.match(
      /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
    ) == null
  ) {
    callback({ status: 1, message: "error format Url" });
    return;
  }

  if (Object.prototype.toString.call(params) !== "[object Object]") {
    callback({ status: 1, message: "error format Patams" });
    return;
  }

  if (params.method == null) {
    callback({ status: 1, message: "error Params Method" });
    return;
  }

  if (!params.headers) {
    params.headers = {};
  }
  params.headers.Token = relCookieToken;
  params.headers.UID = relCookieUserId;

  params.headers["Content-Type"] = "application/json";
  params.headers["User-Agent"] = req.headers["user-agent"];
  params.headers.Referer = req.headers.referer || "";

  fetch(url, params)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        // 续cookie node发送到客户端设置请求头带cookie
        if (
          response &&
          response.headers &&
          response.headers._headers &&
          response.headers._headers["set-cookie"]
        ) {
          for (const i in response.headers._headers["set-cookie"]) {
            res.append(
              "Set-Cookie",
              response.headers._headers["set-cookie"][i]
            );
          }
        }
        return Promise.resolve(response);
      }
      if (response.status === 401) {
        return Promise.resolve(response);
      }
      console.error(response.statusText);
      return Promise.reject(new Error(response.statusText));
    })
    .then((json) => json.json())
    .then(function (data) {
      callback({
        status: data.status,
        results: data,
      });
    })
    .catch((error) => {
      callback({
        status: 1,
        results: { results: error },
      });
      console.log(JSON.stringify({ url, params, error }));
    });
}

export function GetSingleCookie(documentCookies, cookie) {
  if (cookie) {
    var arr = documentCookies.match(new RegExp(`(^| )${cookie}=([^;]*)(;|$)`));
  } else {
    arr = document.cookie.match(
      new RegExp(`(^| )${documentCookies}=([^;]*)(;|$)`)
    );
  }

  if (arr != null) {
    return unescape(arr[2]);
  }
  return null;
}
export function SetTimeCookie(cookie, value) {
  const Times = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Times * 60 * 1000);
  window.document.cookie = `${cookie}=${escape(
    value
  )};expires=${exp.toGMTString()}; domain=.sephora.cn; path=/`;
}

export function SetForeverCookie(cookie, value) {
  const Times = 60 * 24 * 365 * 20;
  const exp = new Date();
  exp.setTime(exp.getTime() + Times * 60 * 1000);
  window.document.cookie = `${cookie}=${escape(
    value
  )};expires=${exp.toGMTString()}; domain=.sephora.cn; path=/`;
}
export function TrackEnterResource() {
  const query = getLocationQuery();
  const utm_source = query.utm_source;
  const utm_medium = query.utm_medium;
  const utm_campaign = query.utm_campaign;
  const utm_content = query.utm_content;
  const utm_term = query.utm_term;
  const benefit_code = query.code;
  if (utm_source || utm_medium || utm_campaign || utm_content || utm_term) {
    const j = {};
    j.utm_source = encodeURIComponent(utm_source);
    j.utm_medium = encodeURIComponent(utm_medium);
    j.utm_campaign = encodeURIComponent(utm_campaign);
    j.utm_content = encodeURIComponent(utm_content);
    j.utm_term = encodeURIComponent(utm_term);
    j.currentTime = String(new Date().getTime());
    const stringjson = JSON.stringify(j);
    SetTimeCookie("order_source", stringjson);
    if (!GetSingleCookie2({ key: "first_touch_source" })) {
      SetForeverCookie("first_touch_source", stringjson);
    }
  }
  if (benefit_code) {
    const URI_code = encodeURIComponent(benefit_code);
    const string_code = JSON.stringify(URI_code);
    // SetTimeCookie('benefit_code', string_code);
    SetSingleCookie2({
      key: "benefit_code",
      domain: ".sephora.cn",
      value: string_code,
    });
  }
}
/*
 * Get style by dom or class
 */
export function getStyle(selector, style) {
  if (!style) return;

  if (window && document && window.getComputedStyle && document.querySelector) {
    if (typeof selector === "string") {
      return window.getComputedStyle(document.querySelector(selector))[style];
    }
    return window.getComputedStyle(selector)[style];
  }
}

/**
 * 用来校验传入的url 是否配置 track code
 * zoneTian
 * @param {string} link
 * @param {string?} omniture
 */
export function CheckCampaignCode(link, omniture) {
  if (/intcmp=|kwrec=|prodlink=/.test(link)) {
    return link;
  }
  if (!omniture || omniture === "") {
    return link;
  }
  let hashNum = "";
  let query = link.split("?")[1] || null;
  let omni = omniture.split("?")[1] || omniture.split("?")[0];
  omni = omni.split("&")[1] || omni.split("&")[0];
  let domain = link.split("?")[0];
  if (/#/.test(link) || /#/.test(omniture)) {
    const linkHash = link.split("#")[1] || "";
    const omnitureHash = omniture.split("#")[1] || "";
    domain = domain.split("#")[0];
    hashNum =
      linkHash && omnitureHash
        ? `#${linkHash}&${omnitureHash}`
        : `#${linkHash}${omnitureHash}`;
    query = (link.match(/\?(\S*)\#/) && link.match(/\?(\S*)\#/)[1]) || null;
  }
  return query
    ? `${domain}?${query}&${omni}${hashNum}`
    : `${domain}?${omni}${hashNum}`;
}

export function soaLoginOff(notGoHome) {
  new Promise((res) => {
    try {
      userLogout(() => {
        res(true);
      });
    } catch (error) {
      res(true);
    }
  }).then(() => {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = `UID=; expires=${exp.toGMTString()}; path=/`;
    document.cookie =
      `Token=; expires=${exp.toGMTString()}; path=/` + `; domain=.sephora.cn`;
    if (!notGoHome) {
      location.href = "/";
    }
  });
}
// 判断在微信内打开且带有accessToken和openid 显示切换账号按钮 进行微信解绑操作
export function judgeIsChangeUser() {
  return false;
  if (
    /(micromessenger|webbrowser)/.test(
      window.navigator.userAgent.toLocaleLowerCase()
    ) &&
    url.urlGetParams(window.location, "access_token") &&
    url.urlGetParams(window.location, "openid")
  ) {
    return true;
  }
  return false;
}

/**
 * 获取产品的规格显示
 */
export const getProductSpecs = (params = {}) => {
  let productSpecs = "";
  // if (params && params.spec) productSpecs = `${params.spec}`
  if (params && params.specType)
    productSpecs = `${params && params.spec}${
      params.specType == "weight"
        ? "g"
        : params.specType == "volume"
        ? "ml"
        : ""
    }`;
  productSpecs = productSpecs
    ? `${productSpecs}${(params && params.custom && `,${params.custom}`) || ""}`
    : (params && params.custom) || "";
  return productSpecs ? `规格:${productSpecs}` : "";
};

// copyToClipboard  web端拷贝到粘贴板到方法

export const copyToClipboard = (text, fun) => {
  const textString = text.toString();
  let input = document.querySelector("#copy-input");
  if (!input) {
    input = document.createElement("input");
    input.id = "copy-input";
    input.readOnly = "readOnly"; // 防止ios聚焦触发键盘事件
    input.style.position = "fixed";
    // input.style.left = "-1000px";
    input.style.zIndex = "-1000";
    document.body.appendChild(input);
  }
  input.value = textString;
  // ios必须先选中文字且不支持 input.select();
  selectText(input, 0, textString.length);
  if (document.execCommand("copy")) {
    document.execCommand("copy");
    fun && fun("copySuccess");
  } else {
    console.log("不兼容");
  }
  input.blur();
  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  function selectText(textbox, startIndex, stopIndex) {
    if (textbox.createTextRange) {
      // ie
      const range = textbox.createTextRange();
      range.collapse(true);
      range.moveStart("character", startIndex); // 起始光标
      range.moveEnd("character", stopIndex - startIndex); // 结束光标
      range.select(); // 不兼容苹果
    } else {
      // firefox/chrome
      textbox.setSelectionRange(startIndex, stopIndex);
      if (/android/.test(navigator.userAgent.toLocaleLowerCase())) {
        textbox.focus();
      }
    }
  }
};

// 保存设备信息
export function saveDeviceInfo() {
  if (!localStorage.getItem("ua_parse")) {
    $.post("/api/SOA/save/device/information", "", (json) => {
      localStorage.setItem(
        "ua_parse",
        json && json.message && JSON.stringify(json.message)
      );
    });
  }
}

export function isWeChatForLand() {
  if (!window) return false;
  const accesstoken = url.urlGetParams(window.location, "access_token") || "";
  const openid = url.urlGetParams(window.location, "openid") || "";
  if (
    /(micromessenger|webbrowser)/.test(
      window.navigator.userAgent.toLocaleLowerCase()
    ) &&
    accesstoken &&
    openid
  ) {
    return true;
  }
  return false;
}

// 存储用户数据来源
export function storeutmInfoDto() {
  // url.urlGetParams(window.location, 'openId');

  const utmSource = url.urlGetParams(window.location, "utm_source") || "";
  const utmMedium = url.urlGetParams(window.location, "utm_medium") || "";
  const utmTerm = url.urlGetParams(window.location, "utm_term") || "";
  const utmCampaign = url.urlGetParams(window.location, "utm_campaign") || "";
  const utmContent = url.urlGetParams(window.location, "utm_content") || "";
  if (!utmSource && !utmMedium && !utmTerm && !utmCampaign && !utmContent)
    return false;
  return {
    utmSource,
    utmMedium,
    utmTerm,
    utmCampaign,
    utmContent,
  };
}

// 联合登录记录返回页面的信息
export function socialRedirectUrl(path, state) {
  if (!path || !state) return;
  const redirectUrl = JSON.stringify({
    platform: state,
    redirect: encodeURIComponent(
      window.location.search.replace("?historyLocation=", "").replace("&", "?")
    ),
  });
  if (!redirectUrl) return path;
  return `${path}&state=${encodeURIComponent(redirectUrl)}`;
}

/**
 * 获取字符串字节长度
 * @param {string} str
 * @return {number} - description
 */
export const getStringByteLength = (str) => {
  let len = str.length;
  if (typeof str === "string") {
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        len++;
      }
    }
  }
  return len;
};

/**
 *
 * @param {object} params
 * @param {string} params._Omniture
 * @param {string} params._Href
 * @param {string?} params._Https
 */
export const getTrackingHref = (params) => {
  const { _Omniture, _Href, _Https } = params;
  let Href = _Href || "#";
  const Https = _Https || null;
  if (Https === "https" && _Href) {
    Href = configs.abtest + _Href;
  }
  if (Https === "http" && _Href) {
    Href = _Href;
  }
  if (!Href.match(/intcmp=|kwrec=|prodlink=/)) {
    const href = CheckCampaignCode(Href, _Omniture);
    return href;
  }
  return Href;
};

// plp 路由参数校验
export const verifyOptions = (params, types, defValue) => {
  const regexCheck = {
    number: "^[0-9]*$",
  };
  if (params == "" || !String(params).match(new RegExp(regexCheck[types]))) {
    return defValue;
  }
  return false;
};

// 判断plp类型，分类、搜索、品牌、礼物、独家、去使用、热搜
export const judgeTypeOfPlp = () => {
  if (typeof window !== undefined) {
    const href = window.location.pathname;
    const typeReg = {
      category: /category|categories/, // 分类
      giftSet: /gift_set/, // 礼物套装
      couponSet: /coupon_set/, // 优惠券去使用
      exclusive: /exclusive_product/, // 独家销售
      search: /search/, // 搜索结果
      hot: /hot/, // 热搜词
      brand: /brand|brands/, // 品牌
      purchaserecordcon: /\/purchaserecord.html/,
      vaproductlist: /\vaproductlist.html/,
    };
    return Object.keys(typeReg).find((type) => typeReg[type].test(href));
  }
};
