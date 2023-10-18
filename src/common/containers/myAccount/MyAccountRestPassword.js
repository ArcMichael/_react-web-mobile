/*
 * @Author: Leo.Si
 * @Date: 2019-08-27 15:30:23
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2020-12-29 17:07:49
 * @function  用户重置密码页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { initialSetPassWord, mapFunSetPassWordToRun } from "../../actions/myAccount";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountRestPassword.scss");
}
class MyAccountRestPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      ModuleContent: null,
      PopupAlert: null,
      CurrentComponentCommonTop: null,
    };
  }
  componentDidMount() {
    this.props.initialSetPassWord();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        ModuleContent: require("../../components/MyAccount/MyAccountRestPassword/index").default,
        PopupAlert: require("../../components/PopupAlert").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index").default,
      });
    });
  }
  render() {
    const { CommonPageTitle, ModuleContent, PopupAlert, CurrentComponentCommonTop } = this.state;
    const { mapFunSetPassWordToRun, pageShow, profile, cardlist, userMobile } = this.props;
    return (
      <div className="myAccount_center">
        {CommonPageTitle && <CommonPageTitle _isBack={true} _title="更改登录密码" />}
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {ModuleContent && (
          <ModuleContent
            _profile={profile}
            _cardlist={cardlist}
            _userMobile={userMobile}
            _status={pageShow}
            _clickCallback={mapFunSetPassWordToRun}
          />
        )}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { pageShow, profile, cardlist, userMobile } = myAccount;
  return {
    pageShow,
    profile,
    cardlist,
    userMobile,
  };
};
export default connect(mapStateToProps, {
  initialSetPassWord,
  mapFunSetPassWordToRun,
})(MyAccountRestPassword);
