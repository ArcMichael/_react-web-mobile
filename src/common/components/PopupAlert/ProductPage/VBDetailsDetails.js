/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 11:06:49
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-25 18:14:04
 * @function 展示PDP页面套装详情信息
 */

import React from "react";
import $ from "jquery";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import LazyloadImage from "@/components/LazyloadImage";
import { popupAlert } from "../../../actions/popup";

class VBDetailsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "VBDetailsDetails");
    setTimeout(() => {
      let scrollTop = parseFloat($(".product-page").css("bottom"));
      bodyScrollTop.set(scrollTop);
      $(".product-page").css({ bottom: 0 });
    }, 0);
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }
  componentDidMount() {
    // 赠品高度取最高高度
    let giftItems = $(".gift-list-item");
    let giftLength = [];
    if (giftItems.length) {
      for (let i = 0; i < giftItems.length; i++) {
        giftLength.push(giftItems[i].offsetHeight);
      }
    }
    if (giftLength.length) {
      let maxHeight = Math.max.apply(null, giftLength);
      giftItems.css({ height: maxHeight });
    }
  }
  render() {
    const { _data } = this.props;
    console.log(_data);
    return (
      <div className="popup-mgm-popup-module revamp-z">
        <div className={`popup-mgm-popup-module-content plural revamp-radio`}>
          <div className="revamp-top">
            <div className="revamp-title">套装详情</div>
            <div className="modal-close" onClick={this.closePopup}>
              <img
                src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupCloseIcon_black.png"
                alt=""
              />
            </div>
          </div>
          <div className="revamp-con">
            { _data.mainSkus &&
                _data.mainSkus.length > 0 &&<div className="title-desc">主品</div>}
            <ul>
              {_data.mainSkus &&
                _data.mainSkus.length > 0 &&
                _data.mainSkus.map((item, index) => {
                  return (
                    <li>
                      <a
                        href={`/product/${item.productId}.html?sku=${item.skuId}`}
                        key={`vb-details-main-product-main-${index}`}
                      >
                        <div className="vb-li-left">
                          <LazyloadImage
                            imgProps={{
                              src: item.image + "150x150.jpg",
                            }}
                          />
                        </div>
                        <div className="vb-li-right">
                          <div className="vb-li-title">
                            {item && item.brandNameEN}{item&&item.name}{item.spec}
                          </div>
                          <div className="vb-li-bottom">
                          {!!item &&<div className="vb-li-price">￥{ item.price}</div>}
                            <div className="vb-li-num">x{item&&item.number}</div>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
            </ul>
            { _data.gifts &&
                _data.gifts.length > 0 &&<div className="title-desc">赠品</div> }
            <ul>
            {_data.gifts &&
                _data.gifts.length > 0 &&
                _data.gifts.map((item, index) => {
                  return (
                    <li>
                      <a
                        // href={`/product/${item.productId}.html?sku=${item.skuId}`}
                        key={`vb-details-main-product-main-${index}`}
                      >
                        <div className="vb-li-left">
                          <LazyloadImage
                            imgProps={{
                              src: item.defaultImage,
                            }}
                          />
                        </div>
                        <div className="vb-li-right">
                          <div className="vb-li-title">
                            {item && item.brandNameEN}{item&&item.name}{item.spec}
                          </div>
                          <div className="vb-li-bottom">
                          {item &&<div className="vb-li-price" />}
                            <div className="vb-li-num">x{item&&item.number}</div>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
       
        </div>
      </div>
    );
  }
}

VBDetailsDetails.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _data: [],
};

VBDetailsDetails.propTypes = {
  _closeCallback: PropTypes.func,
};

const mapStateToPrps = (state) => {
  const { popup_component } = state;
  let POPUP_ALERT_PARAMETERS = {};
  if (popup_component) {
    POPUP_ALERT_PARAMETERS = popup_component.POPUP_ALERT_PARAMETERS;
  }
  return Object.assign({}, POPUP_ALERT_PARAMETERS);
};

export default connect(mapStateToPrps, {
  popupAlert,
})(VBDetailsDetails);
