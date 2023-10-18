export default function SetSingleCookie2V2({
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
