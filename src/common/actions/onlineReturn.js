/*
 * @Author: Leo.Si
 * @Date: 2019-09-11 14:23:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-03 15:12:02
 * @function onlineReturn action
 */
import $ from "jquery";
import {
  getReturnReason as $getReturnReason,
  onlineReturnApplication as $onlineReturnApplication,
  getOnlineReturnOrder as $getOnlineReturnOrder,
  getReturnItemUnit as $getReturnItemUnit,
  returnDetailsInit as $returnDetailsInit,
  getReturnList as $getReturnList,
  onlineReturnDetailsEdit as $onlineReturnDetailsEdit,
  returnReasonSample as $returnReasonSample,
  consultHistory as $consultHistory,
  returnRefundDetailsInit as $returnRefundDetailsInit,
  deliverySubmit as $deliverySubmit,
} from "../lib/BLL";
import * as types from "../constants/ActionTypes";
import * as url from "../lib/url";
import { popupAlert } from "./popup";
import { GetSingleCookie } from "../lib/Tools";
import getConfigs from "../../isomorphisms/getConfigs";

const configs = getConfigs();

const funcMap = {
  getReturnReason,
  getReturnNumner,
  returnReasonSample,
  getImageOriginalPaths,
  getComment,
  applyReturnAjax,
  returnListTap,
  copySuccess,
  onlineReturnDetailsEdit,
  getLogisticsCompany,
  getLogisticsNumber,
  deliverySubmit,
  uploadImageLoading,
};

function getReturnReason(parasms, dispatch, getState) {
  const returnData = { ...getState().onlineReturn.recoreReason };
  dispatch(
    $getReturnReason({
      onlyKey: "getReturnReason",
      url: `/v1/order/es/return/returnReasons`,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    const { code, message } = json && json.results;
    if (!code) {
      let nowIndex;
      json &&
        json.results &&
        json.results.length > 0 &&
        json.results.map((item, index) => {
          if (item == returnData.returnReason.value) {
            nowIndex = index;
          }
        });
      dispatch(
        popupAlert(1, "PopupScrollSelect", {
          _data: json.results,
          _zIndex: 2000,
          _key: "returnReason",
          _nowIndex: nowIndex || 0,
          _title: "退货原因",
        }),
      );
      dispatch({
        type: types.MY_ONLINERETURN.APPLY_NOSCROLL,
        data: true,
      });
    } else {
      alert(message);
    }
  });
}
function getReturnNumner(parasms, dispatch, getState) {
  const returnData = { ...getState().onlineReturn.recoreReason };
  let nowIndex = 0;
  if (returnData && returnData.returnNumber && returnData.returnNumber.limit <= 1) return;
  let newArray = [];
  if (
    url.urlGetParams(window.location, "returnStatus") &&
    url.urlGetParams(window.location, "returnStatus") == "RRRS"
  ) {
    newArray = [returnData.returnNumber.limit];
  } else {
    for (let i = 1; i <= returnData.returnNumber.limit; i++) {
      if (returnData && returnData.returnNumber && returnData.returnNumber.value == i + 1) {
        nowIndex = i;
      }
      newArray.push(i);
    }
  }
  dispatch(
    popupAlert(1, "PopupScrollSelect", {
      _data: newArray,
      _zIndex: 2000,
      _key: "returnNumber",
      _nowIndex: nowIndex,
      _title: "退货数量",
    }),
  );
  dispatch({
    type: types.MY_ONLINERETURN.APPLY_NOSCROLL,
    data: true,
  });
}

// 允许申请退货页面滚动
export const allowApplyScroll = () => (dispatch) => {
  dispatch({
    type: types.MY_ONLINERETURN.APPLY_NOSCROLL,
    data: false,
  });
};
function getImageOriginalPaths(parasms, dispatch, getState) {
  saveApplyReturnData &&
    saveApplyReturnData({
      applyImageOriginalPaths: parasms,
    })(dispatch, getState);
}

function getComment(parasms, dispatch, getState, source) {
  saveApplyReturnData &&
    saveApplyReturnData({
      applyComment: parasms,
      isEdit: source,
    })(dispatch, getState);
}
// 用户提交退货申请
function applyReturnAjax(parasms, dispatch, getState) {
  const returnData = { ...getState().onlineReturn.recoreReason };
  const applyData = { ...getState().onlineReturn.applyData };
  let _text =
    applyData && !applyData.returnReason
      ? "请选择退货原因"
      : !applyData.applyImageOriginalPaths
      ? "请上传退货凭证"
      : "";
  if (applyData && _text) {
    return dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text,
        _autoClose: true,
        _ox: false,
      }),
    );
  }
  applyData.applyImageOriginalPaths = JSON.stringify(applyData.applyImageOriginalPaths);
  if (
    url.urlGetParams(window.location, "returnStatus") &&
    url.urlGetParams(window.location, "returnStatus") == "RRRS"
  ) {
    applyData.applyQty = returnData.returnNumber.limit;
  }
  dispatch(
    $onlineReturnApplication({
      onlyKey: "onlineReturnApplication",
      url: `/v1/order/return/onlineReturnApplication`,
      type: "POST",
      data: applyData,
      isConfirm: true,
    }),
  ).then((json) => {
    const { code, message } = json && json.results;
    if (!code) {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: "申请成功",
          _autoClose: true,
          _ox: true,
        }),
      );
      window.location.href = `/myAccount/returnDetails?returnId=${
        json.results
      }&orderPage=true&orderId=${url.urlGetParams(window.location, "orderId")}`;
    } else if (code === 400811289) {
      dispatch(popupAlert(1, "PopupReturnError"));
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: message,
          _autoClose: true,
          _ox: false,
        }),
      );
    }
  });
}
// 退货---退货原因-示例图
function returnReasonSample(parasms, dispatch, getState) {
  const returnData = { ...getState().onlineReturn.recoreReason };
  if (!returnData.returnReason.value) {
    dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: "请选择退货原因",
        _autoClose: true,
      }),
    );
    return;
  }
  dispatch(
    $returnReasonSample({
      onlyKey: "returnReasonSample",
      url: `/v1/order/es/return/returnReasonSample`,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    const { code, message } = json && json.results;
    let obj;
    json &&
      json.results &&
      json.results.length > 0 &&
      json.results.map((item) => {
        const { reason } = item;
        if (reason == returnData.returnReason.value) {
          obj = item;
        }
      });
    if (!code) {
      let body=document.querySelector(".online_return_page")
      body.className="online_return_page fix-body"
      dispatch(popupAlert(1, "PopupUpLoadImageSample", { _data: obj,_closeCallback:()=>{
        body.className="online_return_page"
      } }));
    } else {
      alert(message);
    }
  });
}
/**
 * 作为回调函数传入组件，通过函数名map调用所有方法.
 * @param {string} callbackKEY 需要调取的函数名
 */
export const mapFuncToRun = (callbackKEY, parasms, source) => (dispatch, getState) => {
  const func = funcMap[callbackKEY];
  func && func(parasms, dispatch, getState, source);
};
const OnlineReturnReason = require("../components/MyAccount/MyAccountOnlineReturn/OnlineReturnReason.json");

export const applyReturnInit = () => (dispatch, getState) => {
  getOnlineReturnStatus &&
    getOnlineReturnStatus({
      Status: "applyReturn",
      contnent: "一般在3个工作日内会完成审核，如有疑问请联系客服。",
      title: "申请退货",
    })(dispatch, getState);
  dispatch({
    type: types.MY_ONLINERETURN.RECORD_REASON,
    data: OnlineReturnReason,
  });
  getOnlineReturnOrder && getOnlineReturnOrder()(dispatch, getState);
  getReturnItemUnit && getReturnItemUnit()(dispatch, getState);
};
const ProgressSpeed = require("../components/MyAccount/MyAccountOnlineReturn/ProgressSpeed.json");
// onlineReturn 退货流程的状态
export const getOnlineReturnStatus = (params) => (dispatch) => {
  const { Status, contnent, title } = params;
  const newObj = JSON.parse(JSON.stringify(ProgressSpeed));
  newObj.title = title;
  newObj.contnent = contnent;
  if (Status == "REJECTED") {
    newObj.nowState = 1;
  } else {
    newObj.nowState = newObj.allState.indexOf(Status) > -1 ? newObj.allState.indexOf(Status) : 0;
  }
  newObj.processStatus = Status;
  newObj.returnState = newObj.returnState.map((item, index) => {
    const { key } = item;
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.status = key == Status;
    if (Status == "PARTIAL_REFUNDED" && index == 4) {
      newItem.status = true;
      newItem.returnStateTitle = title;
    }
    if (Status == "REJECTED" && index == 1) {
      newItem.status = true;
    }
    return newItem;
  });
  dispatch({
    type: types.MY_ONLINERETURN.STATUS,
    data: newObj,
  });
};

// onlineReturn 获取产品数据(调用订单详情的接口)
export const getOnlineReturnOrder = () => (dispatch, getState) => {
  dispatch(
    $getOnlineReturnOrder({
      onlyKey: "getOnlineReturnOrder",
      // url: `/v2/myaccount/order/orderDetailInfo/${url.urlGetParams(window.location, "orderId")}`,
      url: `/v3/es/order/detail/mobile/${url.urlGetParams(window.location, "orderId")}`,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    const { code } = (json && json.results) || {};
    if (!code) {
      const newArray = [];
      json &&
        json.results &&
        json.results.realProducts &&
        json.results.realProducts.length > 0 &&
        json.results.realProducts.map((item) => {
          const { skuId } = item;
          if (skuId == url.urlGetParams(window.location, "skuId")) {
            newArray.push(item);
          }
        });
      recordReturnReason && recordReturnReason(newArray)(dispatch, getState);
    }
  });
};

// 退货---申请可退数量以及商品单价
export const getReturnItemUnit = () => (dispatch, getState) => {
  const newDate = getState().onlineReturn.recoreReason;
  dispatch(
    $getReturnItemUnit({
      onlyKey: "getReturnItemUnit",
      url: `/v1/order/es/return/returnItemUnit?orderId=${url.urlGetParams(
        window.location,
        "orderId",
      )}&returnSkuId=${url.urlGetParams(window.location, "skuId")}`,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      newDate.returnAmount.value = `¥${json.results.apportionAmountUnit.toFixed(2)}`;
      newDate.returnAmount.limit = json.results.apportionAmountUnit;
      newDate.returnNumber.limit = json.results.vailableQty;
      if (
        url.urlGetParams(window.location, "returnStatus") &&
        url.urlGetParams(window.location, "returnStatus") == "RRRS"
      ) {
        newDate.returnNumber.value = json.results.vailableQty;
        newDate.returnAmount.value = `¥${(
          json.results.apportionAmountUnit * json.results.vailableQty
        ).toFixed(2)}`;
      }
      dispatch({
        type: types.MY_ONLINERETURN.RECORD_REASON,
        data: newDate,
      });
    }
  });
};
// 记录onlineReturn的退货原因、退货数量、退货金额、退货说明
export const recordReturnReason = (params) => (dispatch, getState) => {
  const newDate = getState().onlineReturn.recoreReason;
  newDate.productList = params;
  //  newDate.returnAmount.value = params && params[0] && `¥${params[0].offerPrice}`
  dispatch(
    $getReturnReason({
      onlyKey: "getReturnReason",
      url: `/v1/order/es/return/returnReasons`,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      dispatch({
        type: types.MY_ONLINERETURN.RECORD_REASON,
        data: newDate,
      });
      saveApplyReturnData &&
        saveApplyReturnData({
          returnReason: "",
        })(dispatch, getState);
    }
  });
};
// 存储申请退货时的申请信息
export const saveApplyReturnData = (params) => (dispatch, getState) => {
  const { returnReason, applyComment, returnNumber, applyImageOriginalPaths, isEdit } = params;
  const applyData = { ...getState().onlineReturn.applyData };
  const returnData = { ...getState().onlineReturn.recoreReason };
  let comment = applyComment;
  if (!isEdit) {
    comment = applyComment || (applyData && applyData.applyComment) || "";
  }
  const apply_data = {
    applyComment: comment,
    applyImageOriginalPaths:
      applyImageOriginalPaths || (applyData && applyData.applyImageOriginalPaths) || "",
    applyQty: returnNumber || (applyData && applyData.applyQty) || 1,
    orderId: url.urlGetParams(window.location, "orderId"),
    returnReason: returnReason || (applyData && applyData.returnReason) || "",
    skuId: url.urlGetParams(window.location, "skuId"),
    subChannel: "MOBILE",
  };
  if (returnReason) returnData.returnReason.value = returnReason;
  if (returnNumber) {
    returnData.returnNumber.value = returnNumber;
    returnData.returnAmount.value = `¥${(
      Number(returnData.returnAmount.limit) * returnNumber
    ).toFixed(2)}`;
  }
  // console.log("returnData",returnData, apply_data)
  dispatch({
    type: types.MY_ONLINERETURN.RECORD_REASON,
    data: returnData,
  });
  dispatch({
    type: types.MY_ONLINERETURN.SAVE_APPLY_DATA,
    data: apply_data,
  });
};
// 上传图片
export function uploadCustomHead(params, callback) {
  $.ajax({
    method: "POST",
    processData: false,
    contentType: false,
    headers: {
      UID: GetSingleCookie(document.cookie, "UID"),
      Token: GetSingleCookie(document.cookie, "Token"),
    },
    url: `https://${configs.api}/v1/order/return/applyImg/upload`,
    data: params,
    success: (json) => {
      const { code } = json && json.results;
      if (!code) {
        callback && callback(json);
      } else {
        alert("上传失败！");
      }
    },
    error: (error) => {
      console.error("Upload error", error);
    },
  });
}

function uploadImageLoading(parasms, dispatch) {
  if (parasms.isSuccess) {
    if (parasms.status) {
      dispatch(popupAlert(0, "PopupAlertDefault"));
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: "图片上传成功",
          _autoClose: true,
          _ox: true,
        }),
      );
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: "图片上传中请稍后！",
          _autoClose: false,
          _ox: true,
        }),
      );
    }
  } else {
    dispatch(popupAlert(0, "PopupAlertDefault"));
    dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: "上传失败！",
        _autoClose: parasms.state,
        _ox: false,
      }),
    );
  }
}

// 退货/售后页面 初始化接口数据
export const returnListInit = () => (dispatch, getState) => {
  mapFuncToRun &&
    mapFuncToRun("returnListTap", {
      nowIndex: 0,
    })(dispatch, getState);
  getReturnList &&
    getReturnList({
      pageNo: 1,
      showStatus: "ALL",
    })(dispatch, getState);
  saveReturnListStatus && saveReturnListStatus("ALL")(dispatch, getState);
};

export const saveReturnListStatus = (params) => (dispatch) => {
  dispatch({
    type: types.MY_ONLINERETURN.RETURN_LIST_STATUS,
    data: params,
  });
};
const OnlineReturnListTap = require("../components/MyAccount/MyAccountOnlineReturn/OnlineReturnList/OnlineReturnListTap.json");
// 退货/售后页面切换tap的事件
function returnListTap(params, dispatch, getState) {
  window.scrollTo(0, 0);
  const { nowIndex, showStatus } = params;
  const returnListTap = getState().onlineReturn.returnListTap || OnlineReturnListTap;
  getReturnList &&
    getReturnList({
      pageNo: 1,
      showStatus,
    })(dispatch, getState);
  saveReturnListStatus && saveReturnListStatus(showStatus)(dispatch, getState);
  dispatch({
    type: types.MY_ONLINERETURN.RETURN_LIST_TAP,
    data:
      returnListTap &&
      returnListTap.map((item) => {
        const { tap_index } = item;
        const obj = { ...item };
        if (tap_index == nowIndex) {
          obj.active_class = "active";
        } else {
          obj.active_class = "";
        }
        return obj;
      }),
  });
}
// 退货---退货/售后 列表
export const getReturnList = (params) => (dispatch, getState) => {
  // let returnListData = getState().onlineReturn.returnListData
  const returnListData = JSON.parse(JSON.stringify(getState().onlineReturn.returnListData));
  const returnListStatus = getState().onlineReturn.returnListStatus;
  const { pageNo, pageSize, showStatus, totalRecord } = params;
  if ((pageNo - 1) * 15 > totalRecord) return;
  dispatch(
    $getReturnList({
      onlyKey: "getReturnList",
      url: `/v1/order/es/return/list/status`,
      type: "POST",
      data: {
        requestPage: {
          pageNo,
          pageSize: pageSize || 15,
        },
        showStatus: showStatus == "ALL" ? "" : showStatus,
      },
      isConfirm: true,
    }),
  ).then((json) => {
    let renderData;
    if (json && json.results && !json.results.code) {
      if (returnListData && returnListStatus == showStatus) {
        renderData = json && json.results;
        renderData.content = returnListData.content.concat(json.results.content);
      } else {
        renderData = json && json.results;
      }
      dispatch({
        type: types.MY_ONLINERETURN.RETURN_LIST_DATA,
        data: renderData,
      });
    }
  });
};

// 复制成功显示提示
function copySuccess(params, dispatch) {
  // dispatch(popupAlert(1, 'PopupAlertDefault', { _text: '复制成功', _totalCount: 1000, _autoClose: true, _ox: true }));
  dispatch(popupAlert(1, "PopupToast", { _text: "复制成功", _autoClose: true }));
}

// 退货---退货单详情
export const returnDetailsInit = () => (dispatch, getState) => {
  let urlInterFace;
  if (url.urlGetParams(window.location, "returnId")) {
    urlInterFace = `/v1/order/es/return/queryOrderReturn?returnId=${url.urlGetParams(
      window.location,
      "returnId",
    )}`;
  } else {
    urlInterFace = `/v1/order/es/return/queryOrderReturnDetail?orderId=${url.urlGetParams(
      window.location,
      "orderId",
    )}&returnSkuId=${url.urlGetParams(window.location, "skuId")}`;
  }
  dispatch(
    $returnDetailsInit({
      onlyKey: "returnDetailsInit",
      url: urlInterFace,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      const newObj = json.results;
      getOnlineReturnStatus &&
        getOnlineReturnStatus({
          Status: json.results.processStatus,
          contnent: json.results.tips,
          title: json.results.processComment,
        })(dispatch, getState);

      newObj.productData = [
        {
          defaultImagePath: json.results.defaultImagePath,
          brandNameEN: json.results.brandNameEN,
          productNameCN: json.results.productNameCN,
          skuSaleAttrDto: json.results.skuSaleAttr,
          quantity: json.results.applyQty,
          offerPrice: json.results.applyUnitPrice,
          productId: json.results.returnProductId,
          skuId: json.results.returnSkuId,
        },
      ];
      newObj.applyImage = JSON.parse(json.results.applyImagePaths) || [];
      newObj.delivery = {
        name: "请选择快递公司",
        iconUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png",
        value: "",
        callbackKEY: "getLogisticsCompany",
        hasRight: false,
      };
      saveApplyReturnData &&
        saveApplyReturnData({
          applyComment: json.results.applyComment,
          applyImageOriginalPaths: newObj.applyImage,
        })(dispatch, getState);
      newObj.allowEdit = json.results.processStatus == "WAIT_APPROVE";
      newObj.allowAddress = json.results.processStatus == "WAIT_RETURN";
      newObj.showDelivery =
        json.results.processStatus == "WAIT_REFUND" || json.results.processStatus == "REFUNDED";
      newObj.showPrice = !!(
        json.results.processStatus == "PARTIAL_REFUNDED" || json.results.processStatus == "REFUNDED"
      );
      newObj.totalPrice = json.results.actualTotalPrice;
      dispatch({
        type: types.MY_ONLINERETURN.RETURN_DETAILS_DATA,
        data: newObj,
      });
    }
  });
};

// 退货---修改退货申请信息
function onlineReturnDetailsEdit(params, dispatch, getState) {
  const editData = getState().onlineReturn.applyData;
  const returnID =
    getState().onlineReturn.returnDetailsData && getState().onlineReturn.returnDetailsData.returnId;
  if (
    editData &&
    (!editData.applyImageOriginalPaths || editData.applyImageOriginalPaths.length == 0)
  )
    return dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: "请上传退货凭证",
        _autoClose: true,
        _ox: false,
      }),
    );
  dispatch(
    $onlineReturnDetailsEdit({
      onlyKey: "onlineReturnDetailsEdit",
      url: `/v1/order/return/onlineReturnApplication`,
      type: "PUT",
      data: {
        applyComment: editData && editData.applyComment,
        applyImageOriginalPaths: JSON.stringify(editData && editData.applyImageOriginalPaths),
        returnId: returnID,
      },
      isConfirm: true,
    }),
  ).then((json) => {
    if (json && json.results && !json.results.code && json.results == "SUCCESS") {
      window.location.href = `/myAccount/returnDetails?returnId=${returnID}`;
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: (json && json.results && json.results.message) || "修改失败",
          _autoClose: true,
          _ox: false,
        }),
      );
    }
  });
}

function getLogisticsCompany(params, dispatch, getState) {
  const returnDetailsData = { ...getState().onlineReturn.returnDetailsData };
  let nowIndex = 0;
  const deliveryData = [
    "EMS",
    "顺丰速运",
    "申通快递",
    "韵达快递",
    "全峰快递",
    "联邦快递",
    "中通快递",
    "德邦快递",
    "宅急送",
    "天天快递",
    "全一快递",
    "百世快递",
    "苏宁快递",
    "圆通快递",
    "其他",
  ];
  deliveryData.map((item, index) => {
    if (
      returnDetailsData &&
      returnDetailsData.delivery &&
      returnDetailsData.delivery.value &&
      returnDetailsData.delivery.value == item
    ) {
      nowIndex = index;
    }
  });
  dispatch(
    popupAlert(1, "PopupScrollSelect", {
      _data: [
        "EMS",
        "顺丰速运",
        "申通快递",
        "韵达快递",
        "全峰快递",
        "联邦快递",
        "中通快递",
        "德邦快递",
        "宅急送",
        "天天快递",
        "全一快递",
        "百世快递",
        "苏宁快递",
        "圆通快递",
        "其他",
      ],
      _zIndex: 2000,
      _source: "logistics",
      _key: "returnReason",
      _nowIndex: nowIndex,
      _title: "快递公司",
    }),
  );
  dispatch({
    type: types.MY_ONLINERETURN.APPLY_NOSCROLL,
    data: true,
  });
}

function getLogisticsNumber(params, dispatch, getState) {
  const returnDetailsLogistics = getState().onlineReturn.returnDetailsLogistics;
  saveLogisticsData &&
    saveLogisticsData({
      logisticsNumber: params || null,
      logisticsCompany: returnDetailsLogistics.logisticsCompany || "",
    })(dispatch, getState);
}
export const saveLogisticsData = (params, sourece) => (dispatch, getState) => {
  const { logisticsNumber, logisticsCompany } = params;
  const returnDetailsData = { ...getState().onlineReturn.returnDetailsData };
  const returnDetailsLogistics = getState().onlineReturn.returnDetailsLogistics;
  returnDetailsData.delivery.value = logisticsCompany;
  dispatch({
    type: types.MY_ONLINERETURN.RETURN_DETAILS_DATA,
    data: returnDetailsData,
  });
  let renderLogisticsNumber;
  if (sourece == "company") {
    renderLogisticsNumber = returnDetailsLogistics.logisticsNumber;
  } else {
    renderLogisticsNumber = logisticsNumber;
  }
  dispatch({
    type: types.MY_ONLINERETURN.RETURN_DETAILS_LOGISTICS,
    data: {
      logisticsNumber: renderLogisticsNumber,
      logisticsCompany,
    },
  });
};
// deliverySubmit  退货---退货单物流信息填写
function deliverySubmit(params, dispatch, getState) {
  const returnDetailsLogistics = getState().onlineReturn.returnDetailsLogistics;
  const returnID =
    getState().onlineReturn.returnDetailsData && getState().onlineReturn.returnDetailsData.returnId;
  if (
    !returnDetailsLogistics ||
    (returnDetailsLogistics && !returnDetailsLogistics.logisticsCompany)
  ) {
    return dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: "请选择快递公司",
        _autoClose: true,
        _ox: false,
      }),
    );
  }
  if (
    !returnDetailsLogistics ||
    (returnDetailsLogistics &&
      returnDetailsLogistics.logisticsCompany &&
      returnDetailsLogistics.logisticsCompany == "请选择")
  ) {
    return dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: "请选择快递公司",
        _autoClose: true,
        _ox: false,
      }),
    );
  }
  if (
    !returnDetailsLogistics ||
    (returnDetailsLogistics && !returnDetailsLogistics.logisticsNumber)
  ) {
    return dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: "请填写快递单号",
        _autoClose: true,
        _ox: false,
      }),
    );
  }
  dispatch(
    $deliverySubmit({
      onlyKey: "deliverySubmit",
      url: `/v1/order/es/return/logisticsInfo`,
      type: "POST",
      data: {
        logisticsNumber: returnDetailsLogistics.logisticsNumber,
        logisticsCompany: returnDetailsLogistics.logisticsCompany,
        returnId: returnID,
      },
      isConfirm: true,
    }),
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      if (url.urlGetParams(window.location, "orderId")) {
        window.location.href = `/myAccount/returnDetails?returnId=${returnID}&orderPage=true&orderId=${url.urlGetParams(
          window.location,
          "orderId",
        )}`;
      } else {
        window.location.href = `/myAccount/returnDetails?returnId=${returnID}&goback=true`;
      }
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: (json.results && json.results.message) || "提交失败",
          _autoClose: true,
          _ox: false,
        }),
      );
    }
  });
}

// returnRefundDetailsInit 退货---退款单详情
export const returnRefundDetailsInit = () => (dispatch) => {
  dispatch(
    $returnRefundDetailsInit({
      onlyKey: "returnRefundDetailsInit",
      url: `/v1/order/es/return/queryOrderRefund?returnId=${url.urlGetParams(
        window.location,
        "returnId",
      )}`,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      const newObj = json.results;
      newObj.productData = [
        {
          defaultImagePath:
            json.results.returnProductInfo && json.results.returnProductInfo.defaultImagePath,
          brandNameEN: json.results.returnProductInfo && json.results.returnProductInfo.brandNameEN,
          productNameCN:
            json.results.returnProductInfo && json.results.returnProductInfo.productNameCN,
          skuSaleAttrDto:
            json.results.returnProductInfo && json.results.returnProductInfo.skuSaleAttr,
          quantity: json.results.returnProductInfo && json.results.returnProductInfo.applyQty,
          offerPrice: json.results.applyUnitPrice,
          productId:
            json.results.returnProductInfo && json.results.returnProductInfo.returnProductId,
          skuId: json.results.returnProductInfo && json.results.returnProductInfo.returnSkuId,
        },
      ];
      dispatch({
        type: types.MY_ONLINERETURN.REFUND_DETAILS,
        data: newObj,
      });
    } else {
      // alert((json && json.results && json.results.message) || '系统错误')
    }
  });
};

// Mobile协商历史
export const consultHistory = (callback) => (dispatch) => {
  const returnNo = url.urlGetParams(window.location, "returnNo") || "";
  if (!returnNo) return;
  dispatch(
    $consultHistory({
      onlyKey: "consultHistory",
      url: `/v1/order/return/negotiation?returnNo=${returnNo}`,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    if (json && json.results) callback && callback(json.results);
  });
};
