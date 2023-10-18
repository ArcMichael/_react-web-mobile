/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 11:06:49
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Fr 10:42:41
 * @function 当存在黑金卡活动存在时，展示对应的活动规则
 */

import React from "react";
import $ from "jquery";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import { popupAlert } from "../../../actions/popup";

class RoleActivity extends React.Component {
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
    popupAlert(0, "RoleActivity");
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
    const { _data, _title } = this.props;
    return (
      <div className="popup-mgm-popup-module">
        <div className="popup-mgm-popup-module-role-activity">
          <p>{_title}</p>
          <p>
            {_data.split("\n").map((text) => (
              <span key={text}>
                {text}
                <br />
              </span>
            ))}
          </p>
          <div className="button-konw" onClick={this.closePopup}>
            <p>我知道了</p>
          </div>
        </div>
      </div>
    );
  }
}

RoleActivity.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 101,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _data: "",
};

RoleActivity.propTypes = {
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
})(RoleActivity);