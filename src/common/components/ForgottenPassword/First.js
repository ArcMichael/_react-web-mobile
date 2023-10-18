import React from "react";
import { connect } from "react-redux";
import Button from "../AtomsInput/Button";
import BaseInput from "../AtomsInput/Input/BaseInput";
import { validateValidationValue, judgeUserExist, setForgetPWDRtoken } from "../../actions/login";
import { popupAlert } from "../../actions/popup";

const errorData = require("./json/errorCode.json");
class First extends React.Component {
  constructor(props) {
    super(props);
    this.checkValue = this.checkValue.bind(this);
    this.handClick = this.handClick.bind(this);
    this.state = {
      inputStyleMobile: 0,
      inputStyleGraphic: "", // 图形验证码动画效果控制
      valiCode: "", // 图形验证码的值,
      inputValue: "", // 手机号或者邮箱
      valiCodeToken: "", // 校验验证码时token
      btnStatus: 0, // 按钮默认的初始状态
      valiStatus: false, // 图形验证码蒙层是否显示
    };
  }
  // 设置input的属性值
  setValue(name, callback, nowValue) {
    this.setState(
      {
        [name]: nowValue,
        valiStatus: false,
      },
      () => {
        callback && callback.call(this);
      },
    );
  }
  // 是否可以下一步判断
  checkValue() {
    const { valiCode, inputValue } = this.state;
    const isVCcorrect = !!(valiCode && valiCode.length === 4);
    const isMVcorrect = !!(inputValue && inputValue.length > 4);
    this.setState({
      btnStatus: isVCcorrect && isMVcorrect ? 1 : 0,
    });
  }
  /**
   * 1 校验验证码是否正确
   * 2 校验是否为邮箱或者手机
   */
  handClick() {
    //  提交
    const that = this;
    this.setState({ btnStatus: 0 });
    const { inputValue, valiCode, valiCodeToken } = this.state;
    const { validateValidationValue, setForgetPWDRtoken } = this.props;
    // const { setForgetPWDRtoken } = this.props
    validateValidationValue(
      {
        code: valiCode,
        codeToken: valiCodeToken,
        identification: inputValue,
      },
      (json) => {
        const { results } = json;
        if (results && results.rtoken) {
          // that.getJudgeUserExist({identification:inputValue,rToken:results.rtoken})
          setForgetPWDRtoken(results.rtoken);
          that.getJudgeUserExist({ identification: inputValue, rToken: results.rtoken });
        } else {
          that.setState({
            valiStatus: true,
          });
          setForgetPWDRtoken("");
          this.props.popupAlert(1, "PopupAlertDefault", {
            _text: json.errorMessage,
            _autoClose: true,
          });
        }
        this.setState({ btnStatus: 0 });
      },
    );
  }
  /* 验证手机或者邮箱是否存在*/
  getJudgeUserExist(value) {
    if (
      /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/.test(
        value.identification,
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
  render() {
    const { btnStatus, inputValue, valiCode, valiStatus } = this.state;
    return (
      <div>
        <div
          className={"Model " + this.state.inputStyleMobile}
          onClick={this.setValue.bind(this, "inputStyleMobile", null, "modelAnimation")}
        >
          <p>手机号/邮箱</p>
          <BaseInput
            _iconRight={0}
            _value={inputValue}
            // _filter={/^\d{0,6}$/}
            _getValue={this.setValue.bind(this, "inputValue", this.checkValue)}
          />
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
            loginId={inputValue}
            _filter={
              /^((1\d{10})|([a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+))$/
            }
          />
        </div>

        <div className="register-page-for-kugou-con-btn">
          <Button _text="下一步" _status={btnStatus} _clickCallback={this.handClick} />
        </div>
        <p className="safetyTips">为了您的账户安全，我们将发送验证码到绑定的手机或邮箱。</p>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  validateValidationValue,
  popupAlert,
  judgeUserExist,
  setForgetPWDRtoken,
})(First);
