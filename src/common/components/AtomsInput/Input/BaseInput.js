/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/11
 * Function -- Common module for base input
 *
 */

import React from "react";

/**
 * 本组件props.
 * @param {String} _className 传入的_className
 * @param {number} _iconRight 状态图标，清除icon的right值
 * @param {String} _value input框的value
 * @param {RegExp} _filter 过滤掉正则以外的值，使之无法输入
 * @param {Boolean} _disabled input框disabled
 * @param {_type} _type input框type
 * @param {String} _placeholder input框placeholder
 * @param {Number} _status 0:默认状态; 1:校验正确状态，绿色 ; 2:校验错误状态，红色
 * @return {Function} _getValue 父组件获取input的value
 */

class BaseInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*
       * value: input框的值
       * focusStatus: 1表示onFocus，0表示onBlur
       * typePasswordHide: true表示密码类型为隐藏，false表示密码类型显示
       */
      value: this.props._value,
      focusStatus: 0,
      typePasswordHide: true,
    };
    this.changevalueCallback = this.changevalueCallback.bind(this);
    this.blurTimeout = this.blurTimeout.bind(this);
  }
  static defaultProps = {
    _className: "",
    _width: "100%",
    _iconRight: 0,
    _value: "",
    _filter: "",
    _disabled: false,
    _type: "text",
    _placeholder: "",
    _status: 0,
    _clearIconShow: true,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props._value !== nextProps._value) {
      this.setState({
        value: nextProps._value,
      });
    }
  }

  // onChange事件时设置state中的value
  changevalue(e) {
    const { _filter } = this.props;
    const value = e.target.value;
    this.setState(
      (prevState) => ({
        value:
          !_filter || (_filter && _filter.test(value))
            ? value
            : prevState.value,
      }),
      this.changevalueCallback
    );
  }

  // onChange事件时设置value，将value返回给父组件
  changevalueCallback() {
    const { _getValue } = this.props;
    const { value } = this.state;
    _getValue && _getValue(value);
  }

  // 设置本组件state
  setValue(name, callback, value) {
    this.setState(
      {
        [name]: value,
      },
      () => {
        callback && callback();
      }
    );
  }

  // onBlor时延迟设置状态，保证清除icon可以清除value
  blurTimeout() {
    window.setTimeout(() => {
      this.setState({ focusStatus: 0 });
    }, 100);
  }

  // 密码状态设置可见不可见
  changePassType() {
    this.setState((prevState) => ({
      typePasswordHide: !prevState.typePasswordHide,
    }));
  }

  render() {
    const {
      _className,
      _width,
      _iconRight,
      _disabled,
      _type,
      _placeholder,
      _status,
      _clearIconShow,
    } = this.props;
    const { value, focusStatus, typePasswordHide } = this.state;

    const iconRight = {
      right: `${_iconRight / 100}rem`,
    };

    let borderBtm = "icon-base-line";
    if (focusStatus === 0) {
      if (_status === 1) {
        borderBtm = "icon-good-line";
      } else if (_status === 2) {
        borderBtm = "icon-bad-line";
      }
    }
    if (focusStatus) {
      borderBtm = "icon-now-line";
    }
    return (
      <div className={`base-input ${_className}`} style={{ width: _width }}>
        {focusStatus === 0 && _status !== 0 && (
          <div
            style={iconRight}
            className={_status === 1 ? "icon-good" : "icon-bad"}
          />
        )}
        {_clearIconShow && !!value && focusStatus === 1 && (
          <img
            style={iconRight}
            className="icon-clear-img"
            src="https://ssl1.sephorastatic.cn/soa/mobile/images/del2x.png"
            onClick={this.setValue.bind(
              this,
              "value",
              this.changevalueCallback,
              ""
            )}
          />
        )}
        <div className={borderBtm} />
        <input
          style={{ width: _width }}
          type={typePasswordHide ? _type : "text"}
          disabled={_disabled}
          placeholder={_placeholder}
          onFocus={this.setValue.bind(this, "focusStatus", null, 1)}
          onBlur={this.blurTimeout}
          onChange={this.changevalue.bind(this)}
          value={value}
        />
        {_type === "password" && focusStatus === 1 && !!value && (
          <img
            className="clearText"
            src={
              typePasswordHide
                ? "https://ssl1.sephorastatic.cn/soa/mobile/images/open_eyes2x.png"
                : "https://ssl1.sephorastatic.cn/soa/mobile/images/close_eyes2x.png"
            }
            onClick={this.changePassType.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default BaseInput;
