// 获取单个参数
export function urlGetParams(location, name) {
  return urlGetAllParams(location)[name] || false;
}

/**
 *
 * @param {string} url
 * @return {{ search:string; host:string }} - description
 */
export const getSearchAndHostByUrl = (url) => {
  if (typeof url === 'string') {
    const array = url.match(/^(https*:\/\/.*)(\?.*)/);
    if (array.length === 3) {
      const host = array[1];
      const search = array[2];
      return {
        host,
        search,
      };
    }
  }
  return {
    search: '',
    host: '',
  };
};

/**
 * 以问号结尾的search部分
 * window.location.search
 * @param {string} search
 * @return {{ [K:string]:string }} - description
 */
export const GetParamsByUrl = (search) => {
  if (typeof search === 'string' && /^\?(.+=.+)+/.test(search)) {
    const qs = search.length > 0 ? search.substring(1) : '';
    const args = {};
    const items = qs.length ? qs.split('&') : [];
    let item = null;
    let name = null;
    let value = null;
    let i = 0;
    const len = items.length;
    for (i = 0; i < len; i++) {
      item = items[i].split('=');
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

/**
 * 获取全部URL参数
 * @param {Location} location
 * @return Obejct || {}
 */
export function urlGetAllParams(location) {
  return GetParamsByUrl(location.search);
}
export function pushBack(type,goNum) {
  if (document.referrer == "" || (type && type == "search")) {
    window.location.href = "/";
  } else {
    window.history.go(goNum||-1);
    return false;
  }
}
/**
 * @param {number} targetPort 本地开发时候的目标端口号
 * @return {string} - description
 */
 export const getBaseUrlByTarget = (targetPort = 60018) => {
  if (typeof window !== "undefined") {
    /**
     * 本地开发时候，使用hostname+port
     * 直接使用host
     */
    let { protocol, hostname, host } = window.location;
    if (window.location.host.match(/localhost|127.0.0.1/)) {
      host = `${hostname}:${targetPort}`;
    }
    return `${protocol}//${host}`;
  }
  return "";
};
