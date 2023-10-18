import $ from "jquery";
import * as constType from "../constants/ActionTypes";

export const nicheFragranceChangeIndex = (index) => {
  return (dispatch) => {
    dispatch({
      type: constType.NICHEFRAGRANCE.INDEX,
      index,
    });
  };
};

export const nicheFragranceChangeDetails = (state) => {
  return (dispatch) => {
    dispatch({
      type: constType.NICHEFRAGRANCE.STATE,
      state,
    });
  };
};

export const getCCVideo = (id, callback) => () => {
  $.ajax({
    type: "get",
    url: `/api/v2/SOA/proxy/getVideo?videoid=${id}`,
    success: function (data) {
      callback && callback(data);
    },
  });
};

export const preLoadImg = (source) => (dispatch) => {
  for (let i = 0; i < source.length; i++) {
    dispatch(preLoadImgFun(source[i], i));
  }
};

export const preLoadImgFun = (source, index) => (dispatch, getState) => {
  const promiseAll = [];
  const img = [];
  const imgTotal = source.length;
  for (let i = 0; i < imgTotal; i++) {
    promiseAll[i] = new Promise((resolve) => {
      img[i] = new Image();
      img[i].src = source[i];
      img[i].onload = function () {
        // 第i张加载完成
        resolve(img[i]);
      };
      img[i].onerror = function () {
        resolve(img[i]);
      };
    });
  }
  Promise.all(promiseAll)
    .then(() => {
      // 全部加载完成
      const nowArray = getState().nichefragrance.PRELOADIMG;
      dispatch({
        type: constType.NICHEFRAGRANCE.STATE,
        data: nowArray.push(index),
      });
    })
    .catch((reason) => {
      console.log("reason-----", reason);
    });
};
