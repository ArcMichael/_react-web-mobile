import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class MineFilled extends React.Component {
  render() {
    const { size, color = "#000" } = this.props;

    return (
      <span style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size }}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M22 12c0 3.314-2.686 6-6 6s-6-2.686-6-6c0-3.314 2.686-6 6-6s6 2.686 6 6z" />
          <path d="M24.715 21.642c0.198 0.395 0.037 0.876-0.358 1.073-5.559 2.779-11.157 2.779-16.716 0-0.395-0.198-0.555-0.678-0.358-1.073s0.678-0.555 1.073-0.358c5.108 2.554 10.176 2.554 15.284 0 0.395-0.198 0.876-0.037 1.073 0.358z" />
        </svg>
      </span>
    );
  }
}
