/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-20 11:43:11
 * @function login page
 */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// import { getShuMeiDeviceId } from "@/lib/index";
import { bindActionCreators } from "redux";
import isBrowser from "@/Utils/utils/isBrowser";
import PopupAlert from "@/components/PopupAlert";
import LoginToast from "./components/LoginToast";
import BaseInput from "./components/BaseInput";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/loginNew.scss");
}
import { Login, loginStoreMember, mapFunLoginToRun, resetPassword } from "../../actions/login"; //resetPassword

import { initSMCaptcha, getSmsCode } from "./service";
interface ResetState {
  Login: Function;
  getSmsCode: Function;
  loginStoreMember: Function;
  resetPassword: Function;
}

const ResetTwo: React.FunctionComponent<ResetState> = (props) => {
  const [status, setStatus] = useState(1);
  const [tel, setTel] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setChekcPassword] = useState("");
  const [email, setEmail] = useState("");

  const [toastText, setToastText] = useState("");
  const [endCount, setEndCount] = useState(0);
  const [btnShow, setBtnShow] = useState(false);
  const [codeRid, setCodeRid] = useState("");
  const [showPasswordTip, setShowPasswordTip] = useState(false);
  const [telCheck, setTelCheck] = useState(false);

  const changeStatus = (status: number) => {
    setStatus(status);
    setTel("");
    setPassword("");
    setEndCount(0);
  };

  useEffect(() => {
    if (
      status === 1 &&
      tel.length == 11 &&
      code.length == 6 &&
      password.length >= 6 &&
      checkPassword.length >= 6
    ) {
      setBtnShow(true);
    } else if (email && status === 2) {
      let mailReg =
        /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
      if (mailReg.test(email)) {
        setBtnShow(true);
      } else {
        setBtnShow(false);
      }     
    } else {
      setBtnShow(false);
    }
    if (tel && status == 1) {
      const reg_tel =
        /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/;
      if (!reg_tel.test(tel)) {
        setTelCheck(false);
      } else {
        setTelCheck(true);
      }
    }
  }, [tel, code, password, checkPassword, email, status]);

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
        scene: "FORGET",
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

 
  const postLogin = async () => {
    if (!btnShow) return false;

    const type = status === 1 ? "mobile" : "email";
    const para = {
      type,
      newPassCode: password, //新密码
      rtoken: codeRid, //数美rid或者普通图形验证码的rToken
      smsCode: code, //验证码
      telephone: tel,
      checkPassword: checkPassword
    };
    props.resetPassword(para, (ret: any) => {
      if (ret) {
        window.location.href = "/";
      }
    });
  };

  const emailLogin = async () => {
    if (!btnShow) return false;
    let mailReg =
      /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
    if (mailReg.test(email)) {
    } else {
      setToastText("请输入正确的邮箱格式！");
    }
    const smcRid = await initSMCaptcha();
    const type = status === 1 ? "mobile" : "email";
    const para = {
      verifyType: 2,
      scene: "FORGET",
      email,
      verifyParam: { requestd: smcRid },
      type,
    };
    props.resetPassword(para, (ret: any) => {       
      if (ret) {
        window.location.href = "/EmailSuccess";
      }
    });
  };

  // 弹出窗，1秒默认关闭
  useEffect(() => {
    if (toastText) {
      setTimeout(() => {
        setToastText("");
      }, 1500);
    }
  }, [toastText]);

  const setSourceFous = (flag: boolean) => {
    setShowPasswordTip(flag);
  };

  const goLogin = () => {
    const historyPath =
      decodeURIComponent(window.location.search.replace("?historyLocation=", "")).replace(
        "&",
        "?",
      ) || "";
    window.location.href = `/login?historyLocation=${historyPath}`;
  };

  return (
    <div>
      {showPasswordTip && (
        <div className=" login-pass-tip absolute-tip">8-16位大小写字母、数字和特殊符号的组合</div>
      )}
      <div className="login-page">
        <PopupAlert />
        {!showPasswordTip && (
          <div className="login-title">
            <img
              onClick={goLogin}
              src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
            />
            <span />
          </div>
        )}

        <div className="resetTab">
          <div
            className={`${status === 1 ? "resetTab_active" : ""}`}
            onClick={() => changeStatus(1)}
          >
            <p>手机找回</p>
            <span />
          </div>
          <div
            className={`${status === 2 ? "resetTab_active" : ""}`}
            onClick={() => changeStatus(2)}
          >
            <p>邮箱找回</p>
            <span />
          </div>
        </div>
      </div>
      <div className="login-lineHeiht" />
      <div className="login-reset-box">
        {status == 1 ? (
          <>
            <BaseInput
              _setValue={setTel}
              _placeholder="输入手机号"
              _type="tel"
              _filter={/^\d{0,11}$/}
              _class="mb16"
            />
            <BaseInput
              _setValue={setCode}
              _placeholder="输入验证码"
              _type="code"
              _getCode={getCode}
              _endCount={endCount}
              _telCheck={telCheck}
              _class="mb16"
            />
            <BaseInput
              _setValue={setPassword}
              _placeholder="输入新密码"
              _type="password"
              _filter={/^[\s\S]{0,16}$/}
              _autocomplete="new-password"
              _class="mb16"
              setSourceFous={setSourceFous}
            />
            <BaseInput
              _setValue={setChekcPassword}
              _placeholder="确认新密码"
              _type="password"
              _filter={/^[\s\S]{0,16}$/}
              _autocomplete="new-password"
              setSourceFous={setSourceFous}
            />
          </>
        ) : (
          <div className="login-emial">
            <BaseInput _setValue={setEmail} _placeholder="输入邮箱" />
          </div>
        )}
        <div
          className={`login-btn ${btnShow ? "login-active" : ""}`}
          onClick={status === 1 ? postLogin : emailLogin}
        >
          {status === 1 ? "登录" : "确认"}
        </div>
      </div>
      <div className="login-service">
        <a href="tel:400-670-0055" className="fontSize">联系客服</a>
      </div>
      <LoginToast _mainText={toastText} />
    </div>
  );
};

const mapStateToProps = () => { };

export default connect(mapStateToProps, (dispatch) => ({
  Login: bindActionCreators(Login, dispatch),
  loginStoreMember: bindActionCreators(loginStoreMember, dispatch),
  mapFunLoginToRun: bindActionCreators(mapFunLoginToRun, dispatch),
  resetPassword: bindActionCreators(resetPassword, dispatch),
}))(ResetTwo);
