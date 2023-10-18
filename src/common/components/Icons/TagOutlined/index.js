import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class TagOutlined extends React.Component {
  render() {
    const { size, color = "#000" } = this.props;

    return (
      <span style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size }}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M16.116 8.026c0.204-0.204 0.487-0.31 0.775-0.291l7.494 0.507 0.507 7.494c0.020 0.288-0.086 0.57-0.291 0.775l-9.409 9.409c-0.391 0.391-1.024 0.391-1.414 0l-7.071-7.071c-0.391-0.391-0.391-1.024 0-1.414l9.409-9.409zM17.055 9.35l-8.792 8.792 6.223 6.223 8.791-8.791-0.395-5.828-5.827-0.395z" />
          <path d="M20.46 12.667c0.391 0.391 0.391 1.024 0 1.414s-1.024 0.391-1.414 0c-0.391-0.391-0.391-1.024 0-1.414s1.024-0.391 1.414 0z" />
        </svg>
      </span>
    );
  }
}
