import React, { Component } from "react";
import { getCdnImageUrl } from "@/components/CdnImage";
import ComponentReadAgreementCon from "./ComponentReadAgreementCon";

class Useragreenment extends Component {
  constructor(props) {
    super(props);
    this.userChecked = this.userChecked.bind(this);
    this.state = {
      userchecked: false,
      useragree: this.props.isChecked,
      privacyProtocol: false,
    };
  }

  userChecked() {
    const { privacyProtocol } = this.state; // TODO: 请移除无用state
    console.log(privacyProtocol);
    const { userCheckFun } = this.props;
    this.setState(
      {
        userchecked: !this.state.userchecked,
      },
      () => {
        userCheckFun(this.state.userchecked);
      }
    );
  }

  userAgreement(res) {
    this.setState({
      useragree: res,
    });
  }
  privacyProtocolAction() {
    let url = getCdnImageUrl("/legal/app_privacy_policy.html");
    window.location.href = url;
  }

  render() {
    const { userchecked, useragree } = this.state;
    const { registerClass } = this.props;
    return (
      <div className="user_agreenment">
        <div className="user_agreenment_tp">
          <i
            className={
              userchecked
                ? `${registerClass && registerClass.i} cur user_agreenment_tp_i`
                : `${registerClass && registerClass.i} user_agreenment_tp_i`
            }
            onClick={this.userChecked}
          />
          <span
            className={`user_agreenment_tp_span ${registerClass && registerClass.span
              }`}
          >
            已阅读并同意
            <em onClick={this.userAgreement.bind(this, true)}>
              《丝芙兰用户服务协议》
            </em>
            和
            <em onClick={this.privacyProtocolAction.bind(this, true)}>
              《丝芙兰隐私政策》
            </em>
          </span>
        </div>
        {useragree ? (
          <ComponentReadAgreementCon
            _clickCallback={this.userAgreement.bind(this, false)}
            _className="login-allow-scroll"
          />
        ) : (
          ""
        )}
        {/* {privacyProtocol ? <ComponentPrivacyProtocol _clickCallback={this.privacyProtocolAction.bind(this, false)} _className='login-allow-scroll' /> : ''} */}
      </div>
    );
  }
}

export default Useragreenment;
