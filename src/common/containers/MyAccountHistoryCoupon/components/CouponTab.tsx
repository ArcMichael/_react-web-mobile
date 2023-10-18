import React from "react";
import { depositCoupon } from "../../../components/MyAccount/MyAccountCoupon/CouponBody";

type tabCallback = (v: number, ifSendReq: boolean) => void;
interface CouponTabProps {
  depositCouponResults: depositCoupon[];
  nowValid: number;
  tabCallback: tabCallback;
}
//tab切换
const handleClickTab = (tabCallback: tabCallback, v: number) => {
  tabCallback && tabCallback(v, false);
};

const CouponTab: React.FunctionComponent<CouponTabProps> = ({
  depositCouponResults,
  nowValid,
  tabCallback,
}) => (
  <ul className="tab-title">
    {depositCouponResults.map((data, i) => {
      const { valid, name } = data;
      if (i === 0) return null;
      return (
        <li
          key={"couponTab" + i}
          onClick={handleClickTab.bind(this, tabCallback, valid)}
          className={valid === nowValid ? "tab cur" : "tab"}
        >
          {name}
          <div className="coupon-tab-cur" />
        </li>
      );
    })}
  </ul>
);
export default CouponTab;
