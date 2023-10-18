/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: summer
 * @Last Modified time: 2021-02-Tu 03:55:00
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "../AtomsInput/Button";
import { popupAlert } from "../../actions/popup";

class PopupMgm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnStatus: 0, //按钮默认的初始状态,
      selectGift: "",
      selectSkuCode: [], //选中的skucode
      errPopup: false,
    };
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "PopupMgm");
  }

  clickSure() {
    const { _closeCallback, _data } = this.props;
    const { selectSkuCode } = this.state;
    if (_data && _data.receiveCount > 1) {
      let skuCodes = [];
      _data.results.map((v) => {
        if (v.checked) {
          skuCodes.push(v.skuCode);
        }
      });
      _closeCallback && _closeCallback(skuCodes.toString());
    } else {
      _closeCallback && _closeCallback(selectSkuCode.toString());
    }
  }
  // 点击产品前面的按钮
  choiceGift(index, status, skuCode) {
    const { _data } = this.props;
    if (status && status != "has_inv") return;
    //多选
    if (_data.receiveCount > 1) {
      let checked = [];
      _data.results.filter((v) => {
        if (v.checked) {
          checked.push(v.skuCode);
        }
      });
      if (
        checked.length <
        Number(_data.receiveCount) - Number(_data.userReceivedCount)
      ) {
        _data.results[index].checked = !_data.results[index].checked;
        this.setState({
          btnStatus: 1,
          selectSkuCode: checked,
          errPopup: false,
        });
        if (!_data.results[index].checked && checked.length == 1) {
          this.setState({
            btnStatus: 0,
          });
        }
      } else {
        if (_data.results[index].checked) {
          _data.results[index].checked = false;
          this.setState({ selectSkuCode: checked });
          if (checked.length == 1) {
            this.setState({ btnStatus: 0 });
          }
        } else {
          this.setState({
            errPopup: true,
            selectSkuCode: checked,
          });
          setTimeout(() => {
            this.setState({
              errPopup: false,
            });
          }, 2000);
        }
      }
    } else {
      this.setState({
        selectGift: index + 1,
        btnStatus: 1,
        selectSkuCode: skuCode,
      });
    }
  }
  render() {
    const { _data, _imglist } = this.props;
    const { btnStatus, selectGift, errPopup } = this.state;
    return (
      <div className="popup-mgm-popup-module">
        <div className="popup-mgm-popup-module-content">
          <div className="popup-mgm-title">
            <p>礼赠选择</p>
            <img
              src="https://ssl1.sephorastatic.cn/soa/mobile/images/common_searchtop_delete.png"
              onClick={this.closePopup}
            />
          </div>
          <div className="popup-mgm-tip">
            <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm/gift.png" />
            <span>
              {_data.userReceivedCount ? "还可领取" : "可获得"}
              {Number(_data.receiveCount - _data.userReceivedCount)}
              件礼赠，请选择并加入购物车
            </span>
          </div>
          <ul className="popup-mgm-product">
            {_data &&
              _data.results.length > 0 &&
              _data.results.map((item, index) => {
                const {
                  imagePath,
                  skuName,
                  number,
                  status,
                  brandName,
                  skuCode,
                  checked,
                } = item;
                // status："has_inv有库存， none：领完 received:已领取"
                let imgStyle, imgSrc, imgDiv;
                if (status && status == "has_inv") {
                  imgStyle = "button_default";
                  imgSrc = _imglist.default_checkbox;
                } else if (status && status == "none") {
                  imgStyle = "button_invalid";
                  imgSrc = _imglist.invalid;
                } else if (status && status == "received") {
                  imgStyle = "button_disabled";
                  imgSrc = _imglist.selected_checkbox;
                }
                if (checked) {
                  imgSrc = _imglist.selected_checkbox;
                }
                if (selectGift) {
                  imgDiv = (
                    <img
                      className={
                        status && status == "has_inv"
                          ? "button_default"
                          : "button_invalid"
                      }
                      src={
                        status && status == "has_inv"
                          ? selectGift && selectGift == index + 1
                            ? _imglist.selected_checkbox
                            : _imglist.default_checkbox
                          : _imglist.invalid
                      }
                      onClick={this.choiceGift.bind(
                        this,
                        index,
                        status,
                        skuCode
                      )}
                    />
                  );
                } else {
                  imgDiv = (
                    <img
                      className={imgStyle}
                      src={imgSrc}
                      onClick={this.choiceGift.bind(
                        this,
                        index,
                        status,
                        skuCode
                      )}
                    />
                  );
                }
                return (
                  <li key={`popup-mgm-product-${index}`}>
                    {imgDiv}
                    <div className="popup-mgm-products">
                      <img
                        className="popup-mgm-products-img"
                        src={
                          (imagePath && imagePath + "180x180.jpg") ||
                          _imglist.defaultpic
                        }
                      />
                      <p
                        className={`popup-mgm-products-details ${
                          status && status == "has_inv"
                            ? ""
                            : "popup-mgm-products-details-invalid"
                        }`}
                      >
                        <span>{brandName}</span>
                        <span>{skuName}</span>
                      </p>
                      <span className="popup-mgm-products-number">
                        {number + "  件"}
                      </span>
                      {status && status == "has_inv" ? null : (
                        <div className="popup-mgm-products-invalid">
                          <img src={_imglist.invalidTip} />
                          <span>
                            {status && status == "received"
                              ? "已领取"
                              : "已赠完"}
                          </span>
                        </div>
                      )}
                      {status && status == "has_inv" ? null : (
                        <div className="popup-mgm-products-smectite" />
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
          <Button
            _text="加入购物车"
            _status={btnStatus}
            _className="popup-mgm-button"
            _height="110"
            _clickCallback={this.clickSure}
          />
        </div>
        {errPopup ? (
          <div className={"popup-toast "}>
            <p>可选赠品已达上限，请先取消选择</p>
          </div>
        ) : null}
      </div>
    );
  }
}

PopupMgm.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _data: [],
  _imglist: {
    default:
      "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/rb_circle.png",
    selected:
      "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/rb_circle_selected.png",
    selected_checkbox:
      "https://ssl1.sephorastatic.cn/soa/nmobile/img/rb_checkbox_selected.png",
    default_checkbox:
      "https://ssl1.sephorastatic.cn/soa/nmobile/img/rb_checkbox.png",
    invalid: "https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm/fail.png",
    defaultpic:
      "https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm/defaultpic.png",
    invalidTip: "https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm/caution.png",
  },
};

PopupMgm.propTypes = {
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
})(PopupMgm);
