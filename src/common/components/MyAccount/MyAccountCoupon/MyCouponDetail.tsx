import React from "react";
import { setCouponDetail, couponDetail } from "./CouponBody";

/**
 * 优惠券查看详情
 */

interface MyCouponDetailProps {
  setCouponDetail?: setCouponDetail;
  couponDetail: couponDetail;
}

const MyCouponDetail: React.FunctionComponent<MyCouponDetailProps> = ({
  setCouponDetail,
  couponDetail,
}) => {
  let isShowClass = "hide",
    description = "",
    targetLink = "";
  if (couponDetail.desc) {
    isShowClass = "show";
    description = couponDetail.desc;
    if (couponDetail.link) {
      targetLink = couponDetail.link;
    }
  }
  return (
    <div className={"my-coupon-detial-popup " + isShowClass}>
      <div className="bg">
        <div className="box-content">
          <p className="title coupon-title">使用规则</p>
          <div className="content-info">
            <p>{description}</p>
          </div>
          {targetLink ? (
            <div
              className="bottom-con"
              onClick={() => (window.location.href = targetLink)}
            >
              <a className="btn-conf">去使用</a>
            </div>
          ) : (
            <div
              className="bottom-con"
              onClick={() => setCouponDetail && setCouponDetail({})}
            >
              <a className="btn-conf">我知道了</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCouponDetail;
