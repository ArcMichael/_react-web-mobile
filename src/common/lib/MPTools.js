import getConfigs from "../../isomorphisms/getConfigs";
import { isWeChat } from "./device";
/**
 * 小程序内的跳转
 */

/**
 * 小程序内的h5需要登录
 */

export const MpToH5 = () => {
  if (window && !window.wx) return false;
  wx.miniProgram.navigateTo({
    url: `/packagesA/pages/newLogin/newPhoneNumberAuth?redirectPath=${encodeURIComponent(
      `sp/web?nto=1&ncn=1&nui=1&url=${window.location.href}`,
    )}`,
  });
};
/**
 *
 * @param {string} url 需要跳转的路径
 * @param {boolean} type   是否需要自动加域名
 */
export const LocationToH5 = (url, type) => {
  const configs = getConfigs();
  const host = configs.newtest;
  if (isWeChat()) {
    wx.miniProgram.getEnv(() => {
      wx.miniProgram.navigateTo({
        path: `sp/web?nto=1&ncn=1&url=${type === false ? "" : host}${encodeURIComponent(url)}`,
      });
    });
  }
  window.location.href = url;
};
