import React, { Component } from "react";
import CanvasBg from "./CanvasBg";

/**
 * @typedef {{} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} BottomMenusProps
 */

/**
 * @extends {React.Component<BottomMenusProps>}
 */
class BottomMenus extends Component {
  render() {
    const { className, disableToTop, ...restProps } = this.props;
    return (
      <div className={`BottomMenus ${className || ""}`} {...restProps}>
        <CanvasBg disableToTop={disableToTop} />
      </div>
    );
  }
}

export default BottomMenus;
