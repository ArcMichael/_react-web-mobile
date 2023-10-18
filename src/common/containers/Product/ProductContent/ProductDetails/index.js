/*
 * @Author: Leo.Si
 * @Date: 2020-07-02 15:54:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-25 11:44:55
 * @function 展示商品详情信息
 */
import React from 'react';
import ProductDetailsInfo from "./ProductDetailsInfo";
// import ProductDetailsSpecs from "./ProductDetailsSpecs";

const ProductDetails = ({ _productData, _className, _mySwiper }) => {
  return (
    <div className={`product-details ${_className}`}>
      <ul id="productPage" className="product-details-tab">
        <li>商品详情</li>
        {/* {["商品详情", "规格参数"].map((item, index) => {
          return (
            <li
              key={`product-details-tab-li-${index}`}
              className={Number(_productData.detailsTabIndex) === index ? "active" : ""}
              onClick={_callback.bind(this, "detailsTabClickfun", index)}
            >
              {item}
            </li>
          );
        })} */}
      </ul>
      <ProductDetailsInfo _mySwiper={_mySwiper} _productData={_productData && _productData.detailsData} />
      {/* <ProductDetailsSpecs
          _productData={_productData && _productData.detailsData && _productData.detailsData.skuAttrDtos}
        /> */}
      {/* {Number(_productData.detailsTabIndex) === 1 ? (
        <ProductDetailsSpecs
          _productData={_productData && _productData.detailsData && _productData.detailsData.skuAttrDtos}
        />
      ) : (
        <ProductDetailsInfo _mySwiper={_mySwiper} _productData={_productData && _productData.detailsData} />
      )} */}
    </div>
  );
};

export default ProductDetails;
