import React from "react";
import { setCouponDetail } from "./CouponBody";
import { useDispatch } from "react-redux";
import Sensor from "../../../Utils/sensor";

import { popupAlert } from "@/actions/popup";
//前端新增优惠券对应金额图片配置 SEP-56521

export interface singleCoupon {
  amountValue: number;
  checked: string;
  code: string;
  couponType: string;
  disabled: string;
  discountValue?: number;
  displayType: number;
  effective: string;
  expire: string;
  name: string;
  promDesc: string;
  promotionId: string;
  promotionType: number;
  status: string;
  targetUrl?: string;
  unitType: string;
  valid: number;
  iconUrl: string;
  startTime: string;
  endTime: string;
  couponDisplay: string;
}

interface SingleCouponProps {
  valid: number;
  singleCoupon: singleCoupon;

  setCouponRuleAction: (
    code: string,
    promotionType: number,
    targetUrl?: string,
    promotionId?: string
  ) => void;
  setCouponDetail?: setCouponDetail;
}

const SingleCoupon: React.FunctionComponent<SingleCouponProps> = ({
  singleCoupon,
  setCouponDetail,
}) => {
  const { couponDisplay, targetUrl } = singleCoupon;
  const dispatch = useDispatch();
  let descLength = 0;
  // let moreDesc = '';

  for (let i = 0; i < couponDisplay.length; i++) {
    let chars = couponDisplay.substr(i, 1);
    if (chars.charCodeAt(0) > 255) {
      descLength += 2;
    } else {
      descLength++;
    }
  }
  React.useEffect(() => {
    console.log(descLength);
  }, [descLength]);
  return (
    <li className="pro-box-border">
      <div className="pro-box door-li">
        <div>
          <div>
            <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/off_normal.png" />
          </div>

          <div className="door-li-mid">
            <div className="door-li-title">
              {singleCoupon.status == "5" && (
                <span className="fast-expiration">快过期</span>
              )}
              {singleCoupon.couponName}
            </div>
            <div className="door-li-time">
              <span>{`限${singleCoupon.startTime}至${singleCoupon.endTime}使用`}</span>
            </div>
            <div className="door-li-desc">
              <span>{singleCoupon.couponDisplay}</span>
              {descLength > 30 ? (
                <div
                  className="coupon-detail"
                  onClick={() => {
                    if (Sensor.go) {
                      Sensor.go("myAccount_CouponClick", {
                        button_name: "查看详情",
                      });
                    }
                    console.log(setCouponDetail);

                    setCouponDetail &&
                      setCouponDetail({
                        desc: singleCoupon.couponDisplay,
                        link: targetUrl,
                      });
                  }}
                >
                  <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="door-li-btn">
          {singleCoupon &&
            (singleCoupon.status == "1" || singleCoupon.status == "5") && (
              <div
                className="door-li-active"
                onClick={() => {
                  dispatch(
                    popupAlert(1, "PopupToast", {
                      _text:
                        "可下载丝芙兰官网APP或至丝芙兰微信小程序查询附近门店",
                      _autoClose: true,
                    })
                  );
                }}
              >
                去门店
              </div>
            )}
          {singleCoupon && singleCoupon.status == "3" && (
            <div className="door-li-timeout">已过期</div>
          )}
          {singleCoupon && singleCoupon.status == "2" && (
            <div className="door-li-timeout">已使用</div>
          )}
          {singleCoupon && singleCoupon.status == "4" && (
            <div className="door-li-timeout door-li-default">未开始</div>
          )}
        </div>
      </div>
    </li>
  );
};
export default SingleCoupon;
