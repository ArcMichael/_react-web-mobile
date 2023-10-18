/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-16 17:42:36
 * @function login page
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { bindActionCreators } from "redux";
import PopupAlert from "@/components/PopupAlert";
import LoginSetPassWrod from "./components/LoginSetPassWrod";
import LoginEnter from "./components/LoginEnter";
import LoginSetUeserInfo from "./components/LoginSetUeserInfo";

import { mapFunLoginToRun } from "../../actions/login";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/loginNew.scss");
}

const showType = {
  loginEnter: LoginEnter, // 密码/验证码 登录页面
  // loginStoreMember: LoginStoreMember,
  loginStoreMemberHaveCard: LoginSetPassWrod, //设置密码
  // loginStoreMemberChooseCard: LoginStoreMemberChooseCard,
  // loginStoreMemberTieCard: LoginStoreMemberTieCard,
  loginStoreMemberImproveInfo: LoginSetUeserInfo, //留资页面
};

interface LoginState {
  pageStatus: string;
}

const LoginTwo: React.FunctionComponent<LoginState> = (props) => {
  let ComponentDetail = showType[props.pageStatus];
  return (
    <div>
      <PopupAlert />

      {/* <LoginSetUeserInfo _clickCallback={mapFunLoginToRun} /> */}
      <ComponentDetail _clickCallback={mapFunLoginToRun} />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { login } = state;
  const { pageStatus, NO_TITLE } = login;
  return {
    pageStatus,
    NO_TITLE,
  };
};
export default connect(mapStateToProps, (dispatch) => ({
  mapFunLoginToRun: bindActionCreators(mapFunLoginToRun, dispatch),
}))(LoginTwo);
