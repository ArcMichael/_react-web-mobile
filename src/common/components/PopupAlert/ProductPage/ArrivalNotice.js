/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 11:06:49
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:49:03
 * @function 到货通知的提示以及操作
 */

import React from "react";
import $ from "jquery";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import { popupAlert } from "../../../actions/popup";

class ArrivalNotice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      email: "",
    };
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
  }

  componentDidMount() {
    const {
      _data: { data, msg },
    } = this.props;

    this.setState({
      phone: data.phone,
      email: data.email,
      phoneMSG: msg && msg.phoneMSG,
      emailMSG: msg && msg.emailMSG,
    });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      _data: { data, msg },
    } = nextProps;
    this.setState({
      phone: data.phone,
      email: data.email,
      phoneMSG: msg && msg.phoneMSG,
      emailMSG: msg && msg.emailMSG,
    });
  }
  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "ArrivalNotice");
    this.setState({
      phone: "",
      email: "",
      phoneMSG: "",
      emailMSG: "",
    });
    setTimeout(() => {
      let scrollTop = parseFloat($(".product-page").css("bottom"));
      bodyScrollTop.set(scrollTop);
      $(".product-page").css({ bottom: 0 });
    }, 0);
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback &&
      _closeCallback({
        phone: this.state.phone,
        email: this.state.email,
      });
  }
  change(val, e) {
    this.setState({
      [val]: e.target.value,
      [val + "MSG"]: "",
    });
  }
  render() {
    const { _zIndex } = this.props;
    return (
      <div className="popup-mgm-popup-module" style={{ zIndex: _zIndex }}>
        <div className="popup-mgm-popup-module-arrival-notice">
          <div className="popup-mgm-popup-module-arrival-notice-title">
            到货通知
          </div>
          <input
            className={`arrival-notice-input ${
              this.state.phone ? "" : "noVal"
            }`}
            value={this.state.phone || ""}
            placeholder="手机号码"
            maxLength="11"
            onChange={this.change.bind(this, "phone")}
          />
          <p style={{ visibility: this.state.phoneMSG ? "visible" : "hidden" }}>
            <em />
            {this.state.phoneMSG}
          </p>
          <input
            className={`arrival-notice-input ${
              this.state.email ? "" : "noVal"
            }`}
            value={this.state.email || ""}
            placeholder="邮箱地址"
            onChange={this.change.bind(this, "email")}
          />
          <p style={{ visibility: this.state.emailMSG ? "visible" : "hidden" }}>
            <em />
            {this.state.emailMSG}
          </p>
          <div
            className={`arrival-notice-sure ${
              this.state.email || this.state.phone ? "" : "noVal"
            }`}
            onClick={this.clickSure}
          >
            确定
          </div>
          <div className="arrival-notice-cancle" onClick={this.closePopup}>
            取消
          </div>
        </div>
      </div>
    );
  }
}

ArrivalNotice.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 203,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _data: "",
};

ArrivalNotice.propTypes = {
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
})(ArrivalNotice);
