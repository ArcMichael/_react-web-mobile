/*
 * @Author: leo.si
 * @Date: 2019-07-10 17:36:26
 * @Last Modified by: summer
 * @Last Modified time: 2021-02-Tu 06:27:18
 * @function 小程序试用申领Mob版本接口数据整理
 */

import * as action from "../lib/BLL";
import { urlGetParams } from "../lib/url";
import { popupAlert } from "./popup";
import { GetSingleCookie } from "../lib/Tools";
import Sensor from "../Utils/sensor/index";
import * as device from "../lib/device";
const eventStatus = ["", "活动尚未开始", "抱歉,本次活动已结束", "抱歉,本次活动已结束"];

// 试用申领活动详情
export const getGiftEventInfo = (callback) => (dispatch) => {
  dispatch(
    action.getGiftEventInfo({
      onlyKey: "getGiftEventInfo",
      url: `/v1/shopcart/gift/event-detail/${urlGetParams(window.location, "eventId")}?channel=${
        // 'APP'
        device.isApp() ? "APP" : "MOBILE"
        }`,
      type: "GET",
    }),
  ).then((json) => {
    let btnOnlineStatus = 0,
      btnOfflineStatus = 0,
      showOnlineBtn = true,
      showOfflineBtn = true,
      btnTextOnline = json.results.applyModeMap.onlineText || "至官网领取", //未领取  线上领取文案初始化
      btnLinkOnline = "/cart",
      btnLinkOffline = "/cart",
      btnTextOffline = json.results.applyModeMap.offlineText || "至门店领取", //未领取  线下领取文案初始化
      btnHref = "/cart",
      isReceived = false,
      offlineTypeFlag = json.results.applyModeMap.offlineType; // 1：卡券，2：单档优惠券 3：多档优惠券 线下领取优惠券类别
    if (
      (json && json.results && json.results.failCode && json.results.failCode === "2011") ||
      (json && json.results && json.results.message)
    ) {
      btnOnlineStatus = 1;
      btnOfflineStatus = 1;
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: json.results.failMessage || json.results.message,
          _autoClose: true,
        }),
      );
    } else {
      // eventStatus 活动状态: 0-活动正常; 1-活动未开始; 2-活动已结束; 3-活动已关闭
      // 判断是否显示按钮
      if (json && json.results) {
        showOfflineBtn = json.results.applyModeMap.offline !== null ? true : false;
        showOnlineBtn = json.results.applyModeMap.online !== null ? true : false;
        // 有库存true ，没有库存false
        btnOnlineStatus = json.results.applyModeMap.online ? 0 : 1;
        btnOfflineStatus = json.results.applyModeMap.offline ? 0 : 1;
      }

      if (json && json.results && json.results.eventStatus > 0) {
        // 线上线下都不可点击
        btnOnlineStatus = 1;
        btnOfflineStatus = 1;
        dispatch(
          popupAlert(1, "PopupToast", {
            _text: eventStatus[json.results.eventStatus],
            _autoClose: true,
          }),
        );
      } else {
        // applyStatus 申领状态: 0-活动未开始; -1-活动已结束; 1-申领条件不够; 2-申领条件够,未申领; 3-线上领取完成; 4-线下领取，未到卡包; 5-线下领取完成;
        if (json && json.results && json.results.applyStatus && json.results.applyStatus === 3) {
          //至官网领取 走线上领取 3-线上领取完成

          btnOnlineStatus = 0;
          btnTextOnline = json.results.buttonTxt;
          btnLinkOnline = json.results.buttonLink;
          isReceived = true;
          // setOffline btn to disable
          btnOfflineStatus = 1;
        } else if (
          json &&
          json.results &&
          json.results.applyStatus &&
          json.results.applyStatus === 2
        ) {
          const dataResults = json.results;
          // 2-申领条件够
          // 线上
          // if(dataResults.applyModeMap.online){
          //   showOnlineBtn = true;
          // }
          // if (json && json.results && json.results.applyModeMap.online === null) {
          //   // showOnlineBtn = false;
          // } else if (json && json.results && json.results.applyModeMap.online) {
          //   // showOnlineBtn = true;
          // } else
          // if (json.results.applyModeMap.online == false) {
          //   btnOnlineStatus = 1;
          // }
          // else {
          //   dispatch(popupAlert(1, 'PopupToast', { _text: '抱歉,试用装已申领完毕', _autoClose: true }));
          // }
          if (json.results.applyModeMap.online == false) {
            btnOnlineStatus = 1;
          }
          if (
            (dataResults.applyModeMap.online == false &&
              dataResults.applyModeMap.offline == false) ||
            (dataResults.applyModeMap.online == null &&
              dataResults.applyModeMap.offline == false) ||
            (dataResults.applyModeMap.online == false && dataResults.applyModeMap.offline == null)
          ) {
            // btnOfflineStatus = 1;
            // btnOnlineStatus = 1;
            dispatch(
              popupAlert(1, "PopupToast", { _text: "抱歉，礼赠已申领完毕！", _autoClose: true }),
            );
          }

          // 线下
          if (json && json.results && json.results.applyModeMap.offline === null) {
            showOfflineBtn = false;
          } else if (json && json.results && json.results.applyModeMap.offline) {
            if (json.results.eventType == 1) {
              let path = `sp/sam/lan?activityId=${urlGetParams(window.location, "eventId")}`;
              btnHref = `sephora://foundation/openMiniProgram?username=${json.results.shareMpUserName
                }&path=${encodeURIComponent(path)}`;
            } else {
              let path = `sp/sam/rec?activityId=${urlGetParams(window.location, "eventId")}`;
              btnHref = `sephora://foundation/openMiniProgram?username=${json.results.shareMpUserName
                }&path=${encodeURIComponent(path)}`;
            }
            // showOfflineBtn = true;
          } else if (json && json.results && json.results.applyModeMap.offline == false) {
            btnOfflineStatus = 1;
          }
          // else {
          //   dispatch(popupAlert(1, 'PopupToast', { _text: '抱歉,试用装已申领完毕', _autoClose: true }));
          // }
        } else if (
          //至门店领取 走线下领取
          (json && json.results && json.results.applyStatus && json.results.applyStatus === 4) ||
          (json && json.results && json.results.applyStatus && json.results.applyStatus === 5)
        ) {
          btnOnlineStatus = 1;
          // 卡券就写死
          if (json.results.applyModeMap.offlineType == 1) {
            btnTextOffline = "已领取，查看卡包";
          } else {
            btnLinkOffline = json.results.buttonLink;
            btnTextOffline = json.results.buttonTxt; //'已领取，查看卡包'
          }

          showOfflineBtn = true;
          isReceived = true;

          btnOfflineStatus = 0;
          if (json.results.eventType == 1) {
            let path = `sp/sam/lan?activityId=${urlGetParams(window.location, "eventId")}`;
            btnHref = `sephora://foundation/openMiniProgram?username=${json.results.shareMpUserName
              }&path=${encodeURIComponent(path)}`;
          } else {
            let path = `sp/sam/rec?activityId=${urlGetParams(window.location, "eventId")}`;
            btnHref = `sephora://foundation/openMiniProgram?username=${json.results.shareMpUserName
              }&path=${encodeURIComponent(path)}`;
          }
        }
        //多档
        if (json && json.results && json.results.giftEventStepDtos) {
          let giftEventStepDtos = json && json.results && json.results.giftEventStepDtos,
            stepNo = urlGetParams(window.location, "stepNo")
              ? urlGetParams(window.location, "stepNo")
              : 1;
          if (giftEventStepDtos[stepNo - 1].applyStatus == 3) {
            btnTextOnline = giftEventStepDtos[stepNo - 1].buttonTxt;
            btnLinkOnline = giftEventStepDtos[stepNo - 1].buttonLink;
            isReceived = true;
            btnOnlineStatus = 0;
            btnOfflineStatus = 1;
          }
          // 判断多档是不是线下领取完成
          if (
            giftEventStepDtos[stepNo - 1].applyStatus == 4 ||
            giftEventStepDtos[stepNo - 1].applyStatus == 5
          ) {
            btnTextOffline = giftEventStepDtos[stepNo - 1].buttonTxt;
            btnLinkOffline = giftEventStepDtos[stepNo - 1].buttonLink;
            isReceived = true;
            btnOnlineStatus = 1;
            btnOfflineStatus = 0;
          }
        }
        if (
          json &&
          json.results &&
          json.results.userReceivedCount >= 1 &&
          json.results.applyModeMap.offlineType == 1
        ) {
          btnOfflineStatus = 1;
        }
      }
    }

    callback &&
      callback({
        backgroudUrlList: json.results.backgroudUrlList,
        applyBackgroundImageUrl: json.results.applyBackgroundImageUrl,
        applyTitle: json.results.applyTitle,
        btnOnlineStatus: btnOnlineStatus,
        btnOfflineStatus: btnOfflineStatus,
        btnTextOnline: btnTextOnline,
        btnLinkOnline,
        btnTextOffline,
        btnLinkOffline,
        isReceived,
        showOnlineBtn,
        showOfflineBtn,
        btnHref,
        reportLimitCount: json.results.reportLimitCount,
        unSubmitReportCount: json.results.unSubmitReportCount,
        miniPopup: json.results.miniPopup,
        descriptionText: json.results.descriptionText || "",
        onlineMulti: json.results.onlineMulti,
        eventType: json.results.eventType,
        applyModeMap: json.results.applyModeMap,
        userReceivedCount: json.results.userReceivedCount,
        offlineTypeFlag,
      });
  });
};

const reportLimitclick = (renderData, callback, isOffline) => (dispatch) => {
  // 配置的值0或者Null则走原来逻辑
  if (!renderData.reportLimitCount) {
    if (isOffline) {
      // 如果是线下的用线下的接口
      dispatch(offlinePopup(renderData, callback));
      return;
    }
    dispatch(miniPopup(renderData, callback));
    return;
  }
  // 首先要判断时候有收物还图的次数
  const chanceNum = renderData.reportLimitCount - renderData.unSubmitReportCount;
  if (renderData.unSubmitReportCount === 0) {
    // 用户没有需要提报告的，也继续原来逻辑
    if (isOffline) {
      // 如果是线下的用线下的接口
      dispatch(offlinePopup(renderData, callback));
    } else {
      dispatch(miniPopup(renderData, callback));
    }
  } else {
    if (chanceNum > 0) {
      dispatch(
        popupAlert(1, "PopupCleaning", {
          _cancelText: "继续领取",
          _btnWord: "去填写报告",
          _popTitle: "领取提示",
          _text: `您还有${chanceNum}次领取机会，快去提交试用报告，分享试用体验吧！`,
          _callback: () => {
            window.location.href = "sephora://ecommerce/myApplies";
          },
          _cansoleCallback: () => {
            if (isOffline) {
              // 如果是线下的用线下的接口
              dispatch(offlinePopup(renderData, callback));
            } else {
              dispatch(miniPopup(renderData, callback));
            }
          },
        }),
      );
    } else {
      dispatch(
        popupAlert(1, "PopupCleaning", {
          _cancelText: "取消",
          _btnWord: "去填写报告",
          _popTitle: "领取提示",
          _text: "您有试用报告未填写，提交使用报告获得更多领取机会哦！",
          _callback: () => {
            window.location.href = "sephora://ecommerce/myApplies";
          },
        }),
      );
    }
  }
};

const miniPopup = (renderData, callback) => (dispatch) => {
  if (renderData && renderData.miniPopup && renderData.miniPopup.needShow) {
    if (renderData && renderData.onlineMulti) {
      dispatch(
        popupAlert(1, "PopupCleaning", {
          _btnWord: renderData.miniPopup.confirmText,
          _popTitle: renderData.miniPopup.title,
          _text: renderData.miniPopup.content,
          _cancelText: "取消",
          _callback: () => dispatch(viewGiftDetails(renderData, callback)),
        }),
      );
    } else {
      dispatch(
        popupAlert(1, "PopupCleaning", {
          _btnWord: renderData.miniPopup.confirmText,
          _popTitle: renderData.miniPopup.title,
          _text: renderData.miniPopup.content,
          _cancelText: "取消",
          _callback: () => dispatch(addGiftTocart(renderData, callback)),
        }),
      );
    }
  } else {
    if (renderData && renderData.onlineMulti) {
      dispatch(viewGiftDetails(renderData, callback));
    } else {
      dispatch(addGiftTocart(renderData, callback));
    }
  }
};
// 线下弹窗判断
const offlinePopup = (renderData, callback) => (dispatch) => {
  if (renderData && renderData.miniPopup && renderData.miniPopup.needShow) {
    if (renderData && renderData.offlineMulti) {
      dispatch(
        popupAlert(1, "PopupCleaning", {
          _btnWord: renderData.miniPopup.confirmText,
          _popTitle: renderData.miniPopup.title,
          _text: renderData.miniPopup.content,
          _cancelText: "取消",
          _callback: () => dispatch(viewGiftDetails(renderData, callback, true)),
        }),
      );
    } else {
      dispatch(
        popupAlert(1, "PopupCleaning", {
          _btnWord: renderData.miniPopup.confirmText,
          _popTitle: renderData.miniPopup.title,
          _text: renderData.miniPopup.content,
          _cancelText: "取消",
          _callback: () => dispatch(offlineSave(renderData, callback)),
        }),
      );
    }
  } else {
    if (renderData && renderData.offlineMulti) {
      dispatch(viewGiftDetails(renderData, callback));
    } else {
      dispatch(offlineSave(renderData, callback));
    }
  }
};
// 用户点击button按钮
export const userClikcButton = (renderData, callback) => (dispatch) => {
  if (GetSingleCookie(document.cookie, "Token")) {
    dispatch(reportLimitclick(renderData, callback));
  } else {
    window.location.href = `/login?historyLocation=${encodeURI(
      window.location.pathname.replace("/", ""),
    )}${window.location.search.replace("?", "&")}`;
  }
};
// 线下领取
export const offlineButton = (renderData, callback) => (dispatch) => {
  if (GetSingleCookie(document.cookie, "Token")) {
    dispatch(reportLimitclick(renderData, callback, true));
    // 领取优惠券请求
  } else {
    window.location.href = `/login?historyLocation=${encodeURI(
      window.location.pathname.replace("/", ""),
    )}${window.location.search.replace("?", "&")}`;
  }
};
// 查看礼物选择
// 需要判断
export const viewGiftDetails = (renderData, callback, isOffline) => (dispatch) => {
  dispatch(
    action.viewGiftDetails({
      onlyKey: "viewGiftDetails",
      url: `/v1/activity/gift/${urlGetParams(window.location, "eventId")}/online/sku/info`,
      type: "GET",
    }),
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      let skuList = json && json.results;
      skuList.map((i) => {
        i.checked = false;
      });
      dispatch(
        popupAlert(1, "PopupMgm", {
          _data: Object.assign(
            {
              receiveCount: renderData && renderData.applyModeMap.receiveCount,
              userReceivedCount: renderData && renderData.userReceivedCount,
            },
            { results: skuList },
          ),
          _closeCallback: (skucode) => {
            if (isOffline) {
              dispatch(offlineSave(renderData, callback, skucode));
            } else {
              dispatch(addGiftTocart(renderData, callback, skucode));
            }
          },
        }),
      );
    } else {
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: json.results.message || "系统异常",
          _autoClose: true,
        }),
      );
    }
  });
};
// 赠品领取到购车
export const addGiftTocart = (renderData, callback, skucode) => (dispatch) => {
  dispatch(
    action.addGiftTocart({
      onlyKey: "addGiftTocart",
      url: device.isApp() ? "/v2/activity/gift/online/apply" : `/v1/shopcart/gift/online/apply`,
      // url:  '/v2/activity/gift/online/apply',
      type: "POST",
      data: {
        // channel: 'APP',
        channel: device.isApp() ? "APP" : "MOBILE",
        enventId: urlGetParams(window.location, "eventId"),
        skuCode: skucode,
        stepNo: urlGetParams(window.location, "stepNo")
          ? urlGetParams(window.location, "stepNo")
          : 1,
      },
    }),
  ).then((json) => {
    if (json && json.results && (json.results.failCode || json.results.failMessage)) {
      if (json.results.failCode === "2010" || json.results.failCode === "2008") {
        renderData.btnOnlineStatus = 1;
        renderData.btnOfflineStatus = 1;
      }
      dispatch(popupAlert(1, "PopupToast", { _text: json.results.failMessage, _autoClose: true }));

      callback &&
        callback({
          backgroudUrlList: renderData.backgroudUrlList,
          applyBackgroundImageUrl: renderData.applyBackgroundImageUrl,
          applyTitle: renderData.applyTitle,
          btnOnlineStatus: 1,
          btnOfflineStatus: renderData.btnOfflineStatus,
          showOfflineBtn: renderData.showOfflineBtn,
          showOnlineBtn: true,
          btnTextOffline: renderData.btnTextOffline,
          btnTextOnline: renderData.btnTextOnline,
          isReceived: renderData.isReceived,
          miniPopup: renderData.miniPopup,
          descriptionText: renderData.descriptionText,
          eventType: renderData.eventType,
          btnHref: renderData.btnHref,
        });
    } else {
      Sensor.go("activeATShoppingcart", {
        $lib_detail: "NM_mgm##addGiftTocart##mgmTrialApplication.js##92",
        userID: GetSingleCookie(document.cookie, "UID"),
        activityId: urlGetParams(window.location, "eventId"),
      });
      window.location.href = json.results.forwardUrl; //'/cart';
    }
  });
};
// 线下领取
export const offlineSave = (renderData, callback) => (dispatch) => {
  dispatch(
    action.offlineCouponSave({
      onlyKey: "offlineCouponSave",
      url: "/v1/activity/gift/offline/applyCoupon",
      type: "POST",
      data: {
        giftEventId: urlGetParams(window.location, "eventId"),
        channel: device.isApp() ? "APP" : "MOBILE",
        stepNo: urlGetParams(window.location, "stepNo")
          ? urlGetParams(window.location, "stepNo")
          : 1, // 单多档优惠
      },
    }),
  ).then((json) => {
    if (json && json.results && (json.results.failCode || json.results.failMessage)) {
      if (json.results.failCode === "2010" || json.results.failCode === "2008") {
        renderData.btnOnlineStatus = 1;
        renderData.btnOfflineStatus = 1;
      }
      dispatch(popupAlert(1, "PopupToast", { _text: json.results.failMessage, _autoClose: true }));
      callback &&
        callback({
          backgroudUrlList: renderData.backgroudUrlList,
          applyBackgroundImageUrl: renderData.applyBackgroundImageUrl,
          applyTitle: renderData.applyTitle,
          btnOnlineStatus: renderData.btnOnlineStatus,
          btnOfflineStatus: 1,
          showOfflineBtn: true,
          showOnlineBtn: renderData.showOnlineBtn,
          btnTextOffline: renderData.btnTextOffline,
          btnTextOnline: renderData.btnTextOnline,
          isReceived: renderData.isReceived,
          miniPopup: renderData.miniPopup,
          descriptionText: renderData.descriptionText,
          eventType: renderData.eventType,
          btnHref: renderData.btnHref,
        });
    } else {
      Sensor.go("activeATShoppingcart", {
        $lib_detail: "NM_mgm##addGiftTocart##mgmTrialApplication.js##92",
        userID: GetSingleCookie(document.cookie, "UID"),
        activityId: urlGetParams(window.location, "eventId"),
      });
      window.location.href = json.results.forwardUrl; //'/cart';
    }
  });
};
