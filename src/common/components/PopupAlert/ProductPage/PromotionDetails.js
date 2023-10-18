/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 11:06:49
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-24 18:04:20
 * @function 展示具体的促销信息
 */

import React from "react";
import $ from "jquery";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import Sensor from "@/Utils/sensor";
import * as Regexp from "@/lib/regexp";
import Images from "../../Images/render";
import { popupAlert } from "../../../actions/popup";
class PromotionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
    this.expendList = this.expendList.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "PromotionDetails");
    setTimeout(() => {
      let scrollTop = parseFloat($(".product-page").css("bottom"));
      bodyScrollTop.set(scrollTop);
      $(".product-page").css({ bottom: 0 });
    }, 0);
  }
  componentDidMount() {
    const { _data } = this.props;
    this.setState({
      _data,
    });
  }
  expendList(item, index) {
    const { _data } = this.state;
    if (_data && _data.promotionInfoDtos.length <= 0) {
      return;
    }
    let obj = item;
    let dataTemp = _data;
    obj.expend = !item.expend;
    dataTemp.promotionInfoDtos[index] = obj;

    this.setState({
      _data: dataTemp,
    });
  }

  showAll(item, index) {
    const { _data } = this.state;
  
    let obj = item;
    let dataTemp = _data;
    obj.allFlag = !item.allFlag;
    dataTemp.promotionInfoDtos[index] = obj;

    this.setState({
      _data: dataTemp,
    });
    Sensor.go("PDPClick", {
      OP_code: Regexp.pathnameProductId(window.location),
      button_name: "查看套装详情",
    });
  }
  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }
  render() {
    const { _data } = this.state;

    return (
      <div className="popup-mgm-popup-module revamp-z">
        <div className="popup-mgm-popup-module-content revamp-radio">
          <div className="revamp-top">
            <div className="revamp-title">活动</div>
            <div className="modal-close" onClick={this.closePopup}>
              <img
                src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupCloseIcon_black.png"
                alt=""
              />
            </div>
          </div>
          <div className="popup-promotion-details-con">
            <ul className="popup-promotion-details-con-outside">
              {_data && _data.presaleNote && (
                <li className="popup-promotion-details-tips">
                  <img className="danger-icon" src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/alert_circle.png" />
                  <div className="popup-presaleNote-desc">
                  {_data.presaleNote}
                  </div>
                </li>
              )}
              {_data &&
                _data.promotionInfoDtos &&
                _data.promotionInfoDtos.length > 0 &&
                _data.promotionInfoDtos.map((item, index) => {
                  const { name, rules, tag } = item;
                  return (
                    <li
                      className="popup-promotion-details-con-outside-li"
                      key={`popup-promotion-details-con-outside-${index}`}
                    >
                      <div className="popup-product-active-right revamp-active">
                      
                        <p
                          className="outside-p"
                          onClick={() => {
                            this.expendList(item, index);
                          }}
                        >
                          {!!tag && <span className="outside-span">{tag}</span>}
                          {name}
                        </p>
                        {rules && rules.length > 0 && (
                          <img
                            className={
                              rules &&
                              rules.length > 0 &&
                              !item.expend ?
                              "active-arrow":""
                            }
                            src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/popup-arrow.png"
                          />
                        )}

                        {rules && (
                          <ul className="popup-promotion-details-con-nextside">
                            {rules.length > 0 &&
                              rules.map((velue, key) => {
                                const { rule, gifts } = velue;
                                return (
                                  item.expend && (
                                    <li
                                      className="popup-promotion-details-con-nextside-li"
                                      key={`popup-promotion-details-con-nextside-${key}`}
                                    >
                                      <p className="nextside-p">{rule}</p>
                                      {gifts && (
                                        <ul className="popup-promotion-details-con-inside">
                                          {gifts.length > 0 &&
                                            gifts.map((data, num) => {
                                              const {
                                                defaultImage,
                                                desc,
                                                number,
                                                status,
                                              } = data;
                                             
                                              if (num>2&&!item.allFlag) {
                                                
                                                return 
                                              }
                                              return (
                                                <li
                                                  className="popup-promotion-details-con-inside-li"
                                                  key={`popup-promotion-details-con-inside-${num}`}
                                                >
                                                  <div className="no-inv-box">
                                                    {status &&
                                                      status == "NO_INV" && (
                                                        <div className="no-inv">
                                                          已赠完
                                                        </div>
                                                      )}
                                                    <Images
                                                      _src={defaultImage}
                                                      _size="150"
                                                    />
                                                  </div>
                                                  <p>{desc}</p>
                                                  <span>x{number}</span>
                                                </li>
                                                      
                                              );
                                            })}
                                        {gifts.length>3&&!item.allFlag?<li className="show-all" onClick={()=>{
                                          this.showAll(item,index)
                                        }}>展开全部</li>:null}
                                        </ul>
                                      )}
                                    </li>
                                  )
                                );
                              })}
                          
                          </ul>
                        )}
                    
                      </div>
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

PromotionDetails.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _data: [],
};

PromotionDetails.propTypes = {
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
})(PromotionDetails);