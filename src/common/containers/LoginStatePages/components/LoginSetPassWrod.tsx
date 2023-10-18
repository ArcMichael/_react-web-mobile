/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-20 11:41:14
 * @function login page
 */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BaseInput from "./BaseInput";

import { setLoginPassword } from "../../../actions/login";

interface LoginSetPassWrodState {
  STORE_MEMBER_DATA: Object;
  setLoginPassword: Function;
}

const LoginSetPassWrod: React.FunctionComponent<LoginSetPassWrodState> = (props) => {
  const STORE_MEMBER_DATA = props.STORE_MEMBER_DATA;
  const [btnShow, setBtnShow] = useState(false);
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  useEffect(() => {
    if (password && checkPassword) {
      setBtnShow(true);
    } else {
      setBtnShow(false);
    }
  }, [password, checkPassword]);

  // 开启线上账户
  const handClick = () => {
    const { setLoginPassword } = props;
    setLoginPassword({
      password,
      checkPassword,
    });
  };

  const goLogin = () => {
    window.location.reload();
  };

  return (
    <div className="login-page">
      <div className="login-title">
        <img
          onClick={goLogin}
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
        />
        <span />
      </div>
      <div className="login-setPass">设置密码</div>
      <div className="login-pass-tip">8-16位大小写字母、数字和特殊符号的组合</div>
      <div className="login-user-pass">
        <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/quest/images/check.png" alt="" />
        <span>
          恭喜您获得了会员卡
          {STORE_MEMBER_DATA &&
            STORE_MEMBER_DATA.cardInfoDtos &&
            STORE_MEMBER_DATA.cardInfoDtos[0] &&
            STORE_MEMBER_DATA.cardInfoDtos[0].id}
          ，设置密码即刻登录
        </span>
      </div>
      <BaseInput
        _setValue={setPassword}
        _placeholder="设置登录密码"
        _autocomplete="off"
        _type="password"
        _class="passwordMargin"
      />
      <BaseInput
        _setValue={setCheckPassword}
        _placeholder="确认密码"
        _autocomplete="off"
        _type="password"
      />

      <div className={`login-btn ${btnShow ? "login-active" : ""}`} onClick={handClick}>
        登录
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  let { login } = state;
  let { STORE_MEMBER_DATA, STORE_TIP } = login;
  return {
    STORE_MEMBER_DATA,
    STORE_TIP,
  };
};

export default connect(mapStateToProps, (dispatch) => ({
  setLoginPassword: bindActionCreators(setLoginPassword, dispatch),
}))(LoginSetPassWrod);
