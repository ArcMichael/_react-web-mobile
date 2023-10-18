/*
 *
 * Producer -- Alvin
 * Time -- 2018/8/13
 * Function -- Common module for Image error handler
 *
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";

/**
 * 本组件props.
 */

const DEFAULTPROPS = {
  src: "",
  size: 350,
  offset: 0,
  errorSrc:
    "https://ssl1.sephorastatic.cn/wcsfrontend/products/nopic_50x50.jpg",
};

const PROPTYPES = {
  src: PropTypes.string,
  // size: PropTypes.number,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  offset: PropTypes.number,
  errorSrc: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
  title: PropTypes.string,
};

class Image extends Component {
  constructor(props) {
    super(props);
    this.handleError = this.handleError.bind(this);
    this.state = {
      error: false,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.src !== newProps.src) {
      this.setState({ error: false });
    }
  }

  handleError() {
    const { onError } = this.props;
    if (!this.state.error) {
      this.setState({ error: true }, () => {
        if (typeof onError === "function") {
          console.log("atom-error", this.state.error);
          onError();
        }
      });
    }
  }

  render() {
    const {
      src,
      size,
      offset,
      errorSrc,
      placeholder,
      onError,
      lazyClass,
      ...imageProps
    } = this.props;
    const { error } = this.state;
    return (
      <LazyLoad
        height={size}
        debounce={200}
        offset={offset}
        // once
        placeholder={
          placeholder ? (
            <div className={lazyClass}>
              <img src={placeholder} {...imageProps} />
            </div>
          ) : null
        }
      >
        <img
          src={error ? errorSrc : src}
          onError={this.handleError}
          {...imageProps}
        />
      </LazyLoad>
    );
  }
}

Image.defaultProps = DEFAULTPROPS;
Image.propTypes = PROPTYPES;

export default Image;
