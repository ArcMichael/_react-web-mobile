/*
 * @Author: leo.si
 * @Date: 2019-04-14 18:04:50
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2020-11-03 11:31:23
 * @function 限流页面接口请求
 */
import Dynamic from "@/Utils/Dynamic";
import * as action from "../lib/BLL";
import * as device from "../lib/device";
import { urlGetParams } from "../lib/url";
import CurrentLimitingForMiniprogram from "../Utils/currentLimit";

const dynamic = new Dynamic();

// 获取限流页面文字广告位文字内容
export const getCurrentlimitingWord = (callback) => (dispatch) => {
  dispatch(
    action.textAdvertiseAjax({
      onlyKey: "getCurrentlimitingWord",
      url: "/v1/marketing/MktSimpleGroupController/simpleTextGroup",
      type: "POST",
      data: {
        queryBody: { locationLabel: "MOBILE:CURRENT_LIMIT:TITLE" },
      },
    }),
  ).then((json) => {
    if (json && json.results && json.results.resourceList && json.results.resourceList.length > 0) {
      callback &&
        callback({
          firstWord: json.results.resourceList[0].content,
          secondWord: json.results.resourceList[1].content,
        });
    }
  });
};
// 限流页面判断用户是否还处于限流阶段
export const checkIsLimited = (callback) => (dispatch) => {
  dispatch(
    action.checkIsLimited({
      onlyKey: "checkIsLimited",
      url: "/v1/marketing/availability",
      type: "GET",
    }),
  ).then((json) => {
    if (json && json.status === 0 && (json.status !== 1 || json.status !== 429)) {
      if (device.isApp()) {
        dynamic.sepBridge().then((sep) => {
          sep.closeWindow && sep.closeWindow();
        });
      } else if (CurrentLimitingForMiniprogram.judgeMiniprogramEnvironment()) {
        // wx && wx.miniProgram && wx.miniProgram.navigateBack({})
        CurrentLimitingForMiniprogram.navigateBack();
      } else {
        window.location.href = decodeURIComponent(urlGetParams(window.location, "prePage"));
        // callback && callback(false)
      }
    } else {
      callback && callback(false);
    }
  });
};
// 获取线下服务页面的数据
export const getOfflineService = (callback) => (dispatch) => {
  dispatch(
    action.getOfflineService({
      onlyKey: "getOfflineService",
      url: `/v1/marketing/classify-page/offline-service/${device.isApp() ? "app" : "mobile"}`,
      type: "GET",
    }),
  ).then((json) => {
    if (json && json.results && json.results.groups && json.results.groups.length > 0) {
      callback && callback(json.results.groups);
    }
  });
};
