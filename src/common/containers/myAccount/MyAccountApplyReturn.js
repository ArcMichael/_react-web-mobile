/*
 * @Author: Leo.Si
 * @Date: 2019-09-10 15:19:20
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-23 18:20:24
 * @function OnlineReturn  用户申请退货页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { applyReturnInit, mapFuncToRun } from "../../actions/onlineReturn";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountApplyReturn.scss");
}
class MyAccountApplyReturn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      CurrentComponentCommonTop: null,
      OnlineReturnStaus: null,
      OnlineReturnDetail: null,
    };
  }
  componentDidMount() {
    this.props.applyReturnInit();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        OnlineReturnStaus:
          require("../../components/MyAccount/MyAccountOnlineReturn/ProgressSpeed")
            .default,
        OnlineReturnDetail:
          require("../../components/MyAccount/MyAccountOnlineReturn/OnlineReturnDetail")
            .default,
      });
    });
  }
  render() {
    const {
      CommonPageTitle,
      CurrentComponentCommonTop,
      OnlineReturnStaus,
      OnlineReturnDetail,
    } = this.state;
    const { status, recoreReason, mapFuncToRun, applyNoScroll, applyData } = this.props;
    return (
      <div
        className="online_return_page"
        style={{
          height: applyNoScroll ? "100%" : "auto",
          position: applyNoScroll ? "fixed" : "static",
          paddingBottom: "1.5rem",
        }}
      >
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && (
          <CommonPageTitle
            _isBackV2={true}
            _title="退货/售后"
            _isCustomer={true}
          />
        )}
        {OnlineReturnStaus && <OnlineReturnStaus _status={status} />}
        {OnlineReturnDetail && (
          <OnlineReturnDetail
            _recoreReason={recoreReason}
            _clickCallback={mapFuncToRun}
            _isSumbit = { applyData && applyData.applyImageOriginalPaths.length && applyData.returnReason}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { onlineReturn } = state;
  const { status, recoreReason, applyNoScroll, applyData } = onlineReturn;
  return {
    status,
    recoreReason,
    applyNoScroll,
    applyData
  };
};
export default connect(mapStateToProps, {
  applyReturnInit,
  mapFuncToRun,
})(MyAccountApplyReturn);
