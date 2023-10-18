/*
 * @Author: Leo.Si
 * @Date: 2020-04-08 10:08:09
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:56:25
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Image from "./Image";

/**
 * 本组件props.
 */

const DEFAULTPROPS = {
  src: "",
  size: 350,
  sizeLimits: [50, 100, 150, 210, 280, 320, 350, 450, 700],
  errorSrc: "https://ssl1.sephorastatic.cn/wcsfrontend/products/nopic_",
  placeholder:
    "https://ssl1.sephorastatic.cn/soa/nmobile/img/product_loading.gif",
};

const PROPTYPES = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.string,
  sizeLimits: PropTypes.array,
  errorSrc: PropTypes.string,
  placeholder: PropTypes.string,
};

class PlaceholderImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorSrcTotal: "",
    };
  }

  render() {
    const {
      onError,
      sizeLimits,
      errorSrc,
      pageLoadDone,
      placeholder,
      pageShow,
      ...imageProps
    } = this.props;
    const { errorSrcTotal } = this.state; // TODO: 请移除无用state
    console.log(errorSrcTotal);
    if (pageLoadDone && pageLoadDone == "done") {
      return <Image {...imageProps} />;
    } else {
      return (
        <img
          src={
            placeholder ||
            "https://ssl1.sephorastatic.cn/soa/nmobile/img/product_loading.gif"
          }
        />
      );
    }
  }
}

PlaceholderImage.defaultProps = DEFAULTPROPS;
PlaceholderImage.propTypes = PROPTYPES;
const mapStateToProps = (state) => {
  return {
    pageLoadDone: state.globalReference.PAGE_LOAD_FINISH,
  };
};

export default connect(mapStateToProps, {})(PlaceholderImage);
