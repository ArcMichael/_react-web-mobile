import GetSingleCookie from "./GetSingleCookie";

export default function GetCookie(params, callback) {
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
