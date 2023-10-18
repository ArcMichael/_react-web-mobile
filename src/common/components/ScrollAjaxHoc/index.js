import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import React, { Component } from "react";

/**
 *
 * @typedef {{
 *  __ScrollTop__:number;
 * __InjectData__: null | any;
 * }} ScrollAjaxInjectProps
 * */

/**
 *
 * @param {React.Component} ChildrenComponent
 * @param {Object} options
 * @param {number} options.triggerLimit 当document.body.offsetTop > triggerLimit 时触发 action
 * @param {'SecondScreen' | 'ThirdScreen'} options.triggerAt 'SecondScreen' 相当于triggerLimit = 0; 'ThirdScreen' 相当于triggerLimit = window.innteHeight;
 * @param {(props:any) => Promise<any>} options.triggerAction
 * @returns
 */
const ScrollAjaxHoc = (ChildrenComponent, options = {}) => {
  const { triggerLimit, triggerAction, triggerAt } = options;

  return class extends Component {
    constructor(props) {
      super(props);
      this.handleScroll = this.handleScroll.bind(this);
      this.getLimit = this.getLimit.bind(this);
      this.handleTrigger = this.handleTrigger.bind(this);
      this.state = {
        scrollTop: 0,
        data: null,
      };
    }
    componentDidMount() {
      window.addEventListener("scroll", this.handleScroll);
    }

    getLimit() {
      let limit = null;
      if (typeof triggerLimit === "number") {
        limit = triggerLimit;
      }
      if (triggerAt === "SecondScreen") {
        limit = 0;
      }
      if (triggerAt === "ThirdScreen") {
        limit = window.innerHeight;
      }
      return limit;
    }

    handleTrigger() {
      if (triggerAction) {
        triggerAction(this.props || {}).then((res) => {
          this.setState({
            data: res,
          });
        });
      }
    }

    componentWillUnmount() {
      window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll() {
      if (typeof window !== "undefined") {
        const scrollTop = bodyScrollTop.get();
        let limit = this.getLimit();
        if (scrollTop > limit) {
          this.handleTrigger();
          window.removeEventListener("scroll", this.handleScroll);
        }
        this.setState({
          scrollTop,
        });
      }
    }

    render() {
      return (
        <ChildrenComponent
          __ScrollTop__={this.state.scrollTop}
          __InjectData__={this.state.data}
          {...this.props}
         />
      );
    }
  };
};

export default ScrollAjaxHoc;
