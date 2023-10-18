
/*
 *
 * Producer -- siqiang
 * Time -- 2018/8/13
 * Function -- Common module for register error warning
 *
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { popupAlert } from "../../actions/popup";

class PopupErrorWarnning extends React.Component {
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
      popupAlert(0, "PopupErrorWarnning");
    }, totalCount);
  }

  render() {
    const { _text, _className, _zIndex, popupAlert } = this.props;
    
    return (
      <div className={"_module_warning_tip " + _className} style={{ zIndex: _zIndex }}>
        <p>
          <em className="warningTip" />
          <span>
            {_text}
            <img
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/NoticeCloseIcon.png"
              onClick={popupAlert.bind(this, 0, "PopupErrorWarnning")}
            />
          </span>
        </p>
      </div>
    );
  }
}

PopupErrorWarnning.defaultProps = {
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
};

PopupErrorWarnning.propTypes = {
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
})(PopupErrorWarnning);
