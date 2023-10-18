/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:54:04
 */


import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { popupAlert } from "../../actions/popup";

class PopupConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert, _cansoleCallback } = this.props;
    if (_cansoleCallback) {
      _cansoleCallback();
    } else {
      popupAlert(0, "PopupConfirm");
    }
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }
  render() {
    const { _text, _className, _zIndex, _title, _cancleText, _confirmText } = this.props;

    return (
      <div className="popup-confirm-popup-module">
        <div className={"popup-confirm " + _className} style={{ zIndex: _zIndex }}>
          <p className="popup-confirm-title">{_title}</p>
          {/* <span className='popup-confirm-line' /> */}
          <p className="popup-confirm-text">{_text}</p>
          <button onClick={this.closePopup} className="popup-confirm-cancle">
            {_cancleText}
          </button>
          <button onClick={this.clickSure} className="popup-confirm-confirm">
            {_confirmText}
          </button>
        </div>
      </div>
    );
  }
}

PopupConfirm.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _cancleText: "取消",
  _confirmText: "确认",
};

PopupConfirm.propTypes = {
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
})(PopupConfirm);
