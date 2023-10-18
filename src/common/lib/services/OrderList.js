import request from "../request";
export default class OrderList {
  static API = `/v3/es/orders`;
  //   文字广告位
  static getSimpleTextGroup = (params) => {
    return request(`/v1/marketing/MktSimpleGroupController/simpleTextGroup`, {
      method: "POST",
      body: JSON.stringify({
        queryBody: params,
      }),
    }).then((res) => {
      return res.json();
    });
  };
  // 根据用户ID获取订单列表
  static getOrderList = (params) => {
    return request(
      `${OrderList.API}/paging/${params.pageNo}/${params.pageSize}?orderTime=${params.orderTime}&orderStatus=${params.orderStatus}`,
      {
        method: "GET",
      }
    ).then((res) => {
      return res.json();
    });
  };
  //批量再次购买
  static batchRepurchase = (params) => {
    return request(`/v3/shopcart/shopcart/addToCart`, {
      method: "POST",
      body: JSON.stringify({
        queryBody: params,
      }),
    }).then((res) => {
      return res.json();
    });
  };
  // allowComment商品详情页 - 评论、Q&A开关
  static allowComment = (params) => {
    return request(`/v1/product/switch/comment?channel=${params}`, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
  };
  //勾选购物车商品
  static checkCartAction = (params) => {
    return request(`/v1/shopcart/shopcart/saveProdChkedStat`, {
      method: "POST",
      body: JSON.stringify(params),
    }).then((res) => {
      return res.json();
    });
  };
  // 订单列表获取推荐
  static getRecommend = (params) => {
    return request(`/v1/product/product/settlement/recommend8590`, {
      method: "POST",
      body: JSON.stringify(params),
    }).then((res) => {
      return res.json();
    });
  };
}
