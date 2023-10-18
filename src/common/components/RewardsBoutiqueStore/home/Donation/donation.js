import React from "react";
import classNames from "classnames";
import { WeChatPath } from "../../util";
export default class Donation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
// donation-top
  render() {
    const {isTop}=this.props;
    return (
      <div className={classNames({
        "donation":true,
        "donation-top":!!isTop
      })}>
        <div className="donation-box">
          <img
            src="https://ssl1.sephorastatic.cn/soa/nmobile/img/points_donation.png"
            className="donation-logo"
           />
          <div className="donation-desc">积分公益捐 关爱兔唇宝宝</div>
        </div>
        <div className="donation-btn" onClick={()=>{
          window.location.href = WeChatPath(`/v2/html/intergalDonate`);
        }}>积分捐赠</div>
      </div>
    );
  }
}
