import React from "react";
import { connect } from "react-redux";
import Button from "../AtomsInput/Button";

class EmailTwo extends React.Component {
  constructor(props) {
    super(props);
    this.customerService = this.customerService.bind(this);
    this.handClick = this.handClick.bind(this);
    this.state = {
      btnStatus: 1, // 注册按钮默认的初始状态
      serviceText: "没收到验证邮件？",
    };
  }

  customerService() {
    this.setState({
      serviceText: "请拨打客服热线400 670 0055",
    });
  }

  handClick() {
    //  提交
    window.location.href = "/login";
  }

  render() {
    const { showhelp } = this.props;
    const { btnStatus, serviceText } = this.state;
    return (
      <div>
        <div className="content">
          <p className="title cur">更新密码</p>
          <div className="email_status">
            <img
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/selected.png"
              className="status_img"
            />
            <p className="status_p">验证邮件已发送至您的邮箱</p>
          </div>
          <p className="email_tip">请注意查收邮件修改密码</p>
          <div className="register-page-for-kugou-con-btn">
            <Button _text="去登录" _status={btnStatus} _clickCallback={this.handClick} />
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
export default connect(mapStateToProps, {})(EmailTwo);
