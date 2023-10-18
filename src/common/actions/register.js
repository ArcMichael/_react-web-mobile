/*
 * @Author: Leo.Si
 * @Date: 2019-12-11 13:47:04
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-08-20 11:45:50
 * @function register action
 */
import * as action from "../lib/BLL";
import * as types from "../constants/ActionTypes";
import * as url from "../lib/url";
import Sensor from "../Utils/sensor/index";
import GoogleAnalytics from "../Utils/GoogleAnalytics";
import { popupAlert } from "./popup";
import { isWeChatForLand, storeutmInfoDto, GetSingleCookie } from "../lib/Tools";
import { passwordRegExp } from "../Utils/RegExp";
import { sendPhoneCode } from "./registerForKugou";
import { getShuMeiDeviceId } from "../lib/index";

const REGISTERERRORMESSAGE = require("../components/LoginStatePages/Register/RegisterError.json");

export const register = (options, callback = function () {}) => (dispatch, getState) => {
  let { telephone, password, rtoken, smsCode, privacyClauseVersion } = options;
  const errorMessage =
    passwordRegExp({
      password: options.password,
      newPassWord: options.checkPassword,
    }) || null;
  if (errorMessage) {
    dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: errorMessage || "系统错误",
        _autoClose: true,
      }),
    );
    return callback && callback(true);
  }
  let params = {
    telephone: telephone,
    password: password,
    rtoken: rtoken,
    smsCode: smsCode,
    privacyClauseVersion: privacyClauseVersion,
    openId: isWeChatForLand() ? url.urlGetParams(window.location, "openid") : "",
    NDFingerPrint: getShuMeiDeviceId(),
  };
  if (storeutmInfoDto()) params.utmInfoDto = storeutmInfoDto();
  if (window && url.urlGetParams(window.location, "upstairs")) {
    params.extraMap = {
      MGM: JSON.stringify({
        referrerCardNo: url.urlGetParams(window.location, "upstairs"),
        channel: "MOBILE",
      }),
    };
  }
  if (window && url.urlGetParams(window.location, "sc")) {
    params.extraMap = Object.assign({}, params.extraMap, {
      subChannel: url.urlGetParams(window.location, "sc"),
    });
  }
  action.register(params, (json) => {
    if (json && json.results && !json.errorCode) {
      GoogleAnalytics.push({
        event: "registerSuccess",
        user: {
          id: json.results.userId,
          login_status: "login user",
          loyalty_tier: "",
          card_number: "",
        },
      });
      Sensor.go("signUpResult", {
        sign_up_method: "手机",
        if_success: true,
        failure_reason: false,
        is_member_from_store: false,
        userID: json.results.userId,
        $lib_detail: "M_Register##register##register.js##57",
      });
      Sensor.go("loginResult", {
        login_channel: "手机",
        if_success: true,
        failure_reason: json.errorCode,
        userID: json.results.userId,
        $lib_detail: "M_Register##register##register.js##64",
      });
      Sensor.push("login", json.results.userId);
      GoogleAnalytics.pushV2({ event: "accountCreation" });
      dispatch({
        type: types.REGISTER.USER_INFO,
        data: json && json.results,
      });
      saveTheFirstAndTime && saveTheFirstAndTime()(dispatch, getState);
      registerSuccessLink();
      // 注册流程变更，不需要进入选卡页
      // getRegiserCardList && getRegiserCardList(json.results.loginId)(dispatch, getState)
    } else {
      Sensor.go("signUpResult", {
        sign_up_method: "手机",
        if_success: false,
        failure_reason: json.errorCode,
        is_member_from_store: false,
        $lib_detail: "M_Register##register##register.js##74",
      });
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: json.errorMessage,
          _autoClose: true,
          _zIndex: 201,
        }),
      );
      return callback && callback(true);
    }
  });
};

//保存用户第一次来访时间及渠道saveTheFirstAndTime
export const saveTheFirstAndTime = () => (dispatch) => {
  if (
    GetSingleCookie(document.cookie, "first_touch_source") &&
    GetSingleCookie(document.cookie, "Token")
  ) {
    let tmpUtmSource = {};
    tmpUtmSource = JSON.parse(GetSingleCookie(window.document.cookie, "first_touch_source"));
    dispatch(
      action.saveTheFirstAndTime({
        onlyKey: "initIntegralFlow",
        url: `/v1/myaccount/user/saveUserAccessChannel?createTime=${tmpUtmSource.currentTim}&channel=${tmpUtmSource.utm_source}`,
        type: "POST",
      }),
    ).then(() => {});
  }
};

//注册成功之后，获取用户可以绑定的会员卡
export const getRegiserCardList = (params) => (dispatch) => {
  dispatch(
    action.getRegiserCardList({
      onlyKey: "getRegiserCardList",
      url: `/v1/myaccount/card/optionalCardInfo?loginId=${params}`,
      type: "GET",
    }),
  ).then((json) => {
    dispatch({
      type: types.REGISTER.PAGE_STATUS,
      data: "chooseCard",
    });
    dispatch({
      type: types.REGISTER.CARD_LIST,
      data: json && json.results,
    });
  });
};

/*获取手机验证码以及验证图形验证码*/
export const validateValidationValue = (validationValue, validationValueToken, mobile, stop) => (
  dispatch,
) => {
  let params = {
    validationValue: validationValue,
    validationValueToken: validationValueToken,
  };
  action.validateValidationValue(params, (json) => {
    let valiCodeStatus = json.results.valiCodeStatus;
    let isMBcorrect = /^1\d{10}$/.test(mobile);
    if (valiCodeStatus == "success") {
      if (mobile && isMBcorrect) {
        dispatch(
          sendPhoneCode({
            mobile: mobile,
            module: "1001",
          }),
        );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: REGISTERERRORMESSAGE["error-reporting-8"],
            _autoClose: true,
            _zIndex: 201,
          }),
        );
        stop && stop();
      }
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: REGISTERERRORMESSAGE[valiCodeStatus],
          _autoClose: true,
          _zIndex: 201,
        }),
      );
      stop && stop();
    }
  });
};

export const validateValidationValueRegister = (
  validationValue,
  validationValueToken,
  mobile,
  stop,
  start,
  callback,
  scene,
) => (dispatch) => {
  let isSuccess = false;
  let params = {
    code: validationValue,
    codeToken: validationValueToken,
    identification: mobile,
  };
  action.validateValidationValueV2(params, (json) => {
    let valiCodeStatus = json.results && json.results.rtoken;
    let isMBcorrect = /^1\d{10}$/.test(mobile);
    if (valiCodeStatus) {
      if (mobile && isMBcorrect) {
        action.sendPhoneCodeV2(
          {
            scene: scene || "REGIST",
            rToken: valiCodeStatus,
          },
          (json) => {
            // if (json && json.results && json.results.code) {
            //     dispatch(popupAlert(1, 'PopupErrorWarnning', { _text: REGISTERERRORMESSAGE[json.results.code], _autoClose: true, _zIndex: 201 }))
            // } else {
            //     start && start()
            // }
            if (json && !json.results && json.errorMessage) {
              dispatch(
                popupAlert(1, "PopupAlertDefault", {
                  _text: json.errorMessage,
                  _autoClose: true,
                  _zIndex: 201,
                }),
              );
            } else {
              start && start();
            }
          },
        );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: REGISTERERRORMESSAGE["error-reporting-8"],
            _autoClose: true,
            _zIndex: 201,
          }),
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
        }),
      );
      stop && stop();
    }
    callback && callback(isSuccess, valiCodeStatus);
  });
};
/*获取手机验证码以及验证图形验证码*/
export const validateValidationValueLogin = (
  validationValue,
  validationValueToken,
  mobile,
  stop,
  start,
  callback,
  scene,
) => (dispatch) => {
  let isSuccess = false;
  let params = {
    code: validationValue,
    codeToken: validationValueToken,
    identification: mobile,
  };
  action.validateValidationValueV2(params, (json) => {
    let valiCodeStatus = json.results && json.results.rtoken;
    let isMBcorrect = /^1\d{10}$/.test(mobile);
    if (valiCodeStatus) {
      if (mobile && isMBcorrect) {
        action.sendPhoneCodeV2(
          {
            scene: scene || "SMS",
            rToken: valiCodeStatus,
          },
          (json) => {
            if (json && !json.results && json.errorMessage) {
              dispatch(
                popupAlert(1, "PopupAlertDefault", {
                  _text: json.errorMessage,
                  _autoClose: true,
                  _zIndex: 201,
                }),
              );
            } else {
              start && start();
            }
            // if (json && json.results && json.results.code) {
            //     dispatch(popupAlert(1, 'PopupErrorWarnning', { _text: REGISTERERRORMESSAGE[json.results.code], _autoClose: true, _zIndex: 201 }))
            // } else {
            //     start && start()
            // }
          },
        );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: REGISTERERRORMESSAGE["error-reporting-8"],
            _autoClose: true,
            _zIndex: 201,
          }),
        );
        stop && stop();
      }
    } else {
      isSuccess = true;
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: json.errorMessage,
          _autoClose: true,
          _zIndex: 201,
        }),
      );
      // dispatch(popupAlert(1, 'PopupErrorWarnning', { _text: REGISTERERRORMESSAGE[valiCodeStatus], _autoClose: true, _zIndex: 201 }));
      stop && stop();
    }
    callback && callback(isSuccess, valiCodeStatus);
  });
};

// 切换操作时的页面展示
function switchPage(parasms, dispatch) {
  dispatch({
    type: types.REGISTER.PAGE_STATUS,
    data: parasms,
  });
}

// 注册成功后执行跳转逻辑
function registerSuccessLink() {
  let backUrl = decodeURIComponent(window.location.search.replace("?historyLocation=", "")).replace(
    "&",
    "?",
  );
  if (isWeChatForLand()) {
    window.location.href = "/myAccount";
  } else if (backUrl && window.location.search.indexOf("historyLocation") > -1) {
    window.location.href = decodeURIComponent(backUrl);
  } else {
    window.location.href = "/";
  }
}

// 用户通过输入卡号和卡片标识进行绑卡
function cardBindOperation(params, dispatch) {
  let ajaxData = {
    queryBody: {
      cardNo: params && params.cardNum,
      mobile: params && params.loginId,
    },
  };
  if (params && params.email) {
    ajaxData = {
      queryBody: {
        cardNo: params && params.cardNum,
        email: params && params.email,
      },
    };
  }
  dispatch(
    action.cardBindOperation({
      onlyKey: "cardBindOperation",
      url: `/v1/myaccount/card/cardBindOperation`,
      type: "POST",
      data: ajaxData,
    }),
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      GoogleAnalytics.push({
        event: "boundleSuccess",
        user: {
          id: json.results.userId,
          login_status: "login user",
          loyalty_tier: params.type,
          card_number: params.cardNum,
        },
      });
      //神策注册绑定会员卡
      Sensor.go("record_vip_card", {
        vip_card: params.cardNum,
        vip_card_type: params.type,
        if_choose_existing_vip_card: false,
        $lib_detail: "M_ChooseCard##cardBindOperation##register.js##224",
      });
      registerSuccessLink();
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: REGISTERERRORMESSAGE[json.results && json.results.code] || "系统错误",
          _autoClose: true,
          _zIndex: 201,
        }),
      );
    }
  });
}
const setRegisterFuncMap = {
  switchPage,
  registerSuccessLink,
  cardBindOperation,
};

export const mapFunRegisterToRun = (callbackKEY, parasms, callback) => (dispatch, getState) => {
  let func = setRegisterFuncMap[callbackKEY];
  func && func(parasms, dispatch, getState, callback);
};
