/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 11:06:49
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-19 11:25:32
 * @function 展示PDP页面套装详情信息
 */

import $ from "jquery";
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import { popupAlert } from "../../../actions/popup";

class VipActivityPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "VipActivityPopup");
    setTimeout(() => {
      let scrollTop = parseFloat($(".product-page").css("bottom"));
      bodyScrollTop.set(scrollTop);
      $(".product-page").css({ bottom: 0 });
    }, 0);
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }
  render() {
    const { _data } = this.props;
    return (
      <div className="popup-mgm-popup-module">
        <div className="popup-mgm-popup-module-role-activity">
          <p><strong>{_data.name}</strong></p>
          <p>
          {_data.detail}
          </p>
          <div className="button-konw" onClick={this.closePopup}>
            <p>确定</p>
          </div>
        </div>
      </div>
      // <div className="popup-mgm-popup-module">
      //   <div className="popup-mgm-popup-module-content">
      //     <div className="popup-mgm-title">
      //       <p>{_data.name}</p>
      //       <img
      //         src="https://ssl1.sephorastatic.cn/soa/mobile/images/common_searchtop_delete.png"
      //         onClick={this.closePopup}
      //       />
      //     </div>
      //     <div className="popup-promotion-details-con">
      //       <div className="popup-promotion-details-con-text">
      //         {_data.detail}
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

VipActivityPopup.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _data: [],
};

VipActivityPopup.propTypes = {
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
})(VipActivityPopup);
