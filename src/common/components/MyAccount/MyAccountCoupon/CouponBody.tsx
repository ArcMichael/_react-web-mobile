import React, { useEffect } from "react";
import SingleCoupon, { singleCoupon } from "./SingleCoupon";
import Sensor from "../../../Utils/sensor";
import ScrollContainer from "../../ScrollContainer";

export interface couponDetail {
  desc?: string;
  link?: string;
}

export interface depositCoupon {
  activeStatus: number;
  couponLists: Array<singleCoupon>;
  currentPage: number;
  key: string;
  name: string;
  totalCount: number;
  valid: number;
}

export type setCouponDetail = (data: couponDetail) => void;

interface CouponBodyProps {
  getMyCoupon: (param: any) => void;
  nowValid: number;
  depositCouponResults: Array<depositCoupon>;
  setCouponDetail?: setCouponDetail;
  isBottom?: boolean;
}

interface stateUseDataType {
  totalCount: number;
  currentPage: number;
}

let stateUseData: stateUseDataType = {
  totalCount: 0,
  currentPage: 0,
}; // 保存当前页数与总数据

const handleChangePage = (
  getMyCoupon: CouponBodyProps["getMyCoupon"],
  valid: number,
  pageNo: number
) => {
  // 翻页
  getMyCoupon &&
    getMyCoupon({
      pageNo: pageNo,
      pageSize: 15,
      valid: valid,
    });
};
const sendAjax = (
  getMyCoupon: CouponBodyProps["getMyCoupon"],
  nowValid: number
) => {
  const { totalCount, currentPage } = stateUseData;
  if (currentPage * 15 <= totalCount) {
    // 判断是否是最后一页
    handleChangePage(getMyCoupon, nowValid, currentPage + 1);
  }
};
const setCouponRuleAction = (
  code: string,
  promotionType: number,
  targetUrl?: string,
  promotionId?: string
) => {
  if (Sensor.go) {
    Sensor.go("myAccount_CouponClick", {
      button_name: "优惠券去使用",
    });
  }
  if (targetUrl) {
    window.location.href = targetUrl;
  } else if (promotionType == 5 || promotionType == 6 || promotionType == 7) {
    window.location.href = "/";
  } else {
    window.location.href = `/coupon_set.html?promotionIds=${promotionId}&code=${code}`;
  }
};

const CouponBody: React.FunctionComponent<CouponBodyProps> = ({
  isBottom,
  getMyCoupon,
  nowValid,
  depositCouponResults,
  setCouponDetail = undefined,
}) => {
  useEffect(() => {
    // 到底部时翻页
    if (isBottom) sendAjax(getMyCoupon, nowValid);
  }, [isBottom]);
  useEffect(() => {
    // 数据改变或者切换tab时，重置翻页数据
    depositCouponResults.forEach((element) => {
      if (element.valid === nowValid) {
        stateUseData = {
          totalCount: element.totalCount,
          currentPage: element.currentPage,
        };
      }
    });
  }, [depositCouponResults, nowValid]);
  return (
    <div className={`discount-body ${nowValid !== 1 ? "hastab" : ""}`}>
      {depositCouponResults.map((data, i) => {
        const { valid, totalCount, couponLists, currentPage } = data;
        if (valid === nowValid) {
          if (totalCount > 0) {
            return (
              <div
                className="discount-body-hasDiscount"
                key={"discount-body-hasDiscount " + i}
              >
                <div className="discount-body-hasDiscount-body">
                  {couponLists.map((singleCoupon, j) => {
                    // debugger
                    return (
                      <SingleCoupon
                        key={"MySingleCoupon" + j}
                        singleCoupon={singleCoupon}
                        valid={valid}
                        setCouponRuleAction={setCouponRuleAction}
                        setCouponDetail={setCouponDetail}
                      />
                    );
                  })}
                  {nowValid === 1 && currentPage * 15 >= totalCount ? (
                    <div className="nomore-coupon">已经到底啦</div>
                  ) : null}
                </div>
                {nowValid === 1 ? (
                  <div className="discount-body-hasDiscount-tip">
                    <span
                      onClick={() => {
                        window.location.href =
                          "/v2/html/myAccountHistoryCoupon";
                      }}
                    >
                      历史优惠券
                    </span>
                    <span>|</span>
                    <span
                      onClick={() => {
                        window.location.href = "/v2/html/rewardsBoutique";
                      }}
                    >
                      积分兑换
                    </span>
                  </div>
                ) : (
                  <div>
                    {nowValid === 2 ? (
                      <div className="history-coupon-tips">
                        以上是3个月内已过期记录
                      </div>
                    ) : null}
                    <div
                      className="discount-body-history-coupon"
                      onClick={() => {
                        window.location.href = "/v2/html/historyCoupon";
                      }}
                    >
                      全部历史记录
                      <img
                        src="https://ssl1.sephorastatic.cn/soa/mobile/images/myAccount/coupon-right-arrow.png"
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div className="non-coupon-con" key="non-coupon-con">
                <em className="iconC-non-coupon" />
                <p>您目前还没有优惠券</p>
                {nowValid === 1 && (
                  <div className="discount-body-hasDiscount-tip">
                    <span
                      onClick={() => {
                        window.location.href =
                          "/v2/html/myAccountHistoryCoupon";
                      }}
                    >
                      历史优惠券
                    </span>
                    <span>|</span>
                    <span
                      onClick={() => {
                        window.location.href = "/v2/html/rewardsBoutique";
                      }}
                    >
                      积分兑换
                    </span>
                  </div>
                )}
              </div>
            );
          }
        }
      })}
    </div>
  );
};

export default ScrollContainer<CouponBodyProps, typeof CouponBody>(CouponBody);
