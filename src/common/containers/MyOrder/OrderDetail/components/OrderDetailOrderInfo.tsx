import React, { useState, useEffect, useCallback } from "react";
import { popupAlert } from "@/actions/popup";
import { useDispatch } from "react-redux";
import { copyToClipboard } from "@/lib/Tools";
import { orderInfo } from "@/containers/MyOrder/OrderDetail/interface";

interface OrderDetailDeliveryProps {
  orderDetailData: orderInfo;
}
interface infoDataContent {
  text?: string;
  list?: string;
  value: string | Array<{ payMethodCn: string; payAmount: string }>;
}

const OrderDetailOrderInfo: React.FunctionComponent<OrderDetailDeliveryProps> = ({
  orderDetailData,
}) => {
  const [infoData, setInfoData] = useState<infoDataContent[]>([]);
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch();
  const copy = useCallback((orderId: string) => {
    if (orderId) {
      copyToClipboard(orderId, () => {
        dispatch(
          popupAlert(1, "PopupToast", {
            _text: "复制成功",
            _autoClose: true,
            _className: "clean_cart_tip",
          }),
        );
      });
    }
  }, []);
  useEffect(() => {
    // 数据整理
    if (orderDetailData) {
      let info = [];
      info.push({
        text: "订单编号",
        value: orderDetailData.orderId,
      });
      info.push({
        text: "下单时间",
        value: orderDetailData.createTime,
      });
      if (orderDetailData.paymentTime) {
        info.push({
          text: "支付时间",
          value: orderDetailData.paymentTime,
        });
      }
      if (
        orderDetailData.shippedTime &&
        !["E", "I", "X", "Y"].includes(orderDetailData.orderOriginStatus)
      ) {
        info.push({
          text: "发货时间",
          value: orderDetailData.shippedTime,
        });
      }
      // amountPaid
      let totalAmount = null;
      if (
        orderDetailData.orderStatus == "DPP" &&
        ["B", "BB"].includes(orderDetailData.orderOriginStatus)
      ) {
        totalAmount = orderDetailData.totalPayment;
      }
      info.push({
        text: "订单总额",
        value: "￥" + (totalAmount || orderDetailData.totalPayment),
      });
      // 普通商品取消
      if (
        orderDetailData.payInfoDtos &&
        orderDetailData.payInfoDtos.length === 1 &&
        ["X", "Y"].includes(orderDetailData.orderOriginStatus) &&
        orderDetailData.orderType === "1" &&
        orderDetailData.amountPaid
      ) {
        let itemValue = orderDetailData.payInfoDtos[0];
        let valueText = "";
        if (orderDetailData.totalPayment !== orderDetailData.amountPaid) {
          valueText = itemValue.payMethodCn + "￥" + itemValue.payAmount + " (已取消，原路返回)";
        } else {
          valueText = itemValue.payMethodCn + "(已取消，原路返回)";
        }
        info.push({
          text: "支付方式",
          value: valueText,
        });
      }
      //预售商品 部分支付
      else if (
        orderDetailData.payInfoDtos &&
        orderDetailData.payInfoDtos.length === 1 &&
        ["X", "Y"].includes(orderDetailData.orderOriginStatus) &&
        orderDetailData.orderType === "2"
      ) {
        info.push({
          text: "支付方式",
          value: "在线支付",
        });
      } else if (orderDetailData.orderType == "2") {
        //判断是否是部分支付，还是整单
        let wholeOrder = true; //默认是整单支付
        let [firstDep, fastDep] = orderDetailData.orderDepositList;
        let payInfoDtos = orderDetailData.payInfoDtos;
        let payList: any[] = [];
        payInfoDtos.map((item) => {
          let index = payList.findIndex((it) => it.payMethodCn == item.payMethodCn);
          if (index !== -1) {
            payList[index].payAmount = (
              parseFloat(item.payAmount) + parseFloat(payList[index].payAmount)
            ).toFixed(2);
          } else {
            payList.push(item);
          }
        });
        // 订单状态是部分支付
        if (["F", "MF", "BF"].includes(orderDetailData.orderOriginStatus)) {
          wholeOrder = false; //部分支付
        }
        // 定金支付状态没有付完，待支付，是部分支付状态
        if (firstDep.depositPayStatus == "4" || fastDep.depositPayStatus == "4") {
          wholeOrder = false; //部分支付
        } else {
          // 定金支付完成，存在两种支付方式，必然是部分支付
          if (firstDep.depositPayStatus == "1" && payInfoDtos.length >= 2) {
            wholeOrder = false; //部分支付
          }
          if (fastDep.depositPayStatus == "1" && payInfoDtos.length >= 3) {
            wholeOrder = false; //部分支付
          }
        }
        // 组合支付超过三种，则是部分支付
        if (payInfoDtos.length >= 3) {
          wholeOrder = false; //部分支付
        }
        if (payList && payList.length === 1) {
          info.push({
            text: "支付方式",
            value: payList[0].payMethodCn,
          });
        } else if (payList.length) {
          let payText = "";
          payList.map((it) => {
            // 整单支付，不需要显示金额
            if (wholeOrder) {
              payText = payText + it.payMethodCn + ",";
            }
          });
          if (wholeOrder) {
            info.push({
              text: "支付方式",
              value: payText.substring(0, payText.length - 1),
            });
          } else {
            info.push({
              list: "支付方式",
              value: payList,
            });
          }
        } else {
          info.push({
            text: "支付方式",
            value: orderDetailData.payMethod,
          });
        }
      }  else if (orderDetailData.payInfoDtos && orderDetailData.payInfoDtos.length==1) {
        info.push({
          text: "支付方式",
          value: orderDetailData.payInfoDtos[0].payMethodCn,
        });

      }
      
      else if (orderDetailData.payInfoDtos && orderDetailData.payInfoDtos.length) {
        info.push({
          list: "支付方式",
          value: orderDetailData.payInfoDtos,
        });
      } else {
        info.push({
          text: "支付方式",
          value: orderDetailData.payMethod,
        });
      }
      if (orderDetailData.deliveryInfo) {
        let deliveryTime = null;
        deliveryTime =
          [
            "工作日、双休日与假日均可送货",
            "只双休日、假日送货（工作日不送）",
            "只工作日送货（双休日、假日不送）",
          ][parseInt(orderDetailData.deliveryInfo) - 1] || orderDetailData.deliveryInfo;
        info.push({
          text: "送货时间",
          value: deliveryTime,
        });
      }
      if (orderDetailData.deliveryCompany) {
        info.push({
          text: "配送方式",
          value: orderDetailData.deliveryCompany,
        });
      }
      setInfoData(info);
    }
  }, [orderDetailData]);
  useEffect(() => {
    // 判断是否默认展开
    if (orderDetailData && orderDetailData.orderStatus === "DPP") {
      setShowMore(true);
    }
  }, [orderDetailData]);
  return (
    <div className="myorder_detail_order_info">
      <div className="order_info_title">订单信息</div>
      <em
        className={`expand_icon ${showMore ? "open" : "close"}`}
        onClick={() => {
          setShowMore(!showMore);
        }}
      />
      <div className="order_info_group">
        {infoData.map((content, index) => {
          if (!showMore && index > 1) return null;
          if (content.text)
            return (
              <div key={"order_info_item_" + index}>
                <span>{content.text}</span>
                <span>{content.value}</span>
                {content.text === "订单编号" ? (
                  <span
                    onClick={() => copy(orderDetailData && orderDetailData.orderId)}
                    className="order_info_copy"
                  />
                ) : null}
              </div>
            );
          return (
            <div key={"order_info_item_" + index}>
              <span>{content.list}</span>
              <div>
                {Array.isArray(content.value) &&
                  content.value.map((item) => {
                    return (
                      <p>
                        <span>{item.payMethodCn}</span>
                        {item.payAmount && <span>￥{item.payAmount}</span>}
                      </p>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetailOrderInfo;
