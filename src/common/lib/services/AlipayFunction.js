import request from "../request";

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

export default class Alipay {
  static API = `/v1/order/pay`;

  /**
   * 获取支付链接
   *
   */
  static payInfo = (params) => {
    return request(
      `/v1/order/pay/payInfo/${params.orderId}/Mobile/${params.type}?paymentCode=${params.paymentCode}&openId=${params.openId}`
    ).then((res) => {
      return res.json();
    });
  };
  /**
   * 获取订单状态
   *
   */
  static queryOrderStatus = (params) => {
    return request(`/v1/order/orderInfo/orderstatu/${params}`).then((res) => {
      return res.json();
    });
  };

  /**
   * 丝享卡支付开关
   *
   */
  static silkPayOnOff = (params) => {
    return request("/v1/marketing/MktSimpleGroupController/simpleTextGroup", {
      method: "POST",
      body: JSON.stringify({ queryBody: params }),
    }).then((res) => {
      return res.json();
    });
  };
}
