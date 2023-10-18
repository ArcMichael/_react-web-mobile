/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-15 14:14:55
 * @function login page
 */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as retentionInfo from "@/actions/retentionInfo";
import * as popup from "@/actions/popup";
import LoginToast from "./LoginToast";
import BaseInput from "./BaseInput";
import "./style/bind-phone.scss";
import PopupAlert from "@/components/PopupAlert";
import { multiLogin } from "@/lib/BLL";
import * as utilCookieUtil from "@/Utils/cookieUtil";

if (__DEV__ && isBrowser()) {
  require("../../../../public/style/default.scss");
  require("../../../../public/style/loginNew.scss");
}
const errorCode = require("./errorCode.json");
import {
  Login,
  loginStoreMember,
  mapFunLoginToRun,
} from "../../../actions/login";

import { initSMCaptcha, getSmsCode } from "../service";
import isBrowser from "@/Utils/utils/isBrowser";
import { validateValidationValueRegister } from "@/actions/register";
import { GetSingleCookie } from "@/Utils/cookieUtil";

interface LoginState {
  Login: Function;
  getSmsCode?: Function;
  loginStoreMember: Function;
}

const BindPhone: React.FunctionComponent<LoginState> = (props) => {
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [toastText, setToastText] = useState("");
  const [endCount, setEndCount] = useState(0);
  const [btnShow, setBtnShow] = useState(false);
  //   const [agreeCheck, setAgreeCheck] = useState(false);
  const [codeRid, setCodeRid] = useState("");

  // const changeStatus = (status: number) => {
  //   setStatus(status);
  //   setTel("");
  //   setPassword("");
  //   setEndCount(0);
  //   setAgreeCheck(false);
  // };
  const closeDirectly = () => {
    closePopup();
    utilCookieUtil.DelSingleCookie2({
      key: "Token",
      value: "",
      domain: ".sephora.cn",
    });
    utilCookieUtil.DelSingleCookie2({ key: "UID", value: "" });
    window.location.href = `/login?historyLocation=${encodeURIComponent(
      window.location.pathname.replace("/", "").replace("?", "&")
    )}${window.location.search.replace("?", "&")}`;
  };
  const getCode = async () => {
    // const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    const reg_tel =
      /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/;
    if (!tel) {
      return setToastText("请输入您的手机号码");
    }
    if (!reg_tel.test(tel)) {
      return setToastText("请正确填写您的手机号码");
    }
    let scene = "COMPLETETEL";
    let tpId = GetSingleCookie(document.cookie, "tpId");
    let bindId = GetSingleCookie(document.cookie, "bindId");
    if (tpId) {
      // tpId 联合登录留资
      scene = "SOCIALBIND";
    } else if (bindId) {
      // 邮箱登录留资
      scene = "EMAILBIND";
    }

    const smcRid = await initSMCaptcha();
    if (smcRid) {
      setCodeRid(smcRid);
      const { results, errorMessage } = await getSmsCode({
        verifyParam: { requestId: smcRid },
        scene,
        verifyType: 2,
        telephone: tel,
      });
      if (results) {
        // 验证码发送成功
        let endNum = 60;
        const timer = setInterval(() => {
          endNum = endNum - 1;
          if (endNum <= 0) {
            clearInterval(timer);
            endNum = 0;
          }
          setEndCount(endNum);
        }, 1000);
      }
      if (errorMessage) {
        setToastText(errorMessage);
      }
    }
  };

  const closePopup = () => {
    utilCookieUtil.SetSingleCookie2({
      key: "retention_info_count",
      value: "0",
    });
    // ifPushGA && pushGoogleTagManager({
    //     'event': 'ButtonClick',
    //     'eventName': '退出_留资页',
    //     'buttonPosition': 'InforCollectionPopup',
    // });
    utilCookieUtil.DelSingleCookie2({ key: "tpId", value: "",domain: ".sephora.cn" });
    utilCookieUtil.DelSingleCookie2({ key: "bindId", value: "",domain: ".sephora.cn" });
    utilCookieUtil.DelSingleCookie2({ key: "email", value: "" ,domain: ".sephora.cn"});
    window.location.href = "/";
  };
  // 弹出窗，1秒默认关闭
  const loginSubmit = () => {
    const { retentionInfo, popup } = props;
    // const { mobile, msgValidation, rtoken } = this.state;
    let tpId = GetSingleCookie(document.cookie, "tpId");
    let bindId = GetSingleCookie(document.cookie, "bindId");
    let uid = GetSingleCookie(document.cookie, "UID");
    let ajaxUrl, email;
    if (tpId) {
      // tpId 联合登录留资
      ajaxUrl = "/v1/usercenter/weblogin/bind";
    } else if (bindId) {
      // 邮箱登录留资
      ajaxUrl = "/v1/usercenter/weblogin/pwd/bind";
      email = atob(GetSingleCookie(document.cookie, "email")||"");
    }
    if (ajaxUrl) {
      // 强制绑定手机
      let options = {};
      options.telephone = tel;
      options.smsCode = password;
      options.rtoken = codeRid;
      options.activityParam = null;
      if (tpId) options.tpId = tpId;
      if (bindId) {
        options.bindId = bindId;
        options.email = email;
      }
      retentionInfo.bindTelephoneForce(
        {
          url: ajaxUrl,
          options,
        },
        (callback) => {
          popup.popupAlert(1, "PopupAlertDefault", {
            _text: callback.message,
            _autoClose: true,
            _closeCallback: callback.close
              ? () => {
                  closePopup();
                }
              : () => {},
          });
        }
      );
    } else {
      retentionInfo.putAuthenticate(
        {
          telephone: tel,
          smsCode: password,
          rtoken: codeRid,
          uid,
        },
        (json) => {
          // 接口401,提示重新登录,并关闭popup
          if (
            (json && json.jQueryStatus && json.jQueryStatus.status === 401) ||
            json.status === 401
          ) {
            popup.popupAlert(1, "PopupAlertDefault", {
              _text: "请重新登录",
              _autoClose: true,
              _closeCallback: closeDirectly,
            });
            return;
          }
          const data = json.results;

          const code = data.code;
          // error,展示警告框
          if (code) {
            if (code == "40095799") {
              popup.popupAlert(1, "PopupAlertDefault", {
                _text: data.message,
                _autoClose: true,
              });
            } else if (code == 10304) {
              // 注销
              popup.popupAlert(1, "PopupCleaning", {
                _text: "您的账号正在注销中，如需取消请前往 APP 端。",
              });
            } else if (code == 10311) {
              // 多端登录
              popup.popupAlert(1, "PopupCleaning", {
                _text:
                  "系统检测到当前账号在其他设备保持登陆状态，请问是否授权多端登陆？如同意则多端将保持登陆，如拒绝则其他设备上账号会自动登出。",
                _customFalseText: "拒绝",
                _btnWord: "允许",
                _customTrueCallback: () => {
                  multiLogin(
                    {
                      multiLoginToken: data.message,
                      permit: true,
                    },
                    () => {
                      window.location.href = "/";
                    }
                  );
                },
                _customFalseCallback: () => {
                  multiLogin(
                    {
                      multiLoginToken: data.message,
                      permit: false,
                    },
                    () => {
                      window.location.href = "/";
                    }
                  );
                },
              });
            }
             else {
              popup.popupAlert(1, "PopupAlertDefault", {
                _text: errorCode[code],
                _autoClose: true,
              });
            }

            return;
          }
          // 提示留资成功，并关闭popup
          if (data && data.authenticateResult) {
            popup.popupAlert(1, "PopupAlertDefault", {
              _ox: true,
              _text: "感谢您的合作，验证身份成功!",
              _autoClose: true,
              _closeCallback: closePopup,
            });
            // pushGoogleTagManager({
            //     'event': 'ButtonClick',
            //     'eventName': '提交成功',
            //     'buttonPosition': 'InforCollectionPopup'
            // });
          }
        }
      );
    }
  };
  useEffect(() => {
    if (toastText) {
      setTimeout(() => {
        setToastText("");
      }, 1500);
    }
  }, [toastText]);

  useEffect(() => {
    btnCheck();
  }, [tel, password]);

  const btnCheck = () => {
    if (tel.length == 11 && password.length == 6) {
      setBtnShow(true);
    } else if (tel.length >= 11 && password.length >= 6) {
      setBtnShow(true);
    } else {
      setBtnShow(false);
    }
  };
  return (
    <div className="login-page">
      {/* <div className="login-title">
        <img
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
          onClick={() => {
            closeDirectly();
          }}
        />
      </div> */}
      <div className="email-title">绑定手机号 </div>

      <div className="login-input">
        <BaseInput
          _setValue={setTel}
          _placeholder="输入手机号"
          _type="tel"
          _filter={/^\d{0,11}$/}
          key="tel"
        />
        <div className="get-code">
          <BaseInput
            _setValue={setPassword}
            _placeholder="输入验证码"
            _type="code"
            _getCode={getCode}
            _endCount={endCount}
            key="code"
          />
        </div>
        <div
          className={`login-btn ${btnShow ? "login-active" : ""}`}
          onClick={loginSubmit}
        >
          登录
        </div>
        <div className="bind-cancel" onClick={()=>{
          closeDirectly()
        }}>取消</div>
      </div>
      {/* <a href="tel:400-670-0055" className="email-tel">联系客服</a> */}

      <LoginToast _mainText={toastText} />
      <PopupAlert />
    </div>
  );
};

const mapStateToProps = () => {};

export default connect(mapStateToProps, (dispatch) => ({
  Login: bindActionCreators(Login, dispatch),
  loginStoreMember: bindActionCreators(loginStoreMember, dispatch),
  mapFunLoginToRun: bindActionCreators(mapFunLoginToRun, dispatch),
  popup: bindActionCreators(popup, dispatch),
  retentionInfo: bindActionCreators(retentionInfo, dispatch),
  validateValidationValueRegister: bindActionCreators(
    validateValidationValueRegister,
    dispatch
  ),
}))(BindPhone);
