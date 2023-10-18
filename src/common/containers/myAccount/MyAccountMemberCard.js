/*
 * @Author: Leo.Si
 * @Date: 2019-08-19 17:57:04
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-02-01 19:11:15
 * @function 会员权益页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { mapFuncToRun, memberCardInit } from "../../actions/myAccount";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountMemberCard.scss");
}

class MyAccountMemberCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      MyAccountMemberCardInfo: null,
      MyAccountMemberCardSlide: null,
      PopupAlert: null,
      CurrentComponentCommonTop: null,
    };
  }
  componentDidMount() {
    this.props.memberCardInit();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        MyAccountMemberCardInfo:
          require("../../components/MyAccount/MyAccountMemberCard/MyAccountMemberCardInfo").default,
        MyAccountMemberCardSlide:
          require("../../components/MyAccount/MyAccountMemberCard/MyAccountMemberCardSlide")
            .default,
        PopupAlert: require("../../components/PopupAlert").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index").default,
      });
    });
  }
  render() {
    const {
      CommonPageTitle,
      MyAccountMemberCardInfo,
      MyAccountMemberCardSlide,
      PopupAlert,
      CurrentComponentCommonTop,
    } = this.state;
    const { UIMember, mapFuncToRun, results } = this.props;
    return (
      <div className="myAccount_integral_member_card">
        {CommonPageTitle && <CommonPageTitle _isBack={true} _href="/myAccount" _title="会员权益" />}
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {MyAccountMemberCardInfo && (
          <MyAccountMemberCardInfo _data={UIMember} _clickCallback={mapFuncToRun} />
        )}
        {MyAccountMemberCardSlide && (
          <MyAccountMemberCardSlide _data={UIMember} _results={results} />
        )}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { myAccount, globalReference } = state;
  const { UIMember } = myAccount;
  const { USER_USERCARDINFO } = globalReference;
  const { results } = USER_USERCARDINFO;
  return { UIMember, results };
};
export default connect(mapStateToProps, {
  mapFuncToRun,
  memberCardInit,
})(MyAccountMemberCard);
