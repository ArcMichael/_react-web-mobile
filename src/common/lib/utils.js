/**
 * @typedef {import('../type').__INITIAL_ENV__} INITIAL_ENV
 */

import getConfigs from 'isomorphisms/getConfigs';

export default class Utils {
  static console = {
    green: (...args) => {
      const title = args[0];
      const [, ...restArgs] = args;
      console.log(`%c ${title} `, "background:#7cb305;color:#fff;", ...restArgs);
    },
    gold: (...args) => {
      const title = args[0];
      const [, ...restArgs] = args;
      console.log(`%c ${title} `, "background:#d48806;color:#fff;", ...restArgs);
    },
    black: (...args) => {
      const title = args[0];
      const [, ...restArgs] = args;
      console.log(`%c ${title} `, "background:#000;color:#fff;", ...restArgs);
    },
    red: (...args) => {
      const title = args[0];
      const [, ...restArgs] = args;
      console.log(`%c ${title} `, "background:#f5222d;color:#fff;", ...restArgs);
    },
  };
  static isBrowser() {
    return typeof window !== "undefined";
  }

  /**
   * 仅限浏览器环境使用
   * @return {INITIAL_ENV} - description
   */
  static GET__INITIAL_ENV__() {
    const isBrowser = Utils.isBrowser();
    if (isBrowser) {
      return window.__INITIAL_ENV__;
    }
    return console.error(new Error("GET__INITIAL_ENV__ 仅限浏览器环境使用"));
  }

  /**
   * @param {keyof INITIAL_ENV['Env']} key
   * @return {string} - description
   */
  static getEnv(key) {
    const configs = getConfigs();
    return configs[key]
   
  }

  /**
   * @return {string}
   */
  static getMiniProgramUsername() {
    let env = Utils.getEnv("restfulEnv");
    if (env === "production") {
      return "gh_e4e302a788ba";
    } else {
      return "gh_8f96bdb663d6";
    }
  }

  static uniqIdGenerator() {
    const d = +new Date();
    const s = (Math.random() * 10000000).toFixed();
    return `id-${d}${s}`;
  }

  static afterPageShow() {
    return new Promise((resolve) => {
      if (window.PAGESHOWSTATUS) {
        resolve();
        return;
      }
      const handlePageShow = () => {
        resolve();
        window.removeEventListener("pageshow", handlePageShow);
      };
      window.addEventListener("pageshow", handlePageShow);
    });
  }
}
