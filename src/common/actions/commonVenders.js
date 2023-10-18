import $ from "jquery";
import * as constType from "../constants/ActionTypes";
import { serviceEmarsys } from "../Utils";

/* 以下为Emarsys*/
// Emarsys推入数据
export const pushEmarsys = (data) => (dispatch) => {
  dispatch({ type: constType.COMMONVENDERS.EMARSYS_QUEUE, emarsysParam: data });
};
// Emarsys go
export const emarsysGo = (options) => (dispatch, getState) => {
  serviceEmarsys(getState, options);
};

export const getGuessYouLikeData = (params, callback) => () => {
  $.ajax({
    url: "https://recommender.predict.emarsys.cn/merchants/18BC49C88D345FEB/",
    data: params,
    success: function (json) {
      callback && callback(json);
    },
  });
};
