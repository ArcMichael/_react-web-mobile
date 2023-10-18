/*
 * @Author: Leo.Si
 * @Date: 2019-09-19 19:52:35
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-10-13 10:45:47
 * @function OnlineReturn  用户申请退货详情编辑页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { returnDetailsInit, mapFuncToRun } from "../../actions/onlineReturn";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountApplyReturn.scss");
}
class MyAccountReturnDetailsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      CurrentComponentCommonTop: null,
      OnlineReturnDetailsEditModule: null,
    };
  }
  componentDidMount() {
    this.props.returnDetailsInit();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        OnlineReturnDetailsEditModule:
          require("../../components/MyAccount/MyAccountOnlineReturn/OnlineReturnDetail/OnlineReturnDetailsEditModule")
            .default,
      });
    });
  }
  render() {
    const {
      CommonPageTitle,
      CurrentComponentCommonTop,
      OnlineReturnDetailsEditModule,
    } = this.state;
    const { returnDetailsData, mapFuncToRun } = this.props;
    return (
      <div className="online_return_details_edit">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && (
          <CommonPageTitle _isBackV2={true} _title="编辑退货详情" />
        )}
        {OnlineReturnDetailsEditModule && (
          <OnlineReturnDetailsEditModule
            _returnDetailsData={returnDetailsData}
            _clickCallback={mapFuncToRun}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { onlineReturn } = state;
  const { returnDetailsData } = onlineReturn;
  return {
    returnDetailsData,
  };
};
export default connect(mapStateToProps, {
  returnDetailsInit,
  mapFuncToRun,
})(MyAccountReturnDetailsEdit);
