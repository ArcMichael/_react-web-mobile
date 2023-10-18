import request from "../request";

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

export default class OrderDetail {
  /**
   * 获取订单详情
   */
  static queryOrderDetailAction = (orderId) => {
    return request(`/v3/es/order/detail/mobile/${orderId}`).then((res) => {
      return res.json();
    });
  };

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
   * 获取订单状态
   *
   */
  static queryDefaultAddressAction = (params) => {
    return request(`/v1/shopcart/cneeinfo/queryCneeInfoListSortByUpdateTime`, {
      method: "POST",
      body: params,
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 设置默认地址
   *
   */
  static setDefaultAddress = (params) => {
    return request(`/v1/shopcart/cneeinfo/setDefaultCneeInfo`, {
      method: "POST",
      body: params,
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 删除地址
   *
   */
  static deleteAddress = (params) => {
    return request(`/v1/shopcart/cneeinfo/removeCneeInfo`, {
      method: "POST",
      body: params,
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 选择地址
   *
   */
  static chooseAddressPT = (params) => {
    return request(
      `/v1/order/orderInfo/orderAddressChecked/${params.orderId}/${params.addressId}`,
      {
        method: "PUT",
      }
    ).then((res) => {
      return res.json();
    });
  };

  /**
   * 修改地址
   *
   */
  static editAddress = (params) => {
    return request(
      `/v1/order/orderInfo/orderAddress/${params.queryBody.orderId}`,
      {
        method: "PUT",
        body: JSON.stringify(params),
      }
    ).then((res) => {
      return res.json();
    });
  };

  /**
   * 增加地址（
   *
   */
  static addAddress = (params) => {
    return request(
      `/v1/order/orderInfo/orderAddress/${params.queryBody.orderId}`,
      {
        method: "POST",
        body: JSON.stringify(params),
      }
    ).then((res) => {
      return res.json();
    });
  };

  /**
   * 是否可评价
   *
   */
  static allowComment = (params) => {
    return request(`/v1/product/switch/comment?channel=${params}`, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 去购物车
   *
   */
  static mergeAndSubmit = (params) => {
    return request(`/v1/shopcart/shopcart/saveProdChkedStat`, {
      method: "POST",
      body: JSON.stringify(params),
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 批量再次购买
   *
   */
  static batchRepurchase = (params) => {
    return request(`/v3/shopcart/shopcart/addToCart`, {
      method: "POST",
      body: JSON.stringify(params),
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 取消订单
   *
   */
  static cancelOrderAction = (params) => {
    return request(`/v1/order/orderInfo/cancelOrder`, {
      method: "POST",
      body: JSON.stringify(params),
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 取消订单2
   *
   */
  static cancelReturnOrderAction = (params) => {
    return request(`/v1/order/orderInfo/cancelInProcessOrder`, {
      method: "POST",
      body: JSON.stringify(params),
      headers: { channel: "MOBILE" },
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 订单详情提示广告位
   *
   */
  static advertTxt = (params) => {
    return request(`/v1/marketing/MktSimpleGroupController/simpleTextGroup`, {
      method: "POST",
      body: JSON.stringify(params),
    }).then((res) => {
      return res.json();
    });
  };

  /**
   * 订单详情提示广告位
   *
   */
  static addToCart = (params) => {
    return request(`/v3/shopcart/shopcart/addToCart`, {
      method: "POST",
      body: JSON.stringify(params),
    }).then((res) => {
      return res.json();
    });
  };
}
