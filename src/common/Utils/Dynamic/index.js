import getConfigs from "../../../isomorphisms/getConfigs";

const configs = getConfigs();

export default class Dynamic {
  /** @type {__INITIAL_ENV__} - description */
  __INITIAL_ENV__ = null;

  STATIC = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.__INITIAL_ENV__ = window.__INITIAL_ENV__;
      this.STATIC = this.__INITIAL_ENV__.Env.static;
    }
  }

  scripts = {
    moment: null,
    sepBridge: null,
    jsinvoke: null,
  };

  /**
   * @param {string[]} globalVars
   */
  __handleArrayVars(globalVars) {
    let res = {};
    globalVars.forEach((item) => {
      res[item] = window[item];
    });
    return res;
  }

  /**
   * private
   * @param {string|string[]} globalVars 脚本提供的全局变量名
   * @param {string} scriptSrc 脚本路径
   * @param {string?} scriptName 脚本名称，默认使用唯一globalVar
   */
  __register(globalVars, scriptSrc, scriptName) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(globalVars)) {
        let resolveResult = this.__handleArrayVars(globalVars);
        let trueResults = Object.values(resolveResult).filter((item) =>
          Boolean(item)
        );
        if (trueResults.length === globalVars.length) {
          resolve(resolveResult);
          return;
        }
      }
      if (typeof window[globalVars] !== "undefined") {
        resolve(window[globalVars]);
        return;
      }
      const script = document.createElement("script");
      const body = document.body;
      if (scriptSrc.match(/^https?:\/\//)) {
        script.src = `${scriptSrc}`;
      } else {
        script.src = `${this.STATIC}${scriptSrc}`;
      }
      body.appendChild(script);
      script.onload = () => {
        this.scripts[scriptName || globalVars] = script;
        if (Array.isArray(globalVars)) {
          const exportVars = this.__handleArrayVars(globalVars);
          resolve(exportVars);
        } else {
          resolve(window[globalVars]);
        }
      };
      script.onerror = () => {
        reject(new Error(`Dynamic register ${globalVars} error`));
      };
    });
  }

  moment() {
    return this.__register(
      "moment",
      "/soa/public/js/moment/2.15.2/moment.min.js"
    );
  }

  sepBridge() {
    return this.__register(
      "sep",
      configs.static + "/soa/public/js/sep_invoke/SEPBridge_1.5.6.js"
    );
  }
  jsinvoke() {
    return this.__register(
      "SEPHORA_JSINVOKE",
      configs.static + "/soa/public/js/jsinvoke/jsinvoke_1.08.js"
    );
  }
  reactSwipperId() {
    console.log(111111);
    return this.__register(
      "ReactIdSwiper",
      "/soa/public/js/react-id-swiper/1.6.7/react-id-swiper.min.js"
    );
  }
  reactMobileDatepicker() {
    return this.__register(
      "reactMobileDatePicker",
      "/soa/public/js/react-mobile-datepicker/3.0.6/react-mobile-datepicker_newmobile.min.js"
    );
  }
}
