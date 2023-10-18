import React from "react";
import { connect } from "react-redux";

import isBrowser from "@/Utils/utils/isBrowser";
if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/forgottenPassword.scss");
}
class ForgottenPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentComponentCommonTop: null,
      CommonPageTitle: null,
      PopupAlert: null,
      First: null,
    };
  }

  componentDidMount() {
    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../components/CommonTop/index").default,
        CommonPageTitle: require("../components/CommonPageTitle").default,

        PopupAlert: require("../components/PopupAlert").default,
        First: require("../components/ResetPassword").default,
      });
    });
  }

  render() {
    const { CurrentComponentCommonTop, CommonPageTitle, PopupAlert, First } = this.state;
    return (
      <div className="forgetPassword">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && <CommonPageTitle _isBack />}
        <div className="content">
          {First && <First />}
          {PopupAlert && <PopupAlert />}
        </div>
      </div>
    );
  }
}
export default connect(
  (state) => {
    const { login } = state;
    const { secondshow } = login;
    return { secondshow };
  },
  (dispatch) => ({
    // login: bindActionCreators(login, dispatch),
    dispatch,
  }),
)(ForgottenPassword);
