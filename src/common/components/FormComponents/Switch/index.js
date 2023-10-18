import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import isBrowser from "@/Utils/utils/isBrowser";

if (__DEV__ && isBrowser()) {
  require("../../../../public/style/components/form-components/switch.scss");
}

/**
 * 核对订单-开具发票明细
 * @typedef {{ value?:boolean; onChange?:(value:boolean) => void; className:string, style:import('react').CSSProperties }} SwitchProps
 * @extends {React.Component<SwitchProps>}
 */
export class Switch extends Component {
  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      value: this.props.value,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  handleClick() {
    const { value } = this.state;
    this.setState(
      {
        value: !value,
      },
      () => {
        if (this.props.onChange) this.props.onChange(!value);
      }
    );
  }

  render() {
    const { className, style } = this.props;
    const { value } = this.state;
    return (
      <span
        className={classnames("form-switch", value ? "active" : "", className)}
        onClick={this.handleClick}
        style={style}
       />
    );
  }
}

export default Switch;
