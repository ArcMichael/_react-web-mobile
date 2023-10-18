/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 10:33:47
 * @Last Modified by: cathy.peng
 * @Last Modified time: 2020-11-Mo 04:31:48
 * @function ProductVBDetails 展示PDP页面套装详情信息
 */
import React from "react";

const ProductVBDetails = ({ _callback, _productData }) => (
  <div
    className="product-info-promotion-details"
    onClick={
      _callback &&
      _callback.bind(this, "productVBDetailsPopup", {
        skuCode: _productData && _productData.sku && _productData.sku.skuCode,
      })
    }
  >
    {/* <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/promotion.png" /> */}
    {/* <span>套装详情</span> */}
    {/* <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png" /> */}
    <div className="product-info-count">{_productData.sku.vbmsg}</div>
  </div>
);
export default ProductVBDetails;
