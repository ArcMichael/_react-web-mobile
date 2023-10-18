import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import First from "../components/ForgottenPassword/First";
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
      historyLocation: null,
      PopupAlert: null,
      SecondPhone: null,
      SecondEmail: null,
    };
  }

  componentDidMount() {
    const backUrl = decodeURIComponent(
      window.location.search.replace("?historyLocation=", ""),
    ).replace("&", "?");

    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../components/CommonTop/index").default,
        CommonPageTitle: require("../components/CommonPageTitle").default,
        historyLocation: backUrl,
        PopupAlert: require("../components/PopupAlert").default,
        SecondPhone: require("../components/ForgottenPassword/SecondPhone").default,
        SecondEmail: require("../components/ForgottenPassword/SecondEmail").default,
      });
    });
  }

  render() {
    const {
      CurrentComponentCommonTop,
      CommonPageTitle,
      historyLocation,
      PopupAlert,
      SecondPhone,
      SecondEmail,
    } = this.state;
    const { secondshow } = this.props;
    return (
      <div className="forgetPassword">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && <CommonPageTitle _href={historyLocation} _isBack />}
        <div className="content">
          <p className="title">忘记密码</p>
          {!secondshow && <First />}
          {secondshow === "phone" && SecondPhone ? <SecondPhone /> : null}
          {secondshow === "email" && SecondEmail ? <SecondEmail /> : null}

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
