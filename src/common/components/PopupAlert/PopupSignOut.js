/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:41:34
 */

import React from "react";
import { connect } from "react-redux";

import { popupAlert } from "../../actions/popup";
import { soaLoginOff } from "../../lib/Tools";

class PopupSignOut extends React.Component {
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
    popupAlert(0, "PopupSignOut");
  }

  clickSure() {
    soaLoginOff && soaLoginOff();
  }
  render() {
    const { _className, _zIndex, _title, _cancleText, _confirmText } =
      this.props;

    return (
      <div className="popup-sign-out-module">
        <div
          className={"popup-sign-out " + _className}
          style={{ zIndex: _zIndex }}
        >
          <p className="popup-sign-out-title">{_title}</p>
          <button onClick={this.closePopup} className="popup-sign-out-cancle">
            {_cancleText}
          </button>
          <button onClick={this.clickSure} className="popup-sign-out-confirm">
            {_confirmText}
          </button>
        </div>
      </div>
    );
  }
}

PopupSignOut.defaultProps = {
  _className: "",
  _zIndex: 101,
  _title: "",
  _cancleText: "取消",
  _confirmText: "确认",
};

PopupSignOut.propTypes = {};

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
})(PopupSignOut);
