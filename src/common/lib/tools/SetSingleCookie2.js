export default function SetSingleCookie2({
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
