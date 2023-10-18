import * as types from "../constants/ActionTypes";
import * as action from "../lib/BLL";
import { getCookie } from "../Utils/utils/cookie";

/**
 * @typedef {import('@/lib/Fecth').FetchAjaxResponse} FetchAjaxResponse
 */

/**
 * @typedef {{
 *  content:string;
 *  link:string | null;
 *  omniture:string | null;
 *  seoDescDto:null;
 * }} ResourceItem
 */

/**
 * @typedef { FetchAjaxResponse & {
 *  results:{
 *    resourceList: ResourceItem[]
 *  }
 * }} SimpleTextGroupRes
 */

export const updateGETHOTSEARCHWORD = () => (dispatch) => {
  dispatch(
    action.getHotword({
      onlyKey: "getHotword",
      url: "/v1/marketing/MktSimpleGroupController/simpleTextGroup",
      type: "POST",
      data: {
        head: {
          token: "string",
          userId: "string",
        },
        queryBody: {
          locationLabel: "MOBILE:HOMEPAGE:SEARCHBOX_TEXT",
          memberGroupId: 0,
        },
      },
    }),
  ).then(
    (
      /** @type {SimpleTextGroupRes} - description */
      json,
    ) => {
      dispatch({ type: types.SEARCH.GETHOTSEARCHWORD, GETHOTSEARCHWORD: json });
      // dispatch({ type: types.GLOBALREFERENCE.USER_USERCARDINFO, data: json }), callback(json);
    },
  );
};

export const getHotword = (callback) => (dispatch, getState) => {
  dispatch(
    action.getHotword({
      onlyKey: "getHotword",
      url: "/v1/marketing/MktSimpleGroupController/simpleTextGroup",
      type: "POST",
      data: {
        head: {
          token: "string",
          userId: "string",
        },
        queryBody: {
          locationLabel: "MOBILE:HOMEPAGE:SEARCHBOX_TEXT",
          memberGroupId: 0,
        },
      },
    }),
  ).then(
    (
      /** @type {SimpleTextGroupRes} - description */
      json,
    ) => {
      callback ? callback(json) : "";
      dispatch({ type: types.SEARCH.GETHOTSEARCHWORD, GETHOTSEARCHWORD: json });
      // dispatch({ type: types.GLOBALREFERENCE.USER_USERCARDINFO, data: json }), callback(json);
    },
  );
  historybrows && historybrows()(dispatch, getState);
};

export const expandIstrue = (value) => (dispatch) => {
  dispatch({ type: types.SEARCH.EXPAND_ISTRUE, EXPAND_ISTRUE: value });
};

export const historybrows = () => (dispatch) => {
  getCookie().then((cookie) => {
    let productidHistory = cookie("allpPoductid");
    if (productidHistory && productidHistory.length) {
      productidHistory = productidHistory.split(",");
    } else {
      productidHistory = [];
    }
    dispatch(
      action.historybrows({
        onlyKey: "historybrows",
        url: "/v2/product/product/history-browsing/products?channel=MOBILE",
        type: "POST",
        data: {
          queryBody: productidHistory,
        },
      }),
    ).then((json) => {
      dispatch({ type: types.SEARCH.HISTORY_BROWSING, data: json && json.results });
    });
  });
};

// 获取首页热搜的关键词
export const getSearchBoxText = (callback) => (dispatch) => {
  dispatch(
    action.textAdvertiseAjax({
      onlyKey: "getSearchBoxText",
      url: "/v1/marketing/MktSimpleGroupController/simpleTextGroup",
      type: "POST",
      data: {
        queryBody: { locationLabel: "APP:HOTSEARCH", memberGroupId: 0 },
      },
    }),
  ).then((json) => {
    callback && callback(json && json.results);
  });
};

export const historyArr = (value) => (dispatch) => {
  dispatch({ type: types.SEARCH.HISTORY_ARR, data: value });
};

export const ifInputTrue = (value) => {
  return (dispatch) => {
    dispatch({ type: types.SEARCH.IFINPUTTRUE, data: value });
  };
};
export const autoSuggest = (params, callback) => () => {
  action.autoSuggest(String(params), (data) => {
    callback(data);
  });
};
