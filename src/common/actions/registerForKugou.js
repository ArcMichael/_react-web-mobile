import * as constType from "../constants/ActionTypes";
import * as action from "../lib/BLL";
import { popupAlert } from "./popup";

const errorDatav3 = require("../components/LoginStatePages/Login/ERRORLOGIN.json");
/*
*advertTxt
初始时获取注册成功或者失败是需要跳转的链接
*
*/

export const initialKougouLink = () => () => {
  action.advertTxt(
    {
      queryBody: { locationLabel: "MOBILE:REGISTER:KUGOU:LINK" },
    },
    () => {},
  );
};

const REGISTERERRORMESSAGE = require("../components/LoginStatePages/Register/RegisterError.json");
//  报错编码对应报错信息
export const userUpdateForKugou = (params, callback, errorMessage) => (dispatch) => {
  //  下一步
  const { msgValidation, mobile } = params;
  action.judgePhoneCode(
    {
      valiCode: msgValidation,
      module: "1002",
      mobile,
    },
    (json) => {
      if (json && json.results && !json.results.code) {
        window.location.href = `/resetPasswords?loginId=${mobile}&phoneCodeValue=${msgValidation}`;
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text:
              (errorMessage ? errorMessage[json.results.code] : json.results.message) || "系统错误",
            _autoClose: true,
            _zIndex: 201,
          }),
        );
        callback && callback(true);
      }
    },
  );
};
export const userUpdateForKugouV2 = (params, callback, errorMessage) => (dispatch) => {
  //  下一步
  const { smsCode, telephone, rToken } = params;
  action.judgePhoneCodeV2(
    {
      smsCode,
      telephone,
      rToken,
      scene: "FORGET",
    },
    (json) => {
      if (json && json.results && !json.results.errorCode) {
        window.location.href = `/resetPasswords?loginId=${telephone}&active=${json.results.active}`;
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: (errorMessage ? errorMessage[json.errorCode] : json.errorMessage) || "系统错误",
            _autoClose: true,
            _zIndex: 201,
          }),
        );
        callback && callback(true);
      }
    },
  );
};

export const emalValidateValidationValueV2 =
  (validationValue, validationValueToken, emailNumber, stop) => (dispatch) => {
    const params = {
      code: validationValue,
      codeToken: validationValueToken,
      identification: emailNumber,
    };
    action.validateValidationValueV2(params, (json) => {
      const valiCodeStatus = json.results && json.results.rtoken;
      if (valiCodeStatus) {
        if (emailNumber) {
          dispatch(sendMailV2({ rToken: valiCodeStatus, email: emailNumber }));
        } else {
          dispatch(
            popupAlert(1, "PopupAlertDefault", {
              _text: REGISTERERRORMESSAGE["error-reporting-8"],
              _autoClose: true,
              _zIndex: 201,
            }),
          );
          stop();
        }
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.errorMessage,
            _autoClose: true,
            _zIndex: 201,
          }),
        );
        stop();
      }
    });
  };
/* 忘记密码密码发送邮件 */
export const sendMailV2 = ({ rToken }, callback) => {
  return (dispatch, getState) => {
    action.sendMailV2(
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
        const value = getState().myAccount.body;
        const _value = JSON.parse(JSON.stringify(value));
        _value.email_two = true;
        dispatch({
          type: constType.UPDATEPASSWORD.BODY,
          data: _value,
        });
        dispatch({
          type: constType.UPDATEPASSWORD.SHOWHELP,
          data: true,
        });
        callback && callback(json);
      },
    );
  };
};

/* 获取手机验证码以及验证图形验证码 */
export const validateValidationValue =
  (validationValue, validationValueToken, mobile, stop) => (dispatch) => {
    const params = {
      validationValue,
      validationValueToken,
    };
    action.validateValidationValue(params, (json) => {
      const valiCodeStatus = json.results.valiCodeStatus;
      const isMBcorrect = /^1\d{10}$/.test(mobile);
      if (valiCodeStatus == "success") {
        if (mobile && isMBcorrect) {
          dispatch(
            sendPhoneCode({
              mobile,
              module: 1002,
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
          stop();
        }
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: REGISTERERRORMESSAGE[valiCodeStatus],
            _autoClose: true,
            _zIndex: 201,
          }),
        );
        stop();
      }
    });
  };

export const validateValidationValueV2 =
  (validationValue, validationValueToken, mobile, stop, start, callback, scene) => (dispatch) => {
    let isSuccess = false;
    const params = {
      code: validationValue,
      codeToken: validationValueToken,
      identification: mobile,
    };
    action.validateValidationValueV2(params, (json) => {
      const valiCodeStatus = json.results && json.results.rtoken;
      const isMBcorrect = /^1\d{10}$/.test(mobile);
      if (valiCodeStatus) {
        if (mobile && isMBcorrect) {
          action.sendPhoneCodeV2(
            {
              scene: scene || "FORGET",
              rToken: valiCodeStatus,
            },
            (json) => {
              // if (json && json.results && json.results.code) {
              //     dispatch(popupAlert(1, 'PopupErrorWarnning', { _text: REGISTERERRORMESSAGE[json.results.code], _autoClose: true, _zIndex: 201 }))
              // } else {
              //     start && start()
              // }
              dispatch({
                type: constType.UPDATEPASSWORD.SHOWHELP,
                data: true,
              });
              if (json && !json.results && json.errorMessage) {
                dispatch(
                  popupAlert(1, "PopupAlertDefault", {
                    _text: json.errorMessage,
                    _autoClose: true,
                    _zIndex: 201,
                  }),
                );
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

/* 发送手机短信验证码 */
export const sendPhoneCode = (params) => (dispatch) => {
  const dataParams = {
    queryBody: params,
  };
  action.sendPhoneCode(dataParams, (json) => {
    dispatch({
      type: constType.UPDATEPASSWORD.SHOWHELP,
      data: true,
    });
    if (json && json.results && json.results.code) {
      dispatch(
        popupAlert(1, "PopupAlertDefault", {
          _text: REGISTERERRORMESSAGE[json.results.code],
          _autoClose: true,
          _zIndex: 201,
        }),
      );
    }
  });
};

//  根据code获取对应报错信息
export const updateErrorMessage = (parms, callback) => (dispatch) => {
  action.updateErrorMessage(parms, (json) => {
    dispatch({
      type: constType.UPDATEPASSWORD.BODY,
      data: Object.assign(parms, { msg: json.results, email_two: false, mobial_two: false }),
    });
    callback && callback(json);
  });
};
