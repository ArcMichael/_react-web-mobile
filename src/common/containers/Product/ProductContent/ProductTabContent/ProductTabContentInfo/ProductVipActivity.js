/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 10:33:47
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Fr 03:16:42
 * @function PromotionDetails 展示PDP页面专享活动详情信息
 */
import React from "react";

const ProductVipActivity = ({ _callback, _productData }) => (
  <div
    className="product-vip-promotion-details"
    onClick={
      _callback &&
      _callback.bind(this, "vipActivityPopup", {
        detail: _productData && _productData.detail,
        name: _productData && _productData.name,
      })
    }
  >
    <div>
      <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/alert_circle.png" />
      <span>{_productData.name}</span>
    </div>

    <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/pdp-more.png?f=webp" />
  </div>
);
export default ProductVipActivity;
