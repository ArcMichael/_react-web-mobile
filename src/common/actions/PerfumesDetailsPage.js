import * as constType from "../constants/ActionTypes";
import * as action from "../lib/BLL";
import * as device from "../lib/device";
import * as regexp from "../lib/regexp";
//定制香水组件展示哪一页
export const showLipPerfumePage = (val) => {
  return (dispatch) => {
    dispatch({
      type: constType.PRODUCT.PDP_FILTER_OPEN_PAGE,
      PDP_FILTER_OPEN_PAGE_RESULT: val,
    });
  };
};
//MIUMIU 香水自选组合 Step 1
export const getMiuMiuDetail = (spuId, odorsku, callback) => (dispatch) => {
  dispatch(
    action.getMiuMiuStep1Detail({
      onlyKey: "getMiuMiuStep1Detail",
      url: `/v1/product/sku/groups/miumiu/detail/${spuId}?channel=${
        device.isApp() ? "APP" : "MOBILE"
      }`,
      type: "GET",
    }),
  ).then((json) => {
    if (json && json.results) {
      let newData = Object.assign({}, json.results);
      let skuDetailDtosTotal = newData.skuDetailDtos;
      let totalInv = true;
      if (skuDetailDtosTotal.length > 0) {
        let index = skuDetailDtosTotal.findIndex((item) => item.hasInv === true);
        //四个商品都没有库存的时候，
        totalInv = index >= 0 ? true : false;
        newData = {
          ...newData,
          totalInv,
        };
      }
      dispatch({
        type: constType.PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE,
        PDP_FILTER_ORIGIN_DATA_RESULT: newData,
      });
      if (odorsku) {
        json.results.skuDetailDtos.map((v) => {
          if (v.skuId == odorsku) {
            dispatch({
              type: constType.PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE_TWO,
              PDP_FILTER_ORIGIN_DATA_TWO: v,
            });
          }
        });
      }
      callback && callback(json.results);
    }
  });
};
//香水4选1
export const selectPerfumeOdor = (odorsku) => (dispatch, getState) => {
  let currentdata = getState().product.PDP_IS_OPEN_FILTER_ORIGIN;
  currentdata &&
    currentdata.skuDetailDtos.map((v) => {
      if (odorsku == v.skuId) {
        dispatch({
          type: constType.PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE_TWO,
          PDP_FILTER_ORIGIN_DATA_TWO: v,
        });
      }
    });
};
//MIUMIU 香水自选组合 Step 2
export const getMiuMiuStepTwoDetail = (spuId, odorsku, callback) => (dispatch) => {
  let lidskuId = regexp.searchLidSku(window.location);
  let bodyskuId = regexp.searchBodySku(window.location);
  if (spuId && odorsku) {
    dispatch(
      action.getMiuMiuStep2Detail({
        onlyKey: "getMiuMiuStep2Detail",
        url: `/v1/product/sku/groups/miumiu/chose/${spuId}/${odorsku}?channel=${
          device.isApp() ? "APP" : "MOBILE"
        }`,
        type: "GET",
      }),
    ).then((json) => {
      if (json && json.results) {
        let newData = Object.assign({}, json.results);
        let skuTowDetailDtosTotalOne = newData.partOneDtos;
        let skuTowDetailDtosTotalTwo = newData.partTwoDtos;
        let stepTwoTotalInv = true;
        if (skuTowDetailDtosTotalOne.length > 0 && skuTowDetailDtosTotalTwo.length > 0) {
          let index = skuTowDetailDtosTotalOne.findIndex((item) => item.hasInv === true);
          let indexTwo = skuTowDetailDtosTotalTwo.findIndex((item) => item.hasInv === true);
          //四个商品都没有库存的时候，
          stepTwoTotalInv = index >= 0 && indexTwo >= 0 ? true : false;
          newData = {
            ...newData,
            stepTwoTotalInv,
          };
        }
        let currentsearch = window.location.search;
        let lidsku = /lidsku=/;
        let condition = /lidsku=[0-9]*/;
        newData.partOneDtos.map((v) => {
          if (!lidskuId) {
            if (v.selected) {
              if (currentsearch) {
                if (lidsku.test(currentsearch)) {
                  history.replaceState(
                    `&lidsku=${v.skuId}`,
                    "",
                    currentsearch.replace(condition, "lidsku=" + v.skuId),
                  );
                } else {
                  history.replaceState(
                    `&lidsku=${v.skuId}`,
                    "",
                    currentsearch + "&lidsku=" + v.skuId,
                  );
                }
              } else {
                history.replaceState(`&lidsku=${v.skuId}`, "", "&lidsku=" + v.skuId);
              }
            }
          } else {
            if (lidskuId == v.skuId) {
              v.selected = true;
            } else {
              v.selected = false;
            }
          }
        });
        newData.partTwoDtos.map((v) => {
          if (bodyskuId) {
            if (bodyskuId == v.skuId) {
              v.selected = true;
            } else {
              v.selected = false;
            }
          }
        });
        dispatch({
          type: constType.PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE_THREE,
          PDP_FILTER_ORIGIN_DATA_THREE: newData,
        });
        callback && callback(json.results);
      }
    });
  }
};
//选择香水盖
export const selectPerfumeLid = (type, lidsku, bodysku) => (dispatch, getState) => {
  let currentdata = Object.assign({}, getState().product.PdpFilterThree);
  if (type == "lid") {
    currentdata.partOneDtos.map((v) => {
      if (v.skuId == lidsku) {
        v.selected = true;
      } else {
        v.selected = false;
      }
    });
  } else {
    currentdata.partTwoDtos.map((v) => {
      if (v.skuId == bodysku) {
        v.selected = true;
      } else {
        v.selected = false;
      }
    });
  }
  dispatch({
    type: constType.PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE_THREE,
    PDP_FILTER_ORIGIN_DATA_THREE: currentdata,
  });
};
// MIUMIU 香水自选组合 Step 3
export const getMiuMiuStepThreeDetail = (spuId, odorsku, lidsku, bodysku) => (dispatch) => {
  if (spuId && odorsku && lidsku && bodysku) {
    dispatch(
      action.getMiuMiuStep3Detail({
        onlyKey: "getMiuMiuStep3Detail",
        url: `/v1/product/sku/groups/miumiu/comb?spuId=${spuId}&mainSkuId=${odorsku}&onePartSkuId=${lidsku}&twoPartSkuId=${bodysku}&channel=${
          device.isApp() ? "APP" : "MOBILE"
        }`,
        type: "GET",
      }),
    ).then((json) => {
      if (json && json.results) {
        let newData = Object.assign({}, json.results);
        dispatch({
          type: constType.PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE_COMB,
          PDP_FILTER_ORIGIN_DATA_COMB: newData,
        });
      }
    });
  }
};
// MIUMIU 香水自选组合 加入购物车
export const combAddToCart = (para, callback) => (dispatch) => {
  dispatch(
    action.combAddToCart({
      onlyKey: "combAddToCart",
      url: `/v3/shopcart/shopcart/addToCart`,
      type: "POST",
      data: { queryBody: para },
    }),
  ).then((json) => {
    json && callback(json);
  });
};
