/*
 * function 运用高阶组件
 * param {Class}  InnerComponent 需要获取加载事件的组件
 * param {Object}  配置项
 *     @param {String} name 当实现锚点跳转时，需要传入
 * 主要为
 * （1）当组件加载时，开启监听scroll事件
 * （2）获取当前的可视区域的高度     window.document.documentElement.clientHeight
 *     获取当前元素距离顶部的高度   el.getBoundingClientRect().top
 *     获取当前元素距离的高度      el.offsetHeight
 *     当前元素距离顶部的高度 <= 获取当前的可视区域的高度 时进行加载
 */
import React, { PureComponent } from "react";
const checkInPage = (el) => {
  const pageHeight = window.document.documentElement.clientHeight;
  const contentTop = el.getBoundingClientRect().top;
  const contentHeight = el.offsetHeight;
  return (
    (contentTop < pageHeight && contentTop >= 0) ||
    (contentTop < 0 && contentTop + contentHeight > 0)
  );
};
const ScrollLazyLoading = (InnerComponent, options = {}) => {
  class ScrollLazyLoadingComponent extends PureComponent {
    state = {
      visible: false,
    };
    checkInPage = () => {
      let isVisible = checkInPage(this.el);
      let { visible } = this.state;
      if (visible === true) {
        window.removeEventListener("scroll", this.checkInPage);
        return;
      }
      this.setState({ visible: isVisible });
    };
    componentDidMount() {
      setTimeout(() => {
        this.checkInPage();
        window.addEventListener("scroll", this.checkInPage);
      }, 200);
    }
    componentWillUnmount() {
      window.removeEventListener("scroll", this.checkInPage);
    }
    render() {
      return (
        <div ref={(el) => (this.el = el)} id={options && options.name}>
          {this.state.visible && <InnerComponent {...this.props} />}
        </div>
      );
    }
  }
  return ScrollLazyLoadingComponent;
};
export default ScrollLazyLoading;
