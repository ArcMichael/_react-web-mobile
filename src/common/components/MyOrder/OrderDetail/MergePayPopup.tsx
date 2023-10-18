import { IMergeOrdersDto } from "@/containers/MyOrder/OrderList/interface";
import React from "react";
import isBrowser from "@/Utils/utils/isBrowser";
if (__DEV__ && isBrowser()) {
  require("../../../../public/style/common/_common_order_merge_pay.scss");
}
interface PopupAlertMergePayProps {
  show: boolean;
  mergeOrders: IMergeOrdersDto[];
  callback: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  close: () => void;
}

const PopupAlertMergePay: React.FunctionComponent<PopupAlertMergePayProps> = ({
  show,
  mergeOrders,
  callback,
  close,
}) => {
  return (
    <div className={`popupMergePay ${show ? "" : "hide"}`}>
      <div className="popupMergePay-con">
        <div>
          <p className="popupMergePay-con-head">合并以下商品支付</p>
          {/* <div className="popupMergePay-con-tips">
            <em></em>温馨提示：由于以下商品共享优惠，需要一起支付。
          </div> */}
          <div className="shopTip_common">
            <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupTipsIcon.png" />
            <p>温馨提示：由于以下商品共享优惠，需要一起支付。</p>
          </div>
          <div onClick={close} className="popupMergePay-con-btn">
            <img
              src="https://ssl1.sephorastatic.cn/soa/mobile/images/common_searchtop_delete.png"
              alt=""
            />
            {/* orderCloseButton.png */}
          </div>
        </div>
        <ul className="popupMergePay-con-ul">
          {mergeOrders.map((item) => (
            <li className="popupMergePay-con-ul-li">
              <div className="r-popup-merge">
                <div className="popupMergePay-con-ul-li-orderId">
                  订单编号：{item.moid}
                </div>
                <div className="popupMergePay-con-ul-li-price">
                  需付款 <span>￥</span>
                  <span>{item.msurplusShouldPay}</span>
                </div>
              </div>

              <div className="popupMergePay-con-ul-li-quantity">
                共{item.mproductQuantity}件
              </div>
            </li>
          ))}
        </ul>
        <div
          className="popupMergePay-con-button"
          onClick={(e) => {
            close();
            callback(e);
          }}
        >
          合并支付
        </div>
      </div>
    </div>
  );
};

export default PopupAlertMergePay;
