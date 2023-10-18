import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class CategoryFilled extends React.Component {
  render() {
    const { className, style, size, color = "#000" } = this.props;

    return (
      <span
        className={className || ""}
        style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size, ...style }}
      >
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M8 7h6c0.552 0 1 0.448 1 1v8c0 0.552-0.448 1-1 1h-6c-0.552 0-1-0.448-1-1v-8c0-0.552 0.448-1 1-1z" />
          <path d="M8 18h6c0.552 0 1 0.448 1 1v5c0 0.552-0.448 1-1 1h-6c-0.552 0-1-0.448-1-1v-5c0-0.552 0.448-1 1-1z" />
          <path d="M24 12c0 0.552-0.448 1-1 1h-6c-0.552 0-1-0.448-1-1v-4c0-0.552 0.448-1 1-1h6c0.552 0 1 0.448 1 1v4zM22.4 11.4v-2.8h-4.8v2.8h4.8z" />
          <path d="M17 14h6c0.552 0 1 0.448 1 1v9c0 0.552-0.448 1-1 1h-6c-0.552 0-1-0.448-1-1v-9c0-0.552 0.448-1 1-1z" />
        </svg>
      </span>
    );
  }
}
