import React, { useState, useEffect } from "react";
import { orderInfo } from "@/containers/MyOrder/OrderDetail/interface";
import { getBaseUrlByTarget } from "@/lib/url";

interface OrderDetailButtonProps {
  orderDetailData: orderInfo;
  openMergeOrders: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  cancelOrder: (toApp?: boolean) => void;
  goCart: () => void;
  buyAgain: () => void;
  lookLogistics: () => void;
}

type orderStatus = "DPP" | "DIP" | "DID" | "DF";

interface buttonData {
  className: string;
  text: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
const handeApplyInvoice = (orderInvoiceSwitch: number, orderId: string) => {
  if (orderInvoiceSwitch === 1) {
    alert("已超过申请时间，请联系客服处理");
  }
  const url = `${getBaseUrlByTarget(
    60018
  )}/myAccount/issueInvoice?redirect=${encodeURIComponent(
    window.location.href
  )}&orderId=${orderId}`;
  window.location.href = url;
};
const handleViewInvoice = (orderId: string) => {
  window.location.href = `${getBaseUrlByTarget(
    60018
  )}/myAccount/invoiceList/?orderId=${orderId}`;
};
const OrderDetailButton: React.FunctionComponent<OrderDetailButtonProps> = ({
  orderDetailData,
  openMergeOrders,
  cancelOrder,
  goCart,
  buyAgain,
  lookLogistics,
}) => {
  const [bottomButton, setBottomButton] = useState<buttonData[]>([]);
  const [hideButton, setHideButton] = useState<buttonData[]>([]);
  const [showHideButton, setShowHideButton] = useState(false);
  useEffect(() => {
    if (orderDetailData) {
      let buttonDPP = (orderDetailData: orderInfo, data: buttonData[]) => {
        if (orderDetailData.orderType !== "2") {
          data.push({
            className: "buy-pay",
            text: "立即支付",
            onClick: openMergeOrders,
          });
          data.push({
            className: "delete-order",
            text: "取消订单",
            onClick: () => cancelOrder(),
          });
        } else {
          if (
            orderDetailData.orderDepositList[0].depositAmountType == "1" &&
            (orderDetailData.orderDepositList[0].depositPayStatus == "0" ||
              orderDetailData.orderDepositList[0].depositPayStatus == "3" ||
              orderDetailData.orderDepositList[0].depositPayStatus == "4")
          ) {
            data.push({
              className: "buy-pay",
              text: "立即支付",
              onClick: openMergeOrders,
            });
            data.push({
              className: "delete-order",
              text: "取消订单",
              onClick: () => cancelOrder(),
            });
          } else if (
            orderDetailData.orderDepositList[0].depositAmountType == "1" &&
            orderDetailData.orderDepositList[0].depositPayStatus == "1"
          ) {
            if (orderDetailData.orderDepositList[1].depositAmountType == "2") {
              switch (orderDetailData.orderDepositList[1].depositPayStatus) {
                case "0":
                  if (orderDetailData.orderOriginStatus === "BB") {
                    data.push({
                      className: "buy-pay",
                      text: "立即支付",
                      onClick: openMergeOrders,
                    });
                    data.push({
                      className: "delete-order",
                      text: "取消订单",
                      onClick: () => cancelOrder(),
                    });
                  } else {
                    data.push({
                      className: "buy-pay",
                      text: "去购物车结算",
                      onClick: goCart,
                    });
                  }
                  break;
                case "2":
                  data.push({
                    className: "buy-pay disabled",
                    text: "去购物车结算",
                    onClick: () => {},
                  });
                  break;
                case "3":
                  if (
                    orderDetailData.orderOriginStatus === "BB" ||
                    orderDetailData.orderOriginStatus === "MF" ||
                    orderDetailData.orderOriginStatus === "BF"
                  ) {
                    data.push({
                      className: "buy-pay",
                      text: "立即支付",
                      onClick: () => {
                        alert("已过尾款支付时间，无法支付尾款");
                      },
                    });
                  } else {
                    data.push({
                      className: "buy-pay",
                      text: "去购物车结算",
                      onClick: () => {
                        alert("已过尾款支付时间，无法支付尾款");
                      },
                    });
                  }
                  break;
                case "4":
                  data.push({
                    className: "buy-pay",
                    text: "立即支付",
                    onClick: openMergeOrders,
                  });
                  data.push({
                    className: "delete-order",
                    text: "取消订单",
                    onClick: () => cancelOrder(),
                  });
                  break;
                default:
                  break;
              }
            }
          }
        }
      };
      let buttonDIP = (orderDetailData: orderInfo, data: buttonData[]) => {
        if (
          orderDetailData.orderType != "3" &&
          orderDetailData.orderType != "2"
        ) {
          data.push({
            className: "buy-pay",
            text: "再来一单",
            onClick: buyAgain,
          });
        }
        if (
          orderDetailData.orderOriginStatus == "I" &&
          orderDetailData.processOrderCancel &&
          (orderDetailData.orderType == "1" || orderDetailData.orderType == "2")
        ) {
          data.push({
            className: "delete-order",
            text: "取消订单",
            onClick: () => cancelOrder(true),
          });
        }
      };
      let buttonDID = (orderDetailData: orderInfo, data: buttonData[]) => {
        if (
          orderDetailData.orderType != "3" &&
          orderDetailData.orderType != "2"
        ) {
          data.push({
            className: "buy-pay",
            text: "再来一单",
            onClick: buyAgain,
          });
        }
        data.push({
          className: "look-logistics",
          text: "查看物流",
          onClick: lookLogistics,
        });
      };
      let buttonDF = (orderDetailData: orderInfo, data: buttonData[]) => {
        if (orderDetailData.orderOriginStatus === "Y") {
          if (
            orderDetailData.orderType != "3" &&
            orderDetailData.orderType != "2"
          ) {
            data.push({
              className: "buy-pay",
              text: "再来一单",
              onClick: buyAgain,
            });
          }
        } else if (orderDetailData.orderOriginStatus === "X") {
          if (
            orderDetailData.orderType != "3" &&
            orderDetailData.orderType != "2"
          ) {
            data.push({
              className: "buy-pay",
              text: "再来一单",
              onClick: buyAgain,
            });
          } else if (
            orderDetailData.orderType == "2" &&
            orderDetailData.orderDepositList[0].depositPayStatus === "1"
          ) {
            data.push({
              className: "buy-pay",
              text: "立即支付",
              onClick: openMergeOrders,
            });
          }
        } else if (
          orderDetailData.orderOriginStatus === "D" ||
          orderDetailData.orderOriginStatus === "R"
        ) {
          if (
            orderDetailData.orderType != "3" &&
            orderDetailData.orderType != "2"
          ) {
            data.push({
              className: "buy-pay",
              text: "再来一单",
              onClick: buyAgain,
            });
          }
          data.push({
            className: "look-logistics",
            text: "查看物流",
            onClick: lookLogistics,
          });
        } else if (
          orderDetailData.orderOriginStatus === "E" ||
          orderDetailData.orderOriginStatus === "V"
        ) {
          if (orderDetailData.orderType != "2") {
            data.push({
              className: "buy-pay",
              text: "再来一单",
              onClick: buyAgain,
            });
          }
        } else if (orderDetailData.orderOriginStatus === "G") {
          if (orderDetailData.orderType != "2") {
            data.push({
              className: "buy-pay",
              text: "再来一单",
              onClick: buyAgain,
            });
          }
          data.push({
            className: "look-logistics",
            text: "查看物流",
            onClick: lookLogistics,
          });
        }
      };

      let buttonMap = {
        DPP: buttonDPP,
        DIP: buttonDIP,
        DID: buttonDID,
        DF: buttonDF,
      };
      let buttonTemp: buttonData[] = [];
      let hideButtonTemp: buttonData[] = [];
      let btnfunc = buttonMap[orderDetailData.orderStatus as orderStatus];
      if (btnfunc) {
        btnfunc(orderDetailData, buttonTemp);
      }
      if (orderDetailData) {
        const { orderInvoiceSwitch } = orderDetailData;
        if (orderInvoiceSwitch === 0 || orderInvoiceSwitch === 1) {
          buttonTemp.push({
            className: "look-logistics",
            text: "申请开票",
            onClick: () =>
              handeApplyInvoice(orderInvoiceSwitch, orderDetailData.orderId),
          });
        }
        if (orderInvoiceSwitch === 2) {
          buttonTemp.push({
            className: "look-logistics",
            text: "查看发票",
            onClick: () => handleViewInvoice(orderDetailData.orderId),
          });
        }
      }
      if (buttonTemp.length > 3) {
        hideButtonTemp.push(...buttonTemp.splice(0, 3));
      }
      setBottomButton(buttonTemp);
      setHideButton(hideButtonTemp);
    }
  }, [orderDetailData]);
  return (
    <div
      className={`button_container ${bottomButton.length > 0 ? "" : "hide"}`}
    >
      <div className={`more_button ${showHideButton ? "" : "hide"}`}>
        {hideButton.map((item, index) => {
          return (
            <div onClick={item.onClick} key={`more_button_item_${index}`}>
              {item.text}
            </div>
          );
        })}
      </div>
      <em
        className={`more_button_toogle ${hideButton.length > 0 ? "" : "hide"}`}
        onClick={() => {
          setShowHideButton(!showHideButton);
        }}
       />
      <div className="bottom_buttons">
        {bottomButton.map((item, index) => {
          return (
            <div
              className={`button_item ${item.className}`}
              onClick={item.onClick}
              key={`button_item_${index}`}
            >
              {item.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetailButton;
