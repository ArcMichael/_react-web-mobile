/*
 * @Author: leo.si
 * @Date: 2019-07-24 10:52:01
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-09-06 15:59:42
 * @function 购物车已满一键清理弹框
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { popupAlert } from "../../actions/popup";

const errorCodeData = {
  40051299: "加入购物车成功",
  40051399: "加入购物车成功",
  40052199: "购物车已满",
};
class PopupCleaning extends React.Component {
  constructor() {
    super();
    this.closePopup = this.closePopup.bind(this);
  }
  componentDidMount() { }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "PopupCleaning");
  }

  render() {
    const {
      _text,
      _className,
      _zIndex,
      _title,
      _btnWord,
      _cancel,
      _callback,
      _popTitle,
      _cancelText,
      _customTrueCallback,
      _customFalseCallback,
      _customFalseText,
      _ButtonFalse //控制所有的按钮都不显示
    } = this.props;
    const that = this;
    return (
      <div className="popupCleaning" style={{ zIndex: _zIndex }}>
        <div className="popupCleaning-con">
          {(errorCodeData[_title] || _popTitle) && (
            <p className="popupCleaning-con-title">
              {errorCodeData[_title] || _popTitle}
            </p>
          )}
          <p className="popupCleaning-con-contnet">{_text}</p>

          {_ButtonFalse !== false ? (_customTrueCallback ? (
            <div
              onClick={() => {
                _customTrueCallback();
                that.closePopup();
              }}
              className={`popupCleaning-con-btn ${_className}`}
            >
              {_btnWord}
            </div>
          ) : (
            <div
              onClick={_callback ? _callback : this.closePopup.bind(this)}
              className={`popupCleaning-con-btn ${_className}`}
            >
              {_btnWord}
            </div>
          )) : null}
          {_ButtonFalse !== false && _customFalseCallback && _customFalseText && (
            <span
              span
              className="popupCleaning-con-cancle"
              onClick={() => {
                _customFalseCallback();
                that.closePopup();
              }}
            >
              {_customFalseText}
            </span>
          )}
          {_ButtonFalse !== false && _cancel && (
            <span
              className="popupCleaning-con-cancle"
              onClick={this.closePopup.bind(this)}
            >
              取消
            </span>
          )}
          {_ButtonFalse !== false && _cancelText && (
            <span
              className="popupCleaning-con-cancle"
              onClick={this.closePopup.bind(this)}
            >
              {_cancelText}
            </span>
          )}
        </div>
      </div>
    );
  }
}

PopupCleaning.defaultProps = {
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _btnWord: "我知道了",
  _results: [],
};

PopupCleaning.propTypes = {
  _text: PropTypes.string,
  // _closeCallback: PropTypes.func,
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
})(PopupCleaning);
