import React, { Component } from "react";
import { connect } from "react-redux";
import Qrcode from "qrcode.react";
import * as device from "../../../../lib/device";
import { exchangeRecordDetail } from "../../../../actions/rewardsBoutique";
import { appToMiniprogram, WeChatPath } from "../../util";
import { setupWeChat } from "../../../../Utils/wechat";
import Sensor from "../../../../Utils/sensor";
import CdnImage from "@/components/CdnImage";
export class exchangeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponInfo: null,
      pathstatus: null,
      recordId: null,
    };
    this.getUrl = this.getUrl.bind(this);
    this.toUse = this.toUse.bind(this);
    this.toCoupon = this.toCoupon.bind(this);
  }
  componentDidMount() {
    if (device.device_inMiniProgramsEnvironment()) {
      setupWeChat({});
    }

    let pathstatus = null;
    if (window.location.pathname.indexOf("exchangeSuccess") >= 0) {
      pathstatus = "exchangeSuccess";
    } else if (window.location.pathname.indexOf("exchangeReceiveSuccess") >= 0) {
      pathstatus = "exchangeReceiveSuccess";
    }

    let recordId = window.location.pathname.match("[^/]+(?!.*/)")[0];
    this.setState({
      pathstatus: pathstatus,
      recordId: recordId,
    });

    if (pathstatus === "exchangeSuccess") {
      this.props.exchangeRecordDetail({ recordId }, (res) => {
        if (res) {
          this.setState({
            couponInfo: res,
          });
        } else {
          this.setState({
            couponInfo: {},
          });
        }
      });
    }
  }
  getUrl() {
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
  toUse() {
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.reLaunch({
        url: "/pages/home/index",
      });
    } else if (device.isApp()) {
      window.location.href = "sephora://home";
    } else {
      window.location.href = "/";
    }
  }
  toCoupon() {
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.reLaunch({
        url: "/pages/aboutMe/myCoupons",
      });
    } else if (device.isApp()) {
      window.location.href = "sephora://myCoupon";
    } else {
      window.location.href = "/myAccount/myCoupon";
    }
  }
  render() {
    let { couponInfo, pathstatus, recordId } = this.state;
    let couponText;
    if (couponInfo && couponInfo.couponType == 4) {
      couponText = (
        <div>
          <div className="exchange_txt">
            <p>已成功领取一张丝享卡</p>
            <p>您可在线上或门店任意购买时使用</p>
          </div>
          <a
            className="to_use"
            onClick={() => {
              Sensor.go("pointMall_rewardspoint_click", {
                button_name: "去使用",
              });
              this.toUse();
            }}
          >
            去使用
          </a>
          <a
            className="continue_exchange"
            onClick={() => {
              this.getUrl();
            }}
          >
            继续兑换
          </a>
        </div>
      );
    } else {
      if (couponInfo && couponInfo.storeNo) {
        couponText = (
          <div>
            <div className="exchange_txt">
              <p>恭喜您成功兑换</p>
              <p>{couponInfo && couponInfo.name}x1</p>
            </div>
            {couponInfo && couponInfo.storeNo ? (
              <Qrcode value={`${couponInfo && couponInfo.cardNo}`} />
            ) : (
              ""
            )}
            <p className="card_no">{couponInfo && couponInfo.cardNo}</p>
            <p className="tips_3">展示此页面给店员即可获取商品</p>
            <p className="tips_1">亦可前往兑换记录查看使用领取码</p>
            <p className="tips_2">
              <CdnImage src="/soa/nmobile/img/exchange_tips_red.png" alt="" />
              温馨提示：<span>此商品仅限线下门店兑换</span>
            </p>
            <a
              className="continue_exchange_offline"
              onClick={() => {
                this.getUrl();
              }}
            >
              继续兑换
            </a>
          </div>
        );
      } else if ((couponInfo && !couponInfo.storeNo) || typeof couponInfo != "object") {
        couponText = (
          <div>
            <div className="exchange_txt">
              <p>已进入券包</p>
              <p>您可在线上任意购物时随单使用</p>
            </div>
            <a
              className="to_use"
              onClick={() => {
                Sensor.go("pointMall_rewardspoint_click", {
                  button_name: "去使用",
                });
                this.toUse();
              }}
            >
              去使用
            </a>
            <div className="exchange_bottom">
              <a onClick={this.toCoupon}>查看券包</a>
              <a>|</a>
              <a onClick={this.getUrl}>继续兑换</a>
            </div>
          </div>
        );
      } else {
        couponText = <div />;
      }
    }
    if (pathstatus && pathstatus === "exchangeReceiveSuccess") {
      couponText = (
        <div>
          <div className="exchange_txt">
            <p>您已兑换丝享卡领取资格</p>
            <span className="tipstext text_color">
              <em className="tipsimg" />
              <b className="text_color">温馨提示：</b>您的积分已经扣除，请尽快前往领取。
            </span>
          </div>
          <a
            className="to_use"
            onClick={() => {
              Sensor.go("pointMall_rewardspoint_click", {
                button_name: "立即领取丝享卡",
              });
              window.location.href = appToMiniprogram(`pages/exchange/exchange?code=${recordId}`);
            }}
          >
            立即领取丝享卡
          </a>
        </div>
      );
    }
    couponInfo && console.log(couponInfo.couponType, "couponInfo.couponType ");
    return (
      <div className="exchange_status">
        <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/exchange_success.png" alt="" />

        {/* type==4丝享卡 by summer*/}
        {/* {
          pathstatus && pathstatus === 'exchangeReceiveSuccess' ? <p className="status_success">兑换成功</p> : null
        } */}
        {couponInfo && couponInfo.couponType == 4 ? (
          <p className="status_success">领取成功</p>
        ) : (
          <p className="status_success">兑换成功</p>
        )}

        {couponText}
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, { exchangeRecordDetail })(exchangeStatus);
