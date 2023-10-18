import React from "react";
import { connect } from "react-redux";
import Button from "../AtomsInput/Button";
import BaseInput from "../AtomsInput/Input/BaseInput";

class MobileTwo extends React.Component {
  constructor(props) {
    super(props);
    this.checkValue = this.checkValue.bind(this);
    this.handClick = this.handClick.bind(this);
    this.state = {
      inputStylePassword: "",
      password: "",
      // mobile:"",   //用户的手机号
    };
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
    // let { valiCode, msgValidation } = this.state;
    // let isVCcorrect = (valiCode && valiCode.length == 4) ? true : false;
    // let isMVcorrect = (msgValidation && msgValidation.length == 6) ? true : false;
    // if (this.state.type=='mobile') {
    //     this.setState({
    //         smsStatus: (valiCode && valiCode.length == 4) ? 1 : 0,
    //         btnStatus: (isVCcorrect && isMVcorrect) ? 1 : 0
    //     })
    // }
  }

  handClick() {
    //  提交
    this.setState({ btnStatus: 2 });
  }

  render() {
    const { btnStatus, password } = this.state;
    return (
      <div>
        <div className="content">
          <p className="title">忘记密码</p>
          <p className="mobile">请设置新的登陆密码</p>
          <div
            className={`Model ${this.state.inputStylePassword}`}
            onClick={this.setValue.bind(
              this,
              "inputStylePassword",
              null,
              "modelAnimation"
            )}
          >
            <p>密码</p>
            <BaseInput
              _value={password}
              _type="password"
              _getValue={this.setValue.bind(this, "password", this.checkValue)}
            />
          </div>
          <div className="register-page-for-kugou-con-btn">
            <Button
              _text="提交"
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
  const { body } = myAccount;
  return { body };
};
export default connect(mapStateToProps, {})(MobileTwo);
