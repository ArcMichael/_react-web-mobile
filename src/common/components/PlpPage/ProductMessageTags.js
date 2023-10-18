import React from "react";
import Image from "../ImagesLazyLoad";
/**
 * @typedef {import('./ProductList').tagItem} tagItem
 */

/**
 * @typedef {{
 *  tags:tagItem[]
 * }} ProductMessageTagsProps
 */

/**
 * @typedef {import('react').FunctionComponent<ProductMessageTagsProps>} ProductMessageTags
 */

/**
 *
 * @type ProductMessageTags
 */
const tagImages = {
  newTag: "https://ssl1.sephorastatic.cn/soa/mobile/images/newtag.png", // 新品
  exclusiveSephora:
    "https://ssl1.sephorastatic.cn/soa/mobile/images/exclusiveSephora.png", // 独家
  memberPrice:
    "https://ssl1.sephorastatic.cn/soa/mobile/images/memberPrice.png", // 会员
  limitedAmount:
    "https://ssl1.sephorastatic.cn/soa/mobile/images/limitedAmount.png", // 限量
  discount: "https://ssl1.sephorastatic.cn/soa/mobile/images/discount.png", // 限时
  flagpresell:
    "https://ssl1.sephorastatic.cn/soa/mobile/images/flagpresell.png", // 预售
  largess: "https://ssl1.sephorastatic.cn/soa/mobile/images/largess.png", // 赠品
  salesGift: "https://ssl1.sephorastatic.cn/soa/mobile/images/largess.png", // 买赠
  exclusiveOnline:
    "https://ssl1.sephorastatic.cn/soa/mobile/images/exclusiveOnline.png", //尊享
  fullReduction:
    "https://ssl1.sephorastatic.cn/soa/mobile/images/fullReduction.png", //满减
  prelaunch: "https://sslstage1.sephorastatic.cn/soa/mobile/images/prelaunch.png", //抢先少个图
};
const ProductMessageTags = (props) => {
  let tags = props.tags || [];
  if (tags.length >= 4) {
    tags = tags.slice(0, 4);
  }
  return (
    <span className="product-message-tags">
      {tags.map((tag) => {
        let src = tagImages[tag.tagKey] || tagImages[tag.key];
        if (!src) return null;
        return (
          <Image src={src} key={tag.tagKey} className="product-message-tag" />
        );
      })}
    </span>
  );
};

export default ProductMessageTags;
