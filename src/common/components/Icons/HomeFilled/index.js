import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class HomeFilled extends React.Component {
  render() {
    const { size, color = "#000" } = this.props;

    return (
      <span style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size }}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M8 13.65v10.35c0 0.552 0.448 1 1 1h14c0.552 0 1-0.448 1-1v-10.35c0-0.31-0.144-0.603-0.39-0.792l-7-5.388c-0.36-0.277-0.86-0.277-1.22 0l-7 5.388c-0.246 0.189-0.39 0.482-0.39 0.792z" />
        </svg>
      </span>
    );
  }
}
