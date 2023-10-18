import React, { Component } from "react";
import { connect } from "react-redux";
import { urlGetParams } from "@/lib/url";
import * as device from "../../../../lib/device";
import { exchangeRecordDetail } from "../../../../actions/rewardsBoutique";
import { WeChatPath } from "../../util";
import { setupWeChat } from "../../../../Utils/wechat";
export class exchangeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponInfo: {},
      recordId: null,
      endValidityDate: null,
    };
    this.getUrl = this.getUrl.bind(this);
    this.toCart = this.toCart.bind(this);
  }
  componentDidMount() {
    if (device.device_inMiniProgramsEnvironment()) {
      setupWeChat({});
    }
    let recordId = window.location.pathname.match("[^/]+(?!.*/)")[0];
    let endValidityDate = urlGetParams(window.location, "endValidityDate");
    this.setState({
      endValidityDate: endValidityDate,
    });

    this.props.exchangeRecordDetail({ recordId }, (res) => {
      if (res) {
        this.setState({
          couponInfo: res,
        });
      }
    });
  }

  getUrl() {
    const { recordId } = this.state; // TODO: 请移除无用state
    console.log(recordId);
    let backUrl;
    const { couponInfo } = this.state;
    const brandurl = couponInfo.brandId
      ? `/v2/html/rewardsBrand/${couponInfo.brandId}`
      : `/v2/html/rewardsBoutique`;
    if (device.device_inMiniProgramsEnvironment()) {
      backUrl = WeChatPath(brandurl);
    } else {
      backUrl = brandurl;
    }
    window.location.href = backUrl;
  }

  toCart() {
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.navigateTo({
        url: "/sp/shop/index",
      });
    } else {
      window.location.href = "sephora://cart";
    }
  }

  render() {
    let { endValidityDate } = this.state;
    let couponText = (
      <div>
        <div className="exchange_txt">
          <p>请尽快前往购物车结算</p>
          <p className="postmail_date">{`请在${endValidityDate}前进行结算`}</p>
          <p className="exppires">逾期视为放弃</p>
        </div>
        <a
          className="to_use"
          onClick={() => {
            this.toCart();
          }}
        >
          前往购物车
        </a>
        <div className="exchange_bottom">
          <a onClick={this.getUrl}>继续兑换</a>
        </div>
      </div>
    );
    return (
      <div className="exchange_status">
        <img
          src="https://ssl1.sephorastatic.cn/soa/nmobile/img/exchange_success.png"
          alt=""
        />
        <p className="status_success">兑换成功</p>
        {couponText}
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, { exchangeRecordDetail })(
  exchangeStatus
);
