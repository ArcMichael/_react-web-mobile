import * as action from "../lib/BLL";
import * as types from "../constants/ActionTypes";
import * as url from "../lib/url";

export const questionNaire = (params, callback) => (dispatch, ) => {
  dispatch(
    action.Question({
      onlyKey: "lipquizQuestion",
      url: `/v1/activity/qaa/question`,
      type: "POST",
      data: {
        activityCode: url.urlGetParams(window.location, "activityCode") || "",
        questionCode: params.questionCode,
        answerDtos: params.answerDtos || [],
        pageNo: params.pageNo || 1,
      },
      isConfirm: true,
    }),
  ).then((res) => {
    if (res && res.results) callback && callback(res.results);
  });
};
export const questionSkuList = (params, callback) => (dispatch, ) => {
  dispatch(
    action.skusList({
      onlyKey: "lipquizSkus",
      url: `/v1/activity/qaa/skus`,
      type: "POST",
      data: {
        activityCode: url.urlGetParams(window.location, "activityCode") || "",
        answerDtos: params.answerDtos,
        pageNo: params.pageNo || 1,
      },
      isConfirm: true,
    }),
  ).then((res) => {
    if (res && res) callback && callback(res);
  });
};
// 获取口红问卷分享图
export const getLipQuizImage = (params, callback) => (dispatch, ) => {
  dispatch(
    action.textAdvertiseAjax({
      onlyKey: "getLipQuizImage",
      url: "/v1/marketing/MktSimpleGroupController/simpleImageGroup",
      type: "POST",
      data: {
        queryBody: { locationLabel: "LIP_QUIZ:SHARE_IMAGE" },
      },
    }),
  ).then((json) => {
    if (json && json.results && json.results.resourceList && json.results.resourceList.length > 0) {
      callback && callback(json.results.resourceList[0]);
    }
  });
};
export const objfun = (data) => (dispatch, ) => {
  dispatch({
    type: types.QUIZ.QUIZ_RESULTS,
    data: data,
  });
};
export const selectedObj = (data) => (dispatch, ) => {
  dispatch({
    type: types.QUIZ.QUIZ_SELECTDTO,
    data: data,
  });
};
