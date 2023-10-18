import React from "react";
import { OrderDepositDto } from "@/containers/MyOrder/OrderDetail/interface";
import isBrowser from "@/Utils/utils/isBrowser";
if (__DEV__ && isBrowser()) {
  require("../../../../public/style/common/_common_deposit_confirm.scss");
}

interface PopupAlertMergePayProps {
  show: boolean;
  close: () => void;
  orderDepositList: OrderDepositDto[];
  callback: () => void;
}

const PopupAlertMergePay: React.FunctionComponent<PopupAlertMergePayProps> = ({
  show,
  close,
  orderDepositList,
  callback,
}) => {
  let price = 0;
  if (orderDepositList && orderDepositList.length) {
    price = orderDepositList[0].orderDepositAmount;
    return (
      <div className={`pay-confirm-popup ${show ? "cur" : ""}`}>
        <div className="popup-main">
          <div className="popup-close" onClick={close} />
          <div className="popup-header">订单详情</div>
          <div className="info-row">
            {"定金金额"}
            <label className="label">{"¥" + price}</label>
          </div>
          <div className="popup-warn">
            <em className="iconC-rule-warning" />
            预售商品定金恕不退还
          </div>
          <div className="popup-button" onClick={callback}>
            同意并支付
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default PopupAlertMergePay;
