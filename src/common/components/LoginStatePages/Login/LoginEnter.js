/*
 * @Author: Leo.Si
 * @Date: 2019-12-10 17:02:30
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:34:01
 * @function login enter area
 */
import React from "react";
import { connect } from "react-redux";
import BaseInput from "../../AtomsInput/Input/BaseInput";
import Button from "../../AtomsInput/Button";
import * as url from "../../../lib/url";
import Sensor from "../../../Utils/sensor";
import UserAgreement from "../../Popup/RetentionInfo/UserAgreement/index";
import { validateValidationValue } from "../../../actions/register";
import { Login, resetLoginGraphic, showChecked } from "../../../actions/login";
import { isWeChatForLand } from "../../../lib/Tools";
import { getShuMeiDeviceId } from "../../../lib/index";
import LoginSocial from "./LoginSocial";

class LoginEnter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputStyleGraphic: "", //图形验证码动画效果控制
      valiCode: "", //图形验证码的值,
      inputStyleMobile: "", //手机验证码
      smsStatus: 0, //是否允许用户输入手机号,
      mobile: "", //用户输入的手机号
      valiCodeToken: "", //校验验证码时所需要的验证信息
      inputStyleSMS: "", //短信验证码
      msgValidation: "", //用户输入的手机验证码
      inputStylePassword: "", //用户输入的密码动画效果控制
      password: "", //用户输入的密码
      btnStatus: 0, //注册按钮默认的初始状态
      isChecked: false, //是否点击协议
      inputStatus: 0,
      invokingChildFun: 0,
      requestId: "",
    };
    this.handClick = this.handClick.bind(this);
    this.usercheckfun = this.usercheckfun.bind(this);
    this.initSMCaptcha = this.initSMCaptcha.bind(this);
  }
  componentDidMount() {
    const {
      inputStyleGraphic,
      smsStatus,
      inputStatus,
      msgValidation,
      inputStylePassword,
      inputStyleSMS,
      invokingChildFun,
    } = this.state; // TODO: 请移除无用state
    console.log(
      inputStyleSMS,
      invokingChildFun,
      inputStyleGraphic,
      smsStatus,
      inputStatus,
      msgValidation,
      inputStylePassword
    );
  }
  //设置input的属性值
  setValue(name, callback, nowValue) {
    let { resetLoginGraphic, LOGIN_SHOW_GRAPHIC } = this.props;
    this.setState(
      {
        [name]: nowValue,
      },
      () => {
        callback && callback.call(this);
      }
    );
    LOGIN_SHOW_GRAPHIC && name == "mobile" ? resetLoginGraphic() : "";
  }

  // 校验输入框的值
  checkValue() {
    const { mobile, password, valiCode } = this.state;
    let { LOGIN_SHOW_GRAPHIC } = this.props;
    let isMBcorrect =
      /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/.test(
        mobile
      );
    let isPWcorrect = /^[\s\S]{6,16}$/.test(password);
    this.setState({
      mobileStatus: isMBcorrect ? 1 : 0,
      passwordStatus: isPWcorrect ? 1 : 0, //,
      btnStatus: LOGIN_SHOW_GRAPHIC
        ? isMBcorrect && isPWcorrect && valiCode
          ? 1
          : 0
        : isMBcorrect && isPWcorrect
          ? 1
          : 0,
      inputStatus: 0,
    });
  }
  initSMCaptcha(successCallBack, closeCallBack) {
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
              successCallBack && successCallBack(data2);
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
            closeCallBack && closeCallBack();
          });
        }
      );
  }
  // 点击提交按钮
  handClick() {
    const { isChecked } = this.state
    const { showChecked } = this.props
    if (isChecked === false) {
      showChecked()
      return
    }
    this.setState({ btnStatus: 2, invokingChildFun: 0 });
    const {
      mobile,
      password,
      valiCode,
      valiCodeToken,
      mobileStatus,
      passwordStatus,
      requestId,
    } = this.state;
    let { Login, resetLoginGraphic } = this.props;
    //触发登陆的接口
    if (mobileStatus && passwordStatus) {
      Login(
        {
          loginId: mobile,
          password: password,
          code: valiCode,
          codeToken: valiCodeToken,
          NDFingerPrint: getShuMeiDeviceId(),
          requestId: requestId || null,
        },
        (callback) => {
          if (callback) {
            let { LOGIN_SHOW_GRAPHIC } = this.props;
            let _status = 2;
            if (LOGIN_SHOW_GRAPHIC == "20212") {
              _status = 0;
            }
            this.setState(
              {
                btnStatus: 0,
                inputStatus: _status,
                invokingChildFun: LOGIN_SHOW_GRAPHIC ? 1 : 0,
              },
              () => {

                this.setState({
                  requestId: null,
                });
                if (LOGIN_SHOW_GRAPHIC && LOGIN_SHOW_GRAPHIC == "20212") {
                  this.initSMCaptcha(
                    (res) => {
                      this.setState(
                        {
                          requestId: res.rid,
                        },
                        () => {
                          resetLoginGraphic();
                          this.handClick();
                        }
                      );
                    },
                    () => {
                      resetLoginGraphic();
                      this.setState({
                        btnStatus: 1,
                      });
                    }
                  );
                }
                if (
                  LOGIN_SHOW_GRAPHIC &&
                  (LOGIN_SHOW_GRAPHIC == "20204" ||
                    LOGIN_SHOW_GRAPHIC == "20201")
                ) {
                  resetLoginGraphic();
                }
              }
            );
          }
        }
      );
    }
  }
  // 勾选丝芙兰用户协议
  usercheckfun() {
    let { isChecked, mobile, password, valiCode } = this.state;
    let { LOGIN_SHOW_GRAPHIC } = this.props;
    let isMBcorrect =
      /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/.test(
        mobile
      );
    let isPWcorrect = /^[\s\S]{6,16}$/.test(password);
    this.setState({
      isChecked: !isChecked,
      btnStatus: LOGIN_SHOW_GRAPHIC
        ? isMBcorrect && isPWcorrect && valiCode
          ? 1
          : 0
        : isMBcorrect && isPWcorrect
          ? 1
          : 0,
      inputStatus: 0,
    });
  }

  //点击去注册页面
  toRegisterPage() {
    //神策点击注册
    Sensor.go("clickSignUp", {
      $lib_detail: "M_LoginEnter##toRegisterPage##LoginEnter.js##100",
    });
    if (isWeChatForLand()) {
      window.location.href = `/register?access_token=${url.urlGetParams(
        window.location,
        "access_token"
      )}&openid=${url.urlGetParams(window.location, "openid")}`;
    } else {
      window.location.href =
        "/register?historyLocation=" +
        window.location.search.replace("?historyLocation=", "");
    }
  }
  render() {
    const { mobile, password, btnStatus, isChecked, inputStatus } = this.state;
    const { _clickCallback } = this.props;
    return (
      <div className="login_page_enter">
        <h3>密码登录</h3>
        {url && url.urlGetParams(window.location, "upstairs") ? null : (
          <a
            className="storeMember"
            onClick={_clickCallback.bind(
              this,
              "switchPage",
              "loginStoreMember"
            )}
          >
            手机验证码登录
          </a>
        )}
        <div
          className={"Model " + this.state.inputStyleMobile}
          onClick={this.setValue.bind(
            this,
            "inputStyleMobile",
            null,
            "modelAnimation"
          )}
        >
          <p>手机号/邮箱</p>
          <BaseInput
            _status={inputStatus}
            _value={mobile}
            _getValue={this.setValue.bind(this, "mobile", this.checkValue)}
          />
        </div>
        <div
          className={"Model " + this.state.inputStylePassWord}
          onClick={this.setValue.bind(
            this,
            "inputStylePassWord",
            null,
            "modelAnimation"
          )}
        >
          <p>密码</p>
          <BaseInput
            _type="password"
            _status={inputStatus}
            _value={password}
            _filter={/^[\s\S]{0,16}$/}
            _getValue={this.setValue.bind(this, "password", this.checkValue)}
          />
        </div>
        {/* {LOGIN_SHOW_GRAPHIC ? (
          <div
            className={"Model " + this.state.inputStyleGraphic}
            onClick={this.setValue.bind(this, "inputStyleGraphic", null, "modelAnimation")}
          >
            <p>图形验证码</p>
            <BaseInput
              _iconRight={250}
              _value={valiCode}
              _filter={/^\w{0,4}$/}
              _getValue={this.setValue.bind(this, "valiCode", this.checkValue)}
            />
            <Button
              _type="GraphicButton"
              _getValiCodeToken={this.setValue.bind(this, "valiCodeToken", null)}
              _invokingChildFun={invokingChildFun}
              loginId={mobile}
              _filter={
                /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/
              }
            />
          </div>
        ) : (
          ""
        )} */}
        <a
          className="login_to_forgottenPassWord"
          href={`/forgottenPassword?historyLocation=${window.location.search.replace(
            "?historyLocation=",
            ""
          )}`}
        >
          忘记密码?
        </a>
        <div className="login_page_con_btn">
          <Button
            _text="登录"
            _status={btnStatus}
            _clickCallback={this.handClick}
          />
        </div>
        <p className="login_to_register">
          还没有账号？
          <a
            href="javascript:voild(0);"
            onClick={this.toRegisterPage.bind(this)}
          >
            免费注册
          </a>
        </p>
        <UserAgreement
          registerClass={{
            i: "register_page_con_agreement_i",
            span: "register_page_con_agreement_span",
          }}
          userCheckFun={this.usercheckfun}
          checked={isChecked}
        />
        {url && url.urlGetParams(window.location, "upstairs") ? null : (
          <LoginSocial isChecked={isChecked} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { login } = state;
  let { LOGIN_SHOW_GRAPHIC } = login;
  return {
    LOGIN_SHOW_GRAPHIC,
  };
};
export default connect(mapStateToProps, {
  validateValidationValue,
  Login,
  resetLoginGraphic,
  showChecked
})(LoginEnter);
