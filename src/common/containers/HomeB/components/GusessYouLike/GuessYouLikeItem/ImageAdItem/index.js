import React from "react";
import LazyloadImage from "@/components/LazyloadImage";
import AdButton from "../components/AdButton";

/**
 * @typedef {import('../').ImageItemInfo} ImageItemInfo
 */

/**
 * @typedef {{
 *  info: ImageItemInfo;
 *  onClick?:eact.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>['onClick'];
 *  index: number;
 * }} ImageAdItemProps
 */

/**
 * @extends {React.Component<ImageAdItemProps>}
 */
export default class ImageAdItem extends React.Component {
  /**
   * @param {string} text
   * @param {number} limit
   */
  static ellipsisByCount(text, limit) {
    if (typeof text === "string") {
      if (text.length > limit) {
        return `${text.slice(0, limit)}...`;
      }
    }
    return text;
  }

  render() {
    const { info, onClick } = this.props;
    const { aggr, aggrButton } = info || {};

    if (aggr) {
      return (
        <a className="image-ad-item" href={aggr.link} onClick={onClick}>
          <LazyloadImage
            imgProps={{
              src: aggr.image,
            }}
            loadingType="smalltype"
           />
          {(aggr.text || aggr.subtitle || (aggrButton && aggrButton.text)) && (
            <div className="image-ad-item-bottom">
              <h3>{ImageAdItem.ellipsisByCount(aggr.text, 6)}</h3>
              <h4>{ImageAdItem.ellipsisByCount(aggr.subtitle, 12)}</h4>
              {aggrButton && aggrButton.text && (
                <div>
                  <AdButton text={aggrButton.text} />
                </div>
              )}
            </div>
          )}
        </a>
      );
    }
    return <a className="image-ad-item" href="#" />;
  }
}
