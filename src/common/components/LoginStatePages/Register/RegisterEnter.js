/*
 * @Author: Leo.Si
 * @Date: 2019-12-10 17:02:30
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-17 10:46:21
 * @function register enter area
 */
import React from "react";
import { connect } from "react-redux";
import BaseInput from "../../AtomsInput/Input/BaseInput";
import Button from "../../AtomsInput/Button";
import UserAgreement from "../../Popup/RetentionInfo/UserAgreement/index";
import { getShuMeiDeviceId } from "../../../lib/index";
import {
  validateValidationValueRegister,
  validateValidationValue,
  register,
} from "../../../actions/register";

import { isWeChatForLand } from "../../../lib/Tools";
class RegisterEnter extends React.Component {
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
      inputStyleCheckPassword: "", //用户输入的确认密码动画效果控制
      checkPassword: "", //用户输入的确认密码
      btnStatus: 0, //注册按钮默认的初始状态
      isChecked: false,
      valiStatus: false, // 图形验证码蒙层是否显示
      rtoken: "", // 图形验证码验证通过的rtoken
    };
    this.handClick = this.handClick.bind(this);
    this.usercheckfun = this.usercheckfun.bind(this);
  }
  //设置input的属性值
  setValue(name, callback, nowValue) {
    this.setState(
      {
        [name]: nowValue,
        valiStatus: false,
      },
      () => {
        callback && callback.call(this, name);
      },
    );
  }

  // 校验输入框的值
  checkValue() {
    const { mobile, password, valiCode, msgValidation, checkPassword, isChecked } = this.state;
    let isMBcorrect = /^1\d{10}$/.test(mobile);
    //  let isPWcorrect = /^\w{6,16}$/.test(password);
    let isVCcorrect = valiCode && valiCode.length == 4 ? true : false;
    let isMVcorrect = msgValidation && msgValidation.length == 6 ? true : false;
    // let isCPWcorrect = /^\w{6,16}$/.test(checkPassword);
    this.setState({
      smsStatus: valiCode && valiCode.length == 4 && isMBcorrect ? 1 : 0,
      btnStatus:
        isMBcorrect && password && isVCcorrect && isMVcorrect && checkPassword && isChecked ? 1 : 0,
    });
  }
  // 点击提交按钮
  handClick() {
    this.setState({ btnStatus: 2 });
    const { mobile, password, msgValidation, checkPassword, rtoken } = this.state;
    let { register } = this.props;
    register(
      {
        telephone: mobile,
        password,
        rtoken,
        smsCode: msgValidation,
        checkPassword,
        privacyClauseVersion: "3.1",
        NDFingerPrint: getShuMeiDeviceId(),
      },
      (callback) => {
        const { inputStatus } = this.state; // TODO: 请移除无用state
        console.log(inputStatus);
        callback && this.setState({ btnStatus: 0, inputStatus: 2 });
      },
    );
  }
  // 勾选丝芙兰用户协议
  usercheckfun(isChecked) {
    const { mobile, password, valiCode, msgValidation, checkPassword } = this.state;
    let isMBcorrect = /^1\d{10}$/.test(mobile);
    //  let isPWcorrect = /^\w{6,16}$/.test(password);
    let isVCcorrect = valiCode && valiCode.length == 4 ? true : false;
    let isMVcorrect = msgValidation && msgValidation.length == 6 ? true : false;
    this.setState({
      isChecked: isChecked,
      btnStatus:
        isMBcorrect && password && isVCcorrect && isMVcorrect && checkPassword && isChecked ? 1 : 0,
    });
  }
  sendPhoneMessage(valiCode, valiCodeToken, mobile, stop, start) {
    const { validateValidationValueRegister } = this.props;
    let that = this;
    validateValidationValueRegister(
      valiCode,
      valiCodeToken,
      mobile,
      stop,
      start,
      (isSuccess, rtoken) => {
        if (isSuccess) {
          that.setState({
            valiStatus: true,
          });
        }
        if (rtoken) {
          that.setState({
            rtoken,
          });
        }
      },
    );
  }
  render() {
    const {
      valiCode,
      mobile,
      smsStatus,
      msgValidation,
      password,
      checkPassword,
      btnStatus,
      valiCodeToken,
      isChecked,
      valiStatus,
    } = this.state;
    return (
      <div className="register_page_enter">
        <h3>注册</h3>
        {isWeChatForLand() ? (
          <a className="storeMember" href="javascript:history.go(-1);">
            登录
          </a>
        ) : (
          ""
        )}
        <div
          className={"Model " + this.state.inputStyleMobile}
          onClick={this.setValue.bind(this, "inputStyleMobile", null, "modelAnimation")}
        >
          <p>手机</p>
          <BaseInput
            _iconRight={250}
            _value={mobile}
            _filter={/^\d{0,11}$/}
            _getValue={this.setValue.bind(this, "mobile", this.checkValue)}
          />
          {/* <Button _type="ValidationButton" _soruce='spc' _module='1001' _status={smsStatus} _mobile={mobile} _sendDirect={false} _clickCallback={this.sendPhoneMessage.bind(this, valiCode, valiCodeToken, mobile)} /> */}
        </div>
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
            valiStatus={valiStatus}
            loginId={mobile}
            _filter={/^1\d{10}$/}
          />
        </div>
        <div
          className={"Model " + this.state.inputStyleSMS}
          onClick={this.setValue.bind(this, "inputStyleSMS", null, "modelAnimation")}
        >
          <p>短信验证码</p>
          <BaseInput
            _value={msgValidation}
            _filter={/^\d{0,6}$/}
            _getValue={this.setValue.bind(this, "msgValidation", this.checkValue)}
          />
          <Button
            _type="ValidationButton"
            _soruce="spc"
            _module="1001"
            _status={smsStatus}
            _mobile={mobile}
            _sendDirect={false}
            _clickCallback={this.sendPhoneMessage.bind(this, valiCode, valiCodeToken, mobile)}
          />
        </div>
        <div
          className={"Model " + this.state.inputStylePassword}
          onClick={this.setValue.bind(this, "inputStylePassword", null, "modelAnimation")}
        >
          <p>密码</p>
          <BaseInput
            _value={password}
            _type="password"
            _getValue={this.setValue.bind(this, "password", this.checkValue)}
          />
        </div>
        <div
          className={"Model " + this.state.inputStyleCheckPassword}
          onClick={this.setValue.bind(this, "inputStyleCheckPassword", null, "modelAnimation")}
        >
          <p>确认密码</p>
          <BaseInput
            _value={checkPassword}
            _type="password"
            _getValue={this.setValue.bind(this, "checkPassword", this.checkValue)}
          />
        </div>
        <p className="register_page_tip">8-16位大小写字母、数字和特殊符号的组合</p>
        <div className="register_page_con_btn">
          <Button _text="同意条款并注册" _status={btnStatus} _clickCallback={this.handClick} />
        </div>
        <UserAgreement
          registerClass={{
            i: "register_page_con_agreement_i",
            span: "register_page_con_agreement_span",
          }}
          userCheckFun={this.usercheckfun}
          checked={isChecked}
        />
        <img
          src="https://ssl1.sephorastatic.cn/soa/nmobile/img/mobile_register.png"
          className="register_page_enter_img"
        />
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  validateValidationValueRegister,
  validateValidationValue,
  register,
})(RegisterEnter);
