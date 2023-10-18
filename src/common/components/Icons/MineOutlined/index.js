import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class MineOutlined extends React.Component {
  render() {
    const { size, color = "#000" } = this.props;

    return (
      <span style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size }}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M16 6c3.314 0 6 2.686 6 6s-2.686 6-6 6c-3.314 0-6-2.686-6-6s2.686-6 6-6zM16 7.6c-2.43 0-4.4 1.97-4.4 4.4s1.97 4.4 4.4 4.4c2.43 0 4.4-1.97 4.4-4.4s-1.97-4.4-4.4-4.4z" />
          <path d="M24.715 21.642c0.198 0.395 0.037 0.876-0.358 1.073-5.559 2.779-11.157 2.779-16.716 0-0.395-0.198-0.555-0.678-0.358-1.073s0.678-0.555 1.073-0.358c5.108 2.554 10.176 2.554 15.284 0 0.395-0.198 0.876-0.037 1.073 0.358z" />
        </svg>
      </span>
    );
  }
}
