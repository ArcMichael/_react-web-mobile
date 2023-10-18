import OrderList from "@/lib/services/OrderList";
import { typeofString } from "@/Utils/typeofUtil";
import * as constType from "../constants/ActionTypes";
//orderList 菜单切换
export const orderListChange = (val) => {
  return (dispatch) => {
    dispatch({
      type: constType.ORDERLISTSTATUS,
      ORDERLIST_STATUS: val,
    });
  };
};
//orderList 列表内容切换
export const orderListShow = (val) => {
  return (dispatch) => {
    dispatch({
      type: constType.ORDERLIST.ORDERLIST_SHOW,
      ORDERLIST_SHOW_RESULT: val,
    });
  };
};
/*根据用户ID获取订单列表*/
export const orderList = (pageNo, pageSize, orderTime, orderStatus, callback) => {
  return (dispatch) => {
    let params = {
      pageNo: pageNo,
      pageSize: pageSize,
      orderTime: orderTime,
      orderStatus: orderStatus,
    };
    OrderList.getOrderList(params).then((json) => {
      if (json) {
        switch (orderStatus) {
          case "":
            dispatch({
              type: constType.ORDERLIST.ORDERLIST_ALL,
              ORDERLIST_ALL_RESULT: json,
            });
            break;
          case "DPP":
            dispatch({
              type: constType.ORDERLIST.ORDERLIST_M,
              ORDERLIST_M_RESULT: json,
            });
            break;
          case "DIP":
            dispatch({
              type: constType.ORDERLIST.ORDERLIST_I,
              ORDERLIST_I_RESULT: json,
            });
            break;
          case "DID":
            dispatch({
              type: constType.ORDERLIST.ORDERLIST_S,
              ORDERLIST_S_RESULT: json,
            });
            break;
          case "DF":
            dispatch({
              type: constType.ORDERLIST.ORDERLIST_D,
              ORDERLIST_D_RESULT: json,
            });
            break;
          case "DPPB":
            dispatch({
              type: constType.ORDERLIST.ORDERLIST_DPPB,
              ORDERLIST_DPPB_RESULT: json,
            });
            break;
          default:
            break;
        }
        callback(json);
      }
    });
  };
};
export const orderListMore = (pageNo, pageSize, orderTime, orderStatus, callback) => {
  return () => {
    let params = {
      pageNo: pageNo,
      pageSize: pageSize,
      orderTime: orderTime,
      orderStatus: orderStatus,
    };
    OrderList.getOrderList(params).then((json) => {
      if (json) {
        callback(json);
      }
    });
  };
};
// 批量再次购买
export const batchRepurchase = (param, callback) => {
  return () => {
    OrderList.batchRepurchase(param).then((json) => {
      if (json) {
        callback(json);
      }
    });
  };
};
// 评论相关
export function switchComment(channel, callBackState) {
  //channel==O 订单列表页评论
  //channel==Q 订单详情评论
  //channel==P 商品页评论
  let isComment = false;
  if (!channel || !typeofString(channel)) return false;
  OrderList.allowComment(channel).then((callback) => {
    if (callback && callback.results && callback.results == "1") {
      isComment = true;
      return callBackState(isComment);
    }
  });
}
// 合并去购物车结算
export const mergeAndSubmit = (data, source) => {
  let sendData = { queryBody: data };
  OrderList.checkCartAction(sendData).then((json) => {
    if (json && json.results && parseInt(json.results) > 0) {
      let sourceParams = `?source=${source}`;
      window.location.href = `/cart${source ? sourceParams : ""}`;
    }
  });
};
