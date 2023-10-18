import React from "react";
import { getCdnImageUrl } from "@/components/CdnImage";
import Sensor from "../../../Utils/sensor";
import Image from "../../ImagesLazyLoad/index";
import { setCouponDetail } from "./CouponBody";
//前端新增优惠券对应金额图片配置 SEP-56521
const newChashCouponList = [45, 75, 105, 135, 180];
const TMPDATA = [
  {
    type: "现金券",
    optionStatus: 1,
    imgUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/off_normal.png",
  },
  {
    type: "折扣券",
    optionStatus: 2,
    imgUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/off_normal.png",
  },
  {
    type: "礼品券",
    optionStatus: 3,
    imgUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/gift_normal.png",
  },
  {
    type: "免运费券",
    optionStatus: 4,
    imgUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/express_normal.png",
  },
];

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
  status: number;
  targetUrl?: string;
  unitType: string;
  valid: number;
  iconUrl: string;
}

interface SingleCouponProps {
  valid: number;
  singleCoupon: singleCoupon;
  setCouponRuleAction: (
    code: string,
    promotionType: number,
    targetUrl?: string,
    promotionId?: string,
  ) => void;
  setCouponDetail?: setCouponDetail;
}

const SingleCoupon: React.FunctionComponent<SingleCouponProps> = ({
  valid,
  singleCoupon,
  setCouponRuleAction,
  setCouponDetail,
}) => {
  const {
    discountValue,
    code,
    status,
    effective,
    expire,
    promDesc,
    displayType,
    targetUrl,
    name,
    promotionType,
    promotionId,
    iconUrl,
  } = singleCoupon;
  let discountTypeData = TMPDATA[displayType - 1];
  let buttonClass = "pro-btn ";
  let imgClass = "pro-pic ";
  if (status === 6) {
    buttonClass = "not-started";
  } else if (valid === 1) {
    buttonClass += "valid";
  } else {
    imgClass += "unusable";
  }
  const { imgUrl } = discountTypeData;
  let descLength = 0;
  // let moreDesc = '';
  for (let i = 0; i < promDesc.length; i++) {
    let chars = promDesc.substr(i, 1);
    if (chars.charCodeAt(0) > 255) {
      descLength += 2;
    } else {
      descLength++;
    }
  }
  let tempImt = imgUrl;
  //只有现金券 券值在newChashCouponList内 显示新图片资源
  if (iconUrl) {
    tempImt = iconUrl;
  } else if (displayType === 1 && discountValue && newChashCouponList.indexOf(discountValue) >= 0) {
    tempImt = getCdnImageUrl(`/soa/nmobile/img/coupon/cny${discountValue}.png`);
  }
  return (
    <li className="pro-box-border">
      <div className="pro-box">
        <div className={imgClass}>
          <Image src={tempImt} type="product" />
        </div>
        <div className="pro-desp">
          <div>
            <p className="coupon-name overflow-text-two">
              {status === 4 ? <span className="fast-expiration">快过期</span> : null}
              {name}
            </p>
            <p className="coupon-time">
              限{effective}至{expire}使用
            </p>
            <div className="coupon-desc">
              <p className="coupon-txt overflow-text">{promDesc}</p>
              {descLength > 30 ? (
                <div
                  className="coupon-detail"
                  onClick={() => {
                    if (Sensor.go) {
                      Sensor.go("myAccount_CouponClick", {
                        button_name: "查看详情",
                      });
                    }
                    return valid === 1
                      ? setCouponDetail &&
                          setCouponDetail({
                            desc: promDesc,
                            link: targetUrl,
                          })
                      : null;
                  }}
                >
                  <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png" />
                </div>
              ) : null}
            </div>
          </div>
          <div
            className={buttonClass}
            onClick={() => {
              setCouponRuleAction(code, promotionType, targetUrl, promotionId);
            }}
          >
            {["已使用", "去使用", "已过期", "去使用", "已使用", "未开始"][status - 1]}
          </div>
        </div>
      </div>
    </li>
  );
};
export default SingleCoupon;
