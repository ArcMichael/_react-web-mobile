import {
  sendPhoneCode as $sendPhoneCode,
  sendPhoneCodeV2 as $sendPhoneCodeV2,
  postVildation as $postVildation,
  newPassWordV2 as $newPassWordV2,
  // postLogin as $postLogin,
  postNewLogin as $postNewLogin,
  judgePhoneCode as $judgePhoneCode,
  judgePhoneCodeV2 as $judgePhoneCodeV2,
  setLoginPassword as $setLoginPassword,
  loginStoreMember as $loginStoreMember,
  getLoginPersonalInfo as $getLoginPersonalInfo,
  setLoginBindCard as $setLoginBindCard,
  setLoginPersonalInfo as $setLoginPersonalInfo,
  judgeEmail as $judgeEmail,
  sendMailV2 as $sendMailV2,
  judgeUserExist as $judgeUserExist,
  validateValidationValueV2 as $validateValidationValueV2,
  sendMail as $sendMail,
  smsLoginTwo,
  multiLogin,
  newPassWordV3 as $newPassWordV3,
} from "../lib/BLL";
import { getShuMeiDeviceId } from "../lib/index";

import * as utilCookieUtil from "../Utils/cookieUtil";
import { popupAlert } from "./popup";
import * as constType from "../constants/ActionTypes";
import { getCookie } from "../Utils/utils/cookie";
import { passwordRegExp } from "../Utils/RegExp";
import Sensor from "../Utils/sensor";
import GoogleAnalytics from "../Utils/GoogleAnalytics";
import * as url from "../lib/url";
import { saveTheFirstAndTime } from "./register";
// import { isWeChatForLand } from "../lib/Tools";

const errorData = require("../components/ForgottenPassword/json/errorCode.json");
const errorDatav2 = require("../components/ResetPassword/json/errorCode.json");
const errorDatav3 = require("../components/LoginStatePages/Login/ERRORLOGIN.json");

/* 发送手机短信验证码*/
export const sendPhoneCode = (params, callback) => () => {
  const dataParams = {
    queryBody: params,
  };
  $sendPhoneCode(dataParams, (json) => {
    callback(json);
  });
};
export const sendPhoneCodeV2 = (params, callback) => () => {
  $sendPhoneCodeV2(params, (json) => {
    callback(json);
  });
};
export const postVildationV2 = (params, callback) => {
  return (dispatch) => {
    // const dataParams = {
    //   queryBody: params,
    // }
    if (!params) {
      return dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: "请输入手机号或邮箱",
          _autoClose: true,
        }),
      );
    }
    $postVildation(params, (json) => {
      if (json && json.results && json.status == 0) {
        if (json.results.code) {
          // dispatch(popupAlert(1, 'PopupErrorWarnning', { _text: '验证码错误', _autoClose: true }));
        } else {
          callback({
            captcha: json.results.captcha,
            codeToken: json.results.codeToken,
          });
        }
      } else if (json.status == 0 && json.errorCode && json.errorMessage) {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.errorMessage,
            _autoClose: true,
          }),
        );
      }
    });
  };
};

/* 验证图形验证码*/
export const validateValidationValue = (params, callback) => {
  return () => {
    $validateValidationValueV2(params, (json) => {
      callback(json);
    });
  };
};

/** 验证手机或者邮箱
 * @param {string} params 登录id
 * @return {fun}
 */
export const judgeUserExist = (params) => (dispatch) => {
  dispatch($judgeUserExist(params)).then((json) => {
    const { results } = json;
    results &&
      !results.isExist &&
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: json.errorMessage || "账户名不存在",
          _autoClose: true,
        }),
      );
    if (results && results.isExist === true) {
      const type = /^1\d{10}$/.test(params.identification) ? "phone" : "email";
      dispatch({
        type: constType.FORGOTTENPASSWORD.SECONDSHOW,
        SECONDSHOW: type,
        loginId: params.identification,
      });
    }
  });
};
/**
 * 发送邮件验证码
 * @param {string} params  邮箱地址
 * @param {fun} callback
 * @return {fun}
 */
export const sendMail = (params, callback) => {
  return (dispatch) => {
    $sendMail(params, (json) => {
      const { results, status } = json;
      const { code, resultStatus } = results;
      (resultStatus !== "0001" || !resultStatus) &&
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: errorData[code] || errorData[resultStatus] || errorData[status],
            _autoClose: true,
          }),
        );
      callback && callback(json);
    });
  };
};
export const sendMailV2 = (rToken, callback) => {
  return (dispatch) => {
    $sendMailV2(
      {
        rToken,
        scene: "FORGET",
      },
      (json) => {
        const { results } = json;
        const { resultStatus } = results;
        (resultStatus !== "0001" || !resultStatus) &&
          dispatch(
            popupAlert(1, "PopupAlertDefault", {
              _text: errorDatav3[json.errorCode],
              _autoClose: true,
            }),
          );
        callback && callback(json);
      },
    );
  };
};
/**
 * 验证邮件验证码
 * @param {object} params  参数
 * @param {fun} callback
 * @return {fun}
 */
export const judgeEmail = (params, callback) => (dispatch) => {
  dispatch($judgeEmail(params)).then((json) => {
    const { results } = json;
    const { resultStatus } = results;
    (resultStatus !== "0001" || !resultStatus) && (window.location.href = "/");
    resultStatus === "0001" && callback && callback(json);
  });
};

/**
 * 重置密码
 * @param {object} params  参数
 * @param {fun} callback
 * @return {fun}
 */
export const resetPassword = (params, callback) => (dispatch) => {
  const errorMessage =
    passwordRegExp({
      password: params.newPassCode,
      newPassWord: params.checkPassword,
    }) || null;
  const callbackFun = callback;
  if (errorMessage) {
    dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: errorMessage || "系统错误",
        _autoClose: true,
      }),
    );
    callback(false);
  } else {
    $newPassWordV3(params, (json) => {
      const { results, status, errorCode, errorMessage } = json;
      if (params.type == "mobile") {
        if (errorCode) {
          callbackFun && callbackFun(false);
          if (errorCode == 10304) {
            // 注销
            dispatch(
              popupAlert(1, "PopupCleaning", {
                _text: "您的账号正在注销中，如需取消请前往 APP 端。",
              }),
            );
          } else if (errorCode == 10311) {
            // 多端登录
            dispatch(
              popupAlert(1, "PopupCleaning", {
                _text:
                  "系统检测到当前账号在其他设备保持登陆状态，请问是否授权多端登陆？如同意则多端将保持登陆，如拒绝则其他设备上账号会自动登出。",
                _customFalseText: "拒绝",
                _btnWord: "允许",
                _customTrueCallback: () => {
                  multiLogin(
                    {
                      multiLoginToken: errorMessage,
                      permit: true,
                    },
                    () => {
                      window.location.href = "/";
                    },
                  );
                },
                _customFalseCallback: () => {
                  multiLogin(
                    {
                      multiLoginToken: errorMessage,
                      permit: false,
                    },
                    () => {
                      window.location.href = "/";
                    },
                  );
                },
              }),
            );
          } else if (errorCode && (errorCode !== "0001" || !errorMessage)) {
            dispatch(
              popupAlert(1, "PopupAlertDefault", {
                _text:
                  errorDatav2[errorCode] ||
                  errorDatav2[errorMessage] ||
                  errorDatav2[status] ||
                  (typeof errorDatav2[errorCode] == "undefined" && errorMessage),
                _autoClose: true,
              }),
            );
          }
        } else {
          const { respCommonLoginDto } = results;
          if (respCommonLoginDto) {
            //手机重置密码成功
            const { userId, sephoraToken, bindId } = respCommonLoginDto;
            Sensor.go("loginResult", {
              login_channel: "",
              if_success: true,
              failure_reason: false,
              userID: userId,
              $lib_detail: "M_newResetPassword##resetPassword##login.js##259",
            });
            Sensor.push("login", userId);
            if (bindId) {
              utilCookieUtil.SetSingleCookie2({
                key: "bindId",
                value: bindId,
                domain: ".sephora.cn",
                path: "/",
              });
            }
            dispatch(
              popupAlert(1, "PopupToast", {
                _text: "密码重设成功",
                _autoClose: true,
              }),
            );

            utilCookieUtil.SetSingleCookie2({
              key: "Token",
              value: sephoraToken,
              domain: ".sephora.cn",
              path: "/",
            });
            utilCookieUtil.SetSingleCookie2({
              key: "UID",
              value: userId,
              domain: ".sephora.cn",
              path: "/",
            });
            callbackFun && callbackFun(true);
          } else {
            //手机重置密码失败, 后台没有返回errorCode,只返回了false
            const { result } = results;
            if (!result) {
              dispatch(
                popupAlert(1, "PopupToast", {
                  _text: "密码重设失败",
                  _autoClose: true,
                }),
              );
            }
          }
        }
      } else {
        //邮箱重置
        if (results.result == -1) {
          dispatch(
            popupAlert(1, "PopupToast", {
              _text: "用户不存在",
              _autoClose: true,
            }),
          );
          callbackFun && callbackFun(false);
        } else {
          callbackFun && callbackFun(true);
        }
      }
    });
  }
};
/**
 * 验证手机验证码
 * @param {object} params  参数
 * @param {fun} callback
 * @return {fun}
 */
export const judgePhoneCode =
  ({ msgValidation, mobile }, callback) =>
  () => {
    $judgePhoneCode(
      {
        valiCode: msgValidation,
        module: "1002",
        mobile,
      },
      (json) => {
        const { results } = json;
        const { resultStatus } = results;
        (resultStatus !== "0001" || !resultStatus) && (window.location.href = "/");
        resultStatus === "0001" && callback && callback(json);
      },
    );
  };
export const judgePhoneCodeV2 = (params, callback) => () => {
  const { smsCode, telephone, rToken } = params;
  $judgePhoneCodeV2(
    {
      smsCode,
      telephone,
      rToken,
      scene: "FORGET",
    },
    (json) => {
      const { results } =
        json(!results.result || results.result !== "success") && (window.location.href = "/");
      results.result === "success" && callback && callback(json);
    },
  );
};

/**
 * 用来控制阅读协议弹层
 */

export const showChecked = () => (dispatch) => {
  dispatch(
    popupAlert(1, "PopupAlertDefault", {
      _text: "请先阅读并同意协议",
      _autoClose: true,
      _totalCount: 3000,
      _ox: false,
      _className: "login-less-top",
    }),
  );
};
/**
 * 登陆接口
 * @param {object} params  参数
 * @param {fun} callback
 * @return {fun}
 */
const LOGINERRORMESSAGE = require("../components/LoginStatePages/Login/ERRORLOGIN.json");
export const Login = (params, callback) => (dispatch) => {
  // 2020  sprint3针对mgm活动添加入参
  const newParams = params;
  if (window && url.urlGetParams(window.location, "upstairs")) {
    newParams.extraMap = {
      MGM: JSON.stringify({
        referrerCardNo: url.urlGetParams(window.location, "upstairs"),
        channel: "MOBILE",
      }),
    };
  }
  $postNewLogin(newParams, (json) => {
    // console.log('json----',json);
    if (json && json.results && json.status == 0) {
      // 神策登陆结果
      const jsondata = json.results;
      let ifHasError = false;
      // 本地登录的流程
      if (window.location.port === "60018" && jsondata.results?.sephoraToken) {
        utilCookieUtil.SetSingleCookie2({
          key: "Token",
          value: jsondata.results.sephoraToken,
          domain: "localhost",
          path: "/",
        });
        utilCookieUtil.SetSingleCookie2({
          key: "UID",
          value: jsondata.results.userId,
          domain: "localhost",
          path: "/",
        });
      }
      if (jsondata.errorCode) {
        Sensor.go("loginResult", {
          login_channel: "手机邮箱",
          if_success: false,
          failure_reason: jsondata.errorCode,
          $lib_detail: "M_Login##postLoginV2##Login.js##59",
        });
        if (jsondata.errorCode == "20204" || jsondata.errorCode == "20201") {
          dispatch({
            type: constType.LOGIN.LOGIN_SHOW_GRAPHIC,
            data: jsondata.errorCode,
          });
        } else if (jsondata.errorCode == "20212") {
          dispatch({
            type: constType.LOGIN.LOGIN_SHOW_GRAPHIC,
            data: jsondata.errorCode,
          });
        } else if (jsondata.errorCode == "40097199") {
          dispatch({
            type: constType.LOGIN.LOGIN_SHOW_GRAPHIC,
            data: jsondata.errorCode,
          });
        } else if (jsondata.errorCode == "20202" || jsondata.errorCode == "20203") {
          return (window.location.href = `/updatePassword?code=${jsondata.errorCode}&loginId=${params.loginId}`);
        } else if (jsondata.errorCode == "40097299" || jsondata.errorCode == "40097399") {
          return (window.location.href = `/updatePassword?code=${jsondata.errorCode}&loginId=${params.loginId}`);
        } else if (jsondata.errorCode == "40097499") {
          callback(true);
          dispatch(
            popupAlert(1, "PopupAlertDefault", {
              _text: jsondata && jsondata.errorMessage,
              _autoClose: true,
              _totalCount: 3000,
              _ox: false,
              _className: "login-less-top",
            }),
          );
          return;
        } else if (jsondata.errorCode == "20205") {
          callback(true);
          dispatch(
            popupAlert(1, "PopupAlertDefault", {
              _text: jsondata && jsondata.errorMessage,
              _autoClose: true,
            }),
          );
          return;
        } else if (jsondata.errorCode == "40093399") {
          callback(true);
          dispatch(
            popupAlert(1, "PopupAlertDefault", {
              _text: jsondata && jsondata.errorMessage,
              _autoClose: true,
            }),
          );
          return;
        } else if (jsondata.errorCode == "10304") {
          callback(true);
          dispatch(
            popupAlert(1, "PopupCleaning", {
              _text: "您的账号正在注销中，如需取消请前往 APP 端。",
            }),
          );
          return;
        } else if (jsondata.errorCode == "10311") {
          callback(true);
          dispatch(
            popupAlert(1, "PopupCleaning", {
              _text:
                "系统检测到当前账号在其他设备保持登陆状态，请问是否授权多端登陆？如同意则多端将保持登陆，如拒绝则其他设备上账号会自动登出。",
              _customFalseText: "拒绝",
              _btnWord: "允许",
              _customTrueCallback: () => {
                multiLogin(
                  {
                    multiLoginToken: jsondata.errorMessage,
                    permit: true,
                  },
                  () => {
                    window.location.href = "/";
                  },
                );
              },
              _customFalseCallback: () => {
                multiLogin(
                  {
                    multiLoginToken: jsondata.errorMessage,
                    permit: false,
                  },
                  () => {
                    window.location.href = "/";
                  },
                );
              },
            }),
          );
          return;
        }

        jsondata.errorCode != "20212" &&
          dispatch(
            popupAlert(1, "PopupAlertDefault", {
              _text: LOGINERRORMESSAGE[jsondata.errorCode],
              _autoClose: true,
            }),
          );

        ifHasError = true;
      } else {
        Sensor.go("loginResult", {
          login_channel: "手机邮箱",
          if_success: true,
          failure_reason: false,
          userID: jsondata.results.userId,
          $lib_detail: "M_Login##postLoginV2##Login.js##72",
        });
        Sensor.push("login", jsondata.results.userId);
        // 登陆成功将Token和Uid存入到cookie中去，用户登录成功
        // GA布码，登陆成功事件
        // if (window && window.dataLayer) {
        // 	pushEventTagManager('loginSuccess', true)
        // };
        GoogleAnalytics.push({
          event: "loginSuccess",
          user: {
            id: jsondata.results.userId,
            login_status: "login user",
            card_number: "",
            loyalty_tier: "",
          },
        });
        GoogleAnalytics.pushV2({
          event: "accountLogin",
        });

        getCookie().then((cookie) => {
          // 保存用户第一次来访时间及渠道saveTheFirstAndTime
          if (!jsondata.results.bindId) {
            cookie("tpId", "", { expires: -1 });
            cookie("bindId", "", { expires: -1 });
            cookie("email", "", { expires: -1 });
          } else {
            cookie("email", newParams.loginId);
          }
          dispatch(saveTheFirstAndTime());
          dispatch(
            popupAlert(1, "PopupAlertDefault", {
              _text: "登录成功",
              _autoClose: true,
              _totalCount: 3000,
              _ox: true,
              _className: "login-less-top",
            }),
          );
          // if (window && url.urlGetParams(window.location, "historyLocation")) {
          //   window.location.href = isWeChatForLand()
          //     ? "/myAccount"
          //     : decodeURIComponent(window.location.search.replace("?historyLocation=", ""));
          // } else {
          window.location.href = "/";
          // }
        });
      }
      callback(ifHasError);
    }
  });
};

// 当出现验证码时，用户重新输入用户名时，使验证码这一行消失
export const resetLoginGraphic = () => {
  return (dispatch) => {
    dispatch({ type: constType.LOGIN.LOGIN_SHOW_GRAPHIC, data: null });
  };
};

/** *
 * @function 手机验证码登陆查询相关用户信息
 */
export const loginStoreMember = (params, callback) => (dispatch, getState) => {
  $loginStoreMember({ ...params, NDFingerPrint: getShuMeiDeviceId() }, (json) => {
    let ifHasError = false;
    GoogleAnalytics.push({
      event: "offlineRegister",
      eventName: "查询会员卡",
    });
    if (json.results && json.results.results && json.results.results.sephoraToken) {
      // 本地登录的流程
      if (window.location.port === "60018") {
        utilCookieUtil.SetSingleCookie2({
          key: "Token",
          value: json.results.results.sephoraToken,
          domain: "localhost",
          path: "/",
        });
      }
      Sensor.go("loginResult", {
        login_channel: "手机验证码登录",
        if_success: true,
        failure_reason: false,
        userID: json.results.results.userId,
        $lib_detail: "M_LoginStoreMember##loginStoreMember##login.js##276",
      });
      Sensor.push("login", json.results.results.userId);
      GoogleAnalytics.pushV2({
        event: "accountLogin",
      });
      return (window.location.href =
        decodeURIComponent(window.location.search.replace("?historyLocation=", "")) || "/");
    }
    if (json && json.results && json.results.results && !json.results.results.sephoraToken) {
      let userData = json.results.results;
      let hasCardInfo = json.results.results.cardNum && json.results.results.cardLevel;
      if (hasCardInfo) {
        userData.cardInfoDtos = [
          {
            id: json.results.results.cardNum,
            type: json.results.results.cardLevel,
          },
        ];
      }
      dispatch({
        type: constType.LOGIN.STORE_LOGIN_ID,
        data: params.telephone,
      });
      dispatch({ type: constType.LOGIN.STORE_MEMBER_DATA, data: userData });
      dispatch({ type: constType.LOGIN.STORE_PINK_CARD, data: true });
      // if (json.results.isBind == 1) {
      if (hasCardInfo) {
        dispatch({
          type: constType.LOGIN.STORE_CARD_NUM,
          data: json.results.results.cardNum,
        });
        dispatch({ type: constType.LOGIN.STORE_TIP, data: "检查到您有会员卡" });
        switchPage("loginStoreMemberHaveCard", dispatch, getState);
      }
    } else {
      if (json.results.errorCode == "10311") {
        callback(true);
        dispatch(
          popupAlert(1, "PopupCleaning", {
            _text:
              "系统检测到当前账号在其他设备保持登陆状态，请问是否授权多端登陆？如同意则多端将保持登陆，如拒绝则其他设备上账号会自动登出。",
            _customFalseText: "拒绝",
            _btnWord: "允许",
            _customTrueCallback: () => {
              multiLogin(
                {
                  multiLoginToken: json.results.errorMessage,
                  permit: true,
                },
                () => {
                  window.location.href = "/";
                },
              );
            },
            _customFalseCallback: () => {
              multiLogin(
                {
                  multiLoginToken: json.results.errorMessage,
                  permit: false,
                },
                () => {
                  window.location.href = "/";
                },
              );
            },
          }),
        );
        return;
      } else if (json.results.errorCode === 10304) {
        dispatch(
          popupAlert(1, "PopupCleaning", {
            _text: "您的账号正在注销中，如需取消请前往 APP 端。",
          }),
        );
      } else if (json.results.errorCode == "10312") {
        window.initSMCaptcha &&
          window.initSMCaptcha(
            {
              organization: "qfoShxSauZWl8mZDzd9Z",
              domains: ["fengkong.sephora.cn"],
              registerUrl: "/ca/v1/register",
              fVerifyUrlV2: "/ca/v2/fverify",
              confUrl: "ca/v1/conf",
              trackerDomain: "fengkong.sephora.cn",
              trackerPath: "/exception",
              product: "popup",
              mode: "slide",
              maskBindClose: true,
              width: "300px",
            },
            function (instance) {
              instance.onSuccess(function (data) {
                if (data.pass) {
                  // 验证通过
                  var data2 = instance.getValidate();
                  smsLoginTwo(
                    {
                      onlyKey: "smsLoginTow",
                      url: `/v1/usercenter/login/second/high-risk`,
                      type: "POST",
                      data: {
                        secLoginToken: json.results.errorMessage,
                        requestId: data2.rid,
                      },
                    },
                    (json) => {
                      console.log(JSON.stringify(json));
                      console.log(json);
                      const { errorCode, errorMessage } = json;
                      if (json && json.results && json.results.sephoraToken) {
                        utilCookieUtil.SetSingleCookie2({
                          key: "Token",
                          value: json.results.sephoraToken,
                          domain: ".sephora.cn",
                          path: "/",
                        });
                        utilCookieUtil.SetSingleCookie2({
                          key: "UID",
                          value: json.results.userId,
                          domain: ".sephora.cn",
                          path: "/",
                        });
                        return (window.location.href =
                          decodeURIComponent(
                            window.location.search.replace("?historyLocation=", ""),
                          ) || "/");
                      }
                      if (errorCode == "10311") {
                        dispatch(
                          popupAlert(1, "PopupCleaning", {
                            _text:
                              "系统检测到当前账号在其他设备保持登陆状态，请问是否授权多端登陆？如同意则多端将保持登陆，如拒绝则其他设备上账号会自动登出。",
                            _customFalseText: "拒绝",
                            _btnWord: "允许",
                            _customTrueCallback: () => {
                              multiLogin(
                                {
                                  multiLoginToken: errorMessage,
                                  permit: true,
                                },
                                () => {
                                  window.location.href = "/";
                                },
                              );
                            },
                            _customFalseCallback: () => {
                              multiLogin(
                                {
                                  multiLoginToken: errorMessage,
                                  permit: false,
                                },
                                () => {
                                  window.location.href = "/";
                                },
                              );
                            },
                          }),
                        );
                      }
                      if (errorCode == "10304") {
                        dispatch(
                          popupAlert(1, "PopupCleaning", {
                            _text: "您的账号正在注销中，如需取消请前往 APP 端。",
                          }),
                        );
                      }
                      if (json && json.results && !json.results.sephoraToken) {
                        let userData = json.results;
                        let hasCardInfo = json.results.cardNum && json.results.cardLevel;
                        if (hasCardInfo) {
                          userData.cardInfoDtos = [
                            {
                              id: json.results.cardNum,
                              type: json.results.cardLevel,
                            },
                          ];
                        }
                        dispatch({
                          type: constType.LOGIN.STORE_LOGIN_ID,
                          data: params.telephone,
                        });
                        dispatch({ type: constType.LOGIN.STORE_MEMBER_DATA, data: userData });
                        dispatch({ type: constType.LOGIN.STORE_PINK_CARD, data: true });
                        // if (json.results.isBind == 1) {
                        if (hasCardInfo) {
                          dispatch({
                            type: constType.LOGIN.STORE_CARD_NUM,
                            data: json.results.cardNum,
                          });
                          dispatch({ type: constType.LOGIN.STORE_TIP, data: "检查到您有会员卡" });
                          switchPage("loginStoreMemberHaveCard", dispatch, getState);
                        }
                      }
                    },
                  );
                  // data2.rid
                  // successCallBack && successCallBack(data2);
                } else {
                  // 验证失败
                  instance.reset(); // 重置验证码
                }
              });
              instance.onError(function () {
                // 异常
                instance.reset(); // 重置验证码
              });
              instance.onReady(function () {
                instance.verify();
              });
              instance.onClose(function () {
                // 关闭回调
                // closeCallBack && closeCallBack();
              });
            },
          );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.results.errorMessage,
            _autoClose: true,
          }),
        );
      }
      ifHasError = true;
    }
    callback(ifHasError);
  });
};

/**
 *
 * @param {*} parasms
 * @param {*} dispatch
 * @param {*} getState
 * @param {*} index
 */
export const setLoginPassword = (params, callback) => (dispatch, getState) => {
  const errorMessage =
    passwordRegExp({
      password: params.password,
      newPassWord: params.checkPassword,
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
  $setLoginPassword(
    {
      newPassword: params.password,
      cardNo: getState().login.STORE_CARD_NUM,
      loginId: getState().login.STORE_LOGIN_ID,
    },
    (json) => {
      let ifHasError = false;
      if (json && json.results && json.results.token) {
        // 本地登录的流程
        if (window.location.port === "60018") {
          utilCookieUtil.SetSingleCookie2({
            key: "Token",
            value: json.results.token,
            domain: "localhost",
            path: "/",
          });
        }
        GoogleAnalytics.push({
          event: "offlineRegister",
          eventName: "注册成功",
          user: {
            id: json.results.id,
            login_status: "login user",
            loyalty_tier: "",
            card_number: "",
          },
        });
        Sensor.go("signUpResult", {
          sign_up_method: "手机验证码",
          if_success: true,
          failure_reason: false,
          is_member_from_store: false,
          userID: json.results.id,
          $lib_detail: "M_Register##setLoginPassword##setLoginPassword.js##359",
        });
        Sensor.go("loginResult", {
          login_channel: "手机验证码",
          if_success: true,
          failure_reason: "",
          userID: json.results.id,
          $lib_detail: "M_Register##setLoginPassword##setLoginPassword.js##366",
        });
        Sensor.push("login", json.results.id);
        GoogleAnalytics.pushV2({
          event: "accountCreation",
        });
        dispatch(saveTheFirstAndTime());
        bootToLanding("", dispatch, getState);
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.results.message,
            _autoClose: true,
          }),
        );
        ifHasError = true;
      }
      callback(ifHasError);
    },
  );
};

// 切换操作时的页面展示
function switchPage(parasms, dispatch) {
  dispatch({
    type: constType.LOGIN.PAGE_STATUS,
    data: parasms,
  });
}

function setLoginBindCard(parasms, dispatch, getState) {
  dispatch(
    $setLoginBindCard({
      onlyKey: "setLoginBindCard",
      url: `/v2/myaccount/user/bind/card`,
      type: "POST",
      data: {
        queryBody: parasms,
      },
    }),
  ).then((json) => {
    if (json && json.results && json.results.isBind == "1") {
      GoogleAnalytics.push({
        event: "boundleSuccess",
        eventName: "门店会员首次登陆",
        user: {
          id: json.results.userId,
          login_status: "login user",
          loyalty_tier: json.results.cardInfoDtos[0].type,
          card_number: json.results.cardInfoDtos[0].id,
        },
      });
      // 神策门店会员首次登陆绑定会员卡
      Sensor.go("record_vip_card", {
        vip_card: json.results.cardInfoDtos[0].id,
        vip_card_type: json.results.cardInfoDtos[0].type,
        if_choose_existing_vip_card: false,
        $lib_detail: "M_LoginStoreMemberChooseCard##tieCard##LoginStoreMemberChooseCard.js##70",
      });
      dispatch({
        type: constType.LOGIN.STORE_CARD_NUM,
        data: json.results.cardInfoDtos[0].id,
      });
      dispatch({ type: constType.LOGIN.STORE_TIP, data: "您选择了会员卡" });
      switchPage("loginStoreMemberHaveCard", dispatch, getState);
    } else {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: json.results.message,
          _autoClose: true,
        }),
      );
    }
  });
}
// 切换操作时的页面展示
function bootToLanding(parasms, dispatch, getState) {
  const isPink = getState().login.STORE_PINK_CARD;
  if (isPink) {
    dispatch({ type: constType.LOGIN.NO_TITLE, data: true });
    dispatch(getLoginPersonalInfo());
    switchPage("loginStoreMemberImproveInfo", dispatch, getState);
  } else {
    window.location.href =
      decodeURIComponent(window.location.search.replace("?historyLocation=", "")) || "/";
  }
}

// getPersonalInfo 手机验证码登陆 ---- 完善个人信息获取个人信息
export const getLoginPersonalInfo = () => (dispatch) => {
  dispatch(
    $getLoginPersonalInfo({
      onlyKey: "getLoginPersonalInfo",
      url: `/v1/myaccount/user/mobilevalicodelogon/personalinfo`,
      type: "GET",
    }),
  ).then((json) => {
    dispatch({ type: constType.LOGIN.PERSONAL_INFO, data: json.results });
  });
};
export const setLoginPersonalInfo = (params) => (dispatch) => {
  dispatch(
    $setLoginPersonalInfo({
      onlyKey: "setLoginPersonalInfo",
      url: `/v1/myaccount/user/mobilevalicodelogon/personalinfo?birthday=${
        params.birthday
      }&name=${encodeURIComponent(params.name)}&gender=${params.gender}`,
      type: "PUT",
    }),
  ).then((json) => {
    if (json && json.results && json.results.status == "success") {
      window.location.href =
        decodeURIComponent(window.location.search.replace("?historyLocation=", "")) || "/";
    } else {
      popupAlert(1, "PopupAlertDefault", { _text: json.results.message });
    }
  });
};
const setLoginFuncMap = {
  switchPage,
  setLoginBindCard,
  bootToLanding,
};

export const mapFunLoginToRun = (callbackKEY, parasms, callback) => (dispatch, getState) => {
  const func = setLoginFuncMap[callbackKEY];
  func && func(parasms, dispatch, getState, callback);
};

// 忘记密码rtoken保存
export const setForgetPWDRtoken = (rtoken) => (dispatch) => {
  dispatch({
    type: constType.FORGOTTENPASSWORD.RTOKEN,
    data: rtoken,
  });
};

// 忘记密码换页
export const forgetPWDShowPage = (pageType, loginId) => (dispatch) => {
  dispatch({
    type: constType.FORGOTTENPASSWORD.SECONDSHOW,
    SECONDSHOW: pageType,
    loginId,
  });
};
export const resetPasswordV2 = (params, callback) => (dispatch) => {
  // 强更流程
  const errorMessage =
    passwordRegExp({
      password: params.newPassWord,
    }) || null;
  const callbackFun = callback;

  if (errorMessage) {
    dispatch(
      popupAlert(1, "PopupAlertDefault", {
        _text: errorMessage || "系统错误",
        _autoClose: true,
      }),
    );
    callback(false);
  } else {
    $newPassWordV2(params, (json) => {
      const { results, status, errorCode, errorMessage } = json;
      if (results) {
        const { resultStatus, respCommonLoginDto } = results;
        if (resultStatus === "0001") {
          const { userId, sephoraToken, bindId } = respCommonLoginDto;
          Sensor.go("loginResult", {
            login_channel: "",
            if_success: true,
            failure_reason: false,
            userID: userId,
            $lib_detail: "M_newResetPassword##resetPassword##login.js##259",
          });
          Sensor.push("login", userId);
          if (bindId) {
            utilCookieUtil.SetSingleCookie2({
              key: "bindId",
              value: bindId,
              domain: ".sephora.cn",
              path: "/",
            });
            // 本地登录的流程
            if (window.location.port === "60018") {
              utilCookieUtil.SetSingleCookie2({
                key: "bindId",
                value: bindId,
                domain: "localhost",
                path: "/",
              });
            }
          }
          dispatch(
            popupAlert(1, "PopupToast", {
              _text: "密码重设成功",
              _autoClose: true,
            }),
          );
          utilCookieUtil.SetSingleCookie2({
            key: "Token",
            value: sephoraToken,
            domain: ".sephora.cn",
            path: "/",
          });
          utilCookieUtil.SetSingleCookie2({
            key: "UID",
            value: userId,
            domain: ".sephora.cn",
            path: "/",
          });
          callbackFun && callbackFun(true);
        }
        return false;
      }

      if (errorCode == 10304) {
        // 注销
        dispatch(
          popupAlert(1, "PopupCleaning", {
            _text: "您的账号正在注销中，如需取消请前往 APP 端。",
          }),
        );
      } else if (errorCode == 10311) {
        // 多端登录
        dispatch(
          popupAlert(1, "PopupCleaning", {
            _text:
              "系统检测到当前账号在其他设备保持登陆状态，请问是否授权多端登陆？如同意则多端将保持登陆，如拒绝则其他设备上账号会自动登出。",
            _customFalseText: "拒绝",
            _btnWord: "允许",
            _customTrueCallback: () => {
              multiLogin(
                {
                  multiLoginToken: errorMessage,
                  permit: true,
                },
                () => {
                  window.location.href = "/";
                },
              );
            },
            _customFalseCallback: () => {
              multiLogin(
                {
                  multiLoginToken: errorMessage,
                  permit: false,
                },
                () => {
                  window.location.href = "/";
                },
              );
            },
          }),
        );
      } else if (errorCode !== "0001" || !errorMessage) {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text:
              errorDatav2[errorCode] ||
              errorDatav2[errorMessage] ||
              errorDatav2[status] ||
              errorMessage,
            _autoClose: true,
          }),
        );
      }
      callbackFun && callbackFun(false);
    });
  }
};
