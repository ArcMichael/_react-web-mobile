import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import isBrowser from "@/Utils/utils/isBrowser";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/components/button.scss");
}

/**
 * Button
 * @typedef {{ disabled?:boolean, onClick?:() => void } & HTMLDivElement} ButtonProps
 * @extends {React.Component<ButtonProps>}
 */
export class Button extends Component {
  render() {
    const { disabled, className, fixedBottom, children, onClick, ...restProps } = this.props;
    return (
      <div
        className={classnames("mob-btn", fixedBottom ? "fixed" : "", className)}
        onClick={onClick}
        {...restProps}
      >
        {children}
      </div>
    );
  }
}

Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  fixedBottom: PropTypes.bool,
};
Button.defaultProps = {
  disabled: false,
  onClick: () => {},
  fixedBottom: false,
};

export default Button;
