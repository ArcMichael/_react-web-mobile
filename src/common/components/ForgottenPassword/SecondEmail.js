import React from "react";
import { connect } from "react-redux";
import Button from "../AtomsInput/Button";
import { sendMail, sendMailV2 } from "../../actions/login";

class SecondEmail extends React.Component {
  constructor(props) {
    super(props);
    this.handClick = this.handClick.bind(this);
    this.state = {
      btnStatus: 0, // 按钮默认的初始状态
      text: "去登录", // 按钮默认文字
      time: 3, // 倒计时
    };
  }
  componentDidMount() {
    const {  sendMailV2, forgetRtoken } = this.props;
    sendMailV2(forgetRtoken);
    // const { loginId, sendMail } = this.props
    // sendMail(loginId)
    this.interval = setInterval(() => this.tick(), 1000);
  }
  componentWillUpdate() {
    if (this.state.time < 1) {
      clearInterval(this.interval);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  /* 倒计时3秒*/
  tick() {
    this.setState((prevState) => ({
      time: prevState.time - 1,
      text: `${this.state.time}秒返回登录页`,
    }));
  }
  handClick() {
    window.location.href = "/";
  }

  render() {
    const { btnStatus, text, time } = this.state;
    return (
      <div>
        <div className="mail-tip">
          <p>
            <span />
            验证邮件已发送至您的邮箱
          </p>
          <p>
            如未收到设置新密码的邮件，请拨打 <span>400 670 0055</span>
          </p>
        </div>
        <div className="register-page-for-kugou-con-btn">
          <Button
            _text={time < 0 ? "去登录" : text}
            _status={time < 0 ? 1 : btnStatus}
            _clickCallback={this.handClick}
          />
        </div>
        <div style={{ paddingTop: "46px" }}>
          <p className="safety-tips-new">如您没有收到验证邮件或短信，请留意您的垃</p>
          <p className="safety-tips-new">圾邮件箱或手机设置。</p>
          <p className="safety-tips-new">再有疑问请联系客服热线：400 670 0055</p>
        </div>

        <a className="safety-tips" href={"/"}>
          返回首页
        </a>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { login } = state;
  const { loginId, forgetRtoken } = login;
  return { loginId, forgetRtoken };
};
export default connect(mapStateToProps, {
  sendMailV2,
  sendMail,
})(SecondEmail);
