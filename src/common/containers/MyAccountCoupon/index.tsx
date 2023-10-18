import React, { useState } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import { RouteProps } from "react-router";
import ComponentMyCouponRule from "../../components/MyAccount/MyAccountCoupon/MyCouponRule";
import ComponentMycoupon from "./components/MyCoupon";
import ComponentCommonTop from "../../components/CommonTop/index";
import ComponentMyCouponDetail from "../../components/MyAccount/MyAccountCoupon/MyCouponDetail";
import { couponDetail } from "../../components/MyAccount/MyAccountCoupon/CouponBody";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myCoupon.scss");
}

const MyAccountCoupon: React.FunctionComponent<RouteProps> = () => {
  const [isShowRule, setIsShowRule] = useState(false);
  const [couponDetail, setCouponDetail] = useState({} as couponDetail);
  return (
    <div className="myAccount_myCoupon">
      <ComponentCommonTop />
      <ComponentMycoupon
        key="ComponentMycoupon"
        setCouponDetail={(data: couponDetail) => {
          setCouponDetail(data);
        }}
        toggleCouponRule={() => setIsShowRule(!isShowRule)}
      />
      <ComponentMyCouponRule
        key="ComponentMyCouponRule"
        isShowRule={isShowRule}
        toggleCouponRule={() => setIsShowRule(!isShowRule)}
      />
      <ComponentMyCouponDetail
        key="ComponentMyCouponDetail"
        couponDetail={couponDetail}
        setCouponDetail={(data) => setCouponDetail(data)}
      />
    </div>
  );
};

export default MyAccountCoupon;
