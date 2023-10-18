import React from "react";
import { connect } from "react-redux";
// import CommonPageTitle from "../../CommonPageTitle/index";
import HistoryCoupon from "./HistoryCoupon";
import { couponHistory } from "../../../actions/couponHistory";
class HistoryCouponBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      windowHeight: "",
      dataAjax: true,
    };
  }

  componentDidMount() {
    const { windowHeight, dataAjax } = this.state; // TODO: 请移除无用state
    console.log(windowHeight, dataAjax);
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../CommonPageTitle").default,
      });
    });
    const { couponHistory } = this.props;
    couponHistory && couponHistory({ pageNum: 1, pageSize: 15 });
  }
  render() {
    const { myHistoryCoupon, couponHistory, toggleCouponRule } = this.props;
    const { CommonPageTitle } = this.state;
    return (
      <div className="my-discount">
        <div className="myCoupon_top">
          {CommonPageTitle && (
            <CommonPageTitle
              _title="全部历史记录"
              _isBackV2
              _customRight={
                <img
                  src="https://ssl1.sephorastatic.cn/soa/mobile/images/myAccount/coupon-rule.png"
                  className="coupon_help"
                  onClick={toggleCouponRule}
                />
              }
            />
          )}
        </div>
        <div>
          <HistoryCoupon
            couponHistory={couponHistory}
            myHistoryCoupon={myHistoryCoupon}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { myHistoryCoupon } = myAccount;
  return {
    myHistoryCoupon,
  };
};

export default connect(mapStateToProps, { couponHistory })(HistoryCouponBody);
