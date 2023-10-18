/*
 * @Author: Martin.song
 * @LastEditors: Martin.song
 * @Descripttion: 
 * @version: 0.2
 * @Date: 2021-02-01 17:57:05
 * @LastEditTime: 2021-06-07 09:48:31
 */
import React from 'react';
import Swiper from "react-id-swiper";
import Image from '../../ImagesLazyLoad/index';
class SwiperOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { orderSwiper } = this.props,
      _autoplay;
    if (orderSwiper.length > 1) {
      _autoplay = { delay: 3000 };
    } else {
      _autoplay = false;
    }
    let parms = {
      autoplay: _autoplay,
      direction: 'vertical',
      loop: true,
    };
    let swiperDiv = orderSwiper.map((items, index) => {
      return (
        <a className="orderbox swiper-no-swiping" key={index} href={'/order-' + items.orderId + '.html'}>
          <div className="img">
            {/* <img src={items.defaultImagePath + '150x150.jpg'}></img> */}

            <Image
                src={items.defaultImagePath + '150x150.jpg'}
              />
          </div>
          <div className="right">
            <div className="top">
              <span className="orderid">订单编号{items.orderId}</span>
              <span className="status">{items.statusName}</span>
            </div>
            <p>{items.productNameCN}</p>
          </div>
        </a>
      );
    });
    return (
      <div className="swiperbox" style={{ overflow: 'hidden' }}>
        <Swiper {...parms}>{swiperDiv}</Swiper>
      </div>
    );
  }
}
export default SwiperOrder;
