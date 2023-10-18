/*
 * @Author: Leo.Si
 * @Date: 2020-01-09 10:52:05
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2020-12-08 14:38:23
 * @function login page
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { mapFunLoginToRun } from "../../actions/login";
import OiaWrap from "../../components/OiaWrap";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/login.scss");
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentComponentIndex: null,
      CommonPageTitle: null,
      CurrentComponentCommonTop: null,
      PopupAlert: null,
    };
  }

  componentDidMount() {
    require.ensure([], () => {
      this.setState({
        CurrentComponentIndex: require("../../components/LoginStatePages/Login/index").default,
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index").default,
        PopupAlert: require("../../components/PopupAlert").default,
      });
    });
  }
  render() {
    const { CommonPageTitle, CurrentComponentCommonTop, CurrentComponentIndex, PopupAlert } =
      this.state;
    const { pageStatus, mapFunLoginToRun, NO_TITLE } = this.props;
    return (
      <div className="login-page">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && !NO_TITLE && <CommonPageTitle _isBack />}
        {CurrentComponentIndex && (
          <CurrentComponentIndex _status={pageStatus} _clickCallback={mapFunLoginToRun} />
        )}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { login } = state;
  const { pageStatus, NO_TITLE } = login;
  return {
    pageStatus,
    NO_TITLE,
  };
};
export default OiaWrap(
  connect(mapStateToProps, {
    mapFunLoginToRun,
  })(Login),
);
