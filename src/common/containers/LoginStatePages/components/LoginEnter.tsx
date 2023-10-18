/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-22 17:51:27
 * @function login page
 */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getShuMeiDeviceId } from "@/lib/index";
import { bindActionCreators } from "redux";
import * as url from "@/lib/url";
import LoginFooter from "./LoginFooter";
import LoginAgreenment from "./Agreenment";
import LoginToast from "./LoginToast";
import BaseInput from "./BaseInput";

import { Login, loginStoreMember, mapFunLoginToRun } from "../../../actions/login";

import { initSMCaptcha, getSmsCode } from "../service";

interface LoginState {
  Login: Function;
  getSmsCode: Function;
  loginStoreMember: Function;
}

const LoginTwo: React.FunctionComponent<LoginState> = (props) => {
  const [status, setStatus] = useState(2);
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [toastText, setToastText] = useState("");
  const [endCount, setEndCount] = useState(0);
  const [btnShow, setBtnShow] = useState(false);
  const [agreeCheck, setAgreeCheck] = useState(false);
  const [telCheck, setTelCheck] = useState(false);
  const [codeRid, setCodeRid] = useState("");

  const changeStatus = (status: number) => {
    setStatus(status);
    setTel("");
    setPassword("");
    setEndCount(0);
    setAgreeCheck(false);
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
    const smcRid = await initSMCaptcha();
    if (smcRid) {
      setCodeRid(smcRid);
      const { results, errorMessage } = await getSmsCode({
        verifyParam: { requestId: smcRid },
        scene: "SMS",
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

  // postPwLogin 密码登录
  const postLogin = async () => {
    if (!agreeCheck) return setToastText("请先阅读并同意协议");
    if (!btnShow) return false;
    const { Login } = props;
    const smcRid = await initSMCaptcha();
    Login(
      {
        loginId: tel,
        password: password,
        code: "",
        codeToken: "",
        NDFingerPrint: getShuMeiDeviceId(),
        requestId: smcRid,
      },
      () => {},
    );
  };

  // loginStoreMember 验证码登录
  const postSmsLogin = async () => {
    if (!agreeCheck) return setToastText("请先阅读并同意协议");
    if (!btnShow) return false;
    const { loginStoreMember } = props;
    loginStoreMember(
      {
        telephone: tel,
        smsCode: password,
        rtoken: codeRid,
      },
      () => {},
    );
  };

  // 弹出窗，1秒默认关闭
  useEffect(() => {
    if (toastText) {
      setTimeout(() => {
        setToastText("");
      }, 1500);
    }
  }, [toastText]);

  useEffect(() => {
    btnCheck();
    if (tel) {
      const reg_tel =
        /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/;
      if (!reg_tel.test(tel)) {
        setTelCheck(false);
      } else {
        setTelCheck(true);
      }
    }
  }, [tel, password, agreeCheck]);

  const btnCheck = () => {
    if (tel.length == 11 && password.length == 6 && agreeCheck && status === 1) {
      setBtnShow(true);
    } else if (tel.length >= 11 && password.length >= 6 && agreeCheck && status === 2) {
      setBtnShow(true);
    } else {
      setBtnShow(false);
    }
  };

  const goBack = () => {
    if (window.location.href.indexOf("myAccount")) {
      return (window.location.href = "/");
    }
    window.location.href = `${url.urlGetParams(window.location, "historyLocation") ? "" : "/"}${
      decodeURIComponent(window.location.search.replace("?historyLocation=", "")).replace(
        "&",
        "?",
      ) || ""
    }`;
  };

  return (
    <div className="login-page">
      <div className="login-title">
        <img
          onClick={goBack}
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
        />
        {status === 1 ? (
          <span onClick={() => changeStatus(2)}>账号密码登录</span>
        ) : (
          <span onClick={() => changeStatus(1)}>注册登录</span>
        )}
      </div>
      <LoginAgreenment _status={status} _agreeCheck={agreeCheck} _setAgreeCheck={setAgreeCheck} />
      <div className="login-lineHeiht" />
      {status === 1 ? (
        <BaseInput
          _setValue={setTel}
          _placeholder="输入手机号"
          _type="tel"
          _filter={/^\d{0,11}$/}
          key="tel"
          _class="mb16"
        />
      ) : (
        <BaseInput _setValue={setTel} _placeholder="输入手机号/邮箱" key="email" _class="mb16" />
      )}

      {status === 1 ? (
        <BaseInput
          _setValue={setPassword}
          _placeholder="输入验证码"
          _type="code"
          _getCode={getCode}
          _endCount={endCount}
          _telCheck={telCheck}
          key="code"
        />
      ) : (
        <BaseInput
          _setValue={setPassword}
          _placeholder="输入密码"
          _type="password"
          _filter={/^[\s\S]{0,16}$/}
          key="password"
        />
      )}
      <div
        className={`login-btn ${btnShow ? "login-active" : ""}`}
        onClick={status === 1 ? postSmsLogin : postLogin}
      >
        登录
      </div>
      <LoginFooter _status={status} />
      <LoginToast _mainText={toastText} />
    </div>
  );
};

const mapStateToProps = () => {};

export default connect(mapStateToProps, (dispatch) => ({
  Login: bindActionCreators(Login, dispatch),
  loginStoreMember: bindActionCreators(loginStoreMember, dispatch),
  mapFunLoginToRun: bindActionCreators(mapFunLoginToRun, dispatch),
}))(LoginTwo);
