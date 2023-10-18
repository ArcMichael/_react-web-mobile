/*
 *
 * Producer -- Alvin
 * Time -- 2018/8/13
 * Function -- Common module for Image error handler
 *
 */

import React, { Component } from "react";
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
  placeholder: "https://ssl1.sephorastatic.cn/soa/nmobile/img/product_loading.gif",
};

const PROPTYPES = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.string,
  sizeLimits: PropTypes.array,
  errorSrc: PropTypes.string,
  placeholder: PropTypes.string,
};

class ProductImage extends Component {
  constructor(props) {
    super(props);
    this.setPlaceholder = this.setPlaceholder.bind(this);
    this.state = {
      errorSrcTotal: "",
    };
  }

  setPlaceholder() {
    const { size, sizeLimits, errorSrc, onError } = this.props;
    let errorSrcTotal = "";
    sizeLimits.some((limit, i) => {
      if (size <= limit || i === sizeLimits.length - 1) {
        errorSrcTotal = `${errorSrc}${limit}x${limit}.jpg`;
        return true;
      }
      return false;
    });
    this.setState({ errorSrcTotal }, () => {
      if (typeof onError === "function") {
        onError();
      }
    });
  }

  render() {
    const { onError, sizeLimits, errorSrc, ...imageProps } = this.props;
    const { errorSrcTotal } = this.state;
    return <Image onError={this.setPlaceholder} errorSrc={errorSrcTotal} {...imageProps} />;
  }
}

ProductImage.defaultProps = DEFAULTPROPS;
ProductImage.propTypes = PROPTYPES;

export default ProductImage;
