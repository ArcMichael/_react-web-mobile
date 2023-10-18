/*
 * @Author: Leo.Si
 * @Date: 2019-12-10 15:02:29
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2020-04-09 15:07:41
 * @function register
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { mapFunRegisterToRun } from "../../actions/register";
import { isWeChatForLand } from "../../lib/Tools";
import * as url from "../../lib/url";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/register.scss");
}
class Register extends React.Component {
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
        CurrentComponentIndex: require("../../components/LoginStatePages/Register/index").default,
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index").default,
        PopupAlert: require("../../components/PopupAlert").default,
      });
    });
  }
  render() {
    const { CommonPageTitle, CurrentComponentCommonTop, CurrentComponentIndex, PopupAlert } =
      this.state;
    const { pageStatus, card_list, mapFunRegisterToRun, registerInfo } = this.props;
    return (
      <div
        className={`  ${
          pageStatus && pageStatus == "registerEnter" ? "register-page_nobg" : "register-page"
        }`}
      >
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && !isWeChatForLand() && (
          <CommonPageTitle
            _isBack={true}
            _href={`${url.urlGetParams(window.location, "historyLocation") ? "" : "/"}${
              decodeURIComponent(window.location.search.replace("?historyLocation=", "")).replace(
                "&",
                "?",
              ) || ""
            }`}
          />
        )}
        {CurrentComponentIndex && (
          <CurrentComponentIndex
            _info={registerInfo}
            _status={pageStatus}
            _cardList={card_list}
            _clickCallback={mapFunRegisterToRun}
          />
        )}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { register } = state;
  const { pageStatus, card_list, registerInfo } = register;
  return {
    pageStatus,
    card_list,
    registerInfo,
  };
};
export default connect(mapStateToProps, {
  mapFunRegisterToRun,
})(Register);
