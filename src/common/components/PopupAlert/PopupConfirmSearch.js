/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: summer
 * @Last Modified time: 2021-04-Tu 03:14:04
 */


import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { popupAlert } from "../../actions/popup";

class PopupConfirmSearch extends React.Component {
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
      popupAlert(0, "PopupConfirmSearch");
    }
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }
  render() {
    const { _text, _className, _zIndex, _cancleText, _confirmText } = this.props;
    return (
      <div className="popup-confirm-search">
        <div className={"popup-search " + _className} style={{ zIndex: _zIndex }}>
          <div className="popup-confirm-search-text">{_text}</div>
          <div className="popup-confirm-button">
            <button onClick={this.closePopup} className="popup-confirm-cancle">
              {_cancleText}
            </button>
            <div className="popup-confirm-line" />
            <button onClick={this.clickSure} className="popup-confirm-confirm">
              {_confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

PopupConfirmSearch.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _cancleText: "否",
  _confirmText: "是",
};

PopupConfirmSearch.propTypes = {
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
})(PopupConfirmSearch);
