import React from "react";
import { connect } from "react-redux";
import Button from "../AtomsInput/Button";
import BaseInput from "../AtomsInput/Input/BaseInput";
import {
  validateValidationValue,
  emalValidateValidationValueV2,
} from "../../actions/registerForKugou";

class Email extends React.Component {
  constructor(props) {
    super(props);
    this.checkValue = this.checkValue.bind(this);
    this.handClick = this.handClick.bind(this);
    this.state = {
      inputStyleGraphic: "", //图形验证码动画效果控制
      valiCode: "", //图形验证码的值,
      inputStyleSMS: "", //手机验证码输入框动画效果控制
      valiCodeToken: "", //校验验证码时所需要的验证信息
      btnStatus: 0, //注册按钮默认的初始状态
    };
  }
  componentDidMount() {
    const { inputStyleSMS } = this.state; // TODO: 请移除无用state
    console.log(inputStyleSMS);
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
    const { valiCode } = this.state;
    let isVCcorrect = valiCode && valiCode.length == 4 ? true : false;
    this.setState({
      btnStatus: isVCcorrect ? 1 : 0,
    });
  }
  handClick() {
    //  提交
    this.setState({ btnStatus: 2 });
    const { valiCode, valiCodeToken } = this.state; //图片验证码，验证信息
    let { emalValidateValidationValueV2, body } = this.props;
    emalValidateValidationValueV2(valiCode, valiCodeToken, body.emailNumber); //  发送邮件
  }
  render() {
    let { body } = this.props;
    let { btnStatus, valiCode } = this.state;
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
          <p className="mobile">用户登录邮箱{body.emailNumber}</p>
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
              loginId={body.emailNumber}
            />
          </div>
          <div className="register-page-for-kugou-con-btn">
            <Button
              _text="发送邮件验证"
              _status={btnStatus}
              _clickCallback={this.handClick}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { myAccount } = state;
  let { showhelp, body } = myAccount;
  return { showhelp, body };
};
export default connect(mapStateToProps, {
  // userRegisterForKugou,
  validateValidationValue,
  emalValidateValidationValueV2,
})(Email);
