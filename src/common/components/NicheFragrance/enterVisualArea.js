/*
 * @Author: siqiang
 * @Date: 2019-03-29 11:02:27
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:48:06
 */
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import React, { Component } from "react";
// import $ from 'jQuery'
const EnterVisualArea = (InnerComponent) => {
  class EnterVisualAreaComponent extends Component {
    constructor() {
      super();
      this.state = {
        scrollTop: 0,
        isEnter: false,
        isOuter: false,
      };
      this.myRef = React.createRef();
      this.onScroll = this.onScroll.bind(this);
    }
    componentDidMount() {
      const scrollTop = bodyScrollTop.get();
      this.setState({
        isTop: scrollTop === 0,
        scrollTop: scrollTop,
      });
      window.addEventListener("scroll", this.onScroll.bind(this), false);
    }
    componentWillUnmount() {
      window.removeEventListener("scroll", this.onScroll.bind(this), false);
    }
    onScroll() {
      const swHeight = document.documentElement.clientHeight;
      const mTop =
        this.myRef.current &&
        this.myRef.current.getBoundingClientRect() &&
        this.myRef.current.getBoundingClientRect().top;
      if (mTop <= swHeight - 100) {
        this.setState({
          isEnter: true,
        });
      }
      if (swHeight - mTop > 320) {
        this.setState({
          isEnter: false,
          isOuter: true,
        });
      }
    }
    render() {
      return (
        <div ref={this.myRef}>
          <InnerComponent {...this.state} {...this.props} />
        </div>
      );
    }
  }
  return EnterVisualAreaComponent;
};
export default EnterVisualArea;
