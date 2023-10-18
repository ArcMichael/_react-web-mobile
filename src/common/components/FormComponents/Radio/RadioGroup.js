import React, { Component } from "react";
import classnames from "classnames";
import isBrowser from "@/Utils/utils/isBrowser";

if (__DEV__ && isBrowser()) {
  require("../../../../public/style/components/form-components/radio.scss");
}

/**
 * Radio
 * @typedef {HTMLDivElement} RadioGroupProps
 * @extends {React.Component<RadioGroupProps>}
 */
export class RadioGroup extends Component {
  static propTypes = {};

  render() {
    const { className, ...restProps } = this.props;
    return (
      <div className={classnames("radio-group", className)} {...restProps}>
        {this.props.children}
      </div>
    );
  }
}

export default RadioGroup;
