import urlGetParams from "../urls/urlGetParams";

export default function isWeChatForLand() {
  if (!window) return false;
  const accesstoken = urlGetParams(window.location, "access_token") || "";
  const openid = urlGetParams(window.location, "openid") || "";
  if (
    /(micromessenger|webbrowser)/.test(window.navigator.userAgent.toLocaleLowerCase()) &&
    accesstoken &&
    openid
  ) {
    return true;
  }
  return false;
}
