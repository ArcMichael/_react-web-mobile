import React, { Component } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import classnames from "classnames";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/components/info-row.scss");
}

/**
 * 核对订单-开具发票Popup
 * @typedef {{ left:string, right: string | import('react').ReactNode }, onClick?:Function} InfoRowProps
 * @extends {React.Component<InfoRowProps>}
 */
export class InfoRow extends Component {
  constructor(props) {
    super(props);
    this.getRight = this.getRight.bind(this);
  }
  getRight() {
    const { right } = this.props;
    if (typeof right === "string") {
      return <span className="right">{right}</span>;
    }
    if (right && right.props) {
      const { className, ...restProps } = right.props;
      const newRightNode = React.cloneElement(right, {
        className: classnames(className, "right"),
        ...restProps,
      });
      return newRightNode;
    }
    return "";
  }
  render() {
    const { left, right, onClick, ...restProps } = this.props;
    return (
      <div className="info-row" onClick={onClick} {...restProps}>
        <label className="left">{left}</label>
        {this.getRight()}
      </div>
    );
  }
}

export default InfoRow;
