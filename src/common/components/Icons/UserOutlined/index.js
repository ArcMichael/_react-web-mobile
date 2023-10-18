import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class UserOutlined extends React.Component {
  render() {
    const { size, color = "#000", style, ...restProps } = this.props;

    return (
      <span style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size, ...style }} {...restProps}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M16 5.333c3.535 0 6.4 2.865 6.4 6.4s-2.865 6.4-6.4 6.4c-3.535 0-6.4-2.865-6.4-6.4s2.865-6.4 6.4-6.4zM16 7.467c-2.356 0-4.267 1.91-4.267 4.267s1.91 4.267 4.267 4.267c2.356 0 4.267-1.91 4.267-4.267s-1.91-4.267-4.267-4.267z" />
          <path d="M5.579 26.281c-0.376-0.453-0.314-1.126 0.139-1.502 7.259-6.025 14.269-6.025 20.619 0.050 0.426 0.407 0.441 1.082 0.033 1.508s-1.082 0.441-1.508 0.033c-5.543-5.303-11.333-5.303-17.781 0.050-0.453 0.376-1.126 0.314-1.502-0.14z" />
        </svg>
      </span>
    );
  }
}
