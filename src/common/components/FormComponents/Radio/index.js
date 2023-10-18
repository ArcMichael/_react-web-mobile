import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import isBrowser from "@/Utils/utils/isBrowser";
import RadioGroup from "./RadioGroup";

if (__DEV__ && isBrowser()) {
  require("../../../../public/style/components/form-components/radio.scss");
}

/**
 * Radio
 * @typedef {{ label?:string, checked?:boolean } & HTMLSpanElement} RadioProps
 * @extends {React.Component<RadioProps>}
 */
export class Radio extends Component {
  render() {
    const { label, checked, onClick, className, ...restProps } = this.props;
    if (label) {
      return (
        <span className={classnames("radio-wrap", className)} onClick={onClick} {...restProps}>
          <span>{label}</span>
          <span className={`radio ${checked ? "active" : ""}`} />
        </span>
      );
    }
    return <span className={`radio ${checked ? "active" : ""}`} onClick={onClick} />;
  }
}

Radio.RadioGroup = RadioGroup;

Radio.propTypes = {
  checked: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string,
};

Radio.defaultProps = {
  checked: false,
  onClick: () => {},
  label: "",
};

export default Radio;
