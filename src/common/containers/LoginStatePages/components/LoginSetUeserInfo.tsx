/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-20 11:14:35
 * @function login page
 */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DatePicker from "react-mobile-datepicker";
import moment from "moment";
import BaseInput from "./BaseInput";

import { setLoginPersonalInfo } from "../../../actions/login";

interface LoginSetPassWrodState {
  PERSONAL_INFO: Object;
  setLoginPersonalInfo: Function;
}

const LoginSetPassWrod: React.FunctionComponent<LoginSetPassWrodState> = (props) => {
  const [btnShow, setBtnShow] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isTip, setIsTip] = useState(false);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState(""); // M男   F女

  useEffect(() => {
    if (name && birthday && gender) {
      setBtnShow(true);
    } else {
      setBtnShow(false);
    }
  }, [name, birthday, gender]);

  // 开启线上账户
  const handClick = () => {
    if (!btnShow) return false;
    const { setLoginPersonalInfo } = props;
    setLoginPersonalInfo({
      name,
      birthday,
      gender,
    });
  };

  const imgReturn = (state: boolean) => {
    if (state) {
      return (
        <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/quest/images/select.png" alt="" />
      );
    } else {
      return (
        <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/quest/images/empty.png" alt="" />
      );
    }
  };

  const handleCancel = () => {
    changeDate(false);
  };

  const handleSelect = (time: Date) => {
    changeDate(false);
    setTime(time);
    setBirthday(moment(time).format("YYYY-MM-DD"));
  };

  const changeDate = (type: boolean) => {
    setIsTip(type);
    setIsOpen(type);
  };

  const goBack = () => {
    const historyPath =
      decodeURIComponent(window.location.search.replace("?historyLocation=", "")).replace(
        "&",
        "?",
      ) || "";
    window.location.href = `/register?historyLocation=${historyPath}`;
  };

  return (
    <div className="login-page">
      <div className="login-title">
        <img
          onClick={goBack}
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
        />
        <span />
      </div>
      <div className="login-setPass">完善个人信息</div>
      <div className="login-pass-tip">您还差一步享受兑换积分等福利，完善信息开启线上账户</div>
      <div className="login-user-pass">
        <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupTipsIcon.png" alt="" />
        <span>生日仅能设置一次，请谨慎填写</span>
      </div>

      <div className="login_birthday_box" onClick={() => changeDate(true)}>
        {birthday ? <span>{birthday}</span> : "生日"}
        <img
          className="login_birthday_icon"
          src="https://ssl1.sephorastatic.cn/soa/nmobile/img/datePick.png"
        />
      </div>
      <BaseInput _setValue={setName} _placeholder="昵称" _class="mb16" />
      <div className="login-gender">
        <div onClick={() => setGender("M")}>
          <span>男</span>
          {imgReturn(gender === "M")}
        </div>
        <div onClick={() => setGender("F")}>
          <span>女</span>
          {imgReturn(gender === "F")}
        </div>
      </div>
      <div className={`login-btn ${btnShow ? "login-active" : ""}`} onClick={handClick}>
        确认
      </div>
      {isTip && (
        <div className="privateInfo_module_bir_tip">
          <i className="errorTip" />
          <i className="errorWords">生日仅能设置一次，请谨慎填写。</i>
          <i className="errorClose" />
        </div>
      )}
      <DatePicker value={time} isOpen={isOpen} onSelect={handleSelect} onCancel={handleCancel} />
    </div>
  );
};

const mapStateToProps = (state) => {
  let { login } = state;
  let { PERSONAL_INFO } = login;
  return {
    PERSONAL_INFO,
  };
};

export default connect(mapStateToProps, (dispatch) => ({
  setLoginPersonalInfo: bindActionCreators(setLoginPersonalInfo, dispatch),
}))(LoginSetPassWrod);
