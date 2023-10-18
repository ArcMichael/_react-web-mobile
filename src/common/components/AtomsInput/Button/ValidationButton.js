/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/10
 * Function -- Component countdown button
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { sendPhoneCode } from "../../../actions/login";
import { popupAlert } from "../../../actions/popup";

/**
 * 本组件props.
 * @param {String} _className 传入的_className
 * @param {String} _width 按钮宽度
 * @param {String} _height 按钮高度
 * @param {String} _text 按钮内容
 * @param {Number} _status 0:默认状态置灰，不支持点击; 1:激活状态，表示校验成功，可以点击（在倒计时时不支持点击）
 * @param {Boolean} _disabled 按钮禁用
 * @param {Number} _totalCount 倒计时总数
 * @param {Boolean} _sendDirect 是否直接用内置接口，发送验证码，默认调用，参数module为1005
 * @param {Number} _module 调用的发送验证码接口模块
 * @param {String} _soruce 在发送短信验证码成功后，开始倒计时
 */

const DEFAULTPROPS = {
  _className: "",
  _width: 634,
  _height: "auto",
  _text: "获取验证码",
  _status: 0,
  _disabled: false,
  _totalCount: 60,
  _sendDirect: true,
  _module: 1005,
};

const PROPTYPES = {
  _text: PropTypes.string,
  _clickCallback: PropTypes.func,
  _status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const errorCode = require("./errorCode.json");
class ValidationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countDown: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.setCountDown = this.setCountDown.bind(this);
    this.stopCountDown = this.stopCountDown.bind(this);
  }
  /*
   * 按钮点击事件
   * 1._sendDirect默认为true，直接请求发送验证码接口
   * 2.若_sendDirect设置为false，则调用_clickCallback
   * 3._clickCallback中可以拿到强行停止倒计时的方法stopCountDown
   */
  handleClick() {
    const { _status, _clickCallback, _totalCount, _sendDirect, _soruce } = this.props;
    let { countDown } = this.state;
    if (countDown === 0 && _status) {
      if (_sendDirect) {
        this.netPostPhoneMessage();
      } else {
        if (_soruce && _soruce == "spc") {
          _clickCallback && _clickCallback(this.stopCountDown, this.setCountDown);
        } else {
          this.setCountDown(_totalCount);
          _clickCallback && _clickCallback(this.stopCountDown);
        }
      }
    }
  }

  // 设置倒计时
  setCountDown(totalCount = 60) {
    let countDown = totalCount;
    this.timer = setInterval(() => {
      this.setState(
        {
          countDown: --countDown,
        },
        () => {
          countDown === 0 && clearInterval(this.timer);
        },
      );
    }, 1000);
  }

  // 强行终止倒计时
  stopCountDown() {
    clearInterval(this.timer);
    this.setState({ countDown: 0 });
  }

  // 发送短信验证码接口
  netPostPhoneMessage() {
    if (this.ajaxCount) return;
    const { _mobile, _module, _totalCount, sendPhoneCode, popupAlert } = this.props;
    const params = {
      mobile: _mobile,
      module: _module,
    };
    this.setCountDown(_totalCount);
    this.ajaxCount = 1;
    sendPhoneCode(params, (json) => {
      this.ajaxCount = 0;
      const status = json.status;
      let code = json.results.code;
      if (status === 1) {
        code = 3000;
      }
      if (code) {
        popupAlert(1, "PopupAlertDefault", {
          _text: errorCode[code],
          _autoClose: true,
        });
      }
    });
  }

  // componentDidMount(){
  //   const { loginId } = this.props;
  //   if(loginId){
  //     this.handleClick();
  //   }
  // }

  render() {
    const { _className, _text, _status, _disabled } = this.props;
    const { countDown } = this.state;
    let text = _text;

    let className = "";
    if (countDown > 0) {
      text = countDown + "秒后重新获取";
    } else {
      if (_status === 1) {
        className = "active";
      }
    }

    return (
      <button
        disabled={_disabled}
        className={className + " button-validation " + _className}
        onClick={() => this.handleClick()}
      >
        {text}
      </button>
    );
  }
}

ValidationButton.defaultProps = DEFAULTPROPS;
ValidationButton.propTypes = PROPTYPES;

export default connect(() => ({}), {
  sendPhoneCode,
  popupAlert,
})(ValidationButton);
