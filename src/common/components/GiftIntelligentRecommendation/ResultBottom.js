import React, { Component } from "react";
import { connect } from "react-redux";
import { combAddToCart } from "../../actions/giftIntelligentRecommendation";
import * as device from "../../lib/device";
import { popupAlert } from "../../actions/popup";
import PopupAlert from "../PopupAlert/index";
import CdnImage from "../CdnImage";
import Image from "../ImagesLazyLoad/index";
import Sensor from "../../Utils/sensor";
export class ResultBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
    };
  }
  componentDidMount() {
    const { num } = this.state; // TODO: 请移除无用state
    console.log(num);
  }

  clickAddCart() {
    let { combAddToCart, giftList } = this.props;
    let channel = device.isApp()
      ? "APP"
      : device.isWeChat()
      ? "MINIPROGRAM"
      : "MOBILE";
    let arr = [];
    giftList.map((v) => {
      console.log(v);
      let obj = {
        type: 1,
        channel,
        quantity: 1,
        checked: 1,
      };

      Sensor.go("addToShoppingcart", {
        OP_code: v.spuId,
        commodity_sku: v.skuId,
        commodity_number: 1,
      });
      Sensor.go("giftSelectionClick", {
        button_name: "立即购买",
      });
      obj.skuId = v.skuId;
      arr.push(obj);
    });
    combAddToCart(arr, (callback) => {
      if (callback && callback.results && !callback.results.code) {
        if (device.isApp()) {
          window.location.href = "sephora://cart";
        } else if (device.device_inMiniProgramsEnvironment()) {
          wx.miniProgram.switchTab({
            url: `/pages/shoppingCart/index`,
          });
        } else {
          window.location.href = "/cart";
        }
      } else {
        if (
          callback &&
          callback.results &&
          callback.results.code &&
          (callback.results.code == 40051299 ||
            callback.results.code == 40051399 ||
            callback.results.code == 40052199)
        ) {
          this.props.popupAlert(1, "PopupCleaning", {
            _title: callback.results.code,
            _text: callback.results.message,
            _autoClose: true,
          });
        } else {
          this.props.popupAlert(1, "PopupAlertDefault", {
            _text: "加入购物车失败",
            _autoClose: true,
          });
        }
      }
    });
  }
  clickGift() {
    let { showList } = this.props;
    this.props.changeData(!showList);
    Sensor.go("giftSelectionClick", {
      button_name: "礼品清单",
      commodity_sku: "",
      OP_code: "",
    });
  }
  render() {
    let { showList } = this.props;
    let { giftList, limit } = this.props;
    let totalPrice = 0;
    // giftList.map(v => (totalPrice += Number(v.price)));
    let num = 0,
      giftListBox;
    num = giftList.length;
    if (num > 99) num = "99+";
    if (giftList.length > 0) {
      giftListBox = giftList.map((v, i) => {
        totalPrice += Number(v.price);
        return (
          <div className="list_li" key={`list_li_${i}`}>
            <Image src={`${v.imagePath}120x120.jpg`} alt="" />
            <div>
              <p>{v.productName}</p>
              <p>¥{v.price}</p>
            </div>
          </div>
        );
      });
    } else {
      giftListBox = (
        <div className="list_ul_no">清单中还没有礼品，快来选一些吧！</div>
      );
    }

    return (
      <div className="gift_intelligent_bottom">
        {showList && (
          <div className="gift_list">
            <div className="list_header">
              <p>礼品清单</p>
              <CdnImage
                src="/soa/nmobile/img/giftRecommend/btm_close.png"
                alt=""
                onClick={() => {
                  this.props.changeData(false);
                }}
              />
            </div>
            {limit && (
              <div className="list_limit">
                <div style={{ display: "flex" }}>
                  <p>
                    小计：<span>¥{totalPrice}</span>
                  </p>
                  {totalPrice > limit ? (
                    <p>已达到送礼额度</p>
                  ) : (
                    <p>再选 ¥{limit - totalPrice} 达到送礼额度</p>
                  )}
                </div>
                <p>额度：¥{limit}</p>
              </div>
            )}

            <div className="list_ul">{giftListBox}</div>
          </div>
        )}
        <div className="bottom_buy_btn">
          <div className="btm_left" onClick={this.clickGift.bind(this)}>
            <CdnImage
              src="/soa/nmobile/img/giftRecommend/btm_gift.png"
              alt=""
            />
            <p>礼品清单</p>
            {num > 0 && (
              <p className={`${num >= 10 ? "gift_num_long" : "gift_num"}`}>
                {num}
              </p>
            )}
          </div>
          <div className="buy_btn" onClick={this.clickAddCart.bind(this)}>
            立即购买
          </div>
        </div>
        <PopupAlert _zIndex={1001} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    giftList: state.giftIntelligent.giftList,
  };
};

const mapDispatchToProps = {
  combAddToCart,
  popupAlert,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultBottom);
