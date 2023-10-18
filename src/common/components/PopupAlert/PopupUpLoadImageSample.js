/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-02 15:18:04
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { popupAlert } from "../../actions/popup";

class PopupUpLoadImageSample extends React.Component {
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
    popupAlert(0, "PopupUpLoadImageSample");
    this.clickSure()
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }
  render() {
    const { _className, _zIndex, _data } = this.props;
    return (
      <div className="popupCleaning" style={{ zIndex: _zIndex }}>
        <div className="popupCleaning-con">
          <p className="popupCleaning-con-title">{`${_data && _data.reason}示例图`}</p>

          <ul className="popup-upload-image-sample-module-con-ul">
            {_data &&
              _data.sampleImgs &&
              _data.sampleImgs.map((item, index) => {
                return (
                  <li key={`popup-upload-image-sample-module-con-${index}`}>
                    <img src={item} />
                  </li>
                );
              })}
          </ul>
          <div
            onClick={this.closePopup}
            className={`popupCleaning-con-btn ${_className} image-sample`}
          >
            我知道了
          </div>
          <span className="popupCleaning-con-cancle" onClick={this.closePopup}>
            取消
          </span>
        </div>
      </div>
    );
    // return (
    //   <div
    //     className="popup-upload-image-sample-module"
    //     style={{ zIndex: _zIndex }}
    //   >
    //     <div
    //       className={"popup-upload-image-sample-module-con " + _className}
    //       style={{ zIndex: _zIndex }}
    //     >
    //       <p className="popup-upload-image-sample-module-con-title">{`${
    //         _data && _data.reason
    //       }示例图`}</p>
    //       <ul className="popup-upload-image-sample-module-con-ul">
    //         {_data &&
    //           _data.sampleImgs &&
    //           _data.sampleImgs.map((item, index) => {
    //             return (
    //               <li key={`popup-upload-image-sample-module-con-${index}`}>
    //                 <img src={item} />
    //               </li>
    //             );
    //           })}
    //       </ul>
    //       <span
    //         className="popup-upload-image-sample-module-con-confirm"
    //         onClick={this.closePopup}
    //       >
    //         我知道了
    //       </span>
    //     </div>
    //   </div>
    // );
  }
}

PopupUpLoadImageSample.defaultProps = {
  _className: "",
  _zIndex: 201,
  _title: "",
  _data: {},
};

PopupUpLoadImageSample.propTypes = {
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
})(PopupUpLoadImageSample);
