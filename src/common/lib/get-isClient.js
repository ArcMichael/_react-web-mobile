import * as url from "./url";

export function isBrowser() {
  return typeof window !== "undefined" && window.document;
}

export function JudgeWeChat() {
  if (
    /(micromessenger|webbrowser)/.test(window.navigator.userAgent.toLocaleLowerCase()) &&
    url.urlGetParams(window.location, "access_token") &&
    url.urlGetParams(window.location, "openid") &&
    url.urlGetParams(window.location, "orign") == "wechat"
  )
    return true;
  return false;
}
