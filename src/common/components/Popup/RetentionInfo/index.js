/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/4
 * Function -- Component popup for retention Information
 *
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as retentionInfo from "../../../actions/retentionInfo";
import * as popup from "../../../actions/popup";
import * as utilCookieUtil from "../../../Utils/cookieUtil";
import BaseInputFunc from "../../BaseInputFunc";
import PopupUI from "../PopupUI";
import Button from "../../AtomsInput/Button";
import BaseInput from "../../AtomsInput/Input/BaseInput";
import UserAgreement from "./UserAgreement";
import { validateValidationValueRegister } from "../../../actions/register";
import { GetSingleCookie } from "../../../lib/Tools";
import PopupAlert from "../../PopupAlert";

const errorCode = require("./errorCode.json");

// const PopupAlert = loadable('../../PopupAlert')

class RetentionInfo extends BaseInputFunc {
  constructor(props) {
    super(props);
    this.state = {
      mobile: this.props._mobile || "",
      msgValidation: "",
      isChecked: true,
      inputStyleMobile: this.props._mobile ? "modelAnimation" : "",
      inputStyleSMS: "",
      smsStatus: this.props._mobile ? 1 : 0,
      confirmStatus: 0,
      ADtxt: "",
      valiStatus: false,
      valiCode: "",
      valiCodeToken: "",
      rtoken: "",
    };
    this.handleClickConfirm = this.handleClickConfirm.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.usercheckfun = this.usercheckfun.bind(this);
    this.closeDirectly = this.closeDirectly.bind(this);
    this.sendPhoneMessage = this.sendPhoneMessage.bind(this);
  }

  componentDidMount() {
    this.netPostAD();
  }

  // 校验输入框的值
  checkValue() {
    const { mobile, msgValidation, isChecked, valiCode } = this.state;
    const isMBcorrect = /^1\d{10}$/.test(mobile);

    const isSMScorrect = /^\d{6}$/.test(msgValidation);
    let isVCcorrect = valiCode && valiCode.length == 4 ? true : false;
    this.setState({
      smsStatus: isMBcorrect && isVCcorrect ? 1 : 0,
      confirmStatus: isMBcorrect && isSMScorrect && isChecked ? 1 : 0,
    });
  }

  // 勾选丝芙兰用户协议
  usercheckfun(isChecked) {
    const { mobile, msgValidation } = this.state;
    const isMBcorrect = /^1\d{10}$/.test(mobile);
    const isSMScorrect = /^\d{6}$/.test(msgValidation);
    this.setState({
      isChecked: isChecked,
      confirmStatus: isMBcorrect && isSMScorrect && isChecked ? 1 : 0,
    });
  }
  // 确定按钮事件
  handleClickConfirm() {
    const { retentionInfo, popup } = this.props;
    const { mobile, msgValidation, rtoken } = this.state;
    this.setState({ confirmStatus: 2 });
    let tpId = GetSingleCookie(document.cookie, "tpId");
    let bindId = GetSingleCookie(document.cookie, "bindId");
    let uid = GetSingleCookie(document.cookie, "UID");
    let ajaxUrl, email;
    if (tpId) {
      // tpId 联合登录留资
      ajaxUrl = "/v1/usercenter/weblogin/bind";
    } else if (bindId) {
      // 邮箱登录留资
      ajaxUrl = "/v1/usercenter/weblogin/pwd/bind";
      email = GetSingleCookie(document.cookie, "email");
    }
    if (ajaxUrl) {
      // 强制绑定手机
      let options = {};
      options.telephone = mobile;
      options.smsCode = msgValidation;
      options.rtoken = rtoken;
      options.activityParam = null;
      if (tpId) options.tpId = tpId;
      if (bindId) {
        options.bindId = bindId;
        options.email = email;
      }
      retentionInfo.bindTelephoneForce(
        {
          url: ajaxUrl,
          options,
        },
        (callback) => {
          popup.popupAlert(1, "PopupAlertDefault", {
            _text: callback.message,
            _autoClose: true,
            _closeCallback: callback.close
              ? () => {
                this.closePopup();
                window.location.reload();
              }
              : () => { },
          });
          this.setState({
            confirmStatus: 0,
          });
        }
      );
    } else {
      retentionInfo.putAuthenticate(
        {
          telephone: mobile,
          smsCode: msgValidation,
          rtoken: rtoken,
          uid,
        },
        (json) => {
          this.setState({ confirmStatus: 0 });
          // 接口401,提示重新登录,并关闭popup

          if (
            (json && json.jQueryStatus && json.jQueryStatus.status === 401) ||
            json.status === 401
          ) {
            popup.popupAlert(1, "PopupAlertDefault", {
              _text: "请重新登录",
              _autoClose: true,
              _closeCallback: this.closeDirectly,
            });
            return;
          }
          const data = json.results;

          const code = data.code;
          // error,展示警告框
          if (code) {
            if (code == "40095799") {
              popup.popupAlert(1, "PopupAlertDefault", {
                _text: data.message,
                _autoClose: true,
              });
            } else {
              popup.popupAlert(1, "PopupAlertDefault", {
                _text: errorCode[code],
                _autoClose: true,
              });
            }
            this.setState({
              confirmStatus: 0,
            });
            return;
          }
          // 提示留资成功，并关闭popup
          if (data && data.authenticateResult) {
            popup.popupAlert(1, "PopupAlertDefault", {
              _ox: true,
              _text: "感谢您的合作，验证身份成功!",
              _autoClose: true,
              _closeCallback: this.closePopup,
            });
            // pushGoogleTagManager({
            //     'event': 'ButtonClick',
            //     'eventName': '提交成功',
            //     'buttonPosition': 'InforCollectionPopup'
            // });
          }
        }
      );
    }
  }

  // 业务需求-在留资窗口关闭后弹出粉卡
  popupPinkCard() {
    if (
      GetSingleCookie(document.cookie, "FirstTime") === 1 &&
      GetSingleCookie(document.cookie, "GroupId") === 5
    ) {
      this.props.popup.popupComponent(1, "PopupPinkCard");
      return false;
    }
    return true;
  }

  // 关闭留资弹窗
  closePopup() {
    const { popup } = this.props;
    utilCookieUtil.SetSingleCookie2({
      key: "retention_info_count",
      value: "0",
    });
    // ifPushGA && pushGoogleTagManager({
    //     'event': 'ButtonClick',
    //     'eventName': '退出_留资页',
    //     'buttonPosition': 'InforCollectionPopup',
    // });
    utilCookieUtil.DelSingleCookie2({ key: "tpId", value: "" });
    utilCookieUtil.DelSingleCookie2({ key: "bindId", value: "" });
    utilCookieUtil.DelSingleCookie2({ key: "email", value: "" });
    popup.popupComponent(0, null);
  }

  closeDirectly() {
    this.closePopup();
    utilCookieUtil.DelSingleCookie2({
      key: "Token",
      value: "",
      domain: ".sephora.cn",
    });
    utilCookieUtil.DelSingleCookie2({ key: "UID", value: "" });
    window.location.href = `/login?historyLocation=${encodeURIComponent(
      window.location.pathname.replace("/", "").replace("?", "&")
    )}${window.location.search.replace("?", "&")}`;
  }

  // 广告位
  netPostAD() {
    const { retentionInfo } = this.props;
    retentionInfo.postAD(
      { locationLabel: "PC:HOMEPAGE:LOGIN:AUTHENTICATE" },
      (json) => {
        const data =
          json.results && json.results.resourceList
            ? json.results.resourceList
            : null;
        if (!data) return;
        const ADtxt = data[0] && data[0].content ? data[0].content : "";
        this.setState({
          ADtxt: ADtxt,
        });
      }
    );
  }

  sendPhoneMessage(valiCode, valiCodeToken, mobile, stop, start) {
    const { validateValidationValueRegister } = this.props;
    let that = this;
    let scene = "COMPLETETEL";
    let tpId = GetSingleCookie(document.cookie, "tpId");
    let bindId = GetSingleCookie(document.cookie, "bindId");
    if (tpId) {
      // tpId 联合登录留资
      scene = "SOCIALBIND";
    } else if (bindId) {
      // 邮箱登录留资
      scene = "EMAILBIND";
    }
    validateValidationValueRegister(
      valiCode,
      valiCodeToken,
      mobile,
      stop,
      start,
      (isSuccess, rtoken) => {
        if (isSuccess) {
          that.setState({
            valiStatus: true,
          });
        }
        if (rtoken) {
          that.setState({
            rtoken,
          });
        }
      },
      scene
    );
  }

  render() {
    const {
      mobile,
      msgValidation,
      smsStatus,
      confirmStatus,
      ADtxt,
      valiCode,
      valiCodeToken,
      isChecked,
      valiStatus,
    } = this.state;
    return (
      <PopupUI
        _className="popup-ui-retentioninfo"
        _height={1152}
        _zIndex={1111112}
        _closePopCallback={this.closeDirectly.bind(this)}
      >
        <PopupAlert _zIndex={1001} />
        <div className="retentioninfo">
          <div className="retentioninfo-warn">
            <em />
            <p>
              尊敬的丝芙兰用户，根据《中华人民共和国网络安全法》及相关法律法规对于互联网信息发布等的要求，您需提供以下真实身份信息给到丝芙兰，丝芙兰将为您完成实名认证，以便您继续使用本网站相关服务。
            </p>
          </div>
          <div className="retentioninfo-info">
            <div
              className={"Model " + this.state.inputStyleMobile}
              onClick={this.setValue.bind(
                this,
                "inputStyleMobile",
                null,
                "modelAnimation"
              )}
            >
              <p>手机号码</p>
              <BaseInput
                _iconRight={250}
                _value={mobile}
                _filter={/^\d{0,11}$/}
                _getValue={this.setValue.bind(this, "mobile", this.checkValue)}
              />
            </div>
            <div
              className={"Model " + this.state.inputStyleGraphic}
              onClick={this.setValue.bind(
                this,
                "inputStyleGraphic",
                null,
                "modelAnimation"
              )}
            >
              <p>图形验证码</p>
              <BaseInput
                _iconRight={250}
                _value={valiCode}
                _filter={/^\w{0,4}$/}
                _getValue={(val) => {
                  this.setValue.call(this, "valiCode", this.checkValue, val);
                  this.setState({
                    valiStatus: false,
                  });
                }}
              />
              <Button
                _type="GraphicButton"
                _getValiCodeToken={this.setValue.bind(
                  this,
                  "valiCodeToken",
                  null
                )}
                valiStatus={valiStatus}
                loginId={mobile}
                _filter={/^1\d{10}$/}
              />
            </div>
            <div
              className={"Model " + this.state.inputStyleSMS}
              onClick={this.setValue.bind(
                this,
                "inputStyleSMS",
                null,
                "modelAnimation"
              )}
            >
              <p>短信验证码</p>
              <BaseInput
                _value={msgValidation}
                _filter={/^\d{0,6}$/}
                _getValue={this.setValue.bind(
                  this,
                  "msgValidation",
                  this.checkValue
                )}
              />
              <Button
                _type="ValidationButton"
                _status={smsStatus}
                _mobile={mobile}
                _sendDirect={false}
                _clickCallback={this.sendPhoneMessage.bind(
                  this,
                  valiCode,
                  valiCodeToken,
                  mobile
                )}
              />
            </div>
            <Button
              _type="BaseButton"
              _className="retention-info-confirm"
              _text="确定并同意协议"
              _status={confirmStatus}
              _clickCallback={this.handleClickConfirm}
            />
          </div>
          <div className="retentioninfo-tip">
            <em>*</em>
            <p>{ADtxt}</p>
          </div>
          <UserAgreement userCheckFun={this.usercheckfun} checked={isChecked} />
        </div>
      </PopupUI>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    retentionInfo: bindActionCreators(retentionInfo, dispatch),
    popup: bindActionCreators(popup, dispatch),
    validateValidationValueRegister: bindActionCreators(
      validateValidationValueRegister,
      dispatch
    ),
  })
)(RetentionInfo);
