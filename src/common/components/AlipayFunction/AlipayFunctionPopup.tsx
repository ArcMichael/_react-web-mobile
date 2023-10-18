import React from "react";
import Utils from "@/lib/utils";
import isBrowser from "@/Utils/utils/isBrowser";
import * as utilCookieUtil from "@/Utils/cookieUtil";
import Alipay from "@/lib/services/AlipayFunction";
import browserHistory from "@/store/browserHistory";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";
import CommonPageTitle from "../CommonPageTitle";
import AlipayFunction from "./AlipayFunction";
import { popupAlert } from "@/actions/popup";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
if (__DEV__ && isBrowser()) {
  require("./style/AlipayFunctionPopup.scss");
  require("../../../public/style/common/_common_page_title.scss");
  require("../../../public/style/default.scss");
}

declare var window: Window & { WeixinJSBridge: any };
declare var document: Document & { attachEvent?: any };

interface AlipayPopupProps {
  orderId?: string;
  paySource?: string;
  totalMount?: string;
  showSlik?: boolean;
  mergeOrDeposit?: boolean;
  isShow: boolean;
  prototalmount?: string;
  paymethod: string;
  payType: string;
  togglePopup: () => void;
}

interface AlipayPopupState {
  webPayType?: string;
  allowClick: boolean;
}

/**
 * 支付方式模块
 *  runParameter.AlipayFunctionPopup
 */
class AlipayFunctionPopup extends React.Component<
  AlipayPopupProps,
  AlipayPopupState
> {
  constructor(props: AlipayPopupProps) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
    this.paymentOnce = this.paymentOnce.bind(this);
    this.queryOrderStatus = this.queryOrderStatus.bind(this);
    this.state = {
      webPayType: "",
      allowClick: true,
    };
  }
  intervalTime: number = 0;
  interval: any = null;
  closePopup() {
    this.props.togglePopup();
  }
  onBridgeReady() {
    let { webPayType } = this.state;
    const { mergeOrDeposit } = this.props;
    let WECHAT_OPENID_WX = utilCookieUtil.GetSingleCookie(
      document.cookie,
      "WECHAT_OPENID_WX"
    );
    if (WECHAT_OPENID_WX && WECHAT_OPENID_WX.indexOf("=") === -1) {
      utilCookieUtil.SetSingleCookie2({
        key: "WECHAT_OPENID_WX",
        value: WECHAT_OPENID_WX + "=",
      });
    }
    let newOrderId = this.props.orderId;
    let openId = utilCookieUtil.GetSingleCookie(
      document.cookie,
      "WECHAT_OPENID_WX"
    );
    let paramsTwo = {
      orderId: newOrderId,
      type: webPayType,
      paymentCode: "WxPay",
      openId: openId || undefined,
    };
    Alipay.payInfo(paramsTwo).then((json) => {
      if (json && json.results) {
        let dataObj = JSON.parse(json.results.payUrl);
        let timeStamp = dataObj.timeStamp + "";
        window.WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            timeStamp: timeStamp,
            appId: dataObj.appId,
            nonceStr: dataObj.nonceStr,
            package: dataObj.package,
            signType: dataObj.signType,
            paySign: dataObj.paySign,
          },
          function (res: any) {
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              let href = "/orderPaymentSuccess?orderId=" + newOrderId;
              if (mergeOrDeposit) {
                // 合并订单或者定金订单
                href = href + "&mergeOrDeposit=true";
              }
              window.location.href = href;
            } else {
              alert("支付失败,请重新支付!");
            }
          }
        );
      }
    });
  }
  paymentOnce() {
    const { popupAlert } = this.props;
    let that = this;
    let orderId = this.props.orderId;
    let payWayDom = document.querySelector(
      ".pay-method-popup .iconC-radio.cur"
    );
    let payWay = "";
    if (payWayDom) {
      payWay = payWayDom.getAttribute("data-value") || "";
    }
    let type = "1";
    let paymentCode = "AliPay";
    let para = window.location.search;
    this.setState({
      allowClick: true,
    });
    let openId = utilCookieUtil.GetSingleCookie(
      document.cookie,
      "WECHAT_OPENID_WX"
    );
    try {
      if (para.split("?").length > 1) {
        let stringSearch = para.split("?")[1];
        if (
          stringSearch.indexOf("u") != -1 &&
          stringSearch.split("u").length > 1
        ) {
          utilCookieUtil.SetSingleCookie2({
            key: "WECHAT_OPENID_WX",
            value: browserHistory.getCurrentLocation().query.u,
          });
        } else {
        }
      }
    } catch (e) {
      para = "";
    }
    if (orderId) {
      para = orderId;
    } else {
      try {
        if (para.split("?").length > 1) {
          para =
            para.split("?")[1].split("=").length > 1
              ? para.split("?")[1].split("=")[1]
              : "";
        }
      } catch (e) {
        para = "";
      }
    }
    if (payWay) {
      if (payWay === "alipay") {
        type = "2";
        paymentCode = "AliPay";
        let params = {
          orderId: para,
          type: type,
          paymentCode: paymentCode,
          openId: openId || undefined,
        };
        Alipay.payInfo(params).then((json) => {
          if (json && json.results && json.results.payUrl) {
            //关闭支付弹层
            that.props.togglePopup();
            //跳转支付平台
            let nextUurl = json.results ? json.results.payUrl : "";
            if (payWay === "alipay") {
              // $("body").append(nextUurl);
              var fragment = document.createDocumentFragment();
              let tempDiv = document.createElement("div");
              let nodes = null;
              nodes = tempDiv.childNodes;
              tempDiv.innerHTML = nextUurl;
              for (var i = 0, length = nodes.length; i < length; i += 1) {
                fragment.appendChild(nodes[i].cloneNode(true));
              }
              let hasScript = fragment.querySelectorAll("script");
              document.getElementsByTagName("body")[0].appendChild(fragment);
              if (hasScript) {
                for (let i = 0; i <= hasScript.length - 1; i++) {
                  eval(hasScript[i].innerText);
                }
              }
            }
            that.intervalTime = 2000;
            that.interval = setInterval(function () {
              that.queryOrderStatus(para);
            }, that.intervalTime);
          } else {
              popupAlert(1, "PopupAlertDefault", {
                _text: json.errorMessage,
                _autoClose: true,
              })
          }
        });
      } else if (payWay === "wechat") {
        let ua = window.navigator.userAgent.toLowerCase();
        let matchResult = ua.match(/MicroMessenger/i);
        if (matchResult && matchResult[0] === "micromessenger") {
          type = "1";
          paymentCode = "WxPay";
          that.setState({ webPayType: "1" }, () => {
            if (
              utilCookieUtil.GetSingleCookie(
                document.cookie,
                "WECHAT_OPENID_WX"
              )
            ) {
              let params = {
                orderId: para,
                type: type,
                paymentCode: paymentCode,
                openId: openId || undefined,
              };
              Alipay.payInfo(params).then((json) => {
                if (json && json.results) {
                  //that.abort = { abort: function() {} };
                  //关闭支付弹层
                  that.props.togglePopup();
                  //跳转支付平台
                  let nextUurl = json.results ? json.results.payUrl : "";
                  if (payWay === "wechat") {
                    if (type === "1") {
                      if (typeof window.WeixinJSBridge === "undefined") {
                        if (document.addEventListener) {
                          document.addEventListener(
                            "WeixinJSBridgeReady",
                            that.onBridgeReady,
                            false
                          );
                        } else if (document.attachEvent) {
                          document.attachEvent(
                            "WeixinJSBridgeReady",
                            that.onBridgeReady
                          );
                          document.attachEvent(
                            "onWeixinJSBridgeReady",
                            that.onBridgeReady
                          );
                        }
                      } else {
                        that.onBridgeReady();
                      }
                    } else {
                      window.location.href = nextUurl;
                    }
                  }
                  that.intervalTime = 2000;
                  that.interval = setInterval(function () {
                    that.queryOrderStatus(para);
                  }, that.intervalTime);
                }else{
                  popupAlert(1, "PopupAlertDefault", {
                    _text: json.errorMessage,
                    _autoClose: true,
                  })
                }
              });
            } else {
              // $.cookie("isAutoCallPay", "0"); //将自动调起支付设置为true
              utilCookieUtil.SetSingleCookie2({
                key: "isAutoCallPay",
                value: "0",
              });
              let envValue = Utils.getEnv("restfulEnv") || "";
              let locationHref =
                "https://wx.sephora.cn/index.php?g=CustomWap&m=Shop&a=get_user&token=ulstbc1414854920&url=";
              if (envValue === "stage") {
                locationHref =
                  "https://wxsit.sephora.cn/index.php?g=CustomWap&m=Shop&a=get_user&token=ulstbc1414854920&url=";
              }
              window.location.href =
                locationHref +
                encodeURIComponent(
                  window.location.origin +
                    "/order-" +
                    para +
                    ".html?payWay=" +
                    payWay +
                    "&type=" +
                    type
                );
            }
          });
        } else {
          type = "2";
          that.setState({ webPayType: "2" });
          paymentCode = "WxPay";
          let params = {
            orderId: para,
            type: type,
            paymentCode: paymentCode,
            openId: openId || undefined,
          };
          Alipay.payInfo(params).then((json) => {
            if (json && json.results && json.results.payUrl) {
              //关闭支付弹层
              that.props.togglePopup();
              //跳转支付平台
              let nextUurl = json.results ? json.results.payUrl : "";
              if (payWay === "wechat") {
                window.location.href = nextUurl;
              }
              that.intervalTime = 2000;
              that.interval = setInterval(function () {
                that.queryOrderStatus(para);
              }, that.intervalTime);
            }else{
              popupAlert(1, "PopupAlertDefault", {
                _text: json.errorMessage,
                _autoClose: true,
              })
            }
          });
        }
      } else if (payWay === "silk") {
        window.location.href =
          "/phoneVerification/?orderId=" + that.props.orderId;
      }
      //GA代码
      let totalMount = this.props.totalMount || "";
      let payMethod = "支付宝";
      if (paymentCode === "WxPay") {
        payMethod = "微信支付";
      } else if (paymentCode === "silk") {
        payMethod = "丝享卡";
      }
      // let eventDataLayer={
      // 'event': 'shoppingCartAction',
      // 'eventName': '去支付',
      // 'orderRevenue': totalMount, //传入订单支付价
      // 'orderID': para, //传入支付订单号
      // 'paymentType':payMethod  //传入在线支付方式（支付宝 / 微信支付）
      // };
      // pushEventTagManager('shoppingCartAction',eventDataLayer)
      GoogleAnalytics.push({
        event: "shoppingCartAction",
        eventName: "去支付",
        orderRevenue: totalMount, //传入订单支付价
        orderID: para, //传入支付订单号
        paymentType: payMethod, //传入在线支付方式（支付宝 / 微信支付）
      });
    }
  }

  //查询订单状态
  queryOrderStatus(params: string) {
    Alipay.queryOrderStatus(params).then((callback) => {
      if (callback && callback.results && !callback.results.code) {
        let popupMessageBox = document.getElementById("popupMessage");
        if (popupMessageBox) {
          document
            .getElementsByTagName("body")[0]
            .append(
              `<div id="popupMessage"><div class="bg"></div><div class="container"><label></label><a id="closePopup">确定</a></div></div>`
            );
        }
        let closePopupBox = document.getElementById("closePopup");
        if (closePopupBox) {
          closePopupBox.click = function () {
            let newPopupMessageBox = document.getElementById("popupMessage");
            if (newPopupMessageBox) {
              newPopupMessageBox.style.display = "none";
            }
          };
        }
        let orderStatue = "";
        if (callback.results === "M") {
          orderStatue = "待支付";
        } else if (callback.results === "A") {
          orderStatue = "等待处理";
        } else if (callback.results === "I") {
          orderStatue = "正在处理";
        } else if (callback.results === "S") {
          orderStatue = "配送途中";
        } else if (callback.results === "Y") {
          orderStatue = "订单取消";
        } else if (callback.results === "X") {
          orderStatue = "订单取消";
        } else if (callback.results === "D") {
          orderStatue = "送货成功";
        } else if (callback.results === "O") {
          orderStatue = "送货失败";
        } else if (callback.results === "C") {
          orderStatue = "支付成功";
        }
        if (callback.results != "C") {
          this.intervalTime = this.intervalTime + 2000;
          if (this.intervalTime > 60000) {
            clearInterval(this.interval);
          }
          return;
        }
        let popupMessageBox3 = document.getElementById("popupMessage");
        let labelBox = document.querySelector("#popupMessage>label");
        if (popupMessageBox3) {
          popupMessageBox3.style.display = "block";
          if (labelBox) {
            labelBox.innerHTML = orderStatue;
          }
        }
        clearInterval(this.interval);
      }
    });
  }

  render() {
    let { allowClick } = this.state;
    let {
      paySource,
      showSlik = true,
      isShow,
      prototalmount,
      paymethod,
      payType,
    } = this.props;
    let totalMount = this.props.totalMount || "";
    if (prototalmount) {
      totalMount = prototalmount;
    }
    return (
      <div
        className={"pay-method-popup " + (isShow ? "cur" : "")}
        ref="alipayPopup"
      >
        <CommonPageTitle
          _title="选择支付方式"
          _isBackV2
          _callback={this.closePopup}
        />
        <AlipayFunction
          paySource={paySource}
          payMethod={paymethod}
          orderType={payType}
          showSlik={showSlik}
        />
        <div className="pay-method-bottom">
          <em className="pay-label">需支付：</em>
          <em className="price commonFontPrice">{"¥" + totalMount}</em>
          <a
            className="btn-pay"
            onClick={this.paymentOnce}
            style={{ backgroundColor: allowClick ? "#EE0000" : "#999999" }}
          >
            立即支付
          </a>
        </div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    popupAlert: bindActionCreators(popupAlert, dispatch),
  })
)(AlipayFunctionPopup);
