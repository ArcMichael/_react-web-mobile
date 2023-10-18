/*
 * @Author: Leo.Si
 * @Date: 2019-09-19 19:52:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-23 16:04:11
 * @function OnlineReturn  用户申请退货详情页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import * as url from "../../lib/url";
import { returnDetailsInit, mapFuncToRun } from "../../actions/onlineReturn";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountApplyReturn.scss");
}
class MyAccountReturnDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      CurrentComponentCommonTop: null,
      OnlineReturnStaus: null,
      OnlineReturnDetailsPageModule: null,
    };
  }
  componentDidMount() {
    this.props.returnDetailsInit();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        OnlineReturnStaus:
          require("../../components/MyAccount/MyAccountOnlineReturn/ProgressSpeed")
            .default,
        OnlineReturnDetailsPageModule:
          require("../../components/MyAccount/MyAccountOnlineReturn/OnlineReturnDetail/OnlineReturnDetailsPageModule")
            .default,
      });
    });
  }
  render() {
    const {
      CommonPageTitle,
      CurrentComponentCommonTop,
      OnlineReturnStaus,
      OnlineReturnDetailsPageModule,
    } = this.state;
    const { status, mapFuncToRun, returnDetailsData, applyNoScroll, returnDetailsLogistics} =
      this.props;
    return (
      <div
        className="online_return_details_page"
        style={{
          height: applyNoScroll ? "100%" : "auto",
          position: applyNoScroll ? "fixed" : "static",
        }}
      >
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && (
          <CommonPageTitle
            _isBackV2={true}
            _title="退货/售后"
            _href={`${
              url.urlGetParams(window.location, "orderPage")
                ? `/order-${url.urlGetParams(
                    window.location,
                    "orderId"
                  )}.html?orderType=all`
                : url.urlGetParams(window.location, "goback")
                ? "/myAccount/returnList"
                : ""
            }`}
            _isCustomer={true}
          />
        )}
        {OnlineReturnStaus && <OnlineReturnStaus _status={status} />}
        {OnlineReturnDetailsPageModule && (
          <OnlineReturnDetailsPageModule
            _returnDetailsData={returnDetailsData}
            _clickCallback={mapFuncToRun}
            _isSumbit={returnDetailsLogistics.logisticsNumber && returnDetailsLogistics.logisticsCompany && returnDetailsLogistics.logisticsCompany !== "请选择"}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { onlineReturn } = state;
  const { status, recoreReason, returnDetailsData, applyNoScroll, returnDetailsLogistics } =
    onlineReturn;
  return {
    status,
    recoreReason,
    returnDetailsData,
    applyNoScroll,
    returnDetailsLogistics
  };
};
export default connect(mapStateToProps, {
  returnDetailsInit,
  mapFuncToRun,
})(MyAccountReturnDetails);
