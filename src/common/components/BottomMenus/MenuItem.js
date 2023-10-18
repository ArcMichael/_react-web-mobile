import React, { Component } from "react";
import Text from "@/components/Text";
import LazyloadImage from "@/components/LazyloadImage";

/**
 * @typedef {{
 *  icon:string | JSX.Element;
 *  title:string;
 *  active?:boolean;
 *  href?:string;
 *  onClick?:() => void;
 *  upper?:React.ReactNode;
 * }} MenuItemProps
 */

/**
 * @extends {React.Component<MenuItemProps>}
 */
export default class MenuItem extends Component {
  render() {
    const { title, icon, active, href, onClick, upper } = this.props;
    return (
      <a href={href} onClick={onClick} className={`MenuItem ${active ? "active" : ""}`}>
        {typeof icon === "string" ? (
          <LazyloadImage
            imgProps={{
              src: icon,
              alt: "bottom icon",
              style: {
                height: "40%",
                marginBottom: "0.05rem",
                width: "30%",
              },
            }}
           />
        ) : (
          <span className="MenuItem-icon">
            {upper || ""}
            {icon}
          </span>
        )}
        <Text style={{ width: "100%" }}>{title}</Text>
      </a>
    );
  }
}
