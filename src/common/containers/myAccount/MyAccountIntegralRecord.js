/*
 * @Author: Leo.Si
 * @Date: 2019-08-19 11:09:40
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-09-02 17:41:53
 * @function 用户中心----积分记录页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { initIntegralFlow, memberCardInit } from "../../actions/myAccount";
import ScrollContainer from "../../components/ScrollContainer/index";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountIntegralRecord.scss");
}
class MyAccountIntegralRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      MyAccountIntegralRecordInfo: null,
      MyAccountIntegralRecordList: null,
      CurrentComponentCommonTop: null,
    };
  }
  componentDidMount() {
    this.props.initIntegralFlow(1);
    this.props.memberCardInit();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        MyAccountIntegralRecordInfo:
          require("../../components/MyAccount/MyAccountIntegralRecord/MyAccountIntegralRecordInfo")
            .default,
        MyAccountIntegralRecordList:
          require("../../components/MyAccount/MyAccountIntegralRecord/MyAccountIntegralRecordList")
            .default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
      });
    });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isBottom !== this.props.isBottom && nextProps.isBottom) {
      this.props.initIntegralFlow(
        nextProps &&
          nextProps.integralFlowData &&
          nextProps.integralFlowData.pageNo + 1
      );
    }
  }
  render() {
    const {
      CommonPageTitle,
      MyAccountIntegralRecordInfo,
      MyAccountIntegralRecordList,
      CurrentComponentCommonTop,
    } = this.state;
    const { integralFlowData, UIMember } = this.props;
    return (
      <div className="myAccount_integral_record">
        {CommonPageTitle && (
          <CommonPageTitle _isBack={true} _title="积分记录" />
        )}
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {MyAccountIntegralRecordInfo && (
          <MyAccountIntegralRecordInfo _data={UIMember} />
        )}
        {MyAccountIntegralRecordList && (
          <MyAccountIntegralRecordList _data={integralFlowData} />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { integralFlowData, UIMember } = myAccount;
  return { integralFlowData, UIMember };
};
export default connect(mapStateToProps, {
  initIntegralFlow,
  memberCardInit,
})(ScrollContainer(MyAccountIntegralRecord));
