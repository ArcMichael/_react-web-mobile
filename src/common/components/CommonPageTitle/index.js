/*
 * @Author: leo.si
 * @Date: 2019-06-17 16:24:35
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-08-Th 03:43:21
 */
import React from "react";
import { connect } from "react-redux";
import ActionOnlineReference from "@/actions/onlineReference";
import isBrowser from "@/Utils/utils/isBrowser";
import { mapFuncToRun } from "../../actions/myAccount";
import BottomMenus from "../BottomMenus";
import { getQueryCartProdTotalQuantity } from "../../actions/cart";
class CommonPageTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabMore: false,
    };
    this.tabMoreToggle = this.tabMoreToggle.bind(this);
    this.onBack = this.onBack.bind(this);
  }
  componentDidMount() {
    const { _hasMore, getQueryCartProdTotalQuantity } = this.props;
    if (_hasMore) getQueryCartProdTotalQuantity({});
  }
  tabMoreToggle() {
    const { tabMore } = this.state;
    this.setState({ tabMore: !tabMore });
  }
  onBack() {
    const { _href, _callback } = this.props;
    if (_callback) {
      _callback();
    } else {
      ActionOnlineReference.RemoveSession();
      if (_href) {
        window.location.href = _href;
        return;
      }
      window.history.go(-1);
    }
  }
  render() {
    const {
      _title,
      _isBack,
      _isCustomer = false,
      _style = {},
      mapFuncToRun,
      _hasMore,
      _customRight,
      _isBackV2,
    } = this.props;
    if (
      isBrowser() &&
      navigator &&
      navigator.userAgent &&
      navigator.userAgent.match(/sephora\/app/)
    )
      return null;
    let backImgSrc = "";
    if (_isBack || _isBackV2) {
      if (_isBack) {
        backImgSrc =
          "https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shape.png";
      } else {
        backImgSrc =
          "https://ssl1.sephorastatic.cn/soa/mobile/images/top_back.png";
      }
    }
    return (
      <div className="common-page-title" style={_style}>
        <div className="common-page-title-content">
          {(_isBack || _isBackV2) && (
            <span className="common-page-title-back" onClick={this.onBack}>
              <img src={backImgSrc} />
            </span>
          )}
          <span className="common-page-title-con">{_title}</span>
          {_isCustomer ? (
            <div
              onClick={mapFuncToRun.bind(this, "startCustomerService")}
              className="common-page-title-customer"
            >
              <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/newOnlineServiceIcon.png" />
            </div>
          ) : null}
          {_hasMore ? (
            <span
              className="common-page-title-more"
              onClick={this.tabMoreToggle}
            >
              ...
            </span>
          ) : null}
          {_customRight ? (
            <span className="common-page-title-customer">{_customRight}</span>
          ) : null}
          {this.state.tabMore && (
            <div className="common-page-title-tabbar" style={{ width: "100%" }}>
              <BottomMenus disableToTop />
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  mapFuncToRun,
  getQueryCartProdTotalQuantity,
})(CommonPageTitle);
