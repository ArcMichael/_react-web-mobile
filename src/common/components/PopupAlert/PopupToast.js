/*
 * @Author: leo.si
 * @Date: 2019-07-11 14:54:34
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-10-08 17:33:52
 * @function toast
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { popupAlert } from "../../actions/popup";

class PopupToast extends React.Component {
  componentDidMount() {
    const { _autoClose, _totalCount } = this.props;
    _autoClose && this.autoClosePopup(_totalCount);
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

  render() {
    const { _text, _className, _zIndex, _custom } = this.props;
    let useLarge = false;
    if (_text && _text.length > 10) {
      useLarge = true;
    }
    return (
      <div
        className={`popup-toast ${useLarge ? "large" : ""}` + _className}
        style={{ zIndex: _zIndex }}
      >
        <p>{_text}</p>
        {_custom ? _custom : null}
      </div>
    );
  }
}

PopupToast.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
};

PopupToast.propTypes = {
  _text: PropTypes.string,
  _closeCallback: PropTypes.func,
  // timer: PropTypes.number,
  // setTimer: PropTypes.func,
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
})(PopupToast);
