import * as types from "../constants/ActionTypes";
import {
  postMyaccountUserSocialLogin as $postMyaccountUserSocialLogin,
  getV2MyaccountUserUserCardInfo as $getV2MyaccountUserUserCardInfo,
  firstPopupImg as $firstPopupImg,
  getMyaccountUserAuthenticate as $getMyaccountUserAuthenticate,
} from "../lib/BLL";
import { GetSingleCookie } from "../lib/Tools";
import { urlGetParams } from "../lib/url";

export const postMyaccountUserSocialLogin =
  ({ options, callback = function () {} }) =>
  (dispatch) => {
    $postMyaccountUserSocialLogin(null, options, (results) => {
      dispatch({ type: types.GLOBALREFERENCE.USER_SOCIALLOGIN, data: results });
      callback(results);
    });
  };

export const getV2MyaccountUserUserCardInfo =
  ({ callback = function () {} }) =>
  (dispatch) => {
    if (GetSingleCookie(document.cookie, "Token") || urlGetParams(window.location, "token")) {
      dispatch(
        $getV2MyaccountUserUserCardInfo({
          onlyKey: "getUserUserCardInfo",
          url: "/v1/myaccount/user/userCardInfo",
          type: "GET",
        })
      ).then((json) => {
        dispatch({ type: types.GLOBALREFERENCE.USER_USERCARDINFO, data: json });
        callback(json);
        dispatch({
          type: types.GOOGLE_ANALYTICS.USER,
          USER: {
            id: json ? GetSingleCookie(document.cookie, "UID") || null : null,
            login_status: json ? "login user" : "anonymous",
            card_number: json.results ? json.results.cardNo || null : null,
            loyalty_tier: json.results ? json.results.cardType || null : null,
          },
        });
      });
    } else {
      callback({});
    }
  };



export const firstPopupImg = (params, callback) => (dispatch) => {
  dispatch(
    $firstPopupImg({
      onlyKey: "firstPopupImg",
      url: "/v1/mpcms/common/banner/mobile:home:popup?channel=mobile",
      type: "GET",
    })
  ).then((json) => {
    callback && callback(json && json.results);
  });
};

export const getMyaccountUserAuthenticate =
  ({ options = false, callback = function () {} }) =>
  () => {
    $getMyaccountUserAuthenticate(options, ({ results = false }) => {
      callback(results);
    });
  };

//记录页面是否已经加载完成
export const isFinishPageLoad = (params) => (dispatch) => {
  return dispatch({
    type: types.GLOBALREFERENCE.FINISH_PAGE_LOAD,
    data: params,
  });
};

// googleAnalytics pushV2数组操作
export const googleAnalyticsPushV2 = (datas) => (dispatch, getState) => {
  const { type, data } = datas;
  let newPushArray = [];
  if (type === "push") {
    // 增加
    const {
      googleAnalytics: { PUSHV2 },
    } = getState();
    newPushArray = PUSHV2.concat(data);
  }
  dispatch({ type: types.GOOGLE_ANALYTICS.PUSHV2, PUSHV2: newPushArray });
};
