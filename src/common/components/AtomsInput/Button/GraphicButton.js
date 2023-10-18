/*
 *
 * Producer -- siqiang
 * Time -- 2018/8/13
 * Function -- Component graphic button
 *
 */

import React from "react";
import { connect } from "react-redux";
import { postVildationV2 } from "../../../actions/login";

/**
 * 本组件props.
 * @param {String} _className 传入的_className
 * @param {String} _width 按钮宽度
 * @param {String} _height 按钮高度
 * @param {Number} _status 0:默认状态置灰，不支持点击; 1:激活状态，表示校验成功，可以点击（在倒计时时不支持点击）
 * @param {Number} _totalCount 倒计时总数
 */

const DEFAULTPROPS = {
  _className: "",
  _width: 634,
  _height: "auto",
  _status: 0,
  _totalCount: 180,
};

const PROPTYPES = {};

class GraphicButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationOverTime: true,
      validationImageSrc: "",
    };
    // this.handleClick = this.handleClick.bind(this);
    this.setCountDown = this.setCountDown.bind(this);
    this.stopCountDown = this.stopCountDown.bind(this);
    this.getNewValidateValue = this.getNewValidateValue.bind(this);
  }
  componentDidMount() {
    if (this.props.loginId) {
      this.getNewValidateValue();
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps._invokingChildFun !== this.props._invokingChildFun &&
      nextProps._invokingChildFun === 1
    ) {
      this.getNewValidateValue();
    }
    if (
      nextProps.valiStatus !== this.props.valiStatus &&
      nextProps.valiStatus === true
    ) {
      this.stopCountDownTwo();
    }
    if (nextProps.loginId && nextProps.loginId !== this.props.loginId) {
      // 输入校验通过获取验证码
      if (!this.props._filter || this.props._filter.test(nextProps.loginId)) {
        this.getNewValidateValue(nextProps.loginId);
      }
    }
  }
  // 获取图形验证码的valiCode 和valiCodeToken
  getNewValidateValue(value) {
    const { _getValiCodeToken, postVildationV2, loginId } = this.props;
    let val = value || loginId;
    postVildationV2(val, (callback) => {
      this.stopCountDown();
      this.setState({
        validationImageSrc: callback.captcha,
      });
      this.setCountDown();
      callback && _getValiCodeToken && _getValiCodeToken(callback.codeToken);
    });
  }

  // 设置倒计时
  setCountDown(totalCount = 180) {
    let countDown = totalCount;
    this.timer = setInterval(() => {
      countDown--;
      if (countDown === 0) {
        this.setState(
          {
            validationOverTime: true,
          },
          () => {
            clearInterval(this.timer);
          }
        );
      }
    }, 1000);
  }
  stopCountDownTwo() {
    clearInterval(this.timer);
    this.setState({ validationOverTime: true });
    this.setCountDown();
  }
  // 强行终止倒计时
  stopCountDown() {
    clearInterval(this.timer);
    this.setState({ validationOverTime: false });
  }

  render() {
    const { validationOverTime, validationImageSrc } = this.state;
    return (
      <div>
        {validationOverTime ? (
          <img
            src="https://ssl1.sephorastatic.cn/soa/mobile/images/validateDefault.png"
            className="validateDefault"
            onClick={() => this.getNewValidateValue()}
          />
        ) : (
          ""
        )}
        {validationImageSrc ? (
          <img
            src={validationImageSrc}
            className="validation-image"
            onClick={() => this.getNewValidateValue()}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

GraphicButton.defaultProps = DEFAULTPROPS;
GraphicButton.propTypes = PROPTYPES;

export default connect(() => ({}), {
  postVildationV2,
})(GraphicButton);
