import React, { useState, useEffect, useCallback } from "react";
import OrderDetailAction from "@/lib/services/OrderDetail";
import { orderInfo } from "@/containers/MyOrder/OrderDetail/interface";

interface OrderDetailCancelOrderProps {
  orderDetailData: orderInfo;
  show: boolean;
  close: () => void;
}

const message = [
  "更换或添加新商品",
  "错过促销活动",
  "重复下单",
  "现在不想购买",
  "去门店购买",
  "支付不成功",
  "等待时间过长",
  "更换支付方式",
  "其他",
];
const returnMessage = [
  "不想买了",
  "需要重新下单以享受优惠",
  "Sephora联系要求取消",
];
const OrderDetailCancelOrder: React.FunctionComponent<OrderDetailCancelOrderProps> =
  ({ orderDetailData, show, close }) => {
    const [cancelReason, setCancelReason] = useState<string[]>([]);
    const [selectedReason, setSelectedReason] = useState("");
    useEffect(() => {
      if (
        orderDetailData.orderStatus == "DIP" ||
        orderDetailData.orderStatus == "CDIP"
      ) {
        setCancelReason(returnMessage);
      } else {
        setCancelReason(message);
      }
    }, [orderDetailData]);
    const aliPay = useCallback((value: string) => {
      setSelectedReason(value);
    }, []);
    const cancelOrder = useCallback(() => {
      if (!selectedReason) return;
      let orderId = orderDetailData.orderId;
      let param = {
        cancelReason: selectedReason,
        orderId: orderId,
      };
      setSelectedReason("");
      if (
        orderDetailData.orderStatus &&
        (orderDetailData.orderStatus == "DIP" ||
          orderDetailData.orderStatus == "CDIP")
      ) {
        OrderDetailAction.cancelReturnOrderAction(param).then((json) => {
          if (json.results) {
            if (json.results == "SUCCESS") {
              window.location.reload();
            } else if (json.results.code) {
              close();
              alert(json.results.message || "订单取消失败");
            } else {
              close();
              alert("订单取消失败");
            }
          } else {
            alert("订单取消失败");
          }
        });
      } else {
        OrderDetailAction.cancelOrderAction({ queryBody: param }).then(
          (json) => {
            if (json.results) {
              if (json.results.success == true) {
                window.location.reload();
              } else if (json.results.code) {
                close();
                alert(json.results.message || "订单取消失败");
              } else {
                close();
                alert("订单取消失败");
              }
            } else {
              alert("订单取消失败");
            }
          }
        );
      }
    }, [selectedReason]);
    return (
      <div className={`cancleOrder ${show ? "cur" : ""}`}>
        <div className="cancleOrder-body">
          <div className="cancleOrder-top">
            <span>取消订单</span>
            <span
              className="close"
              onClick={() => {
                close();
                setSelectedReason("");
              }}
             />
          </div>
          {orderDetailData.orderStatus &&
          (orderDetailData.orderStatus == "DIP" ||
            orderDetailData.orderStatus == "CDIP") ? null : (
            <div className="cancleOrder-tip">
              <em className="tips-icon" />
              <p>温馨提示:您的订单取消操作需要经过审核，请耐心等待。</p>
              <p>1、已发货的订单将不能取消;</p>
              <p>2、请在“已取消订单”列表中查看订单是否取消成功</p>
              {orderDetailData.payMethod == "SILKPAY" ||
              orderDetailData.payMethod == "丝享卡" ? (
                <p>3、丝享卡已支付金额将在48小时内原路退回</p>
              ) : (
                ""
              )}
            </div>
          )}
          <ul className="cancleOrder-reason">
            {cancelReason.map((value, index) => {
              return (
                <li
                  onClick={() => aliPay(value)}
                  className={`reason-li ${
                    selectedReason === value ? "cur" : ""
                  }`}
                  key={"cancleOrder-reason-item-" + index}
                >
                  <span>{value}</span>
                  <em
                    className={`cancleOrder-li-radio ${
                      selectedReason === value ? "cur" : ""
                    }`}
                   />
                </li>
              );
            })}
          </ul>
          <div
            className={`sure ${selectedReason ? "cur" : ""}`}
            onClick={cancelOrder}
          >
            确定
          </div>
        </div>
      </div>
    );
  };

export default OrderDetailCancelOrder;
