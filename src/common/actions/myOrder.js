/*
 * @Author: Leo.Si
 * @Date: 2020-06-10 13:46:20
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2020-06-16 18:16:18
 * @function myorder action
 */
import * as action from "../lib/BLL";
import * as url from "../lib/url";

// 获取订单相关的物流信息
export const initOrderDelivery = (callback) => (dispatch) => {
  dispatch(
    action.initOrderDelivery({
      onlyKey: "initOrderDelivery",
      url: `/v3/es/deliveryInfo/getDelivery/${url.urlGetParams(window.location, "orderId")}`,
      type: "GET",
      isConfirm: true,
    }),
  ).then((json) => {
    if (json && json.results && json.results.length > 0) {
      callback &&
        callback({
          data: json.results,
          hrefBack: url.urlGetParams(window.location, "orderType")
            ? `/myOrderList?orderType=${url.urlGetParams(window.location, "orderType")}`
            : "",
          // :`/order-.${url.urlGetParams(window.location, 'orderId')}html?orderType=DF`
        });
    }
  });
};
