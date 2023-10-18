export default function DelSingleCookie2({ key = false, domain = false, path = "/" }) {
  if (!window) return false;
  if (!window.document) return false;
  if (!window.document.cookie) return false;
  if (!key) return false;

  const _exp = new Date();
  _exp.setTime(_exp.getTime() - 1);
  let _set_cookie = `${key}=;expires=-1;`;
  if (domain) _set_cookie += ` domain=${domain};`;
  _set_cookie += ` path=${path};`;
  window.document.cookie = _set_cookie;
}
