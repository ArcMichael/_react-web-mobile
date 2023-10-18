/**
 * IOS9下 Promise.all 有问题
 */

/**
 * @typedef {() => Promise<boolean>} SupportFunc
 */

/**
 * 在任何需要进行支持的·客户端·文件中引入，使用。依赖客户端sessionStorage
 * @example
 *
 * ```js
 * import Supports from "xx/lib/Supports";
 *
 * const support = new Supports();
 * support.register().then(() => {
 *  console.log(support.isSupportWebp)
 * });
 *
 * ```
 */
export default class Supports {
  isSupportWebp = null;

  /**
   * 检查各种支持的工具集
   */
  static Checkks = {
    /**
     * 检查webp的特性支持
     * lossy 有损
     * lossless 无损
     * alpha 透明
     * animation 动画
     * @param {'lossy' | 'lossless' | 'alpha' | 'animation'} feature
     * @return {Promise<boolean>}
     */
    checkWebpFeature(feature) {
      const kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha:
          "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation:
          "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
      };
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
          const result = img.width > 0 && img.height > 0;
          resolve(result);
        };
        img.onerror = function () {
          resolve(false);
        };
        img.src = `data:image/webp;base64,${kTestImages[feature]}`;
      });
    },
  };

  /**
   * 检查各种支持的检查函数
   */
  static SupportProvides = {
    /**
     * @return {Promise<boolean>} - description
     */
    isSupportWebp: () => {
      const webpFeatures = ["lossy", "lossless", "alpha", "animation"];
      return new Promise((resolve) => {
        const sps = Promise.all(
          webpFeatures.map((item) => Supports.Checkks.checkWebpFeature(item)),
        );
        sps.then((res) => {
          if (res.includes(false)) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    },
  };

  constructor() {
    this.__INIT__();
  }

  /**
   * 入口函数
   */
  register() {
    return new Promise((resolve) => {
      if (typeof window !== "undefined") {
        const pros = Object.values(this.privates);
        Promise.all(pros.map((item) => item())).finally(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  __SessionStorageKeys__ = {
    isSupportWebp: "isSupportWebp",
  };

  __INIT__ = () => {
    if (typeof window !== "undefined") {
      const sessionStorageKey = this.__SessionStorageKeys__.isSupportWebp;
      const isSupportWebp = sessionStorage.getItem(sessionStorageKey);
      if (isSupportWebp === "true") {
        this.isSupportWebp = true;
      } else {
        this.isSupportWebp = false;
      }
    }
  };

  /**
   * 私有函数
   * 各种检查初始化
   * @type {{[K:string]: SupportFunc}}
   * */
  privates = {
    getIsSupportWebp: () => {
      return new Promise((resolve) => {
        const sessionStorageKey = this.__SessionStorageKeys__.isSupportWebp;
        const isSupportWebp = sessionStorage.getItem(sessionStorageKey);
        if (typeof isSupportWebp === "string") {
          if (isSupportWebp === "true") {
            this.isSupportWebp = true;
          } else {
            this.isSupportWebp = false;
          }
          resolve();
        } else {
          Supports.SupportProvides.isSupportWebp().then((res) => {
            sessionStorage.setItem(sessionStorageKey, res);
            this.isSupportWebp = res;
            resolve();
          });
        }
      });
    },
  };
}
