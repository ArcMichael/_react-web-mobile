import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class RightArrowOutlined extends React.Component {
  render() {
    const { size, color = "#000", style, ...restProps } = this.props;

    return (
      <span style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size, ...style }} {...restProps}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M11.918 5.405c0.392-0.401 1.008-0.452 1.456-0.149l0.16 0.13 9.796 9.578c0.401 0.392 0.452 1.008 0.148 1.457l-0.131 0.16-9.796 10.014c-0.441 0.451-1.165 0.459-1.616 0.018-0.401-0.392-0.452-1.008-0.148-1.456l0.13-0.16 8.994-9.198-8.976-8.778c-0.401-0.392-0.452-1.008-0.149-1.456l0.13-0.16z" />
        </svg>
      </span>
    );
  }
}
