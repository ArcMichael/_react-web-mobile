/*
 * @Author: summer
 * @Date: 2021-02-Mo 04:42:56
 * @Last Modified by:   summer
 * @Last Modified time: 2021-02-Mo 04:42:56
 */

import React from "react";
import { getCdnImageUrl } from "@/components/CdnImage";
import ScrollContainer from "../../ScrollContainer";
import Image from "../../ImagesLazyLoad/index";
// 前端新增优惠券对应金额图片配置 命中数据金额 显示新增图片

const newChashCouponList = [45, 75, 105, 135, 180];
class MyHistoryCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.state = {};
    this.stateUseData = {};
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isBottom !== this.props.isBottom && nextProps.isBottom) {
      this.sendAjax(nextProps);
    }
  }

  componentDidMount() {}

  sendAjax(props) {
    const { couponHistory } = props;
    const { currentPage, totalSize } = this.stateUseData;
    if (currentPage * 15 <= totalSize) {
      this.handleChangePage(couponHistory, currentPage + 1);
    }
  }

  // 优惠券翻页
  handleChangePage(couponHistory, pageNum) {
    couponHistory({ pageNum, pageSize: 15 });
  }

  render() {
    const { myHistoryCoupon } = this.props;
    this.stateUseData = {
      totalSize: myHistoryCoupon && myHistoryCoupon.totalSize,
      currentPage: myHistoryCoupon && myHistoryCoupon.currentPage,
    };
    if (myHistoryCoupon && myHistoryCoupon.totalRecordsCount > 0) {
      return (
        <div className="coupon-history">
          {myHistoryCoupon &&
            myHistoryCoupon.records.map((d, i) => {
              let imgEl;
              if (d.iconUrl) {
                imgEl = <Image src={d.iconUrl} />;
              }
              //  type 1 现金券 2 折扣券 3 礼品券 4 免运费券
              else if (d.type === 1) {
                // 前端新增优惠券对应金额图片配置 命中数据金额 显示新增图片
                if (newChashCouponList.indexOf(d.discountValue) >= 0) {
                  let tempUrl = getCdnImageUrl(`/soa/nmobile/img/coupon/cny${d.discountValue}.png`);

                  imgEl = <Image src={tempUrl} />;
                } else {
                  imgEl = (
                    <Image src="https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/off_normal.png" />
                  );
                }
              } else if (d.type == 2) {
                imgEl = (
                  <Image src="https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/off_normal.png" />
                );
              } else if (d.type == 3) {
                imgEl = (
                  <Image src="https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/gift_normal.png" />
                );
              } else {
                imgEl = (
                  <Image src="https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/express_normal.png" />
                );
              }
              return (
                <li className="pro-box-border" key={`pro-box-border-${i}`}>
                  <div className="pro-box">
                    <div className="pro-pic">{imgEl}</div>
                    <div className="pro-desp">
                      <div>
                        <p className="coupon-name overflow-text-two">{d.name}</p>
                        <p className="coupon-time">
                          限{d.effective}至{d.expire}使用
                        </p>
                        <div className="coupon-desc">
                          <p className="coupon-txt overflow-text">{d.promDesc}</p>
                          {d.promDesc.length > 17 ? (
                            <div className="coupon-detail">
                              <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png" />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="pro-btn">{d.status == 1 ? "已使用" : "已过期"}</div>
                    </div>
                  </div>
                </li>
              );
            })}
        </div>
      );
    }
    return (
      <div className="coupon-history">
        <div className="non-coupon-con">
          <em className="iconC-non-coupon iconC" />
          <p>您目前没有优惠券</p>
        </div>
      </div>
    );
  }
}

export default ScrollContainer(MyHistoryCoupon);
