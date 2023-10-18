import * as action from "../lib/BLL";
import * as utilCookieUtil from "../Utils/cookieUtil";
import { popupAlert } from "./popup";

const errors = require("../components/LoginStatePages/Login/ERRORLOGIN.json");
// 全站留资 -- 查询是否需要留资
export const getAuthenticate = (callback) => {
  return () => {
    action.getAuthenticate((json) => {
      callback(json);
    });
  };
};
// 全站留资 -- 查询是否需要留资
export const putAuthenticate = (params, callback) => {
  return () => {
    action.putAuthenticate(params, (json) => {
      callback(json);
    });
  };
};

// 全站留资 -- 广告位
export const postAD = (params, callback) => {
  return () => {
    const paramsObj = {
      queryBody: params,
    };
    action.advertTxt(paramsObj, (json) => {
      callback(json);
    });
  };
};

// 强制绑定手机
export const bindTelephoneForce = (params, callback) => {
  return (dispatch) => {
    dispatch(
      action.bindTelephoneForce({
        onlyKey: "bindTelephoneForce",
        url: params.url,
        type: "POST",
        data: params.options,
      }),
    ).then((json) => {
      let cb = {
        message: "",
        close: false,
      };
      if (json && !json.errorMessage && !json.errorCode && json.results) {
        if (json.results.sephoraToken) {
          utilCookieUtil.SetSingleCookie2({
            key: "Token",
            value: json.results.sephoraToken,
            domain: ".sephora.cn",
            path: "/",
          });
        }
        if (json.results.userId) {
          utilCookieUtil.SetSingleCookie2({ key: "UID", value: json.results.userId });
        }
        utilCookieUtil.DelSingleCookie2({ key: "tpId", value: "" });
        utilCookieUtil.DelSingleCookie2({ key: "bindId", value: "" });
        utilCookieUtil.DelSingleCookie2({ key: "email", value: "" });
        cb.message = "感谢您的合作，验证身份成功!";
        cb.close = true;
        callback && callback(cb);
      } else {
        if (json.errorCode == "10311") {
          callback(true);
          dispatch(
            popupAlert(1, "PopupCleaning", {
              _text: "系统检测到当前账号在其他设备保持登陆状态，请问是否授权多端登陆？如同意则多端将保持登陆，如拒绝则其他设备上账号会自动登出。",
              _customFalseText: "拒绝",
              _btnWord: "允许",
              _customTrueCallback: () => {
                action.multiLogin({
                  multiLoginToken: json.errorMessage,
                  permit: true
                }, () => {
                  window.location.reload()
                })
              },
              _customFalseCallback: () => {
                action.multiLogin({
                  multiLoginToken: json.errorMessage,
                  permit: false
                }, () => {
                  window.location.reload()
                })
              }


            })
          );
          return;
        }
        if (json.errorMessage) {
          cb.message = errors[json.errorCode] || json.errorMessage;
        }
        callback && callback(cb);
      }
    });
  };
};
