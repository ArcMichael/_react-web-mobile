import React, { Component } from "react";
import PropTypes from "prop-types";
import LazyloadImage from "@/components/LazyloadImage";
import Text from "@/components/Text";
import { getTrackingHref } from "@/lib/Tools";

/**
 * @typedef {{
 *  href:string;
 *  baseImage?:string;
 *  image:string;
 *  title:string;
 *  price:string;
 *  borderRadius?: string | number | false;
 *  className?:string;
 *  style?:React.CSSProperties;
 *  imageWrapStyle?:React.CSSProperties;
 *  showShadow?:boolean;
 *  hiddenPrice?:boolean;
 *  trackingCode?:string;
 *  onClick?:(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
 * }} ProductProps
 */

/**
 * @extends {React.Component<ProductProps>}
 */
export default class Product extends Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.string,
    image: PropTypes.string.isRequired,
    borderRadius: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
  };
  static defaultProps = {
    baseImage: "",
    borderRadius: "0.25rem",
  };

  render() {
    const {
      href,
      title,
      style = {},
      className,
      borderRadius,
      trackingCode,
      onClick,
      showShadow,
      price,
      image,
      hiddenPrice,
      imageWrapStyle,
    } = this.props;

    return (
      <a
        className={`product-wrap ${className}`}
        href={getTrackingHref({ _Href: href, _Omniture: trackingCode })}
        title={title}
        onClick={onClick}
        style={{
          borderRadius: borderRadius ? borderRadius : 0,
          boxShadow: showShadow
            ? "0.05rem 0.2rem 0.2rem 0 rgba(0,0,0,0.08)"
            : "none",
          ...style,
        }}
      >
        <span className="product-image-wrap" style={imageWrapStyle}>
          <LazyloadImage
            imgProps={{
              src: image,
              style: {
                width: "100%",
                height: "100%",
              },
            }}
            loadingType="smalltype"
           />
        </span>
        <Text className="product-title" ellipsis={2} title={title}>
          {title}
        </Text>
        {!hiddenPrice && (
          <Text
            className="product-price"
            ellipsis={1}
            title={price}
            style={{ fontSize: "0.2rem" }}
          >
            {price}
          </Text>
        )}
      </a>
    );
  }
}
