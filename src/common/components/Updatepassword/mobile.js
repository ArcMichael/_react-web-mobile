import React from "react";
import { connect } from "react-redux";
import Button from "../AtomsInput/Button";
import BaseInput from "../AtomsInput/Input/BaseInput";
import {
  validateValidationValueV2,
  userUpdateForKugouV2,
} from "../../actions/registerForKugou";

class Mobile extends React.Component {
  constructor(props) {
    super(props);
    this.checkValue = this.checkValue.bind(this);
    this.handClick = this.handClick.bind(this);
    this.customerService = this.customerService.bind(this);
    this.state = {
      inputStyleMobile: 0,
      inputStyleGraphic: "", // 图形验证码动画效果控制
      valiCode: "", // 图形验证码的值,
      inputStyleSMS: "", // 手机验证码输入框动画效果控制
      msgValidation: "", // 用户输入的手机验证码
      smsStatus: 0, // 是否允许用户输入验证码
      valiCodeToken: "", // 校验验证码时所需要的验证信息
      btnStatus: 0, // 按钮默认的初始状态
      serviceText: "收不到验证码？",
      rtoken: "",
    };
  }
  componentDidMount() {
    const { inputStyleSMS } = this.state; // TODO: 请移除无用state
    console.log(inputStyleSMS);
  }
  // 设置input的属性值
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
  customerService() {
    this.setState({
      serviceText: "请联系客服400 670 0055",
    });
  }
  // 校验输入框的值
  checkValue() {
    const { valiCode, msgValidation } = this.state;
    const isVCcorrect = !!(valiCode && valiCode.length == 4);
    const isMVcorrect = !!(msgValidation && msgValidation.length == 6);
    this.setState({
      smsStatus: valiCode && valiCode.length == 4 ? 1 : 0,
      btnStatus: isVCcorrect && isMVcorrect ? 1 : 0,
    });
  }
  handClick() {
    //  提交
    this.setState({ btnStatus: 2 });
    const { msgValidation, rtoken } = this.state;
    const { userUpdateForKugouV2, body } = this.props;
    userUpdateForKugouV2(
      {
        smsCode: msgValidation,
        telephone: body.mobile,
        rToken: rtoken,
      },
      (callback) => {
        callback && this.setState({ btnStatus: 0 });
      }
    );
  }
  sendPhoneMessage(valiCode, valiCodeToken, mobile, stop, start) {
    const { validateValidationValueV2 } = this.props;
    let that = this;
    validateValidationValueV2(
      valiCode,
      valiCodeToken,
      mobile,
      stop,
      start,
      (isSuccess, rtoken) => {
        if (rtoken) {
          that.setState({
            rtoken,
          });
        }
      }
    );
  }
  render() {
    const { body, showhelp } = this.props;
    const {
      btnStatus,
      valiCodeToken,
      valiCode,
      msgValidation,
      smsStatus,
      serviceText,
    } = this.state;
    return (
      <div>
        <div className="header cur">
          <img
            src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/tipinfo.png"
            className="header_tipimg"
          />
          <p>{body.msg}</p>
        </div>
        <div className="content">
          <p className="title">更新密码</p>
          <p className="mobile">用户登录手机号{body.mobileNumber}</p>
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
              _getValiCodeToken={this.setValue.bind(
                this,
                "valiCodeToken",
                null
              )}
              loginId={body.mobile}
            />
          </div>
          <div
            className={"Model " + this.state.inputStyleMobile}
            onClick={this.setValue.bind(
              this,
              "inputStyleMobile",
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
              _module="1001"
              _status={smsStatus}
              _mobile={body.mobile}
              _sendDirect={false}
              _clickCallback={this.sendPhoneMessage.bind(
                this,
                valiCode,
                valiCodeToken,
                body.mobile
              )}
            />
          </div>
          <div className="register-page-for-kugou-con-btn">
            <Button
              _text="下一步"
              _status={btnStatus}
              _clickCallback={this.handClick}
            />
          </div>
          {showhelp && (
            <div className="showhelp">
              <em className="button-base-short-line" />
              <p className="service" onClick={this.customerService}>
                {serviceText}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { showhelp, body } = myAccount;
  return { showhelp, body };
};
export default connect(mapStateToProps, {
  validateValidationValueV2,
  userUpdateForKugouV2,
})(Mobile);
