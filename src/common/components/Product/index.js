/*
 * @Author: Leo.Si
 * @Date: 2019-09-12 14:20:32
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-10-29 17:19:54
 * @function 产品展示公共模块
 */
import React from "react";
import Images from "../Images/render";
import { getProductSpecs } from "../../lib/Tools";
const Product = ({ _data, _offerPrice }) =>
  !!_data && (
    <ul className="product_module">
      {_data.map((item, index) => {
        let {
          defaultImagePath,
          brandNameEN,
          productNameCN,
          skuSaleAttrDto,
          quantity,
          offerPrice,
          productId,
          skuId,
          isFullImage = false,
          productSize,
        } = item;
        return (
          <li key={`product_module_${index}`}>
            <a href={productId ? `/product/${productId}.html?sku=${skuId}` : "#"}>
              <Images
                _src={isFullImage ? defaultImagePath : defaultImagePath + "350x350.jpg"}
                _className=""
                _size="150"
              />
            </a>
            <div className="product_module_left">
              <p className="product_module_brandNameEN">{brandNameEN}</p>
              <p className="product_module_productNameCN">{productNameCN}</p>
              {productSize ? (
                <p className="product_module_skuSale">{productSize}</p>
              ) : (
                <p className="product_module_skuSale">
                  {getProductSpecs({
                    specType: skuSaleAttrDto && skuSaleAttrDto.specType,
                    spec: skuSaleAttrDto && skuSaleAttrDto.spec,
                    custom: skuSaleAttrDto && skuSaleAttrDto.custom,
                  })}
                </p>
              )}
            </div>
            <div className="product_module_right">
              {offerPrice ? <p className="product_module_offerPrice">{`¥${_offerPrice || offerPrice}`}</p> : null}
              <p className="product_module_quantity">{`x${quantity}`}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
export default Product;
