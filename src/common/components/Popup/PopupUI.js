/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/4
 * Function -- Common module for Popup UI
 *
 */
import React from "react";
import $ from "jquery";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as popup from "../../actions/popup";

/**
 * 本组件props.
 * @param {String} _className 传入的_className
 * @param {String} _width popup宽度
 * @param {String, Number} _height popup高度
 * @param {Number} _zIndex popup层叠
 * @param {Boolean} _showCloseIcon 是否有关闭按钮
 * @param {String} _module 传入popup组件的key值，如果有，则关闭按钮不需要回调
 */

/*
 * 判断ios版本是否为ios11，如果为11需要处理弹层中input框为fixed的问题
 */


const DEFAULTPROPS = {
  _className: "",
  _width: 634,
  _height: "auto",
  _zIndex: 100,
  _showCloseIcon: true,
  _module: "",
};

const PROPTYPES = {
  children: PropTypes.element.isRequired,
  _closePopCallback: PropTypes.func,
  _module: PropTypes.string,
};

class PopupUI extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    // ios11兼容性
    // if(getAgentIOS11()){
    $(".popup-ui").parent().css({
      height: "100%",
      overflowY: "auto",
      position: "static",
    });
    $(".popup-ui").css({
      //  position: 'absolute',
      position: "fixed",
      overflowX: "hidden",
    });
    // }
  }
  handleClose() {
    const { _closePopCallback, _module, popup } = this.props;
    _closePopCallback && _closePopCallback();
    popup && _module && popup.popupComponent(0, _module);
  }
  render() {
    const { _className, _width, _height, _zIndex, _showCloseIcon, children } = this.props;
    // 代码待修改
    const styleObj = {
      width: _width / 100 + "rem",
      height: _height / 100 + "rem",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      margin: "auto",
      transform: "none",
    };
    return (
      <div className={"popup-ui " + _className} style={{ zIndex: _zIndex }}>
        <div className="popup-ui-container" style={styleObj}>
          {_showCloseIcon && <div className={"popup-ui-close"} onClick={this.handleClose} />}
          <div className="popup-ui-body" style={{ height: _height / 100 + "rem" }}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

PopupUI.defaultProps = DEFAULTPROPS;
PopupUI.propTypes = PROPTYPES;

export default connect(
  () => ({}),
  (dispatch) => ({
    popup: bindActionCreators(popup, dispatch),
  }),
)(PopupUI);
