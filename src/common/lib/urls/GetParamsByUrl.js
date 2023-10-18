/**
 * 以问号结尾的search部分
 * window.location.search
 * @param {string} search
 * @return {{ [K:string]:string }} - description
 */
const GetParamsByUrl = (search) => {
  if (typeof search === "string" && /^\?(.+=.+)+/.test(search)) {
    const qs = search.length > 0 ? search.substring(1) : "";
    const args = {};
    const items = qs.length ? qs.split("&") : [];
    let item = null;
    let name = null;
    let value = null;
    let i = 0;
    const len = items.length;
    for (i = 0; i < len; i++) {
      item = items[i].split("=");
      name = decodeURIComponent(item[0]);
      value = decodeURIComponent(item[1]);
      if (name.length && value) {
        args[name] = value;
      }
    }
    return args;
  }
  return {};
};

export default GetParamsByUrl;
