import React from "react";
import Alipay from "@/lib/services/AlipayFunction";
import isBrowser from "@/Utils/utils/isBrowser";
if (__DEV__ && isBrowser()) {
  require("./style/AlipayFunction.scss");
}

interface AlipayFunctionProps {
  paySource?: string;
  payMethod: string;
  orderType: string;
  showSlik: boolean;
}
/**
 * 支付方式模块
 */
class AlipayFunction extends React.Component<
  AlipayFunctionProps,
  { showsilk: boolean; isWechat: boolean }
> {
  constructor(props: any) {
    super(props);
    this.aliPay = this.aliPay.bind(this);
    this.state = {
      showsilk: false,
      isWechat: false,
    };
  }
  componentDidMount() {
    const { showSlik, orderType, payMethod } = this.props;
    let that = this;
    let param = {
      locationLabel: "SILK:OPEN",
      memberGroupld: 0,
    };
    Alipay.silkPayOnOff(param).then((json) => {
      console.log("json开关", json);
      let showsilk = true;
      if (
        json &&
        json.results &&
        json.results.resourceList &&
        json.results.resourceList[0].content == "1"
      ) {
        if (showSlik) {
          if (
            orderType != "2" &&
            (payMethod == "SILKPAY" ||
              payMethod == "组合支付" ||
              payMethod == "丝享卡")
          ) {
            showsilk = false;
          }
        } else {
          showsilk = false;
        }
      } else {
        showsilk = false;
      }
      that.setState({
        showsilk,
      });
    });

    let isWechat = false;
    let ua =
      typeof window != "undefined" && window.navigator.userAgent.toLowerCase();
    if (ua) {
      let isWec = ua.match(/MicroMessenger/i);
      if (isWec && isWec[0] == "micromessenger") isWechat = true;
      console.log("用微信打开的");
    }
    this.setState({ isWechat });
  }
  aliPay(e: React.MouseEvent) {
    let el = e.currentTarget.querySelector(".iconC-radio");
    document.querySelector(".iconC-radio.cur")?.classList.remove("cur");
    el?.classList.add("cur");
  }
  render() {
    let { showsilk, isWechat } = this.state;

    return (
      <div className="pay-box" ref="payContainer">
        <div className={isWechat ? "disappear" : "row"} onClick={this.aliPay}>
          <em className="iconC iconC-alipay" />
          <label>支付宝</label>
          <em
            className={isWechat ? "iconC iconC-radio" : "iconC iconC-radio cur"}
            data-value="alipay"
           />
        </div>
        <div className="row" onClick={this.aliPay}>
          <em className="iconC iconC-wechart" />
          <label>微信支付</label>
          <em
            className={isWechat ? "iconC iconC-radio cur" : "iconC iconC-radio"}
            data-value="wechat"
           />
        </div>
        {showsilk ? (
          <div className="row" onClick={this.aliPay}>
            <em className="iconC-silk" />
            <label>丝享卡</label>
            <em className="iconC iconC-radio" data-value="silk" />
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default AlipayFunction;
