/*
 * @Author: Leo.Si 
 * @Date: 2020-07-03 11:12:56 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-24 15:29:13
 * @function 显示具体的规格参数
 */
import React from 'react';

const ProductDetailsSpecs = ({
    _productData
}) => {
    return !!_productData && <ul className='product-details-specs'>
        {
            _productData.map((item, index) => {
                const { attrLabel, attrValue } = item
                return <li key={`product-details-specs-${index}`}>
                    <span>{`${attrLabel}`}</span>
                    {`${attrValue}`}
                </li>
            })
        }
    </ul>
}
export default ProductDetailsSpecs