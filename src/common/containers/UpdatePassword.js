import React from "react";
import { connect } from "react-redux";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import isBrowser from "@/Utils/utils/isBrowser";
import Mobile from "../components/Updatepassword/mobile";
import Email from "../components/Updatepassword/email";
import EmailTwo from "../components/Updatepassword/emailTwo";
import { updateErrorMessage } from "../actions/registerForKugou";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/updatePassword.scss");
}
class UpdatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PopupAlert: null,
    };
  }
  componentDidMount() {
    const query = getLocationQuery();
    let code = query.code;
    let loginId = atob(query.loginId);
    let _phoneReg = /^1\d{10}$/;
    let data;
    let { updateErrorMessage } = this.props;
    if (_phoneReg.test(loginId)) {
      data = {
        errorCode: code,
        type: "mobile",
        mobile: loginId,
        mobileNumber: loginId.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2"),
      };
    } else {
      data = {
        errorCode: code,
        type: "email",
        emailNumber: loginId,
      };
    }
    updateErrorMessage(data, () => {
      require.ensure([], () => {
        this.setState({
          CommonPageTitle: require("../components/CommonPageTitle").default,
          PopupAlert: require("../components/PopupAlert").default,
        });
      });
    });
  }

  render() {
    let { CommonPageTitle, PopupAlert } = this.state;
    let { body } = this.props;
    return (
      <div className="updatapassword">
        {CommonPageTitle && <CommonPageTitle _isBack={true} />}
        {body && !body.mobial_two && body.type == "mobile" && <Mobile />}
        {body && !body.email_two && body.type == "email" && <Email />}
        {/* {body.mobial_two && <MobileTwo />} */}
        {body.email_two && <EmailTwo />}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { myAccount } = state;
  let { body } = myAccount;
  return { body };
};
export default connect(mapStateToProps, {
  updateErrorMessage,
})(UpdatePassword);
