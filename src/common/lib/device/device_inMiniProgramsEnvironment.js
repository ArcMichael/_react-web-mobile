/**
 * @function 判断是否处于小程序环境内
 */

const device_inMiniProgramsEnvironment = () => {
  let inMiniPrograms = false;
  if (/(micromessenger|webbrowser|wechatdevtools)/.test(navigator.userAgent.toLocaleLowerCase())) {
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

  return inMiniPrograms || window.__wxjs_environment === "miniprogram";
};


export default device_inMiniProgramsEnvironment;
