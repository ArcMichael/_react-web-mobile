import React from "react";
import { connect } from "react-redux";
import browserHistory from "@/store/browserHistory";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import Button from "../AtomsInput/Button";
import BaseInput from "../AtomsInput/Input/BaseInput";
import { resetPasswordV2, judgePhoneCode, judgeEmail, judgePhoneCodeV2 } from "../../actions/login";
import { popupAlert } from "../../actions/popup";

class First extends React.Component {
  constructor(props) {
    super(props);
    this.checkValue = this.checkValue.bind(this);
    this.handClick = this.handClick.bind(this);
    this.state = {
      inputStyleMobile: 0,
      inputValue: "", // 密码
      btnStatus: 0, // 按钮默认的初始状态
      loginId: null,
      _status: 0,
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
      },
    );
  }

  // 校验输入框的值
  checkValue() {
    const { inputValue } = this.state;
    const isMVcorrect = !!(inputValue && inputValue.length > 7);
    this.setState({
      btnStatus: isMVcorrect ? 1 : 0,
    });
  }

  /**
   *重置密码
   */
  handClick() {
    this.setState({ btnStatus: 2 });
    const { inputValue, loginId } = this.state;
    const { resetPasswordV2 } = this.props;
    let active = "";
    const reg = new RegExp("(^|&)active=([^&]*)(&|$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) {
      active = r[2];
    }
    const query = getLocationQuery();
    const backUrl = query.backUrl;
    resetPasswordV2({ loginId, newPassWord: inputValue, active,type:"mobile" }, (json) => {
      if (json) {
        window.location.href = backUrl || "/";
      } else {
        this.setState({ btnStatus: 0, _status: 0 });
      }
    });
  }

  /**
   * 验证url中的验证码是否合规
   */
  componentDidMount() {
    if (browserHistory.getCurrentLocation().query.loginId) {
      const loginId = browserHistory.getCurrentLocation().query.loginId;

      this.setState({
        loginId,
      });
    }
  }

  render() {
    const { btnStatus, inputValue, _status } = this.state;
    return (
      <div>
        <p className="title">忘记密码</p>
        <div className="written-area">
          <p className="p-message">请设置新的登录密码</p>
          <div
            className={`Model ${this.state.inputStyleMobile}`}
            onClick={this.setValue.bind(this, "inputStyleMobile", null, "modelAnimation")}
          >
            <p>密码</p>
            <BaseInput
              _type="password"
              _value={inputValue}
              _status={_status}
              _getValue={this.setValue.bind(this, "inputValue", this.checkValue)}
            />
          </div>
        </div>
        <p className="reset_password_tip">8-16位大小写字母、数字和特殊符号的组合</p>

        <Button
          _text="完成"
          _bottomShortLine={false}
          _status={btnStatus}
          _clickCallback={this.handClick}
        />
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  resetPasswordV2,
  popupAlert,
  judgePhoneCode,
  judgeEmail,
  judgePhoneCodeV2,
})(First);
