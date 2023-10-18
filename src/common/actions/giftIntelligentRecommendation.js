import * as action from "../lib/BLL";
import * as types from "../constants/ActionTypes";
import { urlGetParams } from "../lib/url";
import * as device from "../lib/device";
import { GetSingleCookie } from "../lib/Tools";
// 选礼Q&A问答环节接口
export const giftsQuestion = (params, callback) => (dispatch) => {
  dispatch(
    action.giftsQuestion({
      onlyKey: "giftsQuestion",
      url: `/v1/activity/qaa/recommend-gifts/question`,
      type: "POST",
      data: {
        activityCode: urlGetParams(window.location, "activityCode") || "",
        questionCode: params.questionCode,
        answerDtos: params.answerDtos || [],
        pageNo: params.pageNo || 1,
      },
      isConfirm: true,
    })
  ).then((res) => {
    dispatch({
      type: types.GIFTINTELLIGENT.SELECTRESDATA,
      data: res.results,
    });
    if (res && res.results) callback(res.results);
  });
};
// 选礼Q&A获取推荐分类sku列表接口
export const questionRecommend = (params, callback) => (dispatch) => {
  dispatch(
    action.giftsQuestion({
      onlyKey: "questionRecommend",
      url: `/v1/activity/qaa/recommend-gifts/skus`,
      type: "POST",
      data: {
        activityCode: urlGetParams(window.location, "activityCode") || "",
        answerCode: params.answerCode,
        answerDtos: params.answerDtos || [],
        pageNo: params.pageNo || 1,
      },
      isConfirm: true,
    })
  ).then((res) => {
    if (res && res.results) callback && callback(res.results);
  });
};
// 选礼Q&A获取推荐分类sku列表接口_2
export const questionRecommend_2 = (params, callback) => (dispatch) => {
  dispatch(
    action.giftsQuestion({
      onlyKey: "questionRecommend_2",
      url: `/v1/activity/qaa/recommend-gifts/skuList`,
      type: "POST",
      data: {
        activityCode: params.activityCode,
        category: params.category || "",
        budget: params.budget || "",
        answerDtos: params.answerDtos || [],
        pageNo: params.pageNo || 1,
      },
      isConfirm: true,
    })
  ).then((res) => {
    if (res && res.results) callback && callback(res.results);
  });
};
//存储选中礼品清单
export const setGiftList_2 = (data) => (dispatch) => {
  dispatch({
    type: types.GIFTINTELLIGENT_2.GIFTLIST,
    data: data,
  });
};
export const changeProductStatus = (data) => (dispatch) => {
  dispatch({
    type: types.GIFTINTELLIGENT.RECOMMENDRESULT,
    data: data,
  });
};
//储存产品状态
export const changeProductStatus_2 = (data) => (dispatch) => {
  dispatch({
    type: types.GIFTINTELLIGENT_2.RECOMMENDRESULT,
    data: data,
  });
};
// 获取人气礼品榜单接口
export const getPopularityList = (params, callback) => (dispatch) => {
  dispatch(
    action.Question({
      onlyKey: "getPopularityList",
      url: `/v1/activity/qaa/recommend-gifts`,
      type: "POST",
      data: {
        activityCode: urlGetParams(window.location, "activityCode") || "",
        pageNo: params.pageNo || 1,
      },
      isConfirm: true,
    })
  ).then((res) => {
    if (res) callback && callback(res);
  });
};
//存储选中礼品清单
export const setGiftList = (data) => (dispatch) => {
  dispatch({
    type: types.GIFTINTELLIGENT.GIFTLIST,
    data: data,
  });
};
// 加入购物车
export const combAddToCart = (para, callback) => (dispatch) => {
  if (
    device.device_inMiniProgramsEnvironment()
      ? urlGetParams(window.location, "token")
      : GetSingleCookie(document.cookie, "Token")
  ) {
    dispatch(
      action.combAddToCart({
        onlyKey: "combAddToCart",
        url: `/v3/shopcart/shopcart/addToCart`,
        type: "POST",
        data: { queryBody: para },
      })
    ).then((json) => {
      json && callback(json);
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
        `sp/web?nto=1&ncn=1&nui=1&url=${window.location.href}`
      )}`,
    });
  } else if (device.isApp()) {
    window.location.href =
      `${window.location.origin}/login?historyLocation=` +
      encodeURIComponent(window.location.href);
  } else {
    window.location.href = `/login?historyLocation=${encodeURIComponent(
      window.location.pathname.replace("/", "").replace("?", "&")
    )}${window.location.search.replace("?", "&")}`;
  }
};

// 选礼Q&A问答环节接口2期
export const giftQuestion = (params, callback) => (dispatch) => {
  dispatch(
    action.giftsQuestion({
      onlyKey: "giftsQuestion",
      url: `/v1/activity/qaa/recommend-gifts/questions`,
      type: "POST",
      data: {
        activityCode: urlGetParams(window.location, "activityCode") || "",
        questionCode: params.questionCode,
        answerDtos: params.answerDtos || [],
        pageNo: params.pageNo || 1,
      },
      isConfirm: true,
    })
  ).then((res) => {
    dispatch({
      type: types.GIFTINTELLIGENT.SELECTRESDATA,
      data: res.results,
    });
    if (res && res.results) callback(res.results);
  });
};
// 设置selectResData
// export const setSelectResData = (answerCode) => (dispatch, getState) => {
//   let currentdata = Object.assign({}, getState().giftIntelligent.selectResData);
//   currentdata.pageDto.records.map((v) => {
//     if (v.answerCode == answerCode) {
//       v.showLid = true;
//     } else {
//       v.showLid = false;
//     }
//   });
//   dispatch({
//     type: types.GIFTINTELLIGENT.SELECTRESDATA,
//     currentdata,
//   });
// };
// 存储当前code
export const saveQuestionCode = (data) => (dispatch) => {
  dispatch({
    type: types.GIFTINTELLIGENT.QUESTIONCODE,
    data,
  });
};
// 点击选题
export const clickSelect =
  (item, currentCode, questionCode, candiapath, callback) =>
  (dispatch, getState) => {
    let answerCodes = [],
      answerDtos = getState().giftIntelligent.answerDtos;
    answerCodes.push(item.answerCode);
    answerDtos.push({
      answerCodes,
      questionCode: currentCode,
    });
    if (candiapath) {
      dispatch(
        giftQuestion({ questionCode, answerDtos, pageNo: 1 }, (res) => {
          callback(res);
        })
      );
    } else {
      callback();
    }
  };

// 设置答题选项
export const saveAnswerDto = (data) => (dispatch) => {
  dispatch({
    type: types.GIFTINTELLIGENT.ANSWERDTOS,
    data,
  });
};
//预加载出场json动画
export const loadAnimateJson = (data) => (dispatch) => {
  dispatch({
    type: types.GIFTINTELLIGENT.ANIMATEJSON,
    data,
  });
};
