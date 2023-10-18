/*
 * @Author: leo.si
 * @Date: 2019-07-11 14:54:34
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 15:05:54
 * @function toast
 */


import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { popupAlert } from "../../actions/popup";

class PopupErrorToast extends React.Component {
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
      popupAlert(0, "PopupErrorToast");
    }, totalCount);
  }

  render() {
    const { _title, _text, _className, _zIndex, _custom } = this.props;
    return (
      <div className={"popup-toast-error " + _className} style={{ zIndex: _zIndex }}>
        <p className="popup-toast-title">{_title}</p>
        <p>{_text}</p>
        {_custom ? _custom : null}
      </div>
    );
  }
}

PopupErrorToast.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
};

PopupErrorToast.propTypes = {
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
})(PopupErrorToast);
