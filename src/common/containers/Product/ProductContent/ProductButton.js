/*
 * @Author: Leo.Si
 * @Date: 2020-07-02 10:25:53
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Sa 11:38:23
 * @function PDP页面底部按钮操作(购物车,在线客服,操作按钮)
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { getProductInfo } from "@/actions/product";
import Sensor from "@/Utils/sensor";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";

class ProductButton extends Component {
  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return false;
    }
    return true;
  }
  constructor(props) {
    super(props);
    // this.state = {
    //     ifRresh: false
    // }
    this.countFun = this.countFun.bind(this);
    this.comment = this.comment.bind(this);
  }
  componentWillUpdate(nextProps) {
    if (nextProps.milliseconds !== this.props.milliseconds) {
      const { milliseconds } = nextProps;
      clearInterval(this.timer);
      milliseconds && this.countFun(milliseconds);
    }
  }
  componentDidMount() {
    const { milliseconds, _productData } = this.props;
    if (
      _productData &&
      _productData.preSaleActivity &&
      _productData.preSaleActivity.virtualInv
    ) {
      this.countFun(milliseconds);
    }
  }
  PrefixInteger(num, length = 2) {
    return (num / Math.pow(10, length)).toFixed(length).substr(2);
  }
  countFun(milliseconds) {
    let maxtime = milliseconds.milliseconds / 1000;
    let that = this;
    const { getProductInfo } = that.props;
    // this.setState({
    //     ifRresh: false
    // })
    if (maxtime >= 0) {
      let day = parseInt(maxtime / 86400) > 0 ? parseInt(maxtime / 86400) : 0;
      let remainHours = maxtime % (24 * 3600);
      let hour = Math.floor(remainHours / 3600 + day * 24);
      let remainMinutes = remainHours % 3600;
      let minute = Math.floor(remainMinutes / 60);
      let remainSecounds = remainMinutes % 60;
      let second = Math.floor(remainSecounds);
      const day_hour =
        hour - day * 24 < 10 ? "0" + (hour - day * 24) : hour - day * 24;
      // let data = `<img src='https://ssl1.sephorastatic.cn/soa/nmobile/img/product/countdown.png' />`;
      let data = ``;
      if (hour < 10) {
        hour = `0` + hour;
      }
      if (milliseconds.precision !== 1) {
        data += `${milliseconds.name}<span> ${hour}:${that.PrefixInteger(
          minute
        )}:${that.PrefixInteger(second)}</span>`;
      } else {
        data +=
          day > 0
            ? `${milliseconds.name}${day}天 ${that.PrefixInteger(
                day_hour
              )}:${that.PrefixInteger(minute)}:${that.PrefixInteger(second)}`
            : `${milliseconds.name}00天 ${that.PrefixInteger(
                day_hour
              )}:${that.PrefixInteger(minute)}:${that.PrefixInteger(second)}`;
      }
      document.getElementsByClassName("countTimes") && document.getElementsByClassName("countTimes").length &&
        (document.getElementsByClassName("countTimes")[0].innerHTML = data);
      maxtime--;
    }
    this.timer = setInterval(function () {
      if (maxtime >= 0) {
        let day = parseInt(maxtime / 86400) > 0 ? parseInt(maxtime / 86400) : 0;
        let remainHours = maxtime % (24 * 3600);
        let hour = Math.floor(remainHours / 3600 + day * 24);
        let remainMinutes = remainHours % 3600;
        let minute = Math.floor(remainMinutes / 60);
        let remainSecounds = remainMinutes % 60;
        let second = Math.floor(remainSecounds);
        const day_hour =
          hour - day * 24 < 10 ? "0" + (hour - day * 24) : hour - day * 24;
        // let data = `<img src='https://ssl1.sephorastatic.cn/soa/nmobile/img/product/countdown.png' />`;
        let data = ``;
        if (hour < 10) {
          hour = `0` + hour;
        }
        if (milliseconds.precision !== 1) {
          data += `${milliseconds.name}<span> ${hour}:${that.PrefixInteger(
            minute
          )}:${that.PrefixInteger(second)}</span>`;
        } else {
          data +=
            day > 0
              ? `${milliseconds.name}${day}天 ${that.PrefixInteger(
                  day_hour
                )}:${that.PrefixInteger(minute)}:${that.PrefixInteger(second)}`
              : `${milliseconds.name}00天 ${that.PrefixInteger(
                  day_hour
                )}:${that.PrefixInteger(minute)}:${that.PrefixInteger(second)}`;
        }
        document.getElementsByClassName("countTimes") && document.getElementsByClassName("countTimes").length &&
          (document.getElementsByClassName("countTimes")[0].innerHTML = data);
        maxtime--;
      } else {
        getProductInfo();
        clearInterval(that.timer);
      }
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  goToCart() {
    Sensor.go("PDPClick", {
      OP_code: window.location.pathname.split("/")[2].split(".")[0] || null,
      button_name: "购物车",
    });
    GoogleAnalytics.pushV2({
      event: "productDetailInteraction",
      // pdpInteractionDetail: '购物车',
      pdpInteractionType: "购物车",
    });
    window.location.href = "/cart?source=PDP";
  }

  comment() {
    const { _ifComment } = this.props;
    Sensor.go("PDPClick", {
      OP_code: window.location.pathname.split("/")[2].split(".")[0] || null,
      button_name: "评价商品",
    });
    window.location.href = `/myConsulation?productId=${_ifComment.productId}&commentType=${_ifComment.commentType}&sku=${_ifComment.skuId}&orderId=${_ifComment.orderId}`;
  }

  render() {
    const { _productData, _tabIndex, _ifComment, _callback, QCPTQ } =
      this.props;
    if (_tabIndex !== 4) {
      return (
        !!_productData && (
          <div className="product-bottom-button">
            {/* {_productData.isAttrChioce ? null : ( */}
            <a className="product-bottom-button-cart" onClick={this.goToCart}>
              {QCPTQ ? <em>{QCPTQ}</em> : null}
              <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/newCartIcon.png" />
              <div>购物车</div>
            </a>
            {/* )} */}
            {/* {_productData.isAttrChioce ? null : ( */}
            <div
              className="product-bottom-button-kefu"
              onClick={_callback.bind(this, "startCustomerService")}
            >
              <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/newOnlineServiceIcon.png" />
              <div>美容顾问</div>
            </div>
            {/* )} */}
            {_productData.buttonType &&
              _productData.buttonType.length > 0 &&
              _productData.buttonType.map((item, index) => {
                const { classname, text, fun, type, tip } = item;
                return (
                  <div
                    key={`product-bottom-button-${index}`}
                    className={classname}
                    onClick={fun}
                  >
                    <span className="product-button-text">{text}</span>
                    {type && type === "presale-addtocart" && (
                      <span className="product-bottom-button-tip">{tip}</span>
                    )}
                    {type &&
                    type === "presale-activity" &&
                    _productData.preSaleActivity &&
                    _productData.preSaleActivity.countDown ? (
                      <div className="product-bottom-button-presale-contdown">
                        <div>
                          {/* {_productData.preSaleActivity.countDown.name} */}
                          <span className="countTimes" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </div>
        )
      );
    } else if (_tabIndex === 4 && _ifComment) {
      return (
        <a className="comment-product" onClick={this.comment}>
          评价商品
        </a>
      );
    } else {
      return null;
    }
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  getProductInfo,
})(ProductButton);
