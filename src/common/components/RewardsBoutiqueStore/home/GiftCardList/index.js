/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-11-17 15:05:27
 * @LastEditTime: 2021-04-21 10:18:47
 */
import React from 'react';
import Sensor from "@/Utils/sensor/index"
import { WeChatPath } from '../../util';
import CurrentComponentCommonTop from '../../../CommonTop/index';


export default class GiftCardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };
    this.getCardHandler = this.getCardHandler.bind(this);
    this.showMore = this.showMore.bind(this);
    this.showDetail = this.showDetail.bind(this);
  }
  // 跳转小程序领取丝享卡
  getCardHandler(item) {
    // 埋点
    Sensor.go('pointMall_hp_click', {
      coupon_name: item.name,
      button_name: '立即领取丝享卡'
    })
    const { exchangeGitfCard } = this.props;
    exchangeGitfCard(item)
  }
  showMore(boolean) {
    this.setState({
      showMore: boolean,
    });
  }

  // 查看详情;
  showDetail(item) {
    window.location.href = WeChatPath(`/v2/html/exchangeDetail/${item.id}`);
  }
  render() {
    const { GiftCardList } = this.props;
    const { showMore } = this.state;
    return (
      <div>
        {showMore && <div className="giftShow" onClick={() => {
          this.showMore(false);
        }} />}
        <CurrentComponentCommonTop />
        {GiftCardList.length === 1 && (
          <div className="GiftCardList">
            <div className="GiftCardItem">
              <span>您有一张未领取的丝享卡</span>
              <a
                className="GiftCardBtn"
                onClick={() => {
                  this.getCardHandler(GiftCardList[0]);
                }}
              >
                立即领取
              </a>
            </div>
          </div>
        )}
        {GiftCardList.length > 1 && (
          <div className="GiftCardList">
            {showMore === false && (
              <div className="GiftCardItem">
                <span>您有{GiftCardList.length}张未领取的丝享卡</span>
                <a
                  className="moreBtn"
                  onClick={() => {
                    this.showMore(true);
                  }}
                >
                  <img src=" https://ssl1.sephorastatic.cn/soa/nmobile/img/down_arrow.png" />
                </a>
              </div>
            )}
            {showMore &&
              GiftCardList.map((item, index) => {
                return (
                  <div className="GiftCardItem" key={item.couponType + '_' + index}>
                    <span>丝芙兰{item.name}</span>
                    <a
                      className="GiftCardBtn"
                      onClick={() => {
                        this.getCardHandler(GiftCardList[0]);
                      }}
                    >
                      立即领取
                    </a>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}
