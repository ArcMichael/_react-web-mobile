import React from "react";

/**
 * @typedef {import('../type').IconProps} IconProps
 * */

/**
 * @extends {React.Component<IconProps>}
 */
export default class HomeOutlined extends React.Component {
  render() {
    const { size, color = "#000" } = this.props;

    return (
      <span style={{ display: "inline-block", width: "1em", height: "1em", fontSize: size }}>
        <svg width="1em" height="1em" fill={color} viewBox="0 0 32 32">
          <path d="M15.39 7.47c0.324-0.249 0.762-0.274 1.108-0.075l0.112 0.075 7 5.388c0.211 0.162 0.347 0.401 0.381 0.661l0.009 0.132v10.35c0 0.513-0.386 0.936-0.883 0.993l-0.117 0.007h-14c-0.513 0-0.935-0.386-0.993-0.883l-0.007-0.117v-10.35c0-0.266 0.106-0.519 0.291-0.705l0.099-0.087 7-5.388zM16 9.018l-6.4 4.926v9.456h12.8v-9.455l-6.4-4.927z" />
        </svg>
      </span>
    );
  }
}
