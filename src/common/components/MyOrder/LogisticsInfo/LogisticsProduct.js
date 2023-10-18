/*
 * @Author: Leo.Si 
 * @Date: 2020-06-10 15:00:32 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Fr 05:18:30
 * @function 展示商品清单
 */
import React from "react";
const LogisticsProduct = ({ _productData }) => (
  <div>
    <div className="myorder-delivery-content-product">
      <p className="myorder-delivery-content-product-title">商品清单</p>
      <ul>
        {_productData &&
          _productData.productDtos &&
          _productData.productDtos.length > 0 &&
          _productData.productDtos.map((item, index) => {
            const { skuNameCN, quantity } = item;
            return (
              <li key={`myorder-delivery-content-product-${index}`}>
                <span>{skuNameCN}</span>
                <em>×{quantity}</em>
              </li>
            );
          })}
      </ul>
      {/* <p className='myorder-delivery-content-product-total'>{`共${_productData.totalQuantity}件商品`}</p> */}
    </div>{" "}
    <img
      className="myorder-delivery-arrow"
      src="http://eesfe.oss-cn-shanghai.aliyuncs.com/static/sephora/order_delivery_arrow.png"
    />
  </div>
);
export default LogisticsProduct;
