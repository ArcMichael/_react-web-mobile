export const isWeChat = () => {
  if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) {
    return true;
  }
  return false;
};

export const isApp = () => {
  if (/(sephora\/app)/.test(navigator.userAgent.toLocaleLowerCase())) {
    return true;
  }
  return false;
};

export const isIOS = () => {
  if (/iphone|ipad|ipod/.test(navigator.userAgent.toLocaleLowerCase())) {
    return true;
  }
  return false;
};

export const isAndorid = () => {
  if (/android/.test(navigator.userAgent.toLocaleLowerCase())) {
    return true;
  }
  return false;
};

export const isDevice = (str) => {
  if (str) {
    if (/(micromessenger|webbrowser)/.test(str.toLocaleLowerCase())) {
      return "wechat";
    }
    if (/(sephora\/app)/.test(str.toLocaleLowerCase())) {
      return "app";
    }
  } else {
    if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) {
      return "wechat";
    }
    if (/(sephora\/app)/.test(navigator.userAgent.toLocaleLowerCase())) {
      return "app";
    }
  }

  return "mobile";
};

/**
 * @function 判断是否处于小程序环境内
 */
export const device_inMiniProgramsEnvironment = function () {
  let inMiniPrograms = false;
  if (typeof window !== "undefined") {
    if (
      /(micromessenger|webbrowser|wechatdevtools)/.test(navigator.userAgent.toLocaleLowerCase())
    ) {
      if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
        document.addEventListener("WeixinJSBridgeReady", ready, false);
      } else {
        ready();
      }
      function ready() {
        if (window.__wxjs_environment === "miniprogram") {
          inMiniPrograms = true;
        }
      }
    }
  }

  return inMiniPrograms || window.__wxjs_environment === "miniprogram";
};
