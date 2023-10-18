import React, { useEffect, useState } from "react";
import { IorderInfoList } from "../interface";
interface Props {
  totalPayAmount: string;
  productQuantity: number;
  shippingFee: string;
  giftProductQuantity: number;
  orderInfoList: IorderInfoList;
  showDepositSteps: Boolean;
}

const MyOrderListGoodsTotal: React.FunctionComponent<Props> = (props) => {
  const {
    totalPayAmount,
    productQuantity,
    shippingFee,
    giftProductQuantity,
    orderInfoList,
    showDepositSteps,
  } = props;

  const [text, setText] = useState("");
  useEffect(() => {
    // if (
    //   orderDepositList &&
    //   orderDepositList.length > 0 &&
    //   orderOriginStatus !== "V" &&
    //   orderOriginStatus !== "G" &&
    //   orderOriginStatus !== "Y" &&
    //   !(
    //     orderOriginStatus === "X" &&
    //     orderDepositList[0].depositPayStatus !== "1"
    //   )
    // ) {
    //   setShowDepositSteps(true);
    // }
    if (
      !orderInfoList ||
      !orderInfoList.orderDepositDtoList ||
      !orderInfoList.orderDepositDtoList.length
    ) {
      const orderStatus = orderInfoList.orderStatus;
      if (
        orderStatus == "DIP" ||
        orderStatus == "DID" ||
        (orderStatus == "DF" && !["X", "Y"].includes(orderInfoList.orderOriginStatus))
      ) {
        setText("实付款");
      } else {
        setText("需付款");
      }
      return;
    }
    let text = "";
    // 定金已付，尾款未付，且订单自动取消
    if (["X", "Y"].includes(orderInfoList.orderOriginStatus) && orderInfoList.orderType === 2) {
      text = "合计";
    } else if (
      orderInfoList.orderStatus == "DIP" ||
      orderInfoList.orderStatus == "DID" ||
      (orderInfoList.orderStatus == "DF" && !["X", "Y"].includes(orderInfoList.orderOriginStatus))
    ) {
      text = "实付款";
    } else if (["0", "4"].includes(orderInfoList.orderDepositDtoList[0].depositPayStatus)) {
      text = "需付定金";
    } else {
      text = "需付尾款";
    }
    setText(text);
    // console.log(orderInfoList, showDepositSteps)
  }, [orderInfoList, showDepositSteps]);

  return (
    <div className="myOrderList-goods-total">
      <div className="total-left">
        共{productQuantity + (giftProductQuantity ? giftProductQuantity : 0)}
        件商品
        {giftProductQuantity ?<span>（含{giftProductQuantity}件赠品）</span>:""}
      </div>
      <div className="total-right">
        <p>
          <span>{text} ¥</span>
          {totalPayAmount}
        </p>
        <p>含运费 ¥{shippingFee}</p>
      </div>
    </div>
  );
};
export default MyOrderListGoodsTotal;
