/*
 *
 * Producer -- siqiang
 * Time -- 2018/9/18
 * Function -- HOC for window scroll
 *
 */

import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import React, { Component } from "react";
import $ from 'jquery';

/**
 * 入参.
 * @param {Class} InnerComponent 需要获取滚动事件的组件
 * @param {Object} options 配置项
 *  + @param {Boolean} needScrollTop 是否需要scrollTop值，默认为false，避免子组件重复render
 * @return {Object} props 向InnerComponent传入本组件state
 *  + @prop {Boolean} isTop 是否到达顶部
 *  + @prop {Boolean} isBottom 是否到达底部
 */

const ScrollContainer = (InnerComponent, options = {}) => {
  const { needScrollTop } = options;
  class ScrollContainerComponent extends Component {
    constructor() {
      super();
      this.state = {
        isTop: false,
        isBottom: false,
        scrollTop: 0,
      };
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
      const { isTop, isBottom } = this.state;
      const totalHeight = $(this.containerDOM).height();

      const scrollTop = bodyScrollTop.get();
      const windowClientHeight = window.screen.height;

      const isTopNow = scrollTop === 0;
      const isBottomNow = scrollTop + windowClientHeight + 1 >= totalHeight;
      if (needScrollTop || isTop !== isTopNow || isBottom !== isBottomNow) {
        this.setState({
          isTop: isTopNow,
          isBottom: isBottomNow,
          scrollTop: scrollTop,
        });
      }
    }

    render() {
      return (
        <div ref={(node) => (this.containerDOM = node)}>
          <InnerComponent {...this.state} {...this.props} />
        </div>
      );
    }
  }

  return ScrollContainerComponent;
};

export default ScrollContainer;
