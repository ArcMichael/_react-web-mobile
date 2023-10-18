/*
 * @Author: leo.si
 * @Date: 2019-07-11 17:55:42
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:43:23
 */

import React from "react";
import { connect } from "react-redux";
import { popupAlert } from "../../actions/popup";
import {
  saveApplyReturnData,
  saveLogisticsData,
  allowApplyScroll,
} from "../../actions/onlineReturn";

class PopupScrollSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowIndex: this.props._nowIndex,
    };
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
  }

  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert, allowApplyScroll } = this.props;
    popupAlert(0, "PopupScrollSelect");
    allowApplyScroll();
  }

  clickSure() {
    const {
      saveApplyReturnData,
      _key,
      _data,
      popupAlert,
      _source,
      saveLogisticsData,
      allowApplyScroll,
    } = this.props;
    const { nowIndex } = this.state;
    let obj = {};
    obj[_key] = _data[nowIndex];
    if (_source && _source == "logistics") {
      saveLogisticsData(
        {
          logisticsCompany: _data[nowIndex],
        },
        "company"
      );
    } else {
      saveApplyReturnData(obj);
    }
    popupAlert(0, "PopupScrollSelect");
    allowApplyScroll();
  }

  //li 选择事件
  select(index) {
    this.setState({
      nowIndex: index,
    });
  }
  render() {
    const { _zIndex, _data, _title } = this.props;
    const { nowIndex } = this.state;
    return (
      <div className={"cancleOrder cur"} style={{ zIndex: _zIndex }}>
        <div className="cancleOrder-body">
          <div className="cancleOrder-top">
            <span>{_title}</span>
            <span className="close" onClick={this.closePopup} />
          </div>
          <ul className="cancleOrder-reason" ref="cancleOrderReason">
            {_data.map((item, index) => {
              return (
                <li
                  onClick={this.select.bind(this, index)}
                  className={`reason-li ${nowIndex == index ? "cur" : ""}`}
                  key={`cancleOrder-reason-li-${index}`}
                >
                  <span>{item}</span>
                  <em
                    className={`cancleOrder-li-radio ${
                      nowIndex == index ? "cur" : ""
                    }`}
                   />
                </li>
              );
            })}
          </ul>
          <div
            className={`sure ${nowIndex === 0 || nowIndex ? "cur" : ""}`}
            onClick={this.clickSure}
          >
            确定
          </div>
        </div>
      </div>
    );
  }
}

PopupScrollSelect.defaultProps = {
  _className: "",
  _zIndex: 101,
  _cancleText: "取消",
  _confirmText: "确认",
  _key: "",
  _data: [],
  _source: "",
};

PopupScrollSelect.propTypes = {};

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
  saveApplyReturnData,
  saveLogisticsData,
  allowApplyScroll,
})(PopupScrollSelect);
