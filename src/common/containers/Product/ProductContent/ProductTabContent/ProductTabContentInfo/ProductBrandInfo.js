/*
 * @Author: Leo.Si 
 * @Date: 2020-07-14 10:09:26 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-25 10:27:32
 * @function PDP 页面当中展示商品的品牌信息
 */
import React from 'react';

const ProductBrandInfo = ({
    _callback,
    _productData
}) => !!_productData && <div id="brandPage" className='product-info-brand' onClick={_callback && _callback.bind(this, 'toBrandPage',_productData.sku )}>
    <div className='product-info-brand-img'><img src={_productData.sku && _productData.sku.brandImage} /></div>
    <p>
        {_productData.sku && _productData.sku.brandCN}
        <div>{_productData.sku &&_productData.sku.brandSaleDesc}</div>
    </p>
    <span className="product-page-arrow">进入品牌</span>
    {/* <img className='product-page-arrow' src='https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png' /> */}
</div>
export default ProductBrandInfo