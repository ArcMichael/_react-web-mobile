import React from "react";
import RightArrowOutlined from "@/components/Icons/RightArrowOutlined";

/**
 * @typedef {{
 *  text:string;
 *  onClick?:() => void;
 * }} AdButtonProps
 * */

/**
 * @extends {React.Component<AdButtonProps>}
 */
export default class AdButton extends React.Component {
  render() {
    const { text, onClick } = this.props;
    return (
      <button
        className="gyl-ad-button"
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {text ? text.slice(0, 4) : ""}
        <span className="gyl-ad-button-icon">
          <RightArrowOutlined className="gyl-ad-button-icon-array" color="#fff" size="0.18rem" />
        </span>
      </button>
    );
  }
}
