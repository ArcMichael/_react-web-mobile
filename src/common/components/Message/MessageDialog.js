import React, { Component } from "react";
import classnames from "classnames";
import isBrowser from "@/Utils/utils/isBrowser";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/components/message.scss");
}

/**
 * 核对订单-开具发票明细
 * @typedef {{ message:React.ReactNode } & HTMLDivElement} AlertComponentProps
 * @extends {React.Component<AlertComponentProps>}
 */
export class MessageDialog extends Component {
  render() {
    const { message, className, _ox, _title, _zIndex = 1 } = this.props;
    return (
      <div className={classnames(className, "mob-alert")} style={{ zIndex: _zIndex }}>
        {_ox && (
          <img
            className="mob-alert-tip"
            src={"https://ssl1.sephorastatic.cn/soa/mobile/images/newReset.png"}
          />
        )}
        {_title && <div className="mob-alert-title">{_title}</div>}
        <div>{message}</div>
      </div>
    );
  }
}

export default MessageDialog;
