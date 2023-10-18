import React, { useState } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import { RouteProps } from "react-router";
import ComponentMyCouponRule from "../../components/MyAccount/MyAccountCoupon/MyCouponRule";
import ComponentMycoupon from "./components/MyCoupon";
import CurrentComponentCommonTop from "../../components/CommonTop/index";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myCoupon.scss");
}

const MyAccountHistoryCoupon: React.FunctionComponent<RouteProps> = () => {
  const [isShowRule, setIsShowRule] = useState(false);

  return (
    <div className="myAccount_myCoupon">
      <CurrentComponentCommonTop />
      <ComponentMycoupon
        key="ComponentMycoupon"
        toggleCouponRule={() => setIsShowRule(!isShowRule)}
      />
      <ComponentMyCouponRule
        key="ComponentMyCouponRule"
        isShowRule={isShowRule}
        toggleCouponRule={() => setIsShowRule(!isShowRule)}
      />
    </div>
  );
};

export default MyAccountHistoryCoupon;
