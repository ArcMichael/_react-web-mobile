import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class SearchOutlined extends React.Component {
  render() {
    const { size, color = "#000", style, ...restProps } = this.props;

    return (
      <span style={{ display: "inline-flex", width: "1em", height: "1em", fontSize: size, ...style }} {...restProps}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M22.634 21.172l3.394 3.394c0.625 0.625 0.625 1.638 0 2.263s-1.638 0.625-2.263 0l-3.394-3.394c-0.625-0.625-0.625-1.638 0-2.263s1.638-0.625 2.263 0z" />
          <path d="M15.2 4.8c5.744 0 10.4 4.656 10.4 10.4s-4.656 10.4-10.4 10.4c-5.744 0-10.4-4.656-10.4-10.4s4.656-10.4 10.4-10.4zM15.2 8c-3.976 0-7.2 3.224-7.2 7.2s3.224 7.2 7.2 7.2c3.976 0 7.2-3.224 7.2-7.2s-3.224-7.2-7.2-7.2z" />
        </svg>
      </span>
    );
  }
}
