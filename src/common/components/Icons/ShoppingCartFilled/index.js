import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */
/**
 * @extends {React.Component<IconProps>}
 */
export default class ShoppingCartFilled extends React.Component {
  render() {
    const { size, color = "#000" } = this.props;

    return (
      <span style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size }}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M10.547 12h10.907c0.503 0 0.928 0.374 0.992 0.873l1.41 11c0.070 0.548-0.317 1.049-0.865 1.119-0.042 0.005-0.085 0.008-0.127 0.008h-13.727c-0.552 0-1-0.448-1-1 0-0.043 0.003-0.085 0.008-0.127l1.41-11c0.064-0.499 0.489-0.873 0.992-0.873z" />
          <path d="M11.36 9.98c-0.265-0.353-0.193-0.855 0.16-1.12 2.951-2.213 6.009-2.213 8.96 0 0.353 0.265 0.425 0.767 0.16 1.12s-0.767 0.425-1.12 0.16c-2.382-1.787-4.658-1.787-7.040 0-0.353 0.265-0.855 0.193-1.12-0.16z" />
        </svg>
      </span>
    );
  }
}
