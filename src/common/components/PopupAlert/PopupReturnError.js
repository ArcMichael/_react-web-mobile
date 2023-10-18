/*
 * @Author: Martin.song
 * @LastEditors: Martin.song
 * @Descripttion:
 * @version: 0.2
 * @Date: 2021-02-23 15:07:12
 * @LastEditTime: 2021-03-02 16:10:37
 */
/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-08-29 10:46:13
 */

import React from "react";
import { connect } from "react-redux";
import { popupAlert } from "../../actions/popup";
const show = {
  position: "fixed",
  top: "0",
  height: "100%",
  "z-index": "21",
  width: "100%",
  background: "rgba(0, 0, 0, 0.5)",
};
const content = {
  width: "6.34rem",
  height: "5.04rem",
  background: "#ffffff",
  "border-radius": "0.08rem",
  position: "relative",
  top: "50%",
  margin: "-2.52rem auto 0",
  "padding-top": "0.36rem",
};
const title = {
  width: "4rem",
  "text-align": "center",
  height: "0.44rem",
  "font-size": "0.32rem",
  "font-family": "PingFangSC-Medium, PingFang SC",
  "font-weight": "500",
  color: " #000000",
  "line-height": " 0.44rem",
  display: "block",
  margin: " 0 auto 0.24rem",
};
const text = {
  width: "5.34rem",
  height: "2.9rem",
  "font-size": "0.26rem",
  "font-family": "PingFangSC-Regular, PingFang SC",
  "font-weight": "400",
  color: "#000000",
  "line-height": "0.38rem",
  "overflow-y": "auto",
  margin: "0 auto 0.38rem",
};
const button = {
  "border-top": "0.02rem solid #ddd",
  "font-size": "0.32rem",
  "font-family": "SourceHanSansCN-Regular, SourceHanSansCN",
  "font-weight": "400",
  color: "#ee0000",
  "line-height": " 0.92rem",
  "text-align": "center",
  height: "0.92rem",
};
class PopupReturnError extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "PopupReturnError");
  }

  render() {
    return (
      <div className="popup-mgm-popup-module">
        <div className="popup-mgm-popup-module-content">
          <div style={show}>
            <div style={content}>
              <p style={title}>提示</p>
              <div style={text}>
                因您的会员积分存在异常，退货申请需联系客服人员，为您造成不便敬请谅解！
                <br />
                如您需要继续申请退货，请致电丝芙兰客服热线400 670
                0055或联系丝芙兰官网在线客服选择“售后咨询”。
                <br />
                客服服务时间：9:00-22:00  全年无休，我们将竭诚为您服务！
                <br />
              </div>
              <div style={button} onClick={this.closePopup}>
                我知道了
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PopupReturnError.defaultProps = {
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

PopupReturnError.propTypes = {};

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
})(PopupReturnError);
