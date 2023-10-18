/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/11
 * Function -- Common module for base input
 *
 */

import React from "react";
import PropTypes from "prop-types";

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

const DEFAULTPROPS = {
  _className: "",
  _width: "50px",
  _src: "",
  _size: "50",
  _sizeLimitArr: [50, 100, 150, 280, 350, 450, 700],
  _defaultUrl: "https://ssl1.sephorastatic.cn/wcsfrontend/products/nopic_",
  _alt: "",
  _title: "",
};

const PROPTYPES = {
  _className: PropTypes.string,
  _size: PropTypes.string,
  _src: PropTypes.string,
  _sizeLimitArr: PropTypes.array,
  _defaultUrl: PropTypes.string,
};

class Images extends React.Component {
  constructor(props) {
    super(props);
    this.onErrorHandl = this.onErrorHandl.bind(this);
    this.jumpHref = this.jumpHref.bind(this);
    this.state = {
      /*
       * value: input框的值
       * focusStatus: 1表示onFocus，0表示onBlur
       * typePasswordHide: true表示密码类型为隐藏，false表示密码类型显示
       */
      finalSrc: this.props._src ? this.props._src : "",
      alreadyChoose: false,
    };
  }

  componentDidMount() {}
  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props._src !== newProps._src) {
      this.state.alreadyChoose = false;
    }
    if (!this.state.alreadyChoose) {
      this.setState({
        finalSrc: newProps._src,
      });
    }
    // if((this.props._src!=newProps._src)&&!this.state.alreadyChoose){
    //  this.setState({
    //   finalSrc:newProps._src
    //  })
    // }
  }

  jumpHref() {
    const { callback } = this.props;
    callback && callback();
  }

  getSrc(size) {
    let src;
    const { _sizeLimitArr, _defaultUrl } = this.props;
    if (
      !_sizeLimitArr.some((limit) => {
        if (Number(size) <= limit) {
          src = `${_defaultUrl}${limit}x${limit}.jpg`;
          return true;
        }
        return false;
      })
    ) {
      src = _defaultUrl + "700x700.jpg";
    }

    return src;
  }

  onErrorHandl() {
    if (this.state.alreadyChoose) {
      return;
    }
    const { _size } = this.props;
    const newSrc = this.getSrc(_size);
    this.setState({
      finalSrc: newSrc,
      alreadyChoose: true,
    });
  }

  render() {
    const { _className, _alt, _title, style } = this.props;
    const { finalSrc } = this.state;
    return (
      <img
        src={finalSrc}
        className={_className}
        onError={this.onErrorHandl}
        alt={_alt}
        title={_title}
        onClick={this.jumpHref}
        style={style}
      />
    );
  }
}

Images.defaultProps = DEFAULTPROPS;
Images.propTypes = PROPTYPES;

export default Images;
