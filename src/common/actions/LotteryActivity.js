/*
 * @Author: summer
 * @Date: 2021-02-22 18:36:26
 * @Last Modified by: summer
 * @Last Modified time: 2021-02-Tu 06:27:18
 * @function 【Sprint3】 Mob - Backend - Service 抽奖小游戏
 */

import * as action from "../lib/BLL";
import { urlGetParams } from "../lib/url";
import { popupAlert } from "./popup";
import { GetSingleCookie } from "../lib/Tools";
import * as device from "../lib/device";

// 抽奖小游戏活动详情
export const getLotteryEventInfo = (callback) => (dispatch) => {
  dispatch(
    action.getLotteryEventInfo({
      onlyKey: "getLotteryEventInfo",
      url: `/v1/activity/lottery/info/${urlGetParams(window.location, "id")}`,
      type: "GET",
    }),
  ).then((json) => {
    let btnStatus = false,
      btnText,
      noneStatus = true, //剩余次数
      lottoTips,
      eventStatus = true; //活动状态
    if (json && json.results && json.results.failCode === "2505") {
      dispatch(
        popupAlert(1, "PopupLottery", {
          _text: json.results.failMessage || json.results.message,
          _autoClose: true,
        }),
      );
    } else if (json && json.results && json.results.failCode === "2502") {
      btnStatus = true;
      btnText = "即将开始";
      noneStatus = false;
    } else if (json && json.results && json.results.failCode === "2503") {
      btnStatus = true;
      btnText = "已结束";
      noneStatus = false;
    } else if (json && json.results && json.results.failCode === "2506") {
      noneStatus = true;
    } else if (json && json.errorMessage) {
      eventStatus = false;
      dispatch(popupAlert(1, "PopupLottery", { _text: json.errorMessage, _autoClose: true }));
    }

    if (json.results) {
      lottoTips = json.results.lottoTips;
      if (lottoTips && lottoTips.length > 40) {
        lottoTips = lottoTips.substring(0, 40);
      }

      callback &&
        callback({
          btnStatus,
          eventStatus,
          btnText,
          noneStatus,
          lotteryElement: json.results.lotteryElementDtos,
          lotteryPrize: json.results.lotteryPrizeDtos,
          descriptionText: json.results.descriptionText,
          luckyInfos: json.results.luckyInfos,
          mainTitle: json.results.mainTitle,
          subTitle: json.results.subTitle,
          limitCount: json.results.limitCount,
          hasPrize: json.results.hasPrize,
          lottoTips,
          backgroundImage: json.results.backgroundImage,
          shareCount: json.results.shareCount,
          userShareCount: json.results.userShareCount,
        });
    }
  });
};
// 抽奖
export const lotteryStart = (callback) => (dispatch) => {
  if (
    device.device_inMiniProgramsEnvironment()
      ? urlGetParams(window.location, "token")
      : GetSingleCookie(document.cookie, "Token")
  ) {
    dispatch(
      action.lotteryStart({
        onlyKey: "lotteryStart",
        url: `/v1/activity/lottery/luck`,
        type: "POST",
        data: {
          lotteryId: urlGetParams(window.location, "id"),
        },
      }),
    ).then((json) => {
      if (json.status == 401) return dispatch(goLogin());
      if (json && json.errorMessage) {
        dispatch(popupAlert(1, "PopupLottery", { _text: json.errorMessage, _autoClose: true }));
      }
      callback && json && callback(json);
    });
  } else {
    dispatch(goLogin());
  }
};
// 抽奖活动 - 关联商品列表
export const lotteryProducts = (params, callback) => (dispatch) => {
  dispatch(
    action.lotteryProducts({
      onlyKey: "lotteryProducts",
      url: `/v1/activity/lottery/products/${urlGetParams(window.location, "id")}/${params.pageNo}`,
      type: "GET",
    }),
  ).then((json) => {
    callback && json.results && callback(json.results);
  });
};
//抽奖活动 - 我的奖品
export const lotteryMyPrize = (callback) => (dispatch) => {
  if (
    device.device_inMiniProgramsEnvironment()
      ? urlGetParams(window.location, "token")
      : GetSingleCookie(document.cookie, "Token")
  ) {
    dispatch(
      action.lotteryMyPrize({
        onlyKey: "lotteryMyPrize",
        url: `/v1/activity/lottery/my-prize/${urlGetParams(window.location, "id")}`,
        type: "GET",
      }),
    ).then((json) => {
      if (json.status == 401) return dispatch(goLogin());
      callback && json.results && callback(json.results);
    });
  } else {
    dispatch(goLogin());
  }
};
// 抽奖活动 - 查看奖品
export const lotteryGift = (callback) => (dispatch) => {
  if (
    device.device_inMiniProgramsEnvironment()
      ? urlGetParams(window.location, "token")
      : GetSingleCookie(document.cookie, "Token")
  ) {
    dispatch(
      action.lotteryGift({
        onlyKey: "lotteryGift",
        url: `/v1/activity/lottery/prize-info`,
        type: "POST",
        data: {
          lotteryId: urlGetParams(window.location, "id"),
        },
      }),
    ).then((json) => {
      if (json.status == 401) return dispatch(goLogin());
      callback && json.results && callback(json.results);
    });
  } else {
    dispatch(goLogin());
  }
};
// 去登录
export const goLogin = () => () => {
  if (device.device_inMiniProgramsEnvironment()) {
    wx.miniProgram.navigateTo({
      url: `/packagesA/pages/newLogin/newPhoneNumberAuth?redirectPath=${encodeURIComponent(
        `sp/web?nto=1&ncn=1&nui=1&url=${window.location.href}`,
      )}`,
    });
  } else if (device.isApp()) {
    window.location.href =
      `${window.location.origin}/login?historyLocation=` + encodeURIComponent(window.location.href);
  } else {
    window.location.href = `/login?historyLocation=${encodeURIComponent(
      window.location.pathname.replace("/", "").replace("?", "&"),
    )}${window.location.search.replace("?", "&")}`;
  }
};
// 抽奖活动 - 新增/修改中奖地址
export const lotteryAddress = (params, callback) => (dispatch) => {
  if (
    device.device_inMiniProgramsEnvironment()
      ? urlGetParams(window.location, "token")
      : GetSingleCookie(document.cookie, "Token")
  ) {
    dispatch(
      action.lotteryGift({
        onlyKey: "lotteryAddress",
        url: `/v1/activity/lottery/address`,
        type: "PUT",
        data: {
          lotteryId: urlGetParams(window.location, "id"),
          addrId: params.addrId,
        },
      }),
    ).then((json) => {
      if (json.status == 401) return dispatch(goLogin());
      callback && json.results && callback(json.results);
    });
  } else {
    dispatch(goLogin());
  }
};
//抽奖活动 - 分享增加抽奖次数
export const lotteryShare = (params, callback) => (dispatch) => {
  if (
    device.device_inMiniProgramsEnvironment()
      ? urlGetParams(window.location, "token")
      : GetSingleCookie(document.cookie, "Token")
  ) {
    dispatch(
      action.lotteryGift({
        onlyKey: "lotteryShare",
        url: `/v1/activity/lottery/share`,
        type: "POST",
        data: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          lotteryId: urlGetParams(window.location, "id"),
          platforms: params.platforms,
        },
      }),
    ).then((json) => {
      if (json.status == 401) return dispatch(goLogin());
      callback && json.results && callback(json.results);
    });
  } else {
    dispatch(goLogin());
  }
};
