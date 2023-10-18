/*
 * @Author: Leo.Si
 * @Date: 2020-06-10 11:18:56
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-09-Mo 03:29:18
 * @function 我的订单物流信息页
 */

import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import CommonPageTitle from "@/components/CommonPageTitle";
// GuessYouLike
import GuessYouLike from "@/components/PlpPage/GuessYouLike";
import PopupAlert from "@/components/PopupAlert";
import CurrentComponentCommonTop from "@/components/CommonTop";
import CurrentAdvertisingModule from "@/containers/MyOrder/OrderList/components/AdvertisingModule";
import CurrentComponentIndex from "@/components/MyOrder/LogisticsInfo";
import { initOrderDelivery } from "../../actions/myOrder";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/logisticsInfo.scss");
}
class LogisticsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryData: null,
      hrefLink: null,
    };
  }
  componentDidMount() {
    let that = this;
    this.props.initOrderDelivery((callback) => {
      that.setState({
        deliveryData: callback.data,
        hrefLink: callback.hrefBack,
      });
    });
  }
  render() {
    const { deliveryData, hrefLink } = this.state;

    return (
      <div className="myAccount_center">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && (
          <CommonPageTitle _isBack={true} _title="物流详情" _href={hrefLink} />
        )}

        <CurrentAdvertisingModule
          _locationLabel={{
            queryBody: { locationLabel: "MOB:logistics:TOP_TEXT_CAROUSEL" },
          }}
        />

        <CurrentComponentIndex _data={deliveryData} />
        {/* <GuseeYouLike _title="猜你喜欢" logic="PERSONAL_MOBILE_CART" /> */}
        {GuessYouLike && (
          <GuessYouLike
            _title="推荐"
            type="search"
            listTitle="订单详情:"
            listType="Guess You Like_OrderDetail"
          />
        )}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  initOrderDelivery,
})(LogisticsInfo);
