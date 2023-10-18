/*
 * @Author: Leo.Si 
 * @Date: 2020-07-22 16:35:43 
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-19 14:59:31
 * @function product-info 商品咨询展示模块
 */
import React from 'react';

const ProductConsulting = ({
    _consulation,
    _callback,
}) => !!_consulation && <div className='product-info-comment'>
    <div className='product-info-comment-title' onClick={_callback && _callback.bind(this, 'toConsultingPage' )}>
        <p>产品咨询</p>
        {
           _consulation.consulationProductDtoList &&_consulation.consulationProductDtoList.length > 0 ? null :
                <div className='product-info-no-comment'>有疑问,来发布第一个问题</div>
        }
         <img
          className="product-comment-arrow"
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/popup-arrow.png"
        />
    </div>
    <ul className='product-info-consulting-list'>
        {
            _consulation.consulationProductDtoList &&
            _consulation.consulationProductDtoList.length > 0 &&
            _consulation.consulationProductDtoList.map((item, index) => {
                const { question, answer } = item
                return <li className='' key={`product-info-consulting-list-${index}`}>
                    <p>
                        <img src='https://ssl1.sephorastatic.cn/soa/nmobile/img/product/zixun.png' />
                        <span>{question}</span>
                    </p>
                    <p>{`回答：${answer}`}</p>
                </li>
            })
        }
    </ul>
</div>

export default ProductConsulting