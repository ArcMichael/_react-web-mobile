/* eslint-disable no-underscore-dangle */
export function GetSingleCookieMatch(cookies) {
  let returnCookie = null;
  if (!document.cookie) {
    return returnCookie;
  }
  document.cookie.split("; ").map((data) => {
    if (data.indexOf(cookies) > -1) {
      returnCookie = data;
    }
  });
  return returnCookie;
}

export function SetSingleCookie(documentCookies, cookie, value) {
  documentCookies = cookie + "=" + escape(value);
}

export function GetSingleCookie(documentCookies, cookie) {
  const arr = documentCookies.match(
    new RegExp("(^| )" + cookie + "=([^;]*)(;|$)")
  );
  if (arr !== null) {
    return unescape(arr[2]);
  }
  return false;
}

export function SetSingleCookie2({
  key = "",
  value = "",
  time = false,
  domain = false,
  path = "/",
}) {
  if (!window) return false;
  if (!window.document) return false;
  if (!window.document.cookie) return false;
  if (!key) return false;
  if (!value) return false;

  // eslint-disable-next-line no-underscore-dangle
  const _str_second = time || 1000 * 60 * 60 * 24 * 365 * 20;
  const _exp = new Date();
  _exp.setTime(_exp.getTime() + _str_second * 1);

  let _set_cookie = key + "=" + escape(value) + ";";
  _set_cookie += " expires=" + _exp.toUTCString() + ";";
  if (domain) _set_cookie += " domain=" + domain + ";";
  _set_cookie += " path=" + path + ";";
  window.document.cookie = _set_cookie;
}

export function DelSingleCookie2({ key = false, domain = false, path = "/" }) {
  if (!window) return false;
  if (!window.document) return false;
  if (!window.document.cookie) return false;
  if (!key) return false;

  const _exp = new Date();
  _exp.setTime(_exp.getTime() - 1);
  let _set_cookie = key + "=" + "" + ";" + "expires=" + "-1" + ";";
  if (domain) _set_cookie += " domain=" + domain + ";";
  _set_cookie += " path=" + path + ";";
  window.document.cookie = _set_cookie;
}
