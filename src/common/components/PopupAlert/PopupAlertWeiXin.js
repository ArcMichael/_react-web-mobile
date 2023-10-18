/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/10
 * Function -- Common module for Popup Alert
 *
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as popup from "../../actions/popup";

class PopupAlertWeiXin extends React.Component {
  constructor(props) {
    super(props);
    this.handClickCallBack = this.handClickCallBack.bind(this);
    this.state = {};
  }
  componentDidMount() {}

  /*
   * 点击关闭，回到前一个页面
   */
  handClickCallBack() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }

  render() {
    const {
      _textTitle,
      _textContentF,
      _textContentS,
      _textButton,
      _textSpcial,
      _className,
      _zIndex,
      _children,
    } = this.props;
    const ChildrenComponent = _children || "";
    return (
      <div className={_className} style={{ zIndex: _zIndex }}>
        <div>
          <p>{_textTitle}</p>
          <p />
          {ChildrenComponent && (
            <ChildrenComponent
              _textContentF={_textContentF}
              _textContentS={_textContentS}
              _textSpcial={_textSpcial}
            />
          )}
          <button onClick={this.handClickCallBack}> {_textButton} </button>
        </div>
      </div>
    );
  }
}

PopupAlertWeiXin.defaultProps = {
  _textTitle: "",
  _textContentF: "",
  _textContentS: "",
  _textButton: "",
  _textSpcial: "",
  _className: "",
  _zIndex: 101,
  _children: "",
};

PopupAlertWeiXin.propTypes = {
  _textContentF: PropTypes.string,
  _textContentS: PropTypes.string,
  _textButton: PropTypes.string,
  _textSpcial: PropTypes.string,
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

export default connect(mapStateToPrps, (dispatch) => ({
  popup: bindActionCreators(popup, dispatch),
}))(PopupAlertWeiXin);
