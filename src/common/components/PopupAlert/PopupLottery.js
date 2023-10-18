/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: summer
 * @Last Modified time: 2021-02-Tu 03:55:00
 */


import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { popupAlert } from "../../actions/popup";

class PopupLottery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /*
   * 自动关闭
   */
  autoClosePopup(totalCount) {
    const { popupAlert, _closeCallback } = this.props;
     setTimeout(() => {
      _closeCallback && _closeCallback();
      popupAlert(0, "PopupToast");
    }, totalCount);
  }

  componentDidMount() {
    const { _autoClose, _totalCount } = this.props;
    _autoClose && this.autoClosePopup(_totalCount);
  }

  render() {
    const {  _text } = this.props;
    return (
      <div className="popup-lottery-popup-module">
        <img
          className="popup-lottery-icon"
          src="https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/sign-disable.png"
        />
        <p>{_text}</p>
      </div>
    );
  }
}

PopupLottery.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
};

PopupLottery.propTypes = {
  _text: PropTypes.string,
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
})(PopupLottery);
