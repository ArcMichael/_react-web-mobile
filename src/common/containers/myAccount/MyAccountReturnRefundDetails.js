/*
 * @Author: Leo.Si
 * @Date: 2019-09-20 16:25:49
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-10-14 14:23:37
 * @function 用户退款明细页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import {
  returnRefundDetailsInit,
  mapFuncToRun,
} from "../../actions/onlineReturn";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountApplyReturn.scss");
}
class MyAccountReturnRefundDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      CurrentComponentCommonTop: null,
      ReturnRefundDetails: null,
    };
  }
  componentDidMount() {
    this.props.returnRefundDetailsInit();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        ReturnRefundDetails:
          require("../../components/MyAccount/MyAccountOnlineReturn/OnlineReturnDetail/ReturnRefundDetails")
            .default,
      });
    });
  }
  render() {
    const { CommonPageTitle, CurrentComponentCommonTop, ReturnRefundDetails } =
      this.state;
    const { refundDetails, mapFuncToRun } = this.props;
    return (
      <div className="online_return_refind_details_page">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && (
          <CommonPageTitle _isBackV2={true} _title="退款明细" />
        )}
        {ReturnRefundDetails && (
          <ReturnRefundDetails
            _refundDetails={refundDetails}
            _callback={mapFuncToRun}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { onlineReturn } = state;
  const { refundDetails } = onlineReturn;
  return {
    refundDetails,
  };
};
export default connect(mapStateToProps, {
  returnRefundDetailsInit,
  mapFuncToRun,
})(MyAccountReturnRefundDetails);
