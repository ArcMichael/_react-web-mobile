import $ from "jquery";
import { fetchAjax } from "./Fecth";
import { AJAX } from "./ajax";
import { GetConfirmation, GetSingleCookie } from "./Tools";
import { urlGetParams } from "./url";
import * as device from "./device";
import getRunEnv from "../../isomorphisms/getRunEnv";
import * as utilCookieUtil from "../Utils/cookieUtil";

// 全站文字广告位
export const textAdvertiseAjax = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
  });

// 获取热搜词
export const getHotword = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
  });

// 获取历史浏览的商品数据
export const historybrows = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
  });

// 进入首页显示图片广告位
export const firstPopupImg = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
  });
// 搜索结果
// autoSuggest
export function autoSuggest(params, callback) {
  AJAX(
    {
      type: "GET",
      url: `/v2/search-service/product/suggest?keyWord=${encodeURI(params)}`,
      abort: "post_/v1/search-service/product/suggest",
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

export const getV2MyaccountUserUserCardInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

export function postMyaccountUserSocialLogin(body, data, callback) {
  $.ajax({
    type: "POST",
    url: "/api/SOA/v1/myaccount/user/socialLogin",
    data,
    success(json) {
      callback(GetConfirmation(json));
    },
    error(e) {
      const c = JSON.parse(e.responseText);
      callback(c.results);
    },
  });
}

export function getQueryCartProdTotalQuantity(body, callback) {
  const ajax = { url: "/v1/shopcart/shopcart/queryCartProdTotalQuantity" };
  if (body) ajax.body = body;
  AJAX(ajax, (json) => {
    callback(GetConfirmation(json));
  });
}

// 全站留资 -- 查询是否需要留资
export function getAuthenticate(callback) {
  AJAX(
    {
      url: `/v1/myaccount/user/authenticate`,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
// 全站留资 -- 留资
export function putAuthenticate(params, callback) {
  AJAX(
    {
      type: "PUT",
      url: `/v2/myaccount/user/authenticate?telephone=${params.telephone}&smsCode=${params.smsCode}&rToken=${params.rtoken}`,
      headers: {
        channel: "MOBILE",
        uid: params.uid,
      },
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

// 文字广告位
export function advertTxt(body, callback) {
  AJAX(
    {
      type: "POST",
      url: "/v1/marketing/MktSimpleGroupController/simpleTextGroup",
      data: body,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
// 图片广告位
export function advertImg(body, callback) {
  AJAX(
    {
      type: "POST",
      url: "/v1/marketing/MktSimpleGroupController/simpleImageGroup",
      data: body,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

/* 发送手机短信验证码 */
export function sendPhoneCode(params, callback) {
  AJAX(
    {
      type: "POST",
      url: `/v1/myaccount/sms/smsCode`,
      data: params,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
export function sendPhoneCodeV2(params, callback) {
  AJAX(
    {
      type: "POST",
      url: `/v1/usercenter/verification/smsCode?scene=${params.scene}&rToken=${params.rToken}`,
      headers: {
        channel: "MOBILE",
      },
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

/* 验证码 */
// export function postVildation(params, callback) {
//   AJAX(
//     {
//       type: 'POST',
//       url: `/v1/myaccount/valicode/code`,
//       data: params,
//     },
//     (json) => {
//       callback(GetConfirmation(json));
//     },
//   );
// }

export function postVildation(params, callback) {
  AJAX(
    {
      type: "GET",
      url: `/v1/usercenter/verification/captcha?identification=${params}&imageType=4`,
      headers: {
        channel: "MOBILE",
      },
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

export function getMyaccountUserAuthenticate(body, callback) {
  const ajax = { url: "/v1/myaccount/user/authenticate" };
  if (body) ajax.body = body;
  AJAX(ajax, (json) => {
    callback({ results: GetConfirmation(json) });
  });
}
// 限流页面判断用户是否还处于限流阶段
export const checkIsLimited = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// 获取线下服务页面的数据
export const getOfflineService = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// getGiftEventInfo 试用申领活动详情
export const getGiftEventInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// getGiftEventInfo 试用申领活动首页
export const getActivityEventInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// 获取排行榜
export const getLeaderboard = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// 获取个人助力榜
export const getAssistanceList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// 赠品领取到购车
export const addGiftTocart = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
  });

// viewGiftDetails
export const viewGiftDetails = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// 订单
export function getOrderHistory(callback) {
  const env = getRunEnv();
  let url = "https://stagem.sephora.cn/api/get_order_history.php";
  if (env === "production") {
    url = "https://m.sephora.cn/api/get_order_history.php";
  }

  $.ajax({
    type: "POST",
    url,
    success(json) {
      callback(json);
    },
    error(err) {
      const c = err.responseText;
      callback(c.results);
    },
  });
  // $.ajax({
  //   type: 'post',
  //   contentType: 'application/json',
  //   url: '/api/SOA/Util/getOrderHistory',
  //   //   xhrFields: {
  //   //     withCredentials: true
  //   //  },
  //   success: function(json) {
  //     callback(GetConfirmation(json));
  //   },
  //   error: function(e) {
  //     const c = JSON.parse(e.responseText);
  //     callback(c.results);
  //   },
  // });
}
/*
 myAccount 页面接口
*/
/* 用户个人信息主页，个人信息查询 */
export const getUserHomepageInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: "MOBILE",
    },
    isConfirm: params.isConfirm,
  });
// 获取订单数量信息，写入并重置UI数据.
export const getOrderQuantity = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// 如果是微信过来的且需要做自动登陆功能
export function automaticLoginForWechat(params, callback) {
  // $.get(`/api/SOA/automaticLoginForWechat?accesstoken=${params.accesstoken}&openid=${params.openid}`, json => {
  //   callback(json);
  // });
  $.post(
    `/api/SOA/automaticLoginForWechat?accesstoken=${params.accesstoken}&openid=${params.openid}`,
    (json) => {
      callback(json);
    },
  );
}
// unbindWeChatMyaccount
export const unbindWeChatMyaccount = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });
/* CCA 获取用户用户个人信息 */
export const getPersonalInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

/* 是否允许跳转至积分流水页 */
export const isAllowEnter = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });
/* 修改积分红点为已读 */
export const changePointStstus = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: "MOBILE",
    },
    data: params.data,
    isConfirm: params.isConfirm,
  });
/* 是否允许跳转至会员卡页面 */
export const isAllowEnterMember = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// 是否允许跳转至更换会员卡页面
export const whetherChangeCard = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// 用户进入账号管理页面，展示用户的基本信息
export const managementInit = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// 用户进入会员卡权益页面，展示当前会员卡卡号和会员卡等级
export const memberCardInit = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: "MOBILE",
    },
    isConfirm: params.isConfirm,
  });

// initIntegralFlow
export const initIntegralFlow = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: "MOBILE",
    },
    isConfirm: params.isConfirm,
  });

/* 修改新人引导图状态 */
export const changePopStatus = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });
/** 收货地址管理页面接口 */

// 获取用户的所有地址
export const getAllAddress = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });

// 新增用户的收货地址
export const addedAddress = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });
// 编辑用户的收货地址
export const editAddress = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });

// 删除用户的收货地址

export const deleteAddress = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });

// 设为默认地址
export const setDefaultAddress = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });
// 初始化省市区地址信息
export const getProvincialAndUrbanAreas = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });

// 获取用户个人信息
export const getUserProfile = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// 查询用户是否已经设置过密码
export const whetherSetPassword = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// phoneIsAvailable 通过手机号判断该手机号是可用
export const phoneIsAvailable = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
    headers: {
      channel: "MOBILE",
      uid: params.uid,
    },
  });

// multipleUserOptionalCard 根据用户ID，手机号，邮箱获取对应的可选择的会员卡
export const multipleUserOptionalCard = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });
// 更新用户个人信息
export const changePersonalInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// modifyPassword 更改密码-根据用户ID修改密码
export const modifyPassword = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// setPassword 更改密码-根据用户ID设置密码
export const setPassword = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });
// getReturnItemUnit 退货---申请可退数量以及商品单价
export const getReturnItemUnit = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });
// online return 退货---退货原因List
export const getReturnReason = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// online return  退货---退货原因-示例图
export const returnReasonSample = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// online return  获取产品数据(调用订单详情的接口)
export const getOnlineReturnOrder = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// onlineReturnApplication  用户提交退货申请
export const onlineReturnApplication = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// getReturnList 退货---退货/售后 列表
export const getReturnList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// returnDetailsInit 退货---退货单详情
export const returnDetailsInit = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// onlineReturnDetailsEdit 退货---修改退货申请信息
export const onlineReturnDetailsEdit = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// deliverySubmit 退货---退货单物流信息填写
export const deliverySubmit = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// returnRefundDetailsInit 退货---退款单详情
export const returnRefundDetailsInit = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });
// 根据code获取message
export function updateErrorMessage(body, callback) {
  AJAX(
    {
      type: "GET",
      url: `/v1/myaccount/message/errorMessage?errorCode=${body.errorCode}`,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
/* 验证图形验证码 */
export function validateValidationValue(params, callback) {
  AJAX(
    {
      url: `/v1/myaccount/valicode/validate/${params.validationValue}/${params.validationValueToken}`,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
export function validateValidationValueV2(params, callback) {
  AJAX(
    {
      url: `/v1/usercenter/verification/captcha?identification=${params.identification}&code=${params.code}&codeToken=${params.codeToken}`,
      type: "POST",
      data: params,
      headers: {
        channel: "MOBILE",
      },
      abort: "post_/v1/usercenter/verification/captcha",
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

/* 更新密码发送邮件 */
export function sendMail(params, callback) {
  AJAX(
    {
      url: `/v1/myaccount/email/email?email=${params}`,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
export function sendMailV2(params, callback) {
  AJAX(
    {
      url: `/v1/usercenter/verification/email?scene=${params.scene}&rToken=${params.rToken}`,
      headers: {
        channel: "MOBILE",
      },
      type: "POST",
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
/* 通过手机号和验证码 验证是否匹配和正确 */
export function judgePhoneCode(params, callback) {
  AJAX(
    {
      url: `/v1/myaccount/sms/smsCode/${params.mobile}/${params.module}/${params.valiCode}`,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
export function judgePhoneCodeV2(params, callback) {
  AJAX(
    {
      url: `/v1/usercenter/verification/smsCode?scene=${params.scene}&rToken=${params.rToken}&telephone=${params.telephone}&smsCode=${params.smsCode}`,
      headers: {
        channel: "MOBILE",
      },
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
/* 根据用户手机/邮箱和新密码更新用户密码 */
export function newPassWord(params, callback) {
  AJAX(
    {
      type: "PUT",
      url: `/v1/myaccount/password/userValidate`,
      data: params,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

export function newPassWordV2(params, callback) {
  AJAX(
    {
      type: "post",
      // url: `/v2/myaccount/password/reset`,
      url: `/v2/myaccount/password/forgot`,
      data: params,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
/* 登陆接口 */
export function postLogin(params, callback) {
  params.loginId = window.btoa(params.loginId);
  params.password = window.btoa(params.password);
  $.ajax({
    type: "post",
    url: "/api/SOA/v1/myaccount/user/login",
    data: params,
    success(json) {
      callback(json);
    },
  });
}
/*登陆接口(新)*/
export function postNewLogin(params, callback) {
  params.loginId = window.btoa(params.loginId);
  params.password = window.btoa(params.password);
  $.ajax({
    type: "post",
    url: "/api/SOA/v1/myaccount/user/newlogin",
    data: params,
    success(json) {
      callback(json);
    },
  });
}
// unreadMyMsg 查询我的消息（未读）数量
export const unreadMyMsg = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
    headers: {
      channel: "MOBILE",
    },
  });

// unreadBeauty 查询美力资讯（未读）数量
export const unreadBeauty = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
    headers: {
      channel: "MOBILE",
    },
  });

// mymsgList 获取我的消息列表
export const mymsgList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
    headers: {
      channel: "MOBILE",
    },
  });

// myBeautyList 获取美力资讯列表
export const myBeautyList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
    headers: {
      channel: "MOBILE",
    },
  });

// mybeautyRead 美丽资讯状态置已读
export const mybeautyRead = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: "MOBILE",
    },
    isConfirm: params.isConfirm,
  });

// mymsgRead 我的消息状态置已读
export const mymsgRead = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: "MOBILE",
    },
    isConfirm: params.isConfirm,
  });
export const pendingOrder = (uid, callback) => {
  AJAX(
    {
      type: "GET",
      url: `/v3/es/orders/pending?uid=${uid}`,
    },
    (json) => {
      callback(json);
    },
  );
};

// Mobile协商历史
export const consultHistory = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

/**
 * 忘记密码
 * 验证手机或者邮箱是否存在
 * @param {string} params loginid
 * @return {object}
 */
export const judgeUserExist = (params) =>
  fetchAjax("judgeUserExist", {
    url: `/v1/usercenter/login/exist?identification=${params.identification}&rToken=${params.rToken}`,
    type: "GET",
    headers: { channel: "MOBILE" },
  });

/**
 * 忘记密码
 * 根据邮箱链接后面的参数校验链接是否是有效链接
 * @param {string} email email
 * @param {string} active active
 * @return {object}
 */
export const judgeEmail = ({ email, active }) =>
  fetchAjax("judgeEmail", {
    url: `/v1/myaccount/email/checkEmailLink?email=${email}&active=${encodeURIComponent(active)}`,
    type: "GET",
    // Mobile
  });
/** ** login state page ***** */
// 注册

export function register(params, callback) {
  $.ajax({
    type: "post",
    url: "/api/SOA/v1/myaccount/user/register",
    data: params,
    success(json) {
      callback(json.results);
    },
    error(e) {
      const c = JSON.parse(e.responseText);
      callback(c.results);
    },
  });
}
export const saveTheFirstAndTime = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

//  cardBindOperation 用户通过输入卡号和卡片标识进行绑卡
export const cardBindOperation = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// getRegiserCardList 注册成功之后，获取用户可以绑定的会员卡
export const getRegiserCardList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

/* 登陆接口 */
export function loginStoreMember(params, callback) {
  $.ajax({
    type: "post",
    url: "/api/SOA/v2/myaccount/user/logon/captcha/mobile",
    data: params,
    success(json) {
      callback(json);
    },
  });
}

// 门店会员-根据用户ID设置密码
export function setLoginPassword(params, callback) {
  $.ajax({
    type: "post",
    url: "/api/SOA/v1/myaccount/user/setPasswordAndLogin",
    data: {
      queryBody: params,
    },
    success(json) {
      callback(json.results);
    },
  });
}

export const setLoginBindCard = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

export const getLoginPersonalInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });
export const setLoginPersonalInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

/** ** login state page ***** */

/* 用户登出接口 */
export function userLogout(callback) {
  AJAX(
    {
      type: "POST",
      url: `/v1/portal/logout`,
      headers: {
        channel: "WEB",
      },
    },
    (json) => {
      callback(json);
    },
  );
}

// 获取订单相关的物流信息
export const initOrderDelivery = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

export function discountPrice(params, callback, excludeSoldOut = false) {
  AJAX(
    {
      type: "POST",
      url: `/v1/product/product/discount-price?channel=MOBILE&&excludeSoldOut=${excludeSoldOut}`,
      data: {
        queryBody: params,
      },
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

// 获取第一道题
export const Question = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      UID: device.isWeChat()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.isWeChat()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
    data: params.data,
    isConfirm: params.isConfirm,
  });
export const skusList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    headers: {
      UID: device.isWeChat()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.isWeChat()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
    isConfirm: params.isConfirm,
  });

// 兑换券列表
export const exchangeList = (data) => {
  return new Promise((resolve, reject) => {
    AJAX(
      {
        type: "GET",
        url: `/v1/rewards-boutique/exchange-record/list?pageNum=${
          data.pageNum
        }&pageSize=${10}&storeNo=${data.storeNo ? data.storeNo : ""}`,
        headers: {
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        const { jQueryStatus } = json;
        if (jQueryStatus.status === 401) {
          window.location.href = `/login?historyLocation=${encodeURIComponent(
            window.location.pathname.replace("/", "").replace("?", "&"),
          )}${window.location.search.replace("?", "&")}`;
        }
        if (typeof json.errorCode === "number" && json.errorMessage) {
          reject(json.errorMessage);
          return;
        }
        resolve(GetConfirmation(json).results);
      },
    );
  });
};
// 兑换详情
export const exchangeDetail = (data) => {
  return new Promise((resolve, reject) => {
    AJAX(
      {
        type: "GET",
        url: `/v1/rewards-boutique/coupons/coupon?id=${data.couponId}&cardNo=${
          data.cardNo
        }&storeNo=${data.storeNo ? data.storeNo : ""}&brandId=${data.brandId ? data.brandId : ""}`,
        headers: {
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        const { jQueryStatus } = json;
        if (jQueryStatus.status === 401) {
          window.location.href = `/login?historyLocation=${encodeURIComponent(
            window.location.pathname.replace("/", "").replace("?", "&"),
          )}${window.location.search.replace("?", "&")}`;
        }
        if (typeof json.errorCode === "number" && json.errorMessage) {
          reject(json.errorMessage);
          return;
        }
        resolve(GetConfirmation(json).results);
      },
    );
  });
};
// 兑换
export const couponsExchange = (data) => {
  return new Promise((resolve, reject) => {
    AJAX(
      {
        type: "POST",
        url: `/v1/rewards-boutique/coupons/exchange`,
        headers: {
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
        data,
      },
      (json) => {
        const { jQueryStatus } = json;
        if (jQueryStatus.status === 401) {
          window.location.href = `/login?historyLocation=${encodeURIComponent(
            window.location.pathname.replace("/", "").replace("?", "&"),
          )}${window.location.search.replace("?", "&")}`;
        }
        if (typeof json.errorCode === "number" && json.errorMessage) {
          reject(json);
          return;
        }
        resolve(GetConfirmation(json).results);
      },
    );
  });
};
// 付邮申领兑换
export const couponsPostmailExchange = (data) => {
  return new Promise((resolve, reject) => {
    AJAX(
      {
        type: "POST",
        url: `/v1/rewards-boutique/coupons/exchange_post_trial`,
        headers: {
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
        data,
      },
      (json) => {
        const { jQueryStatus } = json;
        if (jQueryStatus.status === 401) {
          window.location.href = `/login?historyLocation=${encodeURIComponent(
            window.location.pathname.replace("/", "").replace("?", "&"),
          )}${window.location.search.replace("?", "&")}`;
        }
        if (typeof json.errorCode === "number" && json.errorMessage) {
          reject(json);
          return;
        }
        resolve(GetConfirmation(json).results);
      },
    );
  });
};
// 兑换记录详情
export const exchangeRecordDetail = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
    data: params.data,
    isConfirm: params.isConfirm,
  });
// 证书上的个人信息
export const getProfileInfo = () => {
  return new Promise((resolve) => {
    AJAX(
      {
        type: "GET",
        url: `/v1/portal/member/profile/info`,
        headers: {
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
          channel: "MOBILE",
        },
      },
      (json) => {
        const { jQueryStatus } = json;
        if (jQueryStatus.status === 401) {
          window.location.href = `/login?historyLocation=${encodeURIComponent(
            window.location.pathname.replace("/", "").replace("?", "&"),
          )}${window.location.search.replace("?", "&")}`;
        }
        resolve(json.results);
      },
    );
  });
};
// 赚积分广告位
export const gainPointBanner = () => {
  return new Promise((resolve) => {
    AJAX(
      {
        type: "GET",
        url: `/v1/rewards-boutique/platfrom/point-rule-banner`,
        headers: {
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        const { jQueryStatus } = json;
        if (jQueryStatus.status === 401) {
          window.location.href = `/login?historyLocation=${encodeURIComponent(
            window.location.pathname.replace("/", "").replace("?", "&"),
          )}${window.location.search.replace("?", "&")}`;
        }
        resolve(json.results);
      },
    );
  });
};
// 海报小程序码广告位
export const getDonatePosterBanner = () => {
  return new Promise((resolve) => {
    AJAX(
      {
        type: "POST",
        url: `/v1/marketing/MktSimpleGroupController/simpleImageGroup`,
        data: {
          queryBody: { locationLabel: "ALL:CHARITY:POSTER" },
        },
      },
      (json) => {
        if (
          json &&
          json.results &&
          json.results.resourceList &&
          json.results.resourceList.length > 0
        ) {
          resolve(json.results.resourceList[0]);
        }
      },
    );
  });
};
/** product details page */
// 商品详情页 - 产品基本信息接口
export const getProductDetailsInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
  });
// 调用/v2/product/sku/info 获取商品的具体信息
export const getProductInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// 色卡获取商品规格色板列表具体内容
export const pickColors = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// screenColor 色卡获取商品规格色板列表
export const screenColor = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// getPromotionDetails 调用/v2/product/sku/{skuId}/MOBILE/promotion-info 获取商品的具体的促销信息
export const getPromotionDetails = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// getVBDetailsDetails 调用/v2/product/sku/{skuCode}/{channel}/vb 获取sku相关的套装信息
export const getVBDetailsDetails = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// 调用商品详情页 - 评论列表接口 获取对应的产品的评论列表
export const getCommentList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// 获取图文详情
export function getProductDetails(params, callback) {
  $.get(`/api/SOA/Util/getProductDetails?url=${params}`, (json) => {
    callback(json);
  });
}

// 调用商品详情页 -获取商品的相关的咨询信息
export const getProductConsulationt = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// 调用商品详情页 -获取商品的搭配推荐信息
export const getProductRecommend = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

export const arrivalNoticeAjax = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// 调用商品详情页 -获取所有sku规格
export const openAttrChoice = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

export const addToCart = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

// pdp页获取榜单信息
export const getRanking = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// //getIfComment 判断当前用户是否可以评论
// export const getIfComment = (params) => fetchAjax(params.onlyKey, {
//   url: params.url,
//   type: params.type
// })
/** product details page */

// export function getProductDetails(params, callback) {
//   $.get(`/api/SOA/Util/getProductDetails?url=${params}`, json => {
//     callback(json);
//   });
// }
export const getIfComment = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

/** invoideList page */
// 获取订单下的发票信息
export const getInvoiceList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// 发送指定发票到邮箱
export const sendInvoiceEmail = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    isConfirm: params.isConfirm,
  });

// ----------------------------------- Portal ---------------------------

export const InvoiceType = {
  personal: 0,
  corporate: 1,
};
export const InvoiceIsDefault = {
  no: 0,
  yes: 1,
};
export class InvoiceTitleDTO {
  /** @type {typeof InvoiceType} - 1企业 0 个人 */
  type = InvoiceType.personal;

  /** @type {string} - 抬头名称 */
  name = "";

  /** @type {typeof InvoiceIsDefault} - 是否默认抬头 */
  isDefault = InvoiceIsDefault.no;

  /** @type {string?} - 税号 */
  taxNo;

  /** @type {string?} - 开户银行 */
  bankName;

  /** @type {string?} - 开户银行账号 */
  bankAccount;

  /** @type {string?} - 企业地址 */
  address;

  /** @type {string?} - 企业电话 */
  tel;

  /** @type {number?} - 抬头id */
  id;

  /**
   *
   * @param {InvoiceTitleDTO?} props
   */
  constructor(props) {
    if (props) {
      Object.keys(props).forEach((key) => {
        this[key] = props[key];
      });
    }
  }
}

export class Portal {
  /**
   * 新增用户发票抬头
   * @param {InvoiceTitleDTO} data
   * @return {Promise<number>} - titleId
   */
  static AddInvoiceTitle = (data) => {
    return new Promise((resolve, reject) => {
      AJAX(
        {
          type: "post",
          url: `/v1/portal/invoicetitle`,
          headers: {
            channel: "MOBILE",
          },
          data,
        },
        (json) => {
          if (typeof json.errorCode === "number" && json.errorMessage) {
            reject(json.errorMessage);
            return;
          }
          resolve(GetConfirmation(json).results);
        },
      );
    });
  };

  /**
   * 编辑发票抬头接口
   * @param {InvoiceTitleDTO} data
   * @return {Promise<boolean>} - description
   */
  static EditInvoiceTitle = (data) => {
    const { id } = data;
    return new Promise((resolve, reject) => {
      AJAX(
        {
          type: "PUT",
          url: `/v1/portal/invoicetitle/${id}`,
          headers: {
            channel: "MOBILE",
          },
          data,
        },
        (json) => {
          if (typeof json.errorCode === "number" && json.errorMessage) {
            reject(json.errorMessage);
            return;
          }
          resolve(GetConfirmation(json).results);
        },
      );
    });
  };

  /**
   * 查询发票抬头接口
   * @return {Promise<InvoiceTitleDTO[]>} data
   */
  static GetInvoiceTitles = () => {
    return new Promise((resolve, reject) => {
      AJAX(
        {
          type: "GET",
          url: `/v1/portal/invoicetitle`,
          headers: {
            channel: "MOBILE",
          },
        },
        (json) => {
          if (typeof json.errorCode === "number" && json.errorMessage) {
            reject(json.errorMessage);
            return;
          }
          resolve(GetConfirmation(json).results);
        },
      );
    });
  };

  /**
   * 查询用户默认发票抬头接口
   * @return {Promise<InvoiceTitleDTO>} data
   */
  static GetDefaultInvoiceTitle = () => {
    return new Promise((resolve, reject) => {
      AJAX(
        {
          type: "GET",
          url: `/v1/portal/invoicetitle/default`,
          headers: {
            channel: "MOBILE",
          },
        },
        (json) => {
          if (typeof json.errorCode === "number" && json.errorMessage) {
            reject(json.errorMessage);
            return;
          }
          resolve(GetConfirmation(json).results);
        },
      );
    });
  };

  /**
   * 查询用户默认发票抬头接口
   * @param {number} id
   * @return {Promise<InvoiceTitleDTO>} data
   */
  static DeleteInvoiceTitle = (id) => {
    return new Promise((resolve, reject) => {
      AJAX(
        {
          type: "DELETE",
          url: `/v1/portal/invoicetitle?titleId=${id}`,
          headers: {
            CHANNEL: "MOBILE",
          },
        },
        (json) => {
          if (typeof json.errorCode === "number" && json.errorMessage) {
            reject(json.errorMessage);
            return;
          }
          resolve(GetConfirmation(json).results);
        },
      );
    });
  };
}

// ----------------------------------- Invoice ---------------------------

/**
 * @typedef {Object} ApplyInvoiceParams
 * @property {string} orderId 订单号
 * @property {number} invoiceId 电子发票抬头id
 */

class Invoice {
  /**
   * 发票 申请开具发票
   * @param {ApplyInvoiceParams} data
   * @return {Promise<string>} data
   */
  static applyInvoice = (data) => {
    return new Promise((resolve, reject) => {
      AJAX(
        {
          type: "post",
          url: `/v1/order/invoice/${data.orderId}/channel?invoiceId=${data.invoiceId}&channel=MOBILE`,
        },
        (json) => {
          if (typeof json.errorCode === "number" && json.errorMessage) {
            reject(json.errorMessage);
            return;
          }
          resolve(GetConfirmation(json).results);
        },
      );
    });
  };
}

export class Order {
  /**
   * 发票
   */
  static Invoice = Invoice;
}

// 榜单页 获取榜单列表
export const getRankingList = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });

// pdp全额预售立即购买时验证是否会报错
export const canBuyNow = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
  });

// export const GEThotsalesSku = (params) =>
/**
 * 查询用户默认发票抬头接口
 * @param {number} id
 * @return {Promise<InvoiceTitleDTO>} data
 */
export class HotsalesSku {
  static GetHotsalesSku = ({ categoryId, pageNo }) => {
    const channel = device.isDevice();
    return new Promise((resolve, reject) => {
      AJAX(
        {
          type: "GET",
          headers: {
            channel,
          },
          url: `/v1/dp/hotsales/${categoryId}/skus?channel=${channel}&pageNo=${pageNo}`,
        },
        (json) => {
          if (typeof json.errorCode === "number" && json.errorMessage) {
            reject(json.errorMessage);
            return;
          }
          resolve(GetConfirmation(json).results);
        },
      );
    });
  };
}
export class MyAccount {
  static getBaseInfo = () => {
    return new Promise((resolve, reject) => {
      AJAX(
        {
          type: "GET",
          url: `/v1/portal/card/base/info`,
          headers: {
            channel: device.isDevice(),
          },
        },
        (json) => {
          if (typeof json.errorCode === "number" && json.errorMessage) {
            reject(json.errorMessage);
            return;
          }
          resolve(GetConfirmation(json).results);
        },
      );
    });
  };
}

// 强制绑定手机
export const bindTelephoneForce = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    headers: {
      channel: "MOBILE",
    },
  });

// 历史优惠券
export const getCouponHistory = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });
// 【Sprint3】 Mob - Backend - Service 抽奖小游戏
export const getLotteryEventInfo = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });

// 抽奖活动 - 关联商品列表
export const lotteryProducts = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });
// 抽奖活动 - 我的奖品
export const lotteryMyPrize = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });
// 抽奖活动 - 抽奖
export const lotteryStart = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
    data: params.data,
  });
// 抽奖活动 - 查看奖品
export const lotteryGift = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
    data: params.data,
  });
// 领取线下优惠券
export const offlineCouponSave = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    headers: {
      uid: device.isWeChat()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
    },
  });

// MIUMIU 香水自选组合 Step 1
export const getMiuMiuStep1Detail = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// MIUMIU 香水自选组合 Step 2
export const getMiuMiuStep2Detail = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// MIUMIU 香水自选组合 Step 3
export const getMiuMiuStep3Detail = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
// MIUMIU 香水自选组合 加入购物车
export const combAddToCart = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
  });

// 设置地址为选择地址
export function choiceAddress(params, callback) {
  AJAX(
    {
      type: "PUT",
      url: `/v1/shopcart/shopcart/addReceivingInformation`,
      data: params,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
// 抽奖活动 - 新增/修改中奖地址
export const lotteryAddress = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      channel: device.isApp()
        ? "APP"
        : device.device_inMiniProgramsEnvironment()
        ? "MINIPROGRAM"
        : "MOBILE",
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
    data: params.data,
  });
// 抽奖活动 - 分享增加抽奖次数
export const lotteryShare = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
    data: params.data,
  });

// category 图片广告位
export function categoryImg(body, callback) {
  AJAX(
    {
      type: "POST",
      url: "/v1/marketing/MktSimpleGroupController/simpleImageGroup",
      data: body,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

// plp页数据
export const getPlpPageData = (params) => {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });
};

// plp页品牌数据
export const getPlpPageBrandData = (params) => {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });
};

export function couponInfo(params, callback) {
  AJAX(
    {
      type: "GET",
      url: `/v1/promotion/pxCoupon/couponInfo/${params}`,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

// 根据关联词获取abTest的Key
export function getMatchKey(params) {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
}

// 筛选关联词对应的广告资源
export function getMatchText(params) {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
}

// 筛选关联词对应的广告资源
export function screenNum(params) {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
}

export function quickscreenResetFilter(params) {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
}

// 是否显示活动筛选
export function getFilterActStatus(params) {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
}
//选礼Q&A问答环节接口
export const giftsQuestion = (params) =>
  fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    data: params.data,
    isConfirm: params.isConfirm,
  });

/*根据用户ID获取优惠券信息*/
export function getMyCoupon(params, callback) {
  AJAX(
    {
      url: `/v2/myaccount/coupon/list/${params.pageNo}/${params.pageSize}?valid=${params.valid}`,
      headers: { channel: "MOBILE" },
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}
// 获取门店优惠券
export function getDoorList(params, callback) {
  AJAX(
    {
      type: "POST",
      url: `/v1/offlieLineExternal/coupon/list`,
      headers: { channel: "MOBILE" },
      data: params,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}

// 用户登录时选择允许/不允许多端登录
export function multiLogin(params, callback) {
  AJAX(
    {
      headers: { channel: "MOBILE", multiLoginToken: params.multiLoginToken },
      type: "POST",
      url: "/v1/usercenter/login/multiLogin/" + params.permit,
    },
    (json) => {
      const { results } = json;

      if (results && results.sephoraToken) {
        utilCookieUtil.SetSingleCookie2({
          key: "Token",
          value: results.sephoraToken,
          domain: ".sephora.cn",
          path: "/",
        });
        // 本地登录的流程
        if (window.location.port === "60018") {
          utilCookieUtil.SetSingleCookie2({
            key: "Token",
            value: results.sephoraToken,
            domain: "localhost",
            path: "/",
          });
        }
      }
      if (results && results.userId) {
        utilCookieUtil.SetSingleCookie2({
          key: "UID",
          value: results.userId,
          domain: ".sephora.cn",
          path: "/",
        });
      }
      results.errorMessage && alert(json.errorMessage);
      callback && callback(GetConfirmation(json));
    },
  );
}
// 短信验证码高风险登录
export function smsLoginTwo(params, callback) {
  AJAX(
    {
      headers: { channel: "MOBILE" },
      type: "POST",
      url: "/v1/usercenter/login/second/high-risk",
      data: params.data,
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// 是否显示无库存弹窗
export function noinvPopup(params) {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
  });
}

// 有奖问答， 活动首页
export function getHomePage(id, callback) {
  AJAX(
    {
      type: "GET",
      url: "/v1/activity/award-question/getHomePage/" + id,
      headers: {
        channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
        UID: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "uid")
          : GetSingleCookie(document.cookie, "UID"),
        Token: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "token")
          : GetSingleCookie(document.cookie, "Token"),
      },
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// 有奖问答-获取问卷明细
export function getQuestionnaire(id, callback) {
  AJAX(
    {
      type: "GET",
      url: "/v1/activity/award-question/getQuestionnaire/" + id,
      headers: {
        channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
        UID: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "uid")
          : GetSingleCookie(document.cookie, "UID"),
        Token: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "token")
          : GetSingleCookie(document.cookie, "Token"),
      },
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// 有奖问答-提交问答结果
export function setQuestionCommit(param, callback) {
  AJAX(
    {
      type: "put",
      url: "/v1/activity/award-question/questionnaireResult/commit",
      data: param,
      headers: {
        channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
        UID: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "uid")
          : GetSingleCookie(document.cookie, "UID"),
        Token: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "token")
          : GetSingleCookie(document.cookie, "Token"),
      },
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// 有奖问答-查看问答结果
export function getAnswerResult(id, callback) {
  AJAX(
    {
      type: "GET",
      url: "/v1/activity/award-question/getAnswerResult/" + id,
      headers: {
        channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
        UID: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "uid")
          : GetSingleCookie(document.cookie, "UID"),
        Token: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "token")
          : GetSingleCookie(document.cookie, "Token"),
      },
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// 有奖问答- 抽奖
export function getLuck(id, awardId, callback) {
  AJAX(
    {
      type: "POST",
      url: "/v1/activity/lottery/luck",
      data: {
        lotteryId: id,
        awardQuestionId: awardId,
      },
      headers: {
        channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
        UID: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "uid")
          : GetSingleCookie(document.cookie, "UID"),
        Token: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "token")
          : GetSingleCookie(document.cookie, "Token"),
      },
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// 有奖问答-分享
export function luckShare(params, callback) {
  AJAX(
    {
      type: "POST",
      url: "/v1/activity/award-question/addAnswerCount/share",
      data: params,
      headers: {
        channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
        UID: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "uid")
          : GetSingleCookie(document.cookie, "UID"),
        Token: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "token")
          : GetSingleCookie(document.cookie, "Token"),
      },
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// 有奖问答- 抽奖活动 - 我的奖品
export function myPrize(id, callback) {
  AJAX(
    {
      type: "GET",
      url: "/v1/activity/lottery/my-prize/" + id,
      headers: {
        channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
        UID: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "uid")
          : GetSingleCookie(document.cookie, "UID"),
        Token: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "token")
          : GetSingleCookie(document.cookie, "Token"),
      },
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// 有奖问答- 抽奖活动 - 查看奖品
export function seePrize(id, callback) {
  AJAX(
    {
      type: "POST",
      url: "/v1/activity/lottery/prize-info",
      data: {
        lotteryId: id,
      },
      headers: {
        channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
        UID: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "uid")
          : GetSingleCookie(document.cookie, "UID"),
        Token: device.device_inMiniProgramsEnvironment()
          ? urlGetParams(window.location, "token")
          : GetSingleCookie(document.cookie, "Token"),
      },
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}
export function getVBList(params, callback) {
  AJAX(
    {
      type: params.type,
      url: params.url,
    },
    (json) => {
      callback && callback(GetConfirmation(json));
    },
  );
}

// plp页品牌数据
export const getVBListTwo = (params) => {
  return fetchAjax(params.onlyKey, {
    url: params.url,
    type: params.type,
    headers: {
      UID: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "uid")
        : GetSingleCookie(document.cookie, "UID"),
      Token: device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token"),
    },
  });
};
export function newPassWordV3(params, callback) {
  let url;
  if(params.type == "mobile"){
    url = `/v1/usercenter/account-safety/forgot/tel`;
  } else {
    url = `/v2/usercenter/verification/email`;
  }
  AJAX(
    {
      type: "post",
      url,
      data: params,
    },
    (json) => {
      callback(GetConfirmation(json));
    },
  );
}