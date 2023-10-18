/*
 * @Author: Leo.Si
 * @Date: 2019-08-17 13:34:59
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-09-09 14:06:48
 * @function 账号管理页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { mapFuncToRun, managementInit, memberCardInit } from "../../actions/myAccount";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountManagement.scss");
}
class MyAccountManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      MyAccountManagementInfo: null,
      PopupAlert: null,
      CurrentComponentCommonTop: null,
    };
  }
  componentDidMount() {
    this.props.managementInit();
    this.props.memberCardInit();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        MyAccountManagementInfo:
          require("../../components/MyAccount/MyAccountManagement/MyAccountManagementInfo").default,
        PopupAlert: require("../../components/PopupAlert").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index").default,
      });
    });
  }
  render() {
    const { CommonPageTitle, MyAccountManagementInfo, PopupAlert, CurrentComponentCommonTop } =
      this.state;
    const { mapFuncToRun, UIManagement, UIMember } = this.props;
    return (
      <div className="myAccount_management">
        {CommonPageTitle && <CommonPageTitle _isBack={true} _href="/myAccount" _title="账号管理" />}
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {MyAccountManagementInfo && (
          <MyAccountManagementInfo
            _data={UIManagement}
            _userGroup={UIMember}
            _clickCallback={mapFuncToRun}
          />
        )}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { UIManagement, UIMember } = myAccount;
  return { UIManagement, UIMember };
};
export default connect(mapStateToProps, {
  mapFuncToRun,
  managementInit,
  memberCardInit,
})(MyAccountManagement);
