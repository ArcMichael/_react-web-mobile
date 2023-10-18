/*
 * @Author: Leo.Si
 * @Date: 2019-08-27 15:45:10
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-08-09 04:30:03
 * @function 验证身份
 */
import React from "react";
import BaseInput from "../../AtomsInput/Input/BaseInput";
import Button from "../../AtomsInput/Button";
export default class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputStyleMobile: "",
      inputStatus: 0,
      mobile: "",
      inputStyleSMS: "",
      msgValidation: "",
      smsStatus: 0,
      confirmStatus: 0,
      valiCode: "",
      valiStatus: false,
      valiCodeToken: "",
      rtoken: "",
    };
    this.submit = this.submit.bind(this);
    this.sendPhoneCodeCallBack = this.sendPhoneCodeCallBack.bind(this);
  }
  //设置input的属性值
  setValue(name, callback, nowValue) {
    this.setState(
      {
        [name]: nowValue,
      },
      () => {
        callback && callback.call(this);
      }
    );
  }

  // 校验输入框的值
  checkValue() {
    const { mobile, msgValidation, valiCode } = this.state;
    let isMBcorrect =
      /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/.test(
        mobile
      );
    let isVCcorrect = valiCode && valiCode.length == 4 ? true : false;
    let isMsgValidation = msgValidation && msgValidation.length <= 6;
    this.setState({
      smsStatus: isMBcorrect && isVCcorrect ? 1 : 0,
      confirmStatus: isMBcorrect && isMsgValidation ? 1 : 0,
    });
  }
  // 点击提交按钮
  submit() {
    const { mobile, msgValidation, rtoken } = this.state;
    const { _clickCallback } = this.props;
    this.setState({
      confirmStatus: 2,
    });
    _clickCallback &&
      _clickCallback(
        "phoneIsAvailable",
        {
          telephone: mobile,
          smsCode: msgValidation,
          rToken: rtoken,
        },
        (callback) => {
          if (!callback)
            this.setState({
              confirmStatus: 0,
            });
        }
      );
  }
  sendPhoneCodeCallBack(isSuccess, rtoken) {
    if (isSuccess) {
      this.setState({
        valiStatus: true,
      });
    }
    if (rtoken) {
      this.setState({
        rtoken,
      });
    }
  }
  render() {
    const {
      inputStatus,
      mobile,
      msgValidation,
      smsStatus,
      confirmStatus,
      valiCode,
      valiStatus,
      valiCodeToken,
    } = this.state;
    const { _clickCallback } = this.props;
    return (
      <div className="authentication_con">
        <p className="authentication_con_title">验证身份</p>
        <div
          className={"Model " + this.state.inputStyleMobile}
          onClick={this.setValue.bind(
            this,
            "inputStyleMobile",
            null,
            "modelAnimation"
          )}
        >
          <p>手机号</p>
          <BaseInput
            _status={inputStatus}
            _value={mobile}
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
            _iconRight={250}
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
            _module="1007"
            _status={smsStatus}
            _mobile={mobile}
            _sendDirect={false}
            _clickCallback={_clickCallback.bind(
              this,
              "validateValidationValue",
              {
                valiCode,
                valiCodeToken,
                mobile,
              },
              this.sendPhoneCodeCallBack
            )}
          />
        </div>
        <Button
          _type="BaseButton"
          _className="retention-info-confirm"
          _text="提交"
          _status={confirmStatus}
          _clickCallback={this.submit}
        />
        <p className="authentication_con_tip">
          <span>为了您的账户安全，需进行手机验证</span>
          <span>如留资手机更改或用邮箱申请的会员请致电：</span>
          <span>400-670-0055</span>
        </p>
      </div>
    );
  }
}
