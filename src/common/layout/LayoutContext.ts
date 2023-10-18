import React from "react";

export const LayoutContextInitvalue = {
  isSupportWebp: false,

  afterSupportsRegister: false,

  /**
   * 获取webp的Image Url
   * @param {string} src
   * @param {boolean} isSupportWebp
   */
  getImageSrcByIsSupportWeb(src: string, isSupportWebp: boolean) {
    if (!src) {
      return "";
    }
    if (isSupportWebp) {
      if (src.match(/\?.*f=webp/)) {
        return src;
      }
      if (src.match(/\?.*/)) {
        return `${src}&f=webp`;
      }
      return `${src}?f=webp`;
    }
    return src;
  },
};

/**
 * @typedef {typeof LayoutContextInitvalue} HomepageContextValueType
 */

const LayoutContext = React.createContext(LayoutContextInitvalue);

export const Provider = LayoutContext.Provider;
export const Consumer = LayoutContext.Consumer;
