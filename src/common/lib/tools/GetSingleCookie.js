export default function GetSingleCookie(documentCookies, cookie) {
  let arr = null;
  if (cookie) {
    arr = documentCookies.match(new RegExp(`(^| )${cookie}=([^;]*)(;|$)`));
  } else {
    arr = document.cookie.match(new RegExp(`(^| )${documentCookies}=([^;]*)(;|$)`));
  }

  if (arr != null) {
    return unescape(arr[2]);
  }
  return null;
}
