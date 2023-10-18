/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: summer
 * @Last Modified time: 2021-03-Th 10:46:21
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { popupAlert } from "../../actions/popup";
import CdnImage from "../CdnImage";

class PopupMemberEquity extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "PopupMemberEquity");
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }
  render() {
    const {
      _text,
      _titleImg,
      _className,
      _zIndex,
      _title,
      _confirmText,
      _equityStatus,
      _catStatus,
      _index,
    } = this.props;
    return (
      <div className="popup-equity-module">
        <div className="popup-equity-box">
          <div className={"popup-equity" + _className} style={{ zIndex: _zIndex }}>
            <div className={`popup-img ${_equityStatus ? "" : "unclick"}`}>
              <img
                className={`myAccount_integral_member_card_equity_${_index}`}
                src={_titleImg}
                alt=""
              />
            </div>
            <img
              className="popup_stars"
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/popup_stars.png"
              alt=""
            />
            <p className="popup-equity-title">{_title}</p>
            {_equityStatus ? null : (
              <p className="popup-equity-disable">目前会员状态下不可享受此权益</p>
            )}
            <p
              className="popup-equity-text"
              dangerouslySetInnerHTML={(() => {
                return {
                  __html: _text.indexOf("\n") > -1 ? _text.replace(/\n/g, "<br />") : _text,
                };
              })()}
             />
            <button
              onClick={this.clickSure}
              className={`popup-equity-confirm  ${_catStatus ? "" : "unclick"}`}
              disabled={_catStatus ? "" : "disabled"}
            >
              {_confirmText}
            </button>
          </div>
          <CdnImage
            onClick={this.closePopup}
            className="popup-close"
            src="/soa/mobile/images/popup/errorIcon.png"
            alt=""
          />
        </div>
      </div>
    );
  }
}

PopupMemberEquity.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _cancleText: "取消",
  _confirmText: "确认",
};

PopupMemberEquity.propTypes = {
  _text: PropTypes.string,
  _closeCallback: PropTypes.func,
};

const mapStateToPrps = (state) => {
  const { popup_component } = state;
  let POPUP_ALERT_PARAMETERS = {};
  if (popup_component) {
    POPUP_ALERT_PARAMETERS = popup_component.POPUP_ALERT_PARAMETERS;
  }
  return Object.assign({}, POPUP_ALERT_PARAMETERS);
};

export default connect(mapStateToPrps, {
  popupAlert,
})(PopupMemberEquity);
