export default class QueryString {
  /**
   * 解析querystring
   * @param {string} string
   * @example
   *
   * ```js
   * QueryString.parse("?abc=123&cbd=ssdf") // ==> { abc:"123", cbd:"ssdf" }
   * QueryString.parse(window.location.search) // ==> { query1:"xxx", query2:"xxx" }
   * ```
   */
  static parse(string) {
    let str = string;
    let arr = [];
    let res = {};
    if (string && string.match(/^\?/)) {
      str = str.replace('?', '');
      arr = str.split('&');
      arr.forEach(item => {
        if (item) {
          const keyVal = item.split('=');
          const key = keyVal[0];
          const val = (keyVal[1] && decodeURIComponent(keyVal[1])) || undefined;
          if (key) {
            res[key] = val;
          }
        }
      });
    }
    return res;
  }
  /**
   * stringify Object 到querystring
   * @param {{ [K:string]:string | number }} obj
   * @param {{ questionMark?:boolean }?} options
   * @example
   *
   * ```js
   * QueryString.stringify({ abc:"123", cbd:"ssdf" }) // ==> "abc=123&cbd=ssdf"
   * QueryString.stringify({ abc:"123", cbd:"ssdf" }, { questionMark:true }) // ==> "?abc=123&cbd=ssdf"
   * ```
   */
  static stringify(obj, options) {
    const { questionMark } = options || {};
    let str = '';
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      str = questionMark ? '?' : '';
      const keys = Object.keys(obj);
      keys.forEach((item, i) => {
        if (typeof obj[item] === 'number' || typeof obj[item] === 'string') {
          if (i === keys.length - 1) {
            str += `${item}=${obj[item]}`;
          } else {
            str += `${item}=${obj[item]}&`;
          }
        } else {
          throw new Error(`QueryString.stringify param vals must be number or string`);
        }
      });
    }
    return str;
  }
}
