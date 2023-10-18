import React from "react";
import { connect } from "react-redux";
import Button from "../AtomsInput/Button";
import BaseInput from "../AtomsInput/Input/BaseInput";
import {
  validateValidationValue,
  judgeUserExist,
  sendPhoneCode,
  sendPhoneCodeV2,
  setForgetPWDRtoken,
  forgetPWDShowPage,
} from "../../actions/login";
import {
  userUpdateForKugou,
  userUpdateForKugouV2,
} from "../../actions/registerForKugou";
import { popupAlert } from "../../actions/popup";

const errorData = require("./json/errorCode.json");
const errorDataV2 = require("../LoginStatePages/Login/ERRORLOGIN.json");
class SecondPhone extends React.Component {
  constructor(props) {
    super(props);
    this.checkValue = this.checkValue.bind(this);
    this.handClick = this.handClick.bind(this);
    this.state = {
      inputStyleMobile: 0,
      inputStyleGraphic: "", // 图形验证码动画效果控制
      btnStatus: 0, // 按钮默认的初始状态
      smsStatus: 1, // 是否允许用户输入验证码
    };
  }
  componentDidMount() {
    const { inputStyleGraphic } = this.state; // TODO: 请移除无用state
    console.log(inputStyleGraphic);
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
  // 校验输入框的值
  checkValue() {
    const { msgValidation } = this.state;
    const isMVcorrect = !!(msgValidation && msgValidation.length === 6);
    this.setState({
      btnStatus: isMVcorrect ? 1 : 0,
    });
  }
  /**
   * 1 验证手机
   * 验证码是否正确
   */
  handClick() {
    //  提交
    this.setState({ btnStatus: 0 });
    const { msgValidation } = this.state;
    const { userUpdateForKugouV2, loginId, forgetRtoken } = this.props;
    userUpdateForKugouV2(
      { smsCode: msgValidation, telephone: loginId, rToken: forgetRtoken },
      () => {},
      errorDataV2
    );
    // const { userUpdateForKugou, loginId } = this.props
    // userUpdateForKugou({ msgValidation: msgValidation, mobile: loginId }, (json) => {

    // }, errorData)
  }
  /* 验证手机或者邮箱是否存在*/
  getJudgeUserExist(value) {
    if (
      /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/.test(
        value
      )
    ) {
      this.props.judgeUserExist(value);
    } else {
      this.errorMessage("validators");
    }
  }
  /** 错误信息显示
   * @param {string} code 错误代码
   */
  errorMessage(code) {
    this.props.popupAlert(1, "PopupAlertDefault", {
      _text: errorData[code] || "未知错误",
      _autoClose: true,
    });
  }

  sendPhoneMessage(stop, start) {
    const { sendPhoneCodeV2, forgetRtoken, forgetPWDShowPage } = this.props;
    let that = this;
    let params = {
      scene: "FORGET",
      rToken: forgetRtoken,
    };
    sendPhoneCodeV2(params, (callback) => {
      // console.log('callback,,,,,',callback);
      if (callback && callback.results && !callback.errorCode) {
        start && start();
      } else {
        that.props.popupAlert(1, "PopupAlertDefault", {
          _text: errorDataV2[callback.errorCode] || "未知错误",
          _autoClose: true,
        });
        stop && stop();
        forgetPWDShowPage("", ""); // 发送短信失败回上一页
      }
    });
  }
  render() {
    const { btnStatus, msgValidation, smsStatus } = this.state;
    const { loginId } = this.props;
    const phone = loginId && loginId.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");
    return (
      <div>
        <p className="p-message">请输入{phone}收到的短信校验码</p>
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
            _module="1002"
            _status={smsStatus}
            _mobile={loginId}
            _sendDirect={false}
            loginId={loginId}
            _clickCallback={this.sendPhoneMessage.bind(this)}
          />
          {/* <Button _type='ValidationButton' _module='1002' _status={smsStatus} _mobile={loginId} _sendDirect /> */}
        </div>
        <div className="register-page-for-kugou-con-btn">
          <Button
            _text="下一步"
            _status={btnStatus}
            _clickCallback={this.handClick}
          />
        </div>
        <div style={{ paddingTop: "46px" }}>
          <p className="safety-tips-new">
            如您没有收到验证邮件或短信，请留意您的垃
          </p>
          <p className="safety-tips-new">圾邮件箱或手机设置。</p>
          <p className="safety-tips-new">
            再有疑问请联系客服热线：400 670 0055
          </p>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { login } = state;
  const { loginId, forgetRtoken } = login;
  return { loginId, state, forgetRtoken };
};
export default connect(mapStateToProps, {
  validateValidationValue,
  popupAlert,
  judgeUserExist,
  sendPhoneCode,
  userUpdateForKugou,
  sendPhoneCodeV2,
  userUpdateForKugouV2,
  setForgetPWDRtoken,
  forgetPWDShowPage,
})(SecondPhone);
