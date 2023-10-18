/*
 * @Author: Leo.Si
 * @Date: 2019-08-17 16:04:03
 * @Last Modified by: summer
 * @Last Modified time: 2021-04-Tu 01:53:17
 * @function myAccount action
 */
import Utils from "@/lib/utils";
import * as action from "../lib/BLL";
import * as types from "../constants/ActionTypes";
import { soaLoginOff, judgeIsChangeUser, GetSingleCookie } from "../lib/Tools";
import { popupAlert } from "./popup";
import * as url from "../lib/url";
import { passwordRegExp } from "../Utils/RegExp";
import Sensor from "../Utils/sensor";
import UITMP from "../components/MyAccount/MyAccountCenter/UTMP";
import managementUITMP from "../components/MyAccount/MyAccountManagement/UTMP";
import memberUITMP from "../components/MyAccount/MyAccountMemberCard/UTMP";

const REGISTERERRORMESSAGE = require("../components/LoginStatePages/Register/RegisterError.json");

/*
 * 账号管理页面的action
 */
/**
 * 注销账户.
 */
function unsubscribe(dispatch) {
  dispatch(
    popupAlert(1, "PopupCleaning", {
      _text: "如需注销账户，请拨打400-670-0055",
    })
  );
}
/**
 * 退出当前账户.
 */
function signOut(dispatch) {
  if (judgeIsChangeUser()) {
    dispatch(
      popupAlert(1, "PopupConfirmMyaccount", {
        _text: "确认解除绑定？",
        _closeCallback: () => dispatch(unbindWeChatMyaccount()),
      })
    );
  } else {
    // soaLoginOff();
    dispatch(
      popupAlert(1, "PopupCleaning", {
        _text: "您确认退出当前登入的账号吗？",
        _callback: () => soaLoginOff(),
        _cancel: true,
        _btnWord: "确认",
      })
    );
  }
}
/**
 * 在线客服.
 */
function startCustomerService(dispatch) {
  Sensor.go("CustomerServiceClick", {
    button_location: "myAccount",
  });
  dispatch(
    action.getPersonalInfo({
      onlyKey: "getPersonalInfo",
      url: `/v1/myaccount/user/userProfile`,
      type: "GET",
    })
  ).then((json) => {
    if (
      json &&
      json.jQueryStatus &&
      (json.jQueryStatus.status === 401 || json.status === 401)
    ) {
      window.location.href = `/login?historyLocation=${window.location.pathname}${window.location.search}`;
    } else {
      let token = GetSingleCookie(document.cookie, "Token") || "";
      let url = "https://uataicca.sephora.cn/webchatbot/h5chat_sephora.html";
      if (Utils.getEnv("restfulEnv") === "production") {
        url = "https://aicca.sephora.cn/webchatbot/h5chat_sephora.html";
      }
      Sensor.go("CustomerServiceClick", {
        button_location: "returnRequest",
      });
      window.location.href = `${url}?sysNum=1603354924318&sourceId=70181&lang=zh_CN&token=${token}`;
    }
  });
}
/**
 * 申领中心.
 */
function claimcenter(dispatch) {
  dispatch(
    popupAlert(1, "PopupCleaning", {
      _text: "微信搜索丝芙兰小程序开启申领中心体验",
      _btnWord: "确认",
      _callback: () => {
        Sensor.go("myAccountClick", {
          $lib_detail: "M_NewMobile##getSensorData##PopupAlertMyaccount.js##43",
          button_name: "确认跳转到小程序申领中心",
        });
        dispatch(popupAlert(0, "PopupCleaning"));
      },
    })
  );
  // dispatch(
  //   popupAlert(1, "Popup", { _text: "微信搜索丝芙兰小程序开启申领中心体验", _confirmText: "确认" }),
  // );
}

/**
 * 是否允许跳转至积分流水页.
 */
function changePointStstus(dispatch, getState) {
  const profile = Object.assign({}, getState().myAccount.UIProfile);
  //修改积分红点为已读
  if (profile.cardExtendSysId) {
    dispatch(
      action.changePointStstus({
        onlyKey: "changePointStstus",
        url: `/v1/portal/card/point/status?cardExtendSysId=${profile.cardExtendSysId}`,
        type: "PUT",
        isConfirm: true,
      })
    ).then((json) => {
      if (json && json.results) {
        dispatch(
          action.isAllowEnter({
            onlyKey: "isAllowEnter",
            url: `/v2/myaccount/user/view/control/points-history`,
            type: "GET",
            isConfirm: true,
          })
        ).then((json) => {
          if (json && !json.results) {
            window.location.href = "/myAccount/integralFlow";
          }
        });
      }
    });
  } else {
    dispatch(
      action.isAllowEnter({
        onlyKey: "isAllowEnter",
        url: `/v2/myaccount/user/view/control/points-history`,
        type: "GET",
        isConfirm: true,
      })
    ).then((json) => {
      if (json && !json.results) {
        window.location.href = "/myAccount/integralFlow";
      }
    });
  }
}

/**
 * 是否允许跳转至会员卡页面.
 */
function isAllowEnterMember(dispatch) {
  dispatch(
    action.isAllowEnterMember({
      onlyKey: "isAllowEnterMember",
      url: `/v1/myaccount/user/validate/userGroup`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    if (json && json.results) {
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: json.results,
          _autoClose: true,
        })
      );
      // alert(json.results);
    } else {
      window.location.href = "/myAccount/myMemberCard";
    }
  });
}
/**
 * 是否允许跳转至更换会员卡页面.
 */
function whetherChangeCard(dispatch) {
  dispatch(
    action.whetherChangeCard({
      onlyKey: "whetherChangeCard",
      url: `/v1/myaccount/card/validateUserExchangedCard`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    const { status, code } = json && json.results;
    if (!code && status && status === "success") {
      window.location.href = `/resetMyCard?pre_url=${window.location.pathname}`;
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: "您已经更换过会员卡,请致电400-670-0055换卡",
          _autoClose: true,
        })
      );
    }
  });
}
/**
 * 跳转至消息中心.
 */
function toMyMessage(dispatch, getState) {
  const profile = Object.assign({}, getState().myAccount.UIProfile);
  window.location.href = profile && profile.myNewsLink;
}
/**
 * 个人中心页面所需回调方法map.
 * 根据callbackKEY来拿取相应函数用于执行
 */

const funcMap = {
  unsubscribe,
  signOut,
  startCustomerService,
  claimcenter,
  changePointStstus,
  isAllowEnterMember,
  whetherChangeCard,
  toMyMessage,
};
/**
 * 作为回调函数传入组件，通过函数名map调用所有方法.
 * @param {string} callbackKEY 需要调取的函数名
 */
export const mapFuncToRun = (callbackKEY) => (dispatch, getState) => {
  const func = funcMap[callbackKEY];
  func && func(dispatch, getState);
};
/**
 *
 * 判断当前用户是否是微信公众号过来，且带有参数 access_token openid orign=='wechat'
 */

export const automaticLoginForWechat = () => (dispatch, getState) => {
  if (
    /(micromessenger|webbrowser)/.test(
      window.navigator.userAgent.toLocaleLowerCase()
    ) &&
    url.urlGetParams(window.location, "access_token") &&
    url.urlGetParams(window.location, "openid") &&
    url.urlGetParams(window.location, "orign") == "wechat"
  ) {
    new Promise((res) => {
      action.automaticLoginForWechat(
        {
          accesstoken: url.urlGetParams(window.location, "access_token"),
          openid: url.urlGetParams(window.location, "openid"),
        },
        (json) => {
          if (json && json.results) res(json.results);
        }
      );
    }).then((results) => {
      if (results && results.token && results.id) {
        initial && initial()(dispatch, getState);
      } else if (
        results.code &&
        [40098399, 40091099].indexOf(results.code) > -1
      ) {
        window.location.href = `/login?historyLocation=/myAccount&access_token=${url.urlGetParams(
          window.location,
          "access_token"
        )}&openid=${url.urlGetParams(window.location, "openid")}`;
      } else {
        window.location.href = `/login?historyLocation=/myAccount&access_token=${url.urlGetParams(
          window.location,
          "access_token"
        )}&openid=${url.urlGetParams(window.location, "openid")}`;
      }
    });
  }
  if (initial) {
    initial()(dispatch, getState);
  }
};

// 点击切换账号时 弹出确认此操作的提示
export const unbindWeChatMyaccount = () => (dispatch) => {
  dispatch(
    action.unbindWeChatMyaccount({
      onlyKey: "unbindWeChatMyaccount",
      url: `/v1/myaccount/wechat/unbind`,
      type: "PUT",
      isConfirm: true,
    })
  ).then((json) => {
    if (json && json.results && json.results == "success") {
      window.location.href = `/wxBindCard/?access_token=${url.urlGetParams(
        window.location,
        "access_token"
      )}&openid=${url.urlGetParams(window.location, "openid")}`;
    } else {
      dispatch(popupAlert(0, "PopupAlertMyaccount"));
    }
  });
};
/**
 * 个人信息主页 接口以及数据整理
 */

export const initial = () => (dispatch, getState) => {
  initialUIdata && initialUIdata()(dispatch, getState);
  getUserHomepageInfo && getUserHomepageInfo()(dispatch, getState);
  getOrderQuantity && getOrderQuantity()(dispatch, getState);
  getPulchritude && getPulchritude()(dispatch, getState);
  // unreadMyMsg && unreadMyMsg()(dispatch, getState);
  membermsgCount && membermsgCount()(dispatch, getState);
};
/**
 * 1.未调用接口前初始化UI数据.
 * @param {string} callbackKEY 需要调取的函数名
 */
export const initialUIdata = () => (dispatch) => {
  const data = JSON.parse(JSON.stringify(UITMP));

  // 个人信息部分
  dispatch({
    type: types.MY_ACCOUNT.MY_ACCOUNT_PROFILE,
    data: Object.assign({}, data.myAccountInfo),
  });
  // 订单信息部分
  dispatch({
    type: types.MY_ACCOUNT.MY_ACCOUNT_ORDERS,
    data: [...data.order],
  });
  // 工具信息部分
  // dispatch({
  //     type: types.MY_ACCOUNT.MY_ACCOUNT_TOOLS,
  //     data: [...UITMP.tool]
  // });
  //引导图信息部分
  dispatch({
    type: types.MY_ACCOUNT.MY_ACCOUNT_GUIDEIMAGE,
    data: [...UITMP.guideImageList],
  });
};
/**
 * 2.调用个人信息主页—个人及会员卡信息
 * @param {string} callbackKEY 需要调取的函数名
 */
export const getUserHomepageInfo = () => (dispatch, getState) => {
  dispatch(
    action.getUserHomepageInfo({
      onlyKey: "getUserHomepageInfo",
      url: `/v1/portal/member/homepage/info`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    let {
      cardBenefitsInfo,
      cardLevel,
      cardPoints,
      couponCounts,
      nickName,
      photo,
      userProfileAdPosition,
      upgradeProcess,
      code,
      popStatus,
      cardExtendSysId,
    } = json.results;
    if (!code) {
      const profile = Object.assign({}, getState().myAccount.UIProfile);
      // 昵称长度最高显示11位
      if (nickName && nickName.length > 12)
        nickName = nickName.substring(0, 12) + "...";
      profile.nickname = nickName;
      // pc裁切后的图片需要拼接后缀
      // if (photo && ((photo.length - 1) === photo.lastIndexOf('_'))) photo += '120x120.jpg';
      profile.photo =
        photo ||
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/userImg.png";
      // 当前积分
      profile.cardPoints =
        cardPoints && cardPoints > 99999 ? "99999+" : cardPoints;
      // 积分提示
      profile.cardBenefitsInfo = cardBenefitsInfo;
      // 优惠券数量
      profile.couponCounts =
        couponCounts && couponCounts > 99 ? "99+" : couponCounts;
      // 会员卡等级
      profile.cardLevel = profile.cardTypeMapping[cardLevel] || "无卡会员";
      // 会员卡图片
      profile.cardImageUrl =
        profile.cardImage[cardLevel] ||
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/defalut_card.png";
      // 等级进度条
      profile.upgradeProcess = upgradeProcess;
      // 判断等级进度条 积分提示 是否同时存在
      profile.cardInfoClass = !(
        !cardBenefitsInfo &&
        (!upgradeProcess || upgradeProcess < 0)
      );
      // 判断当前用户的组别，粉白黑金能进入会员卡页面，其余等级不能进入
      profile.userGroup = profile.userGroup.indexOf(cardLevel) > -1;
      // 是否展示丝享派
      // sprint42 功能隐藏
      profile.isEnjoyMent.state = null;
      //是否展示新人引导图
      profile.popStatus = popStatus;
      //过期积分
      profile.cardExtendSysId = cardExtendSysId;
      dispatch({
        type: types.MY_ACCOUNT.MY_ACCOUNT_PROFILE,
        data: profile,
      });
      if (userProfileAdPosition) {
        dispatch(
          action.textAdvertiseAjax({
            onlyKey: "getMyaccountTitle",
            url: "/v1/marketing/MktSimpleGroupController/simpleTextGroup",
            type: "POST",
            data: {
              queryBody: { locationLabel: "MOBILE:USERINFO:NEWTITLE" },
            },
          })
        ).then((data) => {
          // 是否展示补全个人信息提示
          const newProflie = JSON.parse(JSON.stringify(profile));
          newProflie.userProfileAdPosition =
            data &&
            data.results &&
            data.results.resourceList &&
            data.results.resourceList[0] &&
            data.results.resourceList[0].content;
          dispatch({
            type: types.MY_ACCOUNT.MY_ACCOUNT_PROFILE,
            data: newProflie,
          });
        });
      }
    }
  });
};
// 修改新人引导图状态
export const changePopStatus = (params, callback) => (dispatch) => {
  dispatch(
    action.changePopStatus({
      onlyKey: "changePopStatus",
      url: `/v1/portal/user/pop/initialize`,
      type: "PUT",
      isConfirm: true,
    })
  ).then((json) => {
    if (json && json.results) callback && callback(json.results);
  });
};
// 获取订单数量信息，写入并重置UI数据.
export const getOrderQuantity = () => (dispatch, getState) => {
  dispatch(
    action.getOrderQuantity({
      onlyKey: "getOrderQuantity",
      url: `/v1/myaccount/order/orderQuantity?orderTime=`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    const { results } = json;
    const orderLists = Object.assign([], getState().myAccount.UIOrderLists);
    !json.code &&
      dispatch({
        type: types.MY_ACCOUNT.MY_ACCOUNT_ORDERS,
        data: orderLists.map((tmp) => {
          const obj = Object.assign({}, tmp);
          if (obj.key) {
            let amount = results && results[obj.key];
            obj.content = amount || "";
            if (amount > 99) {
              amount = 99;
              obj.moreClass = "moreClass";
              obj.content = amount + "+";
            }
          }
          return obj;
        }),
      });
  });
};

// 获取玩美服务数据
export const getPulchritude = () => (dispatch) => {
  dispatch(
    action.textAdvertiseAjax({
      onlyKey: "textAdvertiseAjax",
      url: "/v1/marketing/MktSimpleGroupController/simpleImageGroup",
      type: "POST",
      data: {
        queryBody: { locationLabel: "MOBILE:PLAYBEAUTY:BANNER" },
      },
      isConfirm: true,
    })
  ).then((json) => {
    const { results } = json;
    const callbackkey = {
      申领中心: "claimcenter",
      在线客服: "startCustomerService",
    };
    if (results && results.resourceList && results.resourceList.length > 0) {
      dispatch({
        type: types.MY_ACCOUNT.MY_ACCOUNT_TOOLS,
        data: results.resourceList.map((item) => {
          const obj = Object.assign({}, item);
          obj.name = item.content;
          obj.href = item.link;
          obj.imgUrl = item.imagePath;
          obj.callbackKEY = callbackkey[item.content];
          obj.SensorName = `玩美服务-${item.content}`;
          obj.iconClass = "";
          obj.content = "";
          return obj;
        }),
      });
    }
  });
};
// data: UITMP.tool.map((tmp, i) => {
//     let obj = Object.assign({}, tmp);
//     obj.name = results.resourceList[i].content
//     obj.href = results.resourceList[i].link || ''
//     obj.imgUrl = results.resourceList[i].imagePath
//     return obj;
// })
/**
 * 个人信息管理页面 接口以及数据整理
 */
export const managementInit = () => (dispatch) => {
  dispatch(
    action.managementInit({
      onlyKey: "managementInit",
      url: `/v1/portal/mobile/member/management/info`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    let { nickName, photo, isCompleted } = json.results;
    const profile = JSON.parse(JSON.stringify(managementUITMP));
    // 昵称长度最高显示11位
    if (nickName && nickName.length > 12)
      nickName = nickName.substring(0, 12) + "...";
    profile.userInfo.nickname = nickName;

    // pc裁切后的图片需要拼接后缀
    //  if (photo && ((photo.length - 1) === photo.lastIndexOf('_'))) photo += '120x120.jpg';
    profile.userInfo.photo =
      photo ||
      "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/userImg.png";
    // 是否补全用户信息
    profile.userInfo.isCompleted = isCompleted;
    dispatch({
      type: types.MY_ACCOUNT.MANAGEMENT_OPTIONS,
      data: profile,
    });
  });
};

/**
 * 会员权益页面 接口以及数据整理
 */
export const memberCardInit = () => (dispatch) => {
  dispatch(
    action.memberCardInit({
      onlyKey: "memberCardInit",
      url: `/v1/portal/card/base/info`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    const { cardLevel, cardNo, cardBenefitsInfo, cardPoints } = json.results;
    const profile = JSON.parse(JSON.stringify(memberUITMP));
    // 会员卡等级
    profile.cardImageText =
      (profile.cardTypeMapping[cardLevel] &&
        profile.cardTypeMapping[cardLevel][0]) ||
      "无卡会员";
    // 会员卡图片
    profile.cardImageUrl = profile.cardImage[cardLevel];
    // 会员卡号
    profile.cardNo = cardNo;
    // 会员卡提示信息
    profile.benefitsInfo = cardBenefitsInfo;
    // 会员积分
    profile.cardPoints = cardPoints;
    // 当前会员的卡等级索引（pink:0,white:1,black:2,golden:3）
    profile.currentIndex =
      profile.cardTypeMapping[cardLevel] &&
      profile.cardTypeMapping[cardLevel][1];
    // 判断当前用户的组别，粉白黑金能进入会员卡页面，其余等级不能进入
    profile.userGroup = profile.userGroup.indexOf(cardLevel) > -1;
    dispatch({
      type: types.MY_ACCOUNT.MEMBER_INFO,
      data: Object.assign(profile, { cardLevel }),
    });
  });
};

// Mobile积分记录页面——积分流水
export const initIntegralFlow = (pageNowIndex) => (dispatch, getState) => {
  const integralFlowData = getState().myAccount.integralFlowData;
  if (
    integralFlowData &&
    integralFlowData.pageNo * integralFlowData.pageSize >
      integralFlowData.totalCount
  )
    return;
  dispatch(
    action.initIntegralFlow({
      onlyKey: "initIntegralFlow",
      url: `/v1/portal/card/points-flow?pageNo=${pageNowIndex}`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    const { memberCardPointsFlowDtos, pageNo, pageSize, totalCount } =
      json.results;
    const cardPointsFlowList = integralFlowData
      ? integralFlowData.memberCardPointsFlowDtos.concat(
          memberCardPointsFlowDtos
        )
      : memberCardPointsFlowDtos;
    dispatch({
      type: types.MY_ACCOUNT.INTEGRAL_FLOW,
      data: {
        memberCardPointsFlowDtos: cardPointsFlowList,
        pageNo,
        pageSize,
        totalCount,
        isBottom: pageNo * pageSize > totalCount,
      },
    });
  });
};

// 收货地址管理页面 接口数据整理
export const initAddress = () => (dispatch, getState) => {
  getAllAddress && getAllAddress()(dispatch, getState);
};
/**
 * 收货地址管理页面所需回调方法map.
 * 根据callbackKEY来拿取相应函数用于执行
 */

const addressFuncMap = {
  switchAddressShow,
  saveProvince,
  controlProvince,
  addedAddress,
  editAddress,
  deleteAddress,
  setDefaultAddress,
};
export const mapAddressFuncToRun =
  (callbackKEY, parasms, index) => (dispatch, getState) => {
    const func = addressFuncMap[callbackKEY];
    func && func(parasms, dispatch, getState, index);
  };

// 切换操作时的页面展示
function switchAddressShow(parasms, dispatch, getState, index) {
  const AllAddress = getState().myAccount.AllAddress;
  if (parasms === "addAddress" && AllAddress && AllAddress.length >= 10)
    return dispatch(
      popupAlert(1, "PopupToast", {
        _text: "抱歉，地址最多只能有10条，删一条再建吧！",
        _autoClose: true,
      })
    );
  dispatch({
    type: types.MY_ADDRESS.ADDRESSS_STATUS,
    data: parasms,
  });
  dispatch({
    type: types.MY_ADDRESS.CURRENT_INDEX,
    data: index,
  });
}
// 是否展示省市区信息
function controlProvince(parasms, dispatch) {
  dispatch({
    type: types.MY_ADDRESS.CONTROL_PROVINCE,
    data: parasms,
  });
}
// 保存省市区信息
function saveProvince(parasms, dispatch) {
  dispatch({
    type: types.MY_ADDRESS.SAVE_PROVINCE_DATA,
    data: parasms,
  });
}
// 获取所有地址信息
export const getAllAddress = () => (dispatch) => {
  dispatch(
    action.getAllAddress({
      onlyKey: "getAllAddress",
      url: `/v1/myaccount/addressManagement/addressList`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    const { results } = json;
    if (!results) {
      dispatch({
        type: types.MY_ADDRESS.ADDRESSS_STATUS,
        data: "noAddress",
      });
      dispatch({
        type: types.MY_ADDRESS.ALL_ADDRESSS,
        data: "",
      });
    } else {
      dispatch({
        type: types.MY_ADDRESS.ALL_ADDRESSS,
        data:
          results &&
          results.map((item) => {
            const newObj = Object.assign([], item);
            newObj.phone = item.mobilePhone
              ? item.mobilePhone.substring(0, 3) +
                "****" +
                item.mobilePhone.substring(7, 11)
              : item.telephone;
            newObj.address =
              item.addrProvince +
              item.addrCity +
              (item.addrDistrict ? item.addrDistrict : "") +
              item.addrDetail +
              (item.zipcode ? "," + item.zipcode : "");
            return newObj;
          }),
      });
    }
  });
};
// 新增收货地址
function addedAddress(parasms, dispatch, getState) {
  if (!parasms)
    return dispatch(
      popupAlert(1, "PopupToast", {
        _text: "请先填写信息！",
        _autoClose: true,
      })
    );
  const province = getState().myAccount.province_city_areas;
  const ajaxParams = {
    userName: parasms.userName || "",
    mobilePhone: parasms.mobilePhone || "",
    telephone: parasms.telephone || "",
    addrProvince: (province && province.province) || "",
    addrCity: (province && province.city) || "",
    addrDistrict: (province && province.areas) || "",
    zipcode: parasms.zipcode || "",
    addrDetail: parasms.addrDetail || "",
    isDefault: parasms.isDefault || "",
    orderType: 1,
  };
  const alertMessage = {
    userName: "请输入收货人姓名！",
    mobilePhone: "请输入手机号码！",
    addrDetail: "请输入详细地址！",
    addrProvince: "请输入所在地区!",
  };
  for (const i in ajaxParams) {
    if (
      !ajaxParams[i] &&
      ["isDefault", "telephone", "zipcode", "addrDistrict"].indexOf(i) == -1
    ) {
      return dispatch(
        popupAlert(1, "PopupToast", {
          _text: alertMessage[i],
          _autoClose: true,
        })
      );
    } else {
      if (i === "mobilePhone" && ajaxParams["mobilePhone"].length > 11) {
        return dispatch(
          popupAlert(1, "PopupToast", {
            _text: "手机号不能超过11位",
            _autoClose: true,
          })
        );
      }
      if (i === "mobilePhone" && ajaxParams["mobilePhone"].length < 11) {
        return dispatch(
          popupAlert(1, "PopupToast", {
            _text: "请输入正确的手机号码！",
            _autoClose: true,
          })
        );
      }
      // else if (i === 'zipcode' && ajaxParams['zipcode'].length != 6) {
      //     return alert('请输入正确的邮政编码！')
      // }
    }
  }
  dispatch(
    action.addedAddress({
      onlyKey: "addedAddress",
      url: `/v1/myaccount/addressManagement/addAddress`,
      type: "POST",
      data: {
        queryBody: ajaxParams,
      },
      isConfirm: true,
    })
  ).then((json) => {
    const { code, saveState } = json;
    if (!code) {
      if (saveState && saveState == "FAILED") {
        dispatch(
          popupAlert(1, "PopupToast", {
            _text: "新增地址失败! ",
            _autoClose: true,
          })
        );
      } else {
        dispatch(getAllAddress());
        switchAddressShow("allAddress", dispatch, getState);
      }
    } else {
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: "新增地址失败! ",
          _autoClose: true,
        })
      );
    }
  });
}

// 编辑收货地址
function editAddress(parasms, dispatch, getState) {
  if (!parasms)
    return dispatch(
      popupAlert(1, "PopupToast", {
        _text: "请先填写信息! ",
        _autoClose: true,
      })
    );
  const province = getState().myAccount.province_city_areas;
  const ajaxParams = {
    userName: parasms.userName || "",
    mobilePhone: parasms.mobilePhone || "",
    telephone: parasms.telephone || "",
    addrProvince: (province && province.province) || parasms.addrProvince,
    addrCity: (province && province.city) || parasms.addrCity,
    addrDistrict: (province && province.areas) || parasms.addrDistrict,
    zipcode: parasms.zipcode || "",
    addrDetail: parasms.addrDetail || "",
    isDefault: parasms.isDefault,
    orderType: 1,
    addrId: parasms.addrId,
  };
  const alertMessage = {
    userName: "请输入收货人姓名！",
    mobilePhone: "请输入手机号码！",
    addrDetail: "请输入详细地址！",
    addrProvince: "请输入所在地区!",
  };

  for (const i in ajaxParams) {
    if (
      !ajaxParams[i] &&
      ["isDefault", "telephone", "zipcode", "addrDistrict"].indexOf(i) == -1
    ) {
      return dispatch(
        popupAlert(1, "PopupToast", {
          _text: alertMessage[i],
          _autoClose: true,
        })
      );
    } else {
      if (i === "mobilePhone" && ajaxParams["mobilePhone"].length > 11) {
        return dispatch(
          popupAlert(1, "PopupToast", {
            _text: "手机号不能超过11位",
            _autoClose: true,
          })
        );
      }
      if (i === "mobilePhone" && ajaxParams["mobilePhone"].length < 11) {
        return dispatch(
          popupAlert(1, "PopupToast", {
            _text: "请输入正确的手机号码",
            _autoClose: true,
          })
        );
      }
    }
  }
  dispatch(
    action.editAddress({
      onlyKey: "editAddress",
      url: `/v1/myaccount/addressManagement/editAddress`,
      type: "PUT",
      data: {
        queryBody: ajaxParams,
      },
      isConfirm: true,
    })
  ).then((json) => {
    const { code, saveState } = json;
    if (!code) {
      if (saveState && saveState == "FAILED") {
        dispatch(
          popupAlert(1, "PopupToast", {
            _text: "修改地址失败! ",
            _autoClose: true,
          })
        );
      } else {
        dispatch(getAllAddress());
        switchAddressShow("allAddress", dispatch, getState);
      }
    } else {
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: "修改地址失败! ",
          _autoClose: true,
        })
      );
    }
  });
}

// 删除地址信息 deleteAddress
function deleteAddress(parasms, dispatch, getState) {
  if (!parasms)
    return dispatch(
      popupAlert(1, "PopupToast", {
        _text: "请确定！",
        _autoClose: true,
      })
    );
  if (confirm("是否确认删除？")) {
    dispatch(
      action.deleteAddress({
        onlyKey: "deleteAddress",
        url: `/v1/myaccount/addressManagement/removeAddress`,
        type: "POST",
        data: {
          queryBody: {
            addrId: parasms,
          },
        },
        isConfirm: true,
      })
    ).then((json) => {
      const { results, code } = json;
      if (!code) {
        if (results && results != 1) {
          dispatch(
            popupAlert(1, "PopupToast", {
              _text: "修改地址失败!",
              _autoClose: true,
            })
          );
        } else {
          dispatch(getAllAddress());
          switchAddressShow("allAddress", dispatch, getState);
        }
      } else {
        dispatch(
          popupAlert(1, "PopupToast", {
            _text: "删除地址失败! ",
            _autoClose: true,
          })
        );
      }
    });
  }
}

// 设为默认地址
function setDefaultAddress(parasms, dispatch, getState) {
  if (!parasms)
    return dispatch(
      popupAlert(1, "PopupToast", {
        _text: "请确定！",
        _autoClose: true,
      })
    );
  dispatch(
    action.setDefaultAddress({
      onlyKey: "setDefaultAddress",
      url: `/v1/myaccount/addressManagement/defaultAddress`,
      type: "POST",
      data: {
        queryBody: {
          addrId: parasms,
        },
      },
      isConfirm: true,
    })
  ).then((json) => {
    const { results, code } = json;
    if (!code) {
      if (results && results != 1) {
        dispatch(
          popupAlert(1, "PopupToast", {
            _text: "设为默认地址失败! ",
            _autoClose: true,
          })
        );
      } else {
        dispatch(getAllAddress());
        switchAddressShow("allAddress", dispatch, getState);
      }
    } else {
      dispatch(
        popupAlert(1, "PopupToast", {
          _text: "设为默认地址失败! ",
          _autoClose: true,
        })
      );
    }
  });
}

// 初始化省市区地址信息
export const getProvincialAndUrbanAreas = (callback) => (dispatch) => {
  // action.getProvincialAndUrbanAreas().then(json => {
  //   callback && callback(json && json.results);
  // });
  dispatch(
    action.getProvincialAndUrbanAreas({
      onlyKey: "getProvincialAndUrbanAreas",
      url: `/v1/shopcart/cneeinfo/initProvinceList`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    callback && callback(json && json.results);
  });
};

/** ********************用户更改登录密码页面数据处理**********************/
const setPassWordFuncMap = {
  phoneIsAvailable,
  changePersonalInfo,
  modifyPassword,
  setPassword,
  switchPage,
  mymsgClick,
  validateValidationValue,
};
export const mapFunSetPassWordToRun =
  (callbackKEY, parasms, callback, ...rest) =>
  (dispatch, getState) => {
    const func = setPassWordFuncMap[callbackKEY];
    func && func(parasms, dispatch, getState, callback, ...rest);
  };

// 切换操作时的页面展示
function switchPage(parasms, dispatch) {
  dispatch({
    type: types.MY_PROFILE.PAGE_SHOW,
    data: parasms,
  });
}
function validateValidationValue(
  parasms,
  dispatch,
  getState,
  callback,
  stop,
  start
) {
  const { valiCode, valiCodeToken, mobile, scene } = parasms;
  let isSuccess = false;
  let params = {
    code: valiCode,
    codeToken: valiCodeToken,
    identification: mobile,
  };
  action.validateValidationValueV2(params, (json) => {
    let valiCodeStatus = json.results && json.results.rtoken;
    let isMBcorrect = /^1\d{10}$/.test(mobile);
    if (valiCodeStatus) {
      if (mobile && isMBcorrect) {
        action.sendPhoneCodeV2(
          {
            scene: scene || "TELREGISTED",
            rToken: valiCodeStatus,
          },
          (json) => {
            if (json && !json.results && json.errorMessage) {
              dispatch(
                popupAlert(1, "PopupAlertDefault", {
                  _text: json.errorMessage,
                  _autoClose: true,
                  _zIndex: 201,
                })
              );
            } else {
              start && start();
            }
          }
        );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: REGISTERERRORMESSAGE["error-reporting-8"],
            _autoClose: true,
            _zIndex: 201,
          })
        );
        stop && stop();
      }
    } else {
      // if (valiCodeStatus == "invalid") isSuccess = true
      isSuccess = true;
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: json.errorMessage,
          _autoClose: true,
          _zIndex: 201,
        })
      );
      stop && stop();
    }
    callback && callback(isSuccess, valiCodeStatus);
  });
}
// 获取用户信息，并且判断用户手机号是否已经被验证
export const initialSetPassWord = () => (dispatch, getState) => {
  dispatch(
    action.getUserProfile({
      onlyKey: "getUserProfile",
      url: `/v1/myaccount/user/userProfile`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    dispatch({
      type: types.MY_PROFILE.PROFILE_INFO,
      data: json && json.results,
    });
    const { results } = json;
    const { telephoneValid, message, code } = results;
    if (code)
      return dispatch(
        popupAlert(1, "PopupToast", {
          _text: message,
          _autoClose: true,
        })
      );
    if (telephoneValid && telephoneValid == 1) {
      whetherSetPassword()(dispatch, getState);
    } else {
      switchPage("authentication", dispatch, getState);
    }
  });
};
// 判断用户是否设置过密码
export const whetherSetPassword = () => (dispatch, getState) => {
  dispatch(
    action.whetherSetPassword({
      onlyKey: "whetherSetPassword",
      url: `/v1/myaccount/password/password`,
      type: "GET",
      isConfirm: true,
    })
  ).then((res) => {
    const { results } = res;
    const { resultStatus, code, message } = results;
    if (code)
      return dispatch(
        popupAlert(1, "PopupToast", {
          _text: message,
          _autoClose: true,
        })
      );
    if (resultStatus && resultStatus == "success") {
      switchPage("modifyPassword", dispatch, getState);
    } else {
      switchPage("setPassword", dispatch, getState);
    }
  });
};

// phoneIsAvailable通过手机号判断该手机号是可用
function phoneIsAvailable(parasms, dispatch, getState, callback) {
  dispatch(
    action.phoneIsAvailable({
      onlyKey: "phoneIsAvailable",
      url: `/v2/myaccount/user/telephoneMember?telephone=${parasms.telephone}&&smsCode=${parasms.smsCode}&rToken=${parasms.rToken}`,
      type: "POST",
      isConfirm: true,
      uid: GetSingleCookie(document.cookie, "UID") || null,
    })
  ).then((res) => {
    const { results } = res;
    const { useable, code, message } = results;
    if (!code && useable == true) {
      dispatch({
        type: types.MY_PROFILE.USER_MOBILE,
        data: parasms.telephone,
      });
      multipleUserOptionalCard(
        {
          queryBody: {
            email: "",
            mobile: parasms.telephone,
            smsCode: parasms.smsCode,
            smsModule: "1007",
          },
        },
        dispatch,
        getState,
        callback
      );
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: message || "系统错误",
          _autoClose: true,
        })
      );
      callback && callback(false);
    }
  });
}

// multipleUserOptionalCard 根据用户ID，手机号，邮箱获取对应的可选择的会员卡
function multipleUserOptionalCard(parasms, dispatch, getState, callback) {
  if (!parasms) return;
  const profile = getState().myAccount.profile;
  dispatch(
    action.multipleUserOptionalCard({
      onlyKey: "multipleUserOptionalCard",
      url: `/v1/myaccount/card/multipleUserOptionalCard?mobile=${parasms.queryBody.mobile}&email=${parasms.queryBody.email}`,
      type: "GET",
      isConfirm: true,
    })
  ).then((res) => {
    const { results } = res;
    const { code, message } = results;
    if (code)
      return dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: message || "系统错误",
          _autoClose: true,
        })
      );
    dispatch({
      type: types.MY_PROFILE.CARD_LIST,
      data: results,
    });
    if (res && res.results) {
      if ((res.results && res.results.length == 1) || res.results == null) {
        changePersonalInfo(
          {
            queryBody: {
              mobile: parasms.queryBody.mobile,
              loginId: profile && profile.loginId,
              cardNum: res.results[0].id,
            },
          },
          dispatch,
          getState,
          callback
        );
      } else {
        switchPage("chooseCard", dispatch, getState);
      }
    } else {
      changePersonalInfo(
        {
          queryBody: {
            mobile: parasms.queryBody.mobile,
            loginId: profile && profile.loginId,
          },
        },
        dispatch,
        getState,
        callback
      );
    }
  });
}

// 更新用户个人信息 changePersonalInfo
function changePersonalInfo(parasms, dispatch, getState) {
  dispatch(
    action.changePersonalInfo({
      onlyKey: "changePersonalInfo",
      url: `/v1/myaccount/user/profile/`,
      type: "PUT",
      data: parasms,
      isConfirm: true,
    })
  ).then((res) => {
    const { results } = res;
    const { code, message } = results;
    if (code)
      return dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: message || "系统错误",
          _autoClose: true,
        })
      );
    if (results && results.mobile) {
      // changePersonalInfo()(dispatch, getState)
      whetherSetPassword()(dispatch, getState);
    }
  });
}

// 更改密码-根据用户ID修改密码
function modifyPassword(parasms, dispatch, getState, callback) {
  if (!parasms) return;
  // if (parasms.newPassWord != parasms.newPassWordSure) {
  //     dispatch(popupAlert(1, 'PopupErrorWarnning', { _text: '设置新密码和确认密码不一致' || '系统错误', _autoClose: true }))
  //     return callback && callback(false)
  // }
  const errorMessage =
    passwordRegExp({
      password: parasms.newPassWord,
      oldPassword: parasms.oldPassWord,
      newPassWord: parasms.newPassWordSure,
    }) || null;
  if (errorMessage) {
    dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: errorMessage || "系统错误",
        _autoClose: true,
      })
    );
    return callback && callback(false);
  }
  dispatch(
    action.modifyPassword({
      onlyKey: "modifyPassword",
      url: `/v1/myaccount/password/password`,
      type: "PUT",
      data: {
        queryBody: {
          newPassword: parasms.newPassWord,
          oldPassword: parasms.oldPassWord,
        },
      },
      isConfirm: true,
    })
  ).then((res) => {
    const { results } = res;
    const { code, resultStatus } = results;
    const Message = {
      40091099: "设置密码失败",
      40097099: "提交失败，请稍后重试",
      40097199: "密码为空或格式不正确",
      40093099: "旧密码不正确",
    };
    if (code) {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: Message[code] || "请致电:400-670-0055",
          _autoClose: true,
        })
      );
      return callback && callback(false);
    } else {
      if (results && resultStatus && resultStatus == "success")
        window.location.href = "/myAccount/management";
    }
  });
}
// setPassword
function setPassword(parasms, dispatch, getState, callback) {
  if (!parasms) return;
  // if (parasms.newPassWord != parasms.newPassWordSure) {
  //     dispatch(popupAlert(1, 'PopupErrorWarnning', { _text: '设置新密码和确认密码不一致' || '系统错误', _autoClose: true }))
  //     return callback && callback(false)
  // }
  const errorMessage =
    passwordRegExp({
      password: parasms.newPassWord,
      newPassWord: parasms.newPassWordSure,
    }) || null;
  if (errorMessage) {
    dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: errorMessage || "系统错误",
        _autoClose: true,
      })
    );
    return callback && callback(false);
  }
  dispatch(
    action.setPassword({
      onlyKey: "setPassword",
      url: `/v1/myaccount/password/password`,
      type: "POST",
      data: {
        queryBody: {
          newPassword: parasms.newPassWord,
        },
      },
      isConfirm: true,
    })
  ).then((res) => {
    const { results } = res;
    const { code, resultStatus } = results;
    const Message = {
      40091099: "设置密码失败",
      40097099: "提交失败，请稍后重试",
      40097199: "密码为空或格式不正确",
      40093099: "旧密码不正确",
    };
    if (code) {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: Message[code] || "请致电:400-670-0055",
          _autoClose: true,
        })
      );
      return callback && callback(false);
    } else {
      if (results && resultStatus && resultStatus == "success") {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: "密码设置成功",
            _autoClose: true,
            _ox: true,
          })
        );
        setTimeout(() => {
          window.location.href = "/myAccount/management";
        }, 300);
      }
    }
  });
}
/** ********************用户更改登录密码页面数据处理**********************/
/** ********************我的消息页面数据初始化**********************/
const myMsgUITMP = require("../components/MyAccount/MyAccountMessage/myMessage.json");
export const myMessageInit = () => (dispatch, getState) => {
  dispatch({
    type: types.MY_ACCOUNT.MYMSG_TAP,
    data: myMsgUITMP.map((item) => {
      const { tap_index } = item;
      const obj = JSON.parse(JSON.stringify(item));
      if (item == 0) obj.active_class = "active";
      if (url.urlGetParams(window.location, "type") == tap_index)
        obj.active_class = "active";
      return obj;
    }),
  });
  // 1 我的消息  0  美力资讯
  // if (url.urlGetParams(window.location, 'type') == 1) {
  //     unreadMyMsg && unreadMyMsg()(dispatch, getState)
  //     // mymsgList && mymsgList(1)(dispatch, getState)
  // } else {
  //     unreadMyMsg && unreadMyMsg()(dispatch, getState)
  //     myBeautyList && myBeautyList(1)(dispatch, getState)
  // }
  membermsgCount && membermsgCount()(dispatch, getState);
};
export const unreadMyMsg = () => (dispatch, getState) => {
  dispatch(
    action.unreadMyMsg({
      onlyKey: "unreadMyMsg",
      url: `/v1/omni/membermsg/mymsg/unread/count`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    if (json && json.results) {
      // const { results } = json
      // let profile = Object.assign({}, getState().myAccount.UIProfile);
      // let newProflie = JSON.parse(JSON.stringify(profile))
      // newProflie.myNewsCount = (json && json.results > 0) ? true : false
      // newProflie.myNewsLink = (json && json.results > 0) ? '/myAccount/myMessage?type=1' : '/myAccount/myMessage?type=0'
      // dispatch({
      //     type: types.MY_ACCOUNT.MY_ACCOUNT_PROFILE,
      //     data: newProflie
      // });
      // if (window && window.location && window.location.pathname == '/myAccount') return
      const renderData = JSON.parse(JSON.stringify(myMsgUITMP));
      renderData[1].isRead = json.results > 0;
      if (json.results > 0 && url.urlGetParams(window.location, "type") == 1) {
        mymsgRead && mymsgRead(1)(dispatch, getState);
        renderData[1].active_class = "active";
      } else {
        renderData[0].active_class = "active";
      }
      dispatch({
        type: types.MY_ACCOUNT.MYMSG_TAP,
        data: renderData,
      });
    } else {
      if (url.urlGetParams(window.location, "type") == 1) {
        mymsgList && mymsgList(1)(dispatch, getState);
      }
    }
  });
};
// 切换操作时的页面展示
function mymsgClick(parasms, dispatch, getState) {
  Sensor.go("MsgCenterExposure", {
    msg_type: parasms.name,
  });
  const myMsgTap = getState().myAccount.myMsgTap;
  const renderData = JSON.parse(JSON.stringify(myMsgTap));
  if (parasms && parasms.identification && parasms.identification == "beauty") {
    renderData[0].active_class = "active";
    renderData[1].active_class = "";
    dispatch({
      type: types.MY_ACCOUNT.MYMSG_TAP,
      data: renderData,
    });
    dispatch({
      type: types.MY_ACCOUNT.MESSAGHE_LIST,
      data: "",
    });
    if (parasms && parasms.active_class && parasms.active_class == "active")
      return;
    if (parasms && parasms.isRead) {
      mybeautyRead && mybeautyRead(1)(dispatch, getState);
    } else {
      myBeautyList && myBeautyList(1)(dispatch, getState);
    }
    window.history.replaceState(
      `?type=${url.urlGetParams(window.location, "type")}`,
      "",
      "?type=0"
    );
  } else if (
    parasms &&
    parasms.identification &&
    parasms.identification == "msg"
  ) {
    renderData[0].active_class = "";
    renderData[1].active_class = "active";
    dispatch({
      type: types.MY_ACCOUNT.MYMSG_TAP,
      data: renderData,
    });
    dispatch({
      type: types.MY_ACCOUNT.MESSAGHE_LIST,
      data: "",
    });
    if (parasms && parasms.active_class && parasms.active_class == "active")
      return;
    if (parasms && parasms.isRead) {
      mymsgRead && mymsgRead(1)(dispatch, getState);
    } else {
      mymsgList && mymsgList(1)(dispatch, getState);
    }
    window.history.replaceState(
      `?type=${url.urlGetParams(window.location, "type")}`,
      "",
      "?type=1"
    );
  }
}

// 我的消息状态置已读
export const mymsgRead = () => (dispatch, getState) => {
  dispatch(
    action.mymsgRead({
      onlyKey: "mymsgRead",
      url: `/v1/omni/membermsg/mymsg/read`,
      type: "PUT",
      isConfirm: true,
    })
  ).then((json) => {
    const myMsgTap = getState().myAccount.myMsgTap;
    const renderData = JSON.parse(JSON.stringify(myMsgTap));
    if (json && json.results && !json.results.code) {
      renderData[1].isRead = false;
      dispatch({
        type: types.MY_ACCOUNT.MYMSG_TAP,
        data: renderData,
      });
    }
    mymsgList && mymsgList(1)(dispatch, getState);
  });
};
export const mybeautyRead = () => (dispatch, getState) => {
  dispatch(
    action.mybeautyRead({
      onlyKey: "mybeautyRead",
      url: `/v1/omni/membermsg/beauty/read`,
      type: "PUT",
      isConfirm: true,
    })
  ).then((json) => {
    const myMsgTap = getState().myAccount.myMsgTap;
    const renderData = JSON.parse(JSON.stringify(myMsgTap));
    if (json && json.results && !json.results.code) {
      renderData[0].isRead = false;
      dispatch({
        type: types.MY_ACCOUNT.MYMSG_TAP,
        data: renderData,
      });
    }
    // 获取我的资讯列表数据
    myBeautyList && myBeautyList(1)(dispatch, getState);
  });
};
// 获取我的消息列表
export const mymsgList = (nowIndex) => (dispatch, getState) => {
  let messageList = "";
  if (nowIndex > 1) messageList = getState().myAccount.messageList;
  const mymsgListData = JSON.parse(JSON.stringify(messageList));
  dispatch(
    action.mymsgList({
      onlyKey: "mymsgList",
      url: `/v1/omni/membermsg/mymsg/list/${nowIndex}`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    let renderData;
    if (json && json.results && !json.results.code) {
      if (mymsgListData) {
        renderData = json && json.results;
        renderData.list = mymsgListData.list.concat(json.results.list);
      } else {
        renderData = json && json.results;
      }
      dispatch({
        type: types.MY_ACCOUNT.MESSAGHE_LIST,
        data: renderData,
      });
    }
  });
};

// 获取美力咨询列表
export const myBeautyList = (nowIndex) => (dispatch, getState) => {
  let messageList = "";
  if (nowIndex > 1) messageList = getState().myAccount.messageList;
  const mymsgListData = JSON.parse(JSON.stringify(messageList));
  dispatch(
    action.myBeautyList({
      onlyKey: "myBeautyList",
      url: `/v1/omni/membermsg/beauty/list/${nowIndex}`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    let renderData;
    if (json && json.results && !json.results.code) {
      if (mymsgListData) {
        renderData = json && json.results;
        renderData.list = mymsgListData.list.concat(json.results.list);
      } else {
        renderData = json && json.results;
      }
      dispatch({
        type: types.MY_ACCOUNT.MESSAGHE_LIST,
        data: renderData,
      });
    }
  });
};
/** ********************我的消息页面数据初始化**********************/
/** ********************获取用户线下订单页面**********************/
export const initOfflineOrderList = (pageNowIndex) => (dispatch, getState) => {
  const offlineOrderList = getState().myAccount.offlineOrderList;
  if (
    offlineOrderList &&
    offlineOrderList.pageNum * offlineOrderList.pageSize >=
      offlineOrderList.total
  )
    return;
  dispatch(
    action.initIntegralFlow({
      onlyKey: "initOfflineOrderList",
      url: `/v1/omni/order/offlineOrder/list/${pageNowIndex}?orderTime=`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    const { list, pageNum, pageSize, total } = json.results;
    const listData = offlineOrderList
      ? offlineOrderList.list.concat(list)
      : list;
    dispatch({
      type: types.MY_ACCOUNT.OFFLINE_ORDER_LIST,
      data: {
        list: listData,
        pageNum,
        pageSize,
        total,
        isMore: !(pageNum * pageSize >= total),
        isShowGuess: true,
      },
    });
  });
};
/** ********************获取用户线下订单页面**********************/

// myAccount中心页面是否展示我的消息小红点
export const membermsgCount = () => (dispatch, getState) => {
  dispatch(
    action.unreadMyMsg({
      onlyKey: "unreadMyMsg",
      url: `/v1/omni/membermsg/mymsg/unread/count`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    dispatch(
      action.unreadBeauty({
        onlyKey: "unreadBeauty",
        url: `/v1/omni/membermsg/beauty/unread/count`,
        type: "GET",
        isConfirm: true,
      })
    ).then((data) => {
      if (
        window &&
        window.location &&
        window.location.pathname == "/myAccount"
      ) {
        const profile = Object.assign({}, getState().myAccount.UIProfile);
        const newProflie = JSON.parse(JSON.stringify(profile));
        newProflie.myNewsCount = !!(
          (json && json.results > 0) ||
          (data && data.results > 0)
        );
        if (json && json.results > 0 && (!data || data.results <= 0)) {
          newProflie.myNewsLink = "/myAccount/myMessage?type=1";
        } else {
          newProflie.myNewsLink = "/myAccount/myMessage?type=0";
        }
        dispatch({
          type: types.MY_ACCOUNT.MY_ACCOUNT_PROFILE,
          data: newProflie,
        });
        if (!json.results && !data.results)
          judgeMsgLink && judgeMsgLink()(dispatch, getState);
        return;
      }
      // 消息中心页面 tab展示小红点的相关逻辑
      const renderData = JSON.parse(JSON.stringify(myMsgUITMP));
      renderData[1].isRead = !!(json && json.results > 0);
      renderData[0].isRead = !!(data && data.results > 0);
      if (url.urlGetParams(window.location, "type") == 1) {
        renderData[1].active_class = "active";
        if (json.results > 0) {
          mymsgRead && mymsgRead(1)(dispatch, getState);
        } else {
          mymsgList && mymsgList(1)(dispatch, getState);
        }
      } else {
        renderData[0].active_class = "active";
        if (data.results > 0) {
          mybeautyRead && mybeautyRead(1)(dispatch, getState);
        } else {
          myBeautyList && myBeautyList(1)(dispatch, getState);
        }
      }
      dispatch({
        type: types.MY_ACCOUNT.MYMSG_TAP,
        data: renderData,
      });
    });
  });
};
// 判断都无消息的情况下，美力资讯 我的消息那个有数据
export const judgeMsgLink = () => (dispatch, getState) => {
  dispatch(
    action.myBeautyList({
      onlyKey: "myBeautyList",
      url: `/v1/omni/membermsg/beauty/list/1`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    const isBeauty = !!(
      json &&
      json.results &&
      json.results.list &&
      json.results.list.length > 0
    );
    dispatch(
      action.mymsgList({
        onlyKey: "mymsgList",
        url: `/v1/omni/membermsg/mymsg/list/1`,
        type: "GET",
        isConfirm: true,
      })
    ).then((data) => {
      const isMSg = !!(
        data &&
        data.results &&
        data.results.list &&
        data.results.list.length > 0
      );
      if (!isBeauty && isMSg) {
        const profile = Object.assign({}, getState().myAccount.UIProfile);
        const newProflie = JSON.parse(JSON.stringify(profile));
        newProflie.myNewsLink = "/myAccount/myMessage?type=1";
        dispatch({
          type: types.MY_ACCOUNT.MY_ACCOUNT_PROFILE,
          data: newProflie,
        });
      }
    });
  });
};
export const pendingOrder = () => (dispatch) => {
  let uid = GetSingleCookie(document.cookie, "UID") || null;
  action.pendingOrder(uid, (json) => {
    let _json;
    if (json.errorMessage) {
      _json = [];
    } else {
      _json = JSON.parse(JSON.stringify(json.results));
      json.results &&
        _json &&
        _json.forEach((items) => {
          switch (items.orderStatus) {
            case "DIP":
              items["statusName"] = "待发货";
              break;
            case "DPP":
              items["statusName"] = "待支付";
              break;
            case "DID":
              items["statusName"] = "已发货";
              break;
            default:
              break;
          }
        });
    }
    dispatch({
      type: types.MY_ACCOUNT.MY_ACCOUNT_ORDERSWIPER,
      data: _json,
    });
  });
};

/** ********************发票详情页面数据初始化**********************/
export const initInvoiceListData = () => (dispatch) => {
  let orderId = url.urlGetParams(window.location, "orderId");
  dispatch(
    action.getInvoiceList({
      onlyKey: "getInvoiceList",
      url: `/v1/order/invoice/list/${orderId}`,
      type: "GET",
      isConfirm: true,
    })
  ).then((json) => {
    if (json && json.results && json.results.length) {
      dispatch({
        type: types.MY_ACCOUNT.MY_ACCOUNT_INVOICELISTDATA,
        data: json.results,
      });
    }
  });
};

// 发送邮件
export const sendInvoiceEmail =
  ({ email, invoiceId }, cb) =>
  (dispatch) => {
    dispatch(
      action.sendInvoiceEmail({
        onlyKey: "sendInvoiceEmail",
        url: `/v1/order/invoice/email/${invoiceId}?email=${email}`,
        type: "POST",
        isConfirm: true,
      })
    ).then((json) => {
      cb && cb(json);
    });
  };

export const getInitialCoupon = (valid,tab=1) => (dispatch) => {
  let param = {
    pageNo: 1,
    pageSize: 15,
    valid,
  };
  let temp = [
    {
      key: "usableCouponList",
      valid: 1,
      activeStatus: 1,
      name: "未使用",
      totalCount: 0,
      currentPage: 1,
      couponLists: [],
    },
    {
      key: "unusableCouponList",
      valid: 0,
      activeStatus: 1,
      name: "已使用",
      totalCount: 0,
      currentPage: 1,
      couponLists: [],
    },
    {
      key: "expiredCouponList",
      valid: 2,
      activeStatus: 1,
      name: "已过期",
      totalCount: 0,
      currentPage: 1,
      couponLists: [],
    },
  ];
  if (tab==1) {
    action.getMyCoupon(param, (json) => {
      if (json && json.results && json.status == 0) {
        let results = json.results;
        let initialData = temp.map((items) => {
          let data = results[items.key];
          items.totalCount = data.totalCount;
          items.currentPage = data.pageNo;
          items.couponLists = data.couponList;
          return items;
        });
        dispatch({
          type: types.MY_ACCOUNT_COUPON.MY_ACCOUNT_COUPON,
          data: initialData,
        });
      }
    });
  }else if(tab==2){
    action.getDoorList(param, (json) => {
      if (json && json.results && json.status == 0) {
        let results = json.results;
        let initialData = temp.map((items) => {
          let data = results[items.key];
          items.totalCount = data.totalCount;
          items.currentPage = data.pageNo;
          items.couponLists = data.couponList;
          return items;
        });
        dispatch({
          type: types.MY_ACCOUNT_COUPON.MY_DOOR_COUPON,
          data: initialData,
        });
      }
    });
  }

};

/* 获取优惠券信息 */
export const getMyCoupon = (params) => (dispatch, getState) => {
  action.getMyCoupon(params, (json) => {
    if (json && json.results && json.status == 0) {
      let results = json.results,
        depositCouponResults = getState().MyAccountCouponConts;
      let type = types.MY_ACCOUNT_COUPON.MY_ACCOUNT_COUPON;
      dispatch({
        type: type,
        data: [
          ...depositCouponResults.map((data) => {
            let tmp = Object.assign({}, data);
            tmp.totalCount = results[data.key].totalCount;
            if (params.valid === tmp.valid && params.pageNo !== 1) {
              tmp.couponLists = tmp.couponLists.concat(
                results[data.key].couponList
              );
            } else {
              tmp.couponLists = results[data.key].couponList;
            }
            tmp.currentPage = results[data.key].pageNo;
            return tmp;
          }),
        ],
      });
    }
  });
};
// 获取线下门店优惠券
export const getDoorList = (params) => (dispatch, getState) => {
  action.getDoorList(params, (json) => {
    if (json && json.results && json.status == 0) {
      let results = json.results,
        depositCouponResults = getState().doorCouponConts;
      let type = types.MY_ACCOUNT_COUPON.MY_DOOR_COUPON;
      dispatch({
        type: type,
        data: [
          ...depositCouponResults.map((data) => {
            let tmp = Object.assign({}, data);
            tmp.totalCount = results[data.key].totalCount;
            if (params.valid === tmp.valid && params.pageNo !== 1) {
              tmp.couponLists = tmp.couponLists.concat(
                results[data.key].couponList
              );
            } else {
              tmp.couponLists = results[data.key].couponList;
            }
            tmp.currentPage = results[data.key].pageNo;
            return tmp;
          }),
        ],
      });
    }
  });
};