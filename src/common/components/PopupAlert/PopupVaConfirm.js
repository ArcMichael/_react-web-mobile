/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-23 11:39:05
 */


import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { popupAlert } from "../../actions/popup";
import getConfigs from "../../../isomorphisms/getConfigs";

const configs = getConfigs();
class PopupVaConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "PopupVaConfirm");
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }

  render() {
    const { _text, _className, _zIndex, _title, _cancleText,  } = this.props;

    return (
      <div className="popup-confirm-popup-module">
        <div className={`popup_confirm_va ${_className}`} style={{ zIndex: _zIndex }}>
          <p className="popup-confirm-title">{_title}</p>
          <p className="popup-confirm-text">{_text}</p>
          <img
            className="download_va_pic"
            src={`${configs.static}/soa/nmobile/img/downloadVa.png`}
          />

          <button onClick={this.closePopup} className="popup-confirm-cancle">
            {_cancleText}
          </button>
        </div>
      </div>
    );
  }
}

PopupVaConfirm.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _cancleText: "知道了",
};

PopupVaConfirm.propTypes = {
  _text: PropTypes.string,
  _closeCallback: PropTypes.func,
};

const mapStateToPrps = (state) => {
  const { popup_component } = state;
  let POPUP_ALERT_PARAMETERS = {};
  if (popup_component) {
    POPUP_ALERT_PARAMETERS = popup_component.POPUP_ALERT_PARAMETERS;
  }
  return { ...POPUP_ALERT_PARAMETERS };
};

export default connect(mapStateToPrps, {
  popupAlert,
})(PopupVaConfirm);
