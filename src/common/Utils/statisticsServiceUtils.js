/**
 * 所有第三方供应商相关服务
 * 1.EMARSYS服务
 * 2.live800客服
 */

import warning from "./warning";
/**
 * 1.Emarsys服务，整理入参，统一发送.
 * @param {Function} getState store.getstate
 * @param {Object} options 配置项
 */
let isGo = true;
export function serviceEmarsys(getState, options = {}) {
  if (isGo) {
    try {
      let { timeout } = options;
      timeout = timeout || 1000;

      setTimeout(() => {
        const { emarsysParamsQueue } = getState().CommonVenders;
        if (emarsysParamsQueue.length > 0 && window && window.ScarabQueue && window.ScarabQueue instanceof Object) {
          emarsysParamsQueue.map(data => {
            data && data.length > 0 && window.ScarabQueue.push(data);
          });
          window.ScarabQueue.push(["go"]);
        }
      }, timeout);
    } catch (err) {
      warning("emarsys error: " + err);
    }
    isGo = false;
  }
}
