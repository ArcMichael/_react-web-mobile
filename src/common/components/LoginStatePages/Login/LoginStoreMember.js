/*
 * @Author: Leo.Si
 * @Date: 2020-03-18 15:45:31
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:55:28
 * @function 手机验证码登陆
 */
import React from "react";
import { connect } from "react-redux";
import BaseInput from "../../AtomsInput/Input/BaseInput";
import Button from "../../AtomsInput/Button";
import { validateValidationValueLogin } from "../../../actions/register";
import { loginStoreMember, showChecked } from "../../../actions/login";
import UserAgreement from "../../Popup/RetentionInfo/UserAgreement/index";
class LoginStoreMember extends React.Component {
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
      btnStatus: 0, //注册按钮默认的初始状态
      isChecked: false,//协议
      invokingChildFun: 0,
      valiStatus: false, // 图形验证码蒙层是否显示
      rtoken: "", // 图形验证码校验
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
        callback && callback.call(this);
      }
    );
  }

  // 校验输入框的值
  checkValue() {
    const { mobile, valiCode, msgValidation } = this.state;
    let isMBcorrect = /^1\d{10}$/.test(mobile);
    let isVCcorrect = valiCode && valiCode.length == 4 ? true : false;
    let isMVcorrect = msgValidation && msgValidation.length == 6 ? true : false;
    this.setState({
      smsStatus: valiCode && valiCode.length == 4 && isMBcorrect ? 1 : 0,
      btnStatus: isMBcorrect && isVCcorrect && isMVcorrect ? 1 : 0,
    });
  }

  //会员验证码登陆或查询事件
  handClick() {

    const { isChecked } = this.state
    const { showChecked } = this.props
    if (isChecked === false) {
      showChecked()
      return
    }
    const { invokingChildFun } = this.state; // TODO: 请移除无用state
    console.log(invokingChildFun);
    this.setState({ btnStatus: 2 });
    const { mobile, msgValidation, rtoken } = this.state;
    this.props.loginStoreMember(
      {
        telephone: mobile,
        rtoken: rtoken,
        smsCode: msgValidation,
      },
      (callback) => {
        callback && this.setState({ btnStatus: 0 });
      }
    );
  }
  // 勾选丝芙兰用户协议
  usercheckfun(isChecked) {
    const { mobile, valiCode, msgValidation } = this.state;
    let isMBcorrect = /^1\d{10}$/.test(mobile);
    let isVCcorrect = valiCode && valiCode.length == 4 ? true : false;
    let isMVcorrect = msgValidation && msgValidation.length == 6 ? true : false;
    this.setState({
      isChecked: isChecked,
      btnStatus: isMBcorrect && isVCcorrect && isMVcorrect ? 1 : 0,
    });
  }
  sendPhoneMessage(valiCode, valiCodeToken, mobile, stop, start) {
    const { validateValidationValueLogin } = this.props;
    let that = this;
    validateValidationValueLogin(
      valiCode,
      valiCodeToken,
      mobile,
      stop,
      start,
      (callback, rtoken) => {
        if (callback) {
          that.setState({
            valiStatus: true,
          });
        }
        if (rtoken) {
          that.setState({
            rtoken,
          });
        }
      }
    );
  }
  render() {
    const {
      valiCode,
      mobile,
      smsStatus,
      valiCodeToken,
      msgValidation,
      btnStatus,
      isChecked,
      valiStatus,
    } = this.state;
    const { _clickCallback } = this.props;
    return (
      <div className="login_page_enter">
        <h3>手机验证码登录</h3>
        <a
          className="storeMember"
          onClick={_clickCallback.bind(this, "switchPage", "loginEnter")}
        >
          密码登录
        </a>
        <div
          className={"Model " + this.state.inputStyleMobile}
          onClick={this.setValue.bind(
            this,
            "inputStyleMobile",
            null,
            "modelAnimation"
          )}
        >
          <p>会员手机号</p>
          <BaseInput
            _iconRight={250}
            _value={mobile}
            _filter={/^\d{0,11}$/}
            _getValue={this.setValue.bind(this, "mobile", this.checkValue)}
          />
        </div>
        <div
          className={"Model " + this.state.inputStyleGraphic}
          onClick={this.setValue.bind(
            this,
            "inputStyleGraphic",
            null,
            "modelAnimation"
          )}
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
          onClick={this.setValue.bind(
            this,
            "inputStyleSMS",
            null,
            "modelAnimation"
          )}
        >
          <p>短信验证码</p>
          <BaseInput
            _value={msgValidation}
            _filter={/^\d{0,6}$/}
            _getValue={this.setValue.bind(
              this,
              "msgValidation",
              this.checkValue
            )}
          />
          <Button
            _type="ValidationButton"
            _soruce="spc"
            _module="1006"
            _status={smsStatus}
            _mobile={mobile}
            _sendDirect={false}
            _clickCallback={this.sendPhoneMessage.bind(
              this,
              valiCode,
              valiCodeToken,
              mobile
            )}
          />
        </div>
        <div className="login_page_con_btn">
          <Button
            _text="登录或查询"
            _status={btnStatus}
            _isChecked={isChecked}
            _clickCallback={this.handClick}
          />
        </div>
        <p className="privateInfo_module_verify_identity_tip">
          <span>如注册手机号更改或使用邮箱申请的会员卡，</span>
          <span>
            请致电客服：<i>400-670-0055</i>
          </span>
        </p>
        <UserAgreement
          registerClass={{
            i: "register_page_con_agreement_i",
            span: "register_page_con_agreement_span",
          }}
          userCheckFun={this.usercheckfun}
          checked={isChecked}
        />
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  validateValidationValueLogin,
  loginStoreMember,
  showChecked
})(LoginStoreMember);
