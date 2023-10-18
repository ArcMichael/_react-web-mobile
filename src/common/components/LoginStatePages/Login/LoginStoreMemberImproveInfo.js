/*
 * @Author: Leo.Si
 * @Date: 2020-03-19 17:44:53
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-14 15:37:14
 * @function 手机验证登陆补全信息
 */
import React from "react";
import $ from "jquery";
import { connect } from "react-redux";
import Dynamic from "@/Utils/Dynamic";
import BaseInput from "../../AtomsInput/Input/BaseInput";
import Button from "../../AtomsInput/Button";
import { setLoginPersonalInfo } from "../../../actions/login";

const dynamic = new Dynamic();

class LoginImprovePersonalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      isOpen: false,
      inputStyleCard: "",
      inputStyleName: "",
      birthday: "",
      isTip: false,
      genderValueM: false,
      genderValueF: false,
      btnStatus: 0,
      name: "",
      DatePicker: null,
    };
    this.closePopup = this.closePopup.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.closeTip = this.closeTip.bind(this);
    this.handClick = this.handClick.bind(this);
  }
  componentDidMount() {
    dynamic.reactMobileDatepicker().then((DatePicker) => {
      this.setState({
        DatePicker,
      });
    });

    const { PERSONAL_INFO } = this.props;
    if (PERSONAL_INFO && PERSONAL_INFO.name) {
      this.setState({
        name: PERSONAL_INFO.name,
        inputStyleName: "modelAnimation",
        btnStatus: 1,
      });
    }
    if (PERSONAL_INFO && PERSONAL_INFO.gender) {
      this.setState({
        genderValueM: PERSONAL_INFO.gender == "M" ? true : false,
        genderValueF: PERSONAL_INFO.gender == "F" ? true : false,
      });
    } else {
      this.setState({
        genderValueM: false,
        genderValueF: true,
      });
    }
  }
  handleCancel() {
    this.setState({ isOpen: false, isTip: false });
  }
  handleSelect(time) {
    dynamic.moment().then((moment) => {
      this.setState({
        birthday: moment(time).format("YYYY-MM-DD"),
        isOpen: false,
        isTip: false,
      });
    });
  }
  // 关闭当前弹框
  closePopup() {
    window.location.href =
      window.location.search.replace("?historyLocation=", "").replace("&", "?") || "/";
  }
  closeTip() {
    this.setState({ isTip: false });
  }
  //设置input的属性值
  setValue(name, callback, nowValue) {
    this.setState(
      {
        [name]: nowValue,
      },
      () => {
        callback && callback.call(this);
      },
    );
    if (name == "setBirthday") {
      this.setState(
        {
          isOpen: true,
          isTip: true,
        },
        () => {
          $(".datepicker").css("height", "6.1rem");
          $(".datepicker-navbar").css({
            height: "1rem",
            "font-size": "0.32rem",
            padding: "0",
            background: "#F5F5F5",
          });
          $(".datepicker-navbar-btn").css({ color: "#000000", "line-height": "3.5em" });
          $(".datepicker-content").css({ "padding-top": "0.2rem", height: "5.1rem" });
          $(".datepicker-viewport").css({ height: "5.1rem" });
          $(".datepicker-wheel").css({ height: "0.8rem" });
          $(".datepicker-scroll>li").css({
            height: "0.8rem",
            "line-height": "0.8rem",
            "font-size": "0.32rem",
          });
          $(".datepicker-scroll").css({ transform: "translateY(-2.4rem) !important" });
        },
      );
    }
  }

  // 校验输入框的值
  checkValue() {
    const { name } = this.state;
    let IsName = name && name.length > 0 ? true : false;
    this.setState({
      btnStatus: IsName ? 1 : 0,
    });
  }

  changeGender(val) {
    if (val == "M") {
      this.setState({
        genderValueM: true,
        genderValueF: false,
      });
    } else if (val == "F") {
      this.setState({
        genderValueF: true,
        genderValueM: false,
      });
    }
  }
  handClick() {
    this.setState({ btnStatus: 2 });
    const { name, birthday, genderValueM } = this.state;
    let gender = genderValueM ? "M" : "F";
    this.props.setLoginPersonalInfo({
      name,
      birthday,
      gender,
    });
  }
  render() {
    let { isOpen, birthday, isTip, name, genderValueF, genderValueM, btnStatus, DatePicker } =
      this.state;
    let minData = new Date(1930, 0, 1);
    let { PERSONAL_INFO } = this.props;
    let isGenderClassM, isGenderClassF;
    isGenderClassM = genderValueM
      ? "wxBindCard_module_gender_button"
      : "wxBindCard_module_gender_button cur";
    isGenderClassF = genderValueF
      ? "wxBindCard_module_gender_button"
      : "wxBindCard_module_gender_button cur";
    return (
      <div className="login_page_enter">
        <div className="login_page_enter_title">
          <p>完善个人信息</p>
          <img
            onClick={this.closePopup}
            src="https://ssl1.sephorastatic.cn/soa/mobile/images/common_searchtop_delete.png"
          />
        </div>
        <p className="login_module_store_member_content_tip">
          您还差一步享受兑换积分等福利，完善信息开启线上账户。
        </p>
        {PERSONAL_INFO && PERSONAL_INFO.birthday ? (
          ""
        ) : (
          <div
            className={"Model " + this.state.inputStyleCard}
            onClick={this.setValue.bind(this, "inputStyleCard", null, "modelAnimation")}
          >
            <p>生日</p>
            <img
              className="login_module_store_member_datepick"
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/datePick.png"
            />
            <div
              className="login_module_store_member_mask"
              onClick={this.setValue.bind(this, "setBirthday", null, "")}
            />
            <BaseInput
              _value={birthday}
              _getValue={this.setValue.bind(this, "birthday", this.checkValue)}
            />
          </div>
        )}
        <div
          style={{ width: "3rem", float: "left" }}
          className={"Model " + this.state.inputStyleName}
          onClick={this.setValue.bind(this, "inputStyleName", null, "modelAnimation")}
        >
          <p className="wxBindCard_module_surname_title">昵称</p>
          <BaseInput
            _value={name}
            _className="wxBindCard_module_surname"
            _width="3rem"
            _getValue={this.setValue.bind(this, "name", this.checkValue)}
          />
        </div>
        <div className="wxBindCard_module_gender">
          <p className="wxBindCard_module_gender_M">
            <span className={isGenderClassM} onClick={this.changeGender.bind(this, "M")}>
              <i />
            </span>
            <span>男</span>
          </p>
          <p className="wxBindCard_module_gender_F">
            <span className={isGenderClassF} onClick={this.changeGender.bind(this, "F")}>
              <i />
            </span>
            <span>女</span>
          </p>
        </div>
        <div className="login_page_con_info_btn">
          <Button _text="确认信息" _status={btnStatus} _clickCallback={this.handClick} />
        </div>
        <div className="store_member_improve_info_tip">
          <p>生日仅能设置一次，请谨慎填写。</p>
        </div>
        {isTip && (
          <div className={"privateInfo_module_bir_tip "}>
            <i className="errorTip" />
            <i className="errorWords">生日仅能设置一次，请谨慎填写。</i>
            <i className="errorClose" onClick={this.closeTip} />
          </div>
        )}
        <div className="App">
          {DatePicker && (
            <DatePicker
              value={this.state.time}
              isOpen={isOpen}
              onSelect={this.handleSelect}
              onCancel={this.handleCancel}
              theme="ios"
              confirmText="确定"
              cancelText="取消"
              max={new Date()}
              min={minData}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { login } = state;
  let { PERSONAL_INFO } = login;
  return {
    PERSONAL_INFO,
  };
};
export default connect(mapStateToProps, {
  setLoginPersonalInfo,
})(LoginImprovePersonalInfo);
