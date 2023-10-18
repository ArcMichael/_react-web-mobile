/*
 * @Author: summer
 * @Date: 2021-02-Mo 04:42:56
 * @Last Modified by:   summer
 * @Last Modified time: 2021-02-Mo 04:42:56
 */

import React from "react";
import isBrowser from "@/Utils/utils/isBrowser";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myCoupon.scss");
}
class HistoryCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      HistoryCoupon: null,
      ComponentMyCouponRule: null,
      isShowRule: false,
    };
    this.toggleCouponRule = this.toggleCouponRule.bind(this);
  }
  toggleCouponRule() {
    const { isShowRule } = this.state;
    this.setState({
      isShowRule: !isShowRule,
    });
  }
  componentDidMount() {
    require.ensure([], () => {
      this.setState({
        HistoryCoupon:
          require("../../components/MyAccount/MyAccountCoupon/HistoryCouponBody")
            .default,
        ComponentMyCouponRule:
          require("../../components/MyAccount/MyAccountCoupon/MyCouponRule")
            .default,
      });
    });
  }

  render() {
    const { HistoryCoupon, ComponentMyCouponRule, isShowRule } = this.state;
    return (
      <div className="myAccount_myCoupon">
        <div id="apptitle">历史优惠券</div>
        {HistoryCoupon && (
          <HistoryCoupon toggleCouponRule={this.toggleCouponRule} />
        )}
        {ComponentMyCouponRule && (
          <ComponentMyCouponRule
            key="ComponentMyCouponRule"
            isShowRule={isShowRule}
            toggleCouponRule={this.toggleCouponRule}
          />
        )}
      </div>
    );
  }
}
export default HistoryCoupon;
