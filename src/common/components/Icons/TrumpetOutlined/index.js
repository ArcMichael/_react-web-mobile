import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class TrumpetOutlined extends React.Component {
  render() {
    const { size, color = "#000", className, style } = this.props;

    return (
      <span
        className={className || ""}
        style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size, ...style }}
      >
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M18.45 5.943l-10.667 4.008c-0.832 0.313-1.383 1.108-1.383 1.997v8.103c0 0.889 0.551 1.684 1.383 1.997l10.667 4.008c0.24 0.090 0.494 0.136 0.75 0.136 1.178 0 2.133-0.955 2.133-2.133v-16.119c0-0.256-0.046-0.511-0.136-0.75-0.414-1.103-1.645-1.661-2.747-1.247zM8.533 11.949l10.667-4.008v16.119l-10.667-4.008v-8.103z" />
          <path d="M23.584 12.218c-0.268-0.525-0.060-1.167 0.465-1.435s1.167-0.060 1.435 0.465c1.575 3.083 1.575 6.281 0.008 9.487-0.259 0.529-0.897 0.749-1.427 0.49s-0.749-0.897-0.49-1.427c1.275-2.609 1.275-5.101 0.008-7.58z" />
        </svg>
      </span>
    );
  }
}
