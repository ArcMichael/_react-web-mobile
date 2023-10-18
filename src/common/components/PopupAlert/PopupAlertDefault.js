/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/10
 * Function -- Common module for Popup Alert
 *
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { popupAlert } from "../../actions/popup";

class PopupAlertDefault extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUnMount: false,
    };
  }
  componentDidMount() {
    const { _autoClose, _totalCount } = this.props;
    _autoClose && this.autoClosePopup(_totalCount);
  }
  componentWillMount() {
    popupAlert(0, "PopupAlertDefault");
  }
  componentWillUnmount() {
    this.setState({ isUnMount: true });
  }
  /*
   * 自动关闭
   */
  autoClosePopup(totalCount) {
    const { popupAlert, _closeCallback, setTimer } = this.props;
    if (!this.state.isUnMount) {
      setTimer(
        setTimeout(() => {
          _closeCallback && _closeCallback();
          popupAlert(0, "PopupAlertDefault");
        }, totalCount)
      );
    }
  }
  shouldComponentUpdate(nextProps) {
    const { timer } = nextProps;
    if (nextProps._autoClose === false) {
      clearTimeout(timer);
    }
    return true;
  }

  render() {
    const { _mainText, _text, POPUP_ALERT_STATE, _ox, _className, _zIndex } =
      this.props;
    const styleObj = {
      transform: "none",
      left: 0,
      bottom: 0,
      right: 0,
      margin: "auto",
    };
    const styleObjMain = {
      transform: "none",
      left: 0,
      bottom: 0,
      right: 0,
    };
    let useLarge = false;
    if ((_text && _text.length > 10) || (_mainText && _mainText.length > 10)) {
      useLarge = true;
    }
    return POPUP_ALERT_STATE === 0 ? null : (
      <div
        className={`popup-alert ${useLarge ? "large" : ""}` + _className}
        style={{ zIndex: _zIndex }}
      >
        {/* <span className={_ox || 'warnning'} /> */}
        <img
          className="popup-alert-tip"
          src={
            _ox
              ? "https://ssl1.sephorastatic.cn/soa/mobile/images/newReset.png"
              : "https://ssl1.sephorastatic.cn/soa/mobile/images/newNoticeOpenIcon.png"
          }
        />

        <div className="popup-alert-bottom">
          {!!_mainText && (
            <em style={styleObjMain} className="popup-alert-bottom-main">
              {_mainText}
            </em>
          )}
          <em style={styleObj}>{_text}</em>
        </div>
      </div>
    );
  }
}

PopupAlertDefault.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
};

PopupAlertDefault.propTypes = {
  _text: PropTypes.string,
  _closeCallback: PropTypes.func,
  timer: PropTypes.number,
  setTimer: PropTypes.func,
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
})(PopupAlertDefault);
