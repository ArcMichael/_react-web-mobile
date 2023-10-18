/**
 * Created by summer
 * 香水定制第三步
 */

import React from "react";
import { connect } from "react-redux";
import {
  showLipPerfumePage,
  combAddToCart,
  getMiuMiuStepTwoDetail,
  getMiuMiuDetail,
} from "../../actions/PerfumesDetailsPage";
import FilterPerfumeHeader from "./FilterPerfumeHeader";
import * as regexp from "../../lib/regexp";
import { GetSingleCookie } from "../../lib/Tools";
import * as device from "../../lib/device";
import { popupAlert } from "../../actions/popup";
import PopupAlert from "../PopupAlert";
import ComponentPdpSpecialTop from "./PdpSpecialTop";
import CdnImage from "../CdnImage";
class FilterPerfumeStickFour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  clickEdit() {
    let currentsearch = window.location.search;
    let spuId = regexp.searchProductId(window.location);
    if (currentsearch) {
      // if (step.test(currentsearch)) {
      //   history.replaceState(`&step=${"one"}`, "", currentsearch.replace(condition, "step=" + "one"));
      // } else {
      //   history.replaceState(`&step=${"one"}`, "", currentsearch + "&step=" + "one");
      // }
      window.history.replaceState(
        "",
        "",
        `/v2/html/filterPerfumeStick?productId=${spuId}&step=one&odorsku=&lidsku=&bodysku=`,
      );
    } else {
      history.replaceState(`&step=${"one"}`, "", "&step=" + "one");
    }
    this.props.getMiuMiuDetail(spuId);
    this.props.showLipPerfumePage("one");
  }
  clickAddCart() {
    let { combAddToCart, getMiuMiuStepTwoDetail } = this.props;
    let spuId = regexp.searchProductId(window.location),
      odorsku = regexp.searchOdorSku(window.location),
      lidsku = regexp.searchLidSku(window.location),
      bodysku = regexp.searchBodySku(window.location);
    if (GetSingleCookie(document.cookie, "Token")) {
      let arr = [],
        odorStatus = false,
        lidStatus = false,
        bodyStatus = false;
      arr.push({
        type: 1,
        channel: device.isApp() ? "APP" : "MOBILE",
        quantity: 1,
        checked: 1,
        skuId: odorsku,
      });
      arr.push({
        type: 1,
        channel: device.isApp() ? "APP" : "MOBILE",
        quantity: 1,
        checked: 1,
        skuId: lidsku,
      });
      arr.push({
        type: 1,
        channel: device.isApp() ? "APP" : "MOBILE",
        quantity: 1,
        checked: 1,
        skuId: bodysku,
      });
      getMiuMiuStepTwoDetail(spuId, odorsku, (res) => {
        if (res.hasInv) odorStatus = true;
        res.partOneDtos.map((v) => {
          if (v.skuId == lidsku) {
            if (v.hasInv) lidStatus = true;
          }
        });
        res.partTwoDtos.map((v) => {
          if (v.skuId == bodysku) {
            if (v.hasInv) bodyStatus = true;
          }
        });
        if (odorStatus && lidStatus && bodyStatus) {
          combAddToCart(arr, (callback) => {
            if (callback && callback.results && !callback.results.code) {
              if (device.isApp()) {
                window.location.href = "sephora://cart";
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
        } else {
          this.props.popupAlert(1, "PopupAlertDefault", {
            _text: "当前组合中有已售完的商品，请重新选择。",
            _autoClose: true,
          });
        }
      });
    } else {
      // 登录
      if (device.isApp()) {
        window.location.href =
          `${window.location.origin}/login?historyLocation=` +
          encodeURIComponent(window.location.href);
      } else {
        window.location.href = `/login?historyLocation=${encodeURIComponent(
          window.location.pathname.replace("/", "").replace("?", "&"),
        )}${window.location.search.replace("?", "&")}`;
      }
    }
  }
  render() {
    let showWhichPage = this.props.pdpFilterPage;
    let PdpFilterComb = this.props.PdpFilterComb;
    let renderData = this.props.PDP_IS_OPEN_FILTER_ORIGIN;
    return (
      <div
        className={
          showWhichPage && showWhichPage == "four"
            ? "filterPerfumeStick-container-four"
            : "disappear"
        }
        style={{ background: PdpFilterComb && PdpFilterComb.bColorCode }}
      >
        <ComponentPdpSpecialTop
          key="ComponentPdpSpecialTop"
          _changeStyle="filter-color-title"
          _keyWordStyle="_keyWordStyle"
        />
        <FilterPerfumeHeader _data={renderData && renderData} />
        <div
          style={{
            backgroundImage: `url(${PdpFilterComb && PdpFilterComb.bImage})`,
            backgroundSize: "cover",
          }}
          className="comb-box"
        >
          <img className="mainSkuImage" src={PdpFilterComb && PdpFilterComb.mainSkuImage} />
          <img className="combImage" src={PdpFilterComb && PdpFilterComb.combImage} />
        </div>
        <div className="filterPerfumeStick-final-info">
          <p className="final-name">{PdpFilterComb && PdpFilterComb.spuName}</p>
          <p className="final-odor">
            {PdpFilterComb && PdpFilterComb.onePartSkuName} x{" "}
            {PdpFilterComb && PdpFilterComb.twoPartSkuName}
          </p>
          <button className="edit-btn" onClick={this.clickEdit.bind(this)}>
            修改组合 <CdnImage src="/soa/nmobile/img/miumiu/arrow_black.png" />
          </button>
          <p className="final-price">组合价：¥{PdpFilterComb && PdpFilterComb.offerPrice}</p>
          <button className="add-btn" onClick={this.clickAddCart.bind(this)}>
            加入购物车
          </button>
        </div>
        <PopupAlert />
      </div>
    );
  }
}

const mapStateToProps = (s) => {
  const { product } = s;
  const { pdpFilterPage, PdpFilterComb, PDP_IS_OPEN_FILTER_ORIGIN } = product;
  return {
    pdpFilterPage,
    PdpFilterComb,
    PDP_IS_OPEN_FILTER_ORIGIN,
  };
};

export default connect(mapStateToProps, {
  showLipPerfumePage,
  combAddToCart,
  popupAlert,
  getMiuMiuStepTwoDetail,
  getMiuMiuDetail,
})(FilterPerfumeStickFour);
