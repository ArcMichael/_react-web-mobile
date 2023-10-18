import * as action from "../lib/BLL";
import { urlGetParams } from "../lib/url";
import { popupAlert } from "./popup";

//活动首页
export const getActivityEventInfo = (callback) => (dispatch) => {
  dispatch(
    action.getActivityEventInfo({
      onlyKey: "getActivityEventInfo",
      url: `/v1/activity/gift/event-info/${urlGetParams(
        window.location,
        "eventId"
      )}?channel=${"APP"}`,
      type: "GET",
    })
  ).then((json) => {
    let showRank = false,
      btnStatus = false,
      btnText = "",
      btnHref = "",
      avatarArr = [],
      shareInfo = null,
      shareV2Info = null,
      rankBtnStatus = false,
      adDesc = "",
      showGuide = localStorage.getItem(urlGetParams(window.location, "eventId"))
        ? true
        : false,
      giftEventStepInfo = null;

    if (
      json &&
      json.results &&
      json.results.failCode &&
      json.results.failCode === "2011"
    ) {
      btnStatus = true;
      adDesc = json.results.adDesc;
      rankBtnStatus = true;
      showGuide = true;
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: json.results.failMessage,
          _autoClose: true,
        })
      );
    }
    if (json && json.results) {
      // 活动状态: 0-活动正常; 1-活动未开始; 2-活动已结束; 3-活动已关闭
      if (json.results.eventStatus == 0) {
        shareInfo = {
          title: json.results.shareImageMainTitle,
          text: json.results.shareImageSubTitle,
          imageUrl: json.results.shareCardImageUrl,
          miniProgramPath: json.results.shareActivityPath,
          miniProgramScene: json.results.shareActivityScene,
          postWithCodeType: "",
          momentsImageUrl: json.results.shareImageUrl,
          shareMpUserName: json.results.shareMpUserName,
          eventId: urlGetParams(window.location, "eventId"),
          shareCardTitle: json.results.shareCardTitle,
        };
        shareV2Info = {
          title: json.results.name,
          text: json.results.text,
          imageUrl: json.results.backgroudUrlList[0].url,
          miniProgramPath: json.results.shareActivityPath.split("&u=")[0],
          miniProgramScene: json.results.shareActivityScene,
          miniProgramUsername: json.results.shareMpUserName,
        };
        localStorage.setItem("shareInfo", JSON.stringify(shareInfo));
        localStorage.setItem("shareV2Info", JSON.stringify(shareV2Info)); //添加分享参数
        adDesc = json.results.adDesc;
        // 引导图
        if (
          json.results.guideImageUrlList &&
          json.results.guideImageUrlList.length > 0
        ) {
          if (json.results.leaderboardNum <= 0) {
            json.results.guideImageUrlList.splice(
              json.results.guideImageUrlList.length - 1,
              1
            );
          }
        } else {
          showGuide = false;
        }
        // 申领状态: 0-活动未开始; -1-活动已结束; 1-申领条件不够; 2-申领条件够,未申领; 3-线上领取完成; 4-线下领取，未到卡包; 5-线下领取完成;
        if (json.results.applyStatus === 3) {
          btnText = json.results.buttonTxt;
          btnHref = json.results.buttonLink;
        } else if (json.results.applyStatus === 2) {
          btnText = json.results.canApplyButtonTxt;
          btnHref = `/v2/html/mgmTrialApplication?eventId=${urlGetParams(
            window.location,
            "eventId"
          )}`;
        } else if (json.results.applyStatus === 1) {
          btnText = json.results.canNotApplyButtonTxt;
        } else if (
          json.results.applyStatus === 4 ||
          json.results.applyStatus === 5
        ) {
          btnText = "已领取，查看卡包";
          // 单档卡券跳转
          // eventType：1 MGM,0 paid sampling
          // 判断优惠券还是卡券
          if (json.results.applyModeMap.offlineType == 1) {
            if (json.results.eventType == 1) {
              let path = `sp/sam/lan?activityId=${urlGetParams(
                window.location,
                "eventId"
              )}`;
              btnHref = `sephora://foundation/openMiniProgram?username=${
                json.results.shareMpUserName
              }&path=${encodeURIComponent(path)}`;
            } else {
              let path = `sp/sam/rec?activityId=${urlGetParams(
                window.location,
                "eventId"
              )}`;
              btnHref = `sephora://foundation/openMiniProgram?username=${
                json.results.shareMpUserName
              }&path=${encodeURIComponent(path)}`;
            }
          } else {
            // 线下多档优惠券
            btnText = json.results.buttonTxt;
            btnHref = json.results.buttonLink;
          }
        }
      } else if (
        json.results.eventStatus == 2 ||
        json.results.eventStatus == 3
      ) {
        btnText = "已结束，查看更多活动";
        json.results.guideImageUrlList = [];
        btnHref = "sephora://ecommerce/applies";
        showGuide = false;
        if (json.results.leaderboardNum > 0) {
          adDesc = "活动已结束，点击查看排行榜";
        } else {
          adDesc = "活动已结束";
        }
      } else if (json.results.eventStatus == 1) {
        btnText = "敬请期待";
        btnStatus = true;
        rankBtnStatus = true;
        adDesc = json.results.adDesc;
        showGuide = true;
      }

      // 展示人数
      if (json.results.leaderboardNum > 0) {
        showRank = true;
      }
      if (
        json.results.partnerList &&
        json.results.partnerList.length >= json.results.showPartnerNum
      ) {
        avatarArr = json.results.partnerList.slice(
          0,
          json.results.showPartnerNum
        );
      } else {
        for (let i = 0; i < json.results.showPartnerNum; i++) {
          if (json.results.partnerList && json.results.partnerList.length > 0) {
            avatarArr[i] = json.results.partnerList[i];
          } else {
            avatarArr[i] = {};
          }
        }
      }
      //解锁进度条
      if (json.results.giftEventStepDtos) {
        giftEventStepInfo = {};
        giftEventStepInfo.partnerNum = json.results.partnerNum;
        giftEventStepInfo.giftEventStepDtos = json.results.giftEventStepDtos;
      }

      callback &&
        callback({
          adDesc,
          backgroudUrlList: json.results.backgroudUrlList,
          applyBackgroundImageUrl: json.results.applyBackgroundImageUrl,
          guideImageUrlList: json.results.guideImageUrlList,
          btnStatus: btnStatus ? 1 : 0,
          miniPopup: json.results.miniPopup,
          descriptionText: json.results.descriptionText || "",
          avatarArr,
          btnText,
          canNotApplyButtonTxt: json.results.canNotApplyButtonTxt,
          showRank,
          btnHref,
          showGuide,
          eventStatus: json.results.eventStatus,
          applyStatus: json.results.applyStatus,
          assistanceRankButtonTxt: json.results.assistanceRankButtonTxt,
          shareInfo,
          leaderboardNum: json.results.leaderboardNum,
          rankBtnStatus,
          giftEventStepInfo,
        });
    }
  });
};

// 查看排行榜
export const getLeaderboard = (data, callback) => (dispatch) => {
  dispatch(
    action.getLeaderboard({
      onlyKey: "getLeaderboard",
      url: `/v1/activity/gift/rank/${urlGetParams(
        window.location,
        "eventId"
      )}/${data.pageNo}`,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      callback(json.results);
    } else {
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: json.results ? json.results.message : "系统异常",
          _autoClose: true,
        })
      );
    }
  });
};
// getAssistanceList
export const getAssistanceList = (data, callback) => (dispatch) => {
  dispatch(
    action.getAssistanceList({
      onlyKey: "getAssistanceList",
      url: `/v1/shopcart/gift/assistanceList/${urlGetParams(
        window.location,
        "eventId"
      )}/${data.pageNo}`,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      callback(json.results);
    } else {
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: json.results ? json.results.message : "系统异常",
          _autoClose: true,
        })
      );
    }
  });
};
