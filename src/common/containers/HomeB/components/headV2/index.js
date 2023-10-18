import React, { Component } from "react";
import settings from "@/containers/HomeB/settings";
import HeadComponent from "./Head";
import { Consumer } from "../../context";

/**
 * @typedef {{
 * minihead: boolean;
 * animate: null | boolean
 * }} HeadProps
 */

/**
 * @extends {React.Component<HeadProps>}
 */
const heightStyle = {
  height: "1.8rem",
};
export default class Head extends Component {
  constructor(props) {
    super(props);
  }

  /** @type {HTMLDivElement} - description */
  fixedTopRef = null;
  componentDidMount() {}

  render() {
    const { minihead, style, animate } = this.props;
    const transition = "all 0.1s";
    const styleNow = minihead
      ? { zIndex: settings.fixedZindex.topBar, ...style, ...heightStyle }
      : { zIndex: settings.fixedZindex.topBar, ...style };

    return (
      <Consumer>
        {(contextValue) => {
          return (
            <div
              className={`${
                minihead ? "minihead-wrap fixed-top" : "fixed-top"
              }`}
              ref={(ref) => {
                this.fixedTopRef = ref;
              }}
              style={styleNow}
            >
              <HeadComponent
                className="top"
                style={{
                  height: "1.08rem",
                  transition,
                  overflow: "hidden",
                }}
                animate={animate}
                isLogin={contextValue.isLogin}
                minihead={minihead}
              />
            </div>
          );
        }}
      </Consumer>
    );
  }
}
