import React, { Component } from "react";
import PropTypes from "prop-types";
import isBrowser from "@/Utils/utils/isBrowser";
import Button from "../Button";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/components/bottom-popup.scss");
}

/**
 * 从底部弹出的弹出框
 * @typedef {{onOk:Function, active: boolean, onClose:Function,title?:string }} BottomPopupProps
 * @extends {React.Component<BottomPopupProps>}
 */
export class BottomPopup extends Component {
  render() {
    const { children, onClose, title, onOk, okText, visible } = this.props;
    return (
      <div className={`BottomPopup ${visible ? "active" : ""}`}>
        <div className="bg" onClick={onClose} />
        <div
          style={{
            position: "relative",
            backgroundColor: "#fff",
          }}
        >
          <i className="css-icon-close" onClick={onClose} />
          {title && <p className="title">{title}</p>}
          {children}
          <Button
            onClick={() => {
              onClose();
              onOk();
            }}
          >
            {okText}
          </Button>
        </div>
      </div>
    );
  }
}

BottomPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func,
  okText: PropTypes.string,
};
BottomPopup.defaultProps = {
  okText: "确定",
  title: "",
  onOk: () => {},
  showShadowCover: true,
};

export default BottomPopup;
