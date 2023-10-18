import React from 'react'
import LazyloadImage from '@/components/LazyloadImage';
import Sensor from '../../../Utils/sensor/index'
import * as device from '../../../lib/device';

/**
 * 
 * @param {Array} productlist 产品列表
 * @param {*} CategoryId   当前分类的id
 */

export const ProductList = ({ CategoryId, productlist, gid, cardNo, cardLevel }) => {
    return (
        <div className={`${CategoryId}_Product categoryList`}>

            {
                productlist && productlist.map(({ skuPic, brand, skuName, productId, skuId, skuCode, sapPrice, skuValue }, index) => {
                    return <div key={skuId + index} className={index === 0 ? 'categoryList_icon_v1' : 'categoryListIcon'} onClick={() => {
                        Sensor.go('BestSellerListProductClick', {
                            'OP_code': productId,
                            commodity_sku: skuCode,
                            'segment_ID': gid || "",
                            vip_card: cardNo || "",
                            vip_card_type: cardLevel || "",
                        })
                        if(device.isWeChat()){
                            wx.miniProgram.navigateTo({
                                url: `/pages/productDetail?productId=${productId}&skuId=${skuId}`,
                              });
                            if (!window.__wxjs_environment||(window.__wxjs_environment!=='miniprogram')) {
                                window.location.href = `/product/${productId}.html?sku=${skuId}`
                            }
                        }else{
                            window.location.href = `/product/${productId}.html?sku=${skuId}`;
                        }
                    }}>
                        <img className='little' src="https://ssl2.sephorastatic.cn/wcsfrontend/campaign/mobile_img/2019/10/hotsales_data/images/icon-hg.png" />
                        {skuPic && <LazyloadImage
                            imgProps={{
                                src: `${skuPic}320x320.jpg`,
                                style: {
                                    height: '3.2rem',
                                    width: '3.2rem',
                                    marginBottom: '0.05rem',
                                    position: 'releative',
                                    margin: '0 auto',
                                    display: 'block'
                                }

                            }}
                            loadingType='smalltype'
                         />}
                        <div className="h_p_info">
                            <p className="info_brand">{brand}</p>
                            <p className="info_brandname">{skuName}</p>
                            <p className="info_price">
                                <span className='info_price1'>
                                    {sapPrice ? (sapPrice === "0.00" || sapPrice === "0") ? "" : `价格¥${sapPrice}` : ''}
                                </span>
                                <span className='info_price2'>
                                    {skuValue ? (skuValue === "0.00" || skuValue == "0") ? "" : `价值¥${skuValue}` : ''}
                                </span>
                            </p>
                        </div>
                    </div>
                })
            }
        </div >
    )
}
