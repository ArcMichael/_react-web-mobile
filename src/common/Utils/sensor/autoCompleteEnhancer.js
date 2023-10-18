
import * as sensorMap from "../../Mapping/sensorMap";
import * as _url from "../../lib/url";

function get_current_url(currentUrl) {
  if (currentUrl) return currentUrl;
  return window.location.href || "";
}
function get_environment_type() {
  let type = "other";
  if (window.location.href.indexOf("m.sephora.cn") > 0) type = "production";
  if (window.location.href.indexOf("stagem.sephora.cn") > 0) type = "stage";
  if (window.location.href.indexOf("testm.sephora.cn") > 0) type = "test";

  return type;
}

function get_banner_to_page_type(url) {
  if (!url) return "Other";
  if (url.search("/") < 0) return url;
  return sensorMap.sensor_router_type(url);
}
function get_current_page_type(currentPageType) {
  if (currentPageType) return currentPageType;
  const pathName = window.location.pathname || "";

  return sensorMap.sensor_router_type(pathName);
}

function get_previous_url(previousUrl) {
  if (previousUrl) return previousUrl;

  return typeof document !== "undefined" && typeof document.referrer === "string"
    ? document.referrer
    : "";
}

function get_previous_page_type_new(previous_page_type_new) {
  if (previous_page_type_new) return previous_page_type_new;

  const path_name = get_previous_url() || "";
  return sensorMap.sensor_router_type(path_name);
}

function get_sign_up_method(sign_up_method) {
  if (sign_up_method) return sign_up_method;

  if (_url.urlGetParams(window.location, "state") === "QQ") return "qq";
  if (_url.urlGetParams(window.location, "state") === "WEIBO") return "weibo";
  if (_url.urlGetParams(window.location, "state") === "WECHAT") return "wechat";

  return "";
}

function get_campaign_code(campaign_code) {
  const arr = (campaign_code && campaign_code.split(/intcmp=|kwrec=|prodlink=/)) || [];
  return arr.length > 1 ? arr[arr.length - 1] : null;
}

function get_device(device) {
  if (device) return device;
  // if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) return 'wechat';
  if (navigator.userAgent.match(/sephora\/app/)) return "app";
  return "mobile";
}

function get_os(os = "") {
  if (os) return os;
  const clientStrings = [
    { s: "Android", r: /Android/ },
    { s: "iOS", r: /(iPhone|iPad|iPod)/ },
  ];
  for (var id in clientStrings) {
    var cs = clientStrings[id];
    if (cs.r.test(navigator.userAgent)) {
      os = cs.s;
      break;
    }
  }
  return os;
}

export default {
  get_current_url,
  get_current_page_type,
  get_previous_url,
  get_previous_page_type_new,
  get_sign_up_method,
  get_campaign_code,
  get_device,
  get_os,
  get_environment_type,
  get_banner_to_page_type,
};
