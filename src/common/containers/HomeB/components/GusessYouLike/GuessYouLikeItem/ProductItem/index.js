import React from "react";
import LazyloadImage from "@/components/LazyloadImage";

/**
 * @typedef {{
 *  available: boolean;
 *  brand: string;
 *  c_custom_0: string;
 *  c_custom_1: string;
 *  category: string;
 *  description: string | null;
 *  id: string;
 *  image: string;
 *  item: string;
 *  link: string;
 *  msrp: number;
 *  newCostPrice: string;
 *  newPrice: string;
 *  price: number;
 *  title: string;
 *  trackingCode: string;
 *  zoom_image: string;
 * }} GuessYouLikeProductItem
 */

/**
 * @typedef {{
 *  index:number;
 *  info:GuessYouLikeProductItem;
 *  onClick: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>['onClick'];
 * }} ProductItemProps
 */

/**
 * @extends {React.Component<ProductItemProps>}
 */
export default class ProductItem extends React.Component {
  constructor(props) {
    super(props);
    this.getHomebNodes = this.getHomebNodes.bind(this);
  }

  /**
   * @param {ProductItemProps['info']} item
   */
  getHomebNodes(item) {
    return (
      <div className="product-item-text">
        <p className="product-item-title">
          {item.c_custom_0}
          {item.title}
        </p>
        <div className="product-item-price">
          <p className="product-item-price-cost">{item.newCostPrice ? `¥${item.newCostPrice}` : ""}</p>
          <p>¥{item.newPrice ? item.newPrice : item.price && item.price.toFixed(2)}</p>
        </div>
      </div>
    );
  }
  render() {
    const { index, onClick, info } = this.props;
    return (
      <a
        className="product-item"
        href={`https://m.sephora.cn/product/${info.item}.html?prodlink=NewHome|GuessYouLike|Position(${index})|${info.item}`}
        onClick={onClick}
      >
        <LazyloadImage
          imgProps={{
            src: info.zoom_image,
          }}
          loadingType="smalltype"
         />
        {this.getHomebNodes(info)}
      </a>
    );
  }
}
