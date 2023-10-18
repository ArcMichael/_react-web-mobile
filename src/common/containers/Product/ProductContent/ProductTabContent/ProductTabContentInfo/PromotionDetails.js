/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 10:33:47
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Fr 03:22:33
 * @function PromotionDetails 展示PDP页面促销详情信息
 */
import getUniqId from "@/Utils/utils/getUniqId";
import React from "react";
const PromotionDetails = ({ _callback, _productData, _promotionTags }) => (
  
  <div
    className="product-info-promotion-details"
    onClick={
      _callback &&
      _callback.bind(this, "promotionDetailsPopup", {
        skuId: _productData && _productData.sku && _productData.sku.skuId,
        preSaleActivity: _productData && _productData.preSaleActivity,
      })
    }
  >
    <span className="product-info-title">活动</span>
    {/* <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/promotion.png" /> */}
    {/* <span>促销详情</span> */}
    {/* <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png" /> */}
    <div className="product-info-promotion-tags">
      {_promotionTags &&
        _promotionTags.map((tags) => (
          <div className="product-info-promotion-tag" key={getUniqId()}>
            {<div className={tags.tag ? "" : "tag-none"}>{tags.tag}</div>}
            <div>{tags.name}</div>
          </div>
        ))}
    </div>
    <img
      className="pdp-more"
      src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/pdp-more.png"
      alt=""
    />
  </div>
);
export default PromotionDetails;
