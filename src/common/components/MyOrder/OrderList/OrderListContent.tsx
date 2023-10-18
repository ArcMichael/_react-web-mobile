import React, { useState, useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import OrderListContentTop from "../../../containers/MyOrder/OrderList/components/OrderListContentTop";
import OrderListContentGoods from "./OrderListContentGoods";
import OrderListGoodsTotal from "../../../containers/MyOrder/OrderList/components/OrderListGoodsTotal";
import OrderListContentBottom from "../../../containers/MyOrder/OrderList/components/OrderListContentBottom";
import {
  IorderInfoList,
  orderList,
  IproductInfoDto,
  IoperationDto,
} from "../../../containers/MyOrder/OrderList/interface";
import DepositSteps from "../OrderDetail/DepositSteps";
interface Props {
  orderInfoList: IorderInfoList;
  // orderStatus: string;
  checkBoxValue?: {
    checked: boolean;
    disabled: boolean;
  };
  joinDepositChecked?: any;
  orderType: number;
  isComment: boolean;
  index: number;
  orderListStatus: string;
  setIndex?: Function;
}
const OrderListContent: React.FunctionComponent<Props> = (props) => {
  const {
    orderInfoList,
    checkBoxValue,
    joinDepositChecked,
    orderType,
    isComment,
    index,
    orderListStatus,
    setIndex,
  } = props;
  const [orderStatus, setOrderStatus] = useState("");
  const [productInfo, setProductInfo] = useState<Array<ReactNode>>([]);
  const [stage, setStage] = useState<ReactNode>("");
  const [deliveryInfo, setDeliveryInfo] = useState<ReactNode>("");
  const orderList = useSelector<RootState, orderList>((s) => s.orderList);
  const [showDepositSteps, setShowDepositSteps] = useState(false);

  useEffect(() => {
    let { orderDepositDtoList, orderOriginStatus } = orderInfoList;
    if (
      orderDepositDtoList &&
      orderDepositDtoList.length > 0 &&
      orderOriginStatus !== "V" &&
      orderOriginStatus !== "G" &&
      orderOriginStatus !== "Y" &&
      !(orderOriginStatus === "X" && orderDepositDtoList[0].depositPayStatus !== "1")
    ) {
      setShowDepositSteps(true);
    }
  }, [orderInfoList.orderDepositDtoList, orderInfoList.orderOriginStatus]);

  const getOrderStatus = () => {
    if (orderInfoList.payMethod === "货到付款") {
      if (orderInfoList.orderType === 1 || orderInfoList.orderType === 3) {
        setOrderStatus("C" + orderInfoList.orderStatus);
      } else if (orderInfoList.orderType === 2) {
        setOrderStatus(orderInfoList.orderStatus);
      } else {
        setOrderStatus("C" + orderInfoList.orderStatus);
      }
      if (orderInfoList.orderOriginStatus == "X" || orderInfoList.orderOriginStatus == "Y") {
        setOrderStatus("XY" + orderInfoList.orderStatus);
      }
    } else {
      setOrderStatus(orderInfoList.orderStatus);
      if (orderInfoList.orderOriginStatus == "X" || orderInfoList.orderOriginStatus == "Y") {
        setOrderStatus("XY" + orderInfoList.orderStatus);
      }
    }
  };
  const toLogisticsInfo = () => {
    window.location.href = "/logisticsInfo?orderId=" + orderInfoList.orderId;
  };
  const toOrderDetail = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    window.location.href =
      "/order-" + orderInfoList.orderId + ".html?orderType=" + orderList.ORDERLISTSTATUS;
  };
  useEffect(() => {
    getOrderStatus();
    let deposit;
    // 定金阶段已取消的订单不显示
    if (
      orderInfoList.orderType == 2 &&
      orderInfoList.orderDepositDtoList &&
      !(
        (orderStatus === "XYDF" && orderInfoList.orderDepositDtoList[0].depositPayStatus != "1") ||
        orderInfoList.orderOriginStatus == "Y" ||
        orderInfoList.orderDepositDtoList[0].depositPayStatus == "3" || // 定金支付超时不显示
        orderInfoList.orderOriginStatus == "V" ||
        orderInfoList.orderOriginStatus == "G"
      ) // 交易关闭不显示
    ) {
      let estimatedDeliveryTime = "";
      orderInfoList.productInfoDtoList.map((items) => {
        if (items.estimatedDeliveryTime) {
          estimatedDeliveryTime = items.estimatedDeliveryTime;
        }
      });
      deposit = (
        <DepositSteps
          orderDepositList={orderInfoList.orderDepositDtoList}
          orderOriginStatus={orderInfoList.orderOriginStatus}
          estimatedDeliveryTime={estimatedDeliveryTime}
        />
      );
      setStage(deposit);
    }
    let isDIP = orderInfoList.orderStatus === "DIP", // 待发货
      isDID = orderInfoList.orderStatus === "DID", // 已发货
      isCanceling =
        (orderStatus == "CDF" || orderStatus == "DF" || orderStatus == "XYDF") &&
        orderInfoList.orderOriginStatus == "E"; // 取消处理中
    let deliveryInfo;
    if (isDIP || isDID || isCanceling) {
      // 拆单订单并且是待发货状态 和 拆单订单并且是取消处理中状态  不展示物流信息
      if (
        !(orderInfoList.isSplitOrder && isDIP) &&
        !(orderInfoList.isSplitOrder && isCanceling) &&
        orderInfoList.orderType == 1
      ) {
        deliveryInfo = orderInfoList.deliveryTracking && (
          <div
            className="orderInfo_deliveryInfo_container"
            onClick={() => {
              toLogisticsInfo();
            }}
          >
            <div className="orderInfo_deliveryInfo_content">
              <p className="orderInfo_deliveryInfo_message">
                {orderInfoList.deliveryTracking.trackingInfo}
              </p>
              <p className="orderInfo_deliveryInfo_time">
                {orderInfoList.deliveryTracking.updateTime}
              </p>
            </div>
            <div className="orderInfo_deliveryInfo_icon">
              <img
                src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
                alt=""
              />
            </div>
          </div>
        );
        setDeliveryInfo(deliveryInfo);
      }
    }
  }, []);

  useEffect(() => {
    let productInfoList: Array<ReactNode> = [];
    let giftInfoList: Array<ReactNode> = [];
    let productInfoDtoList = orderInfoList.productInfoDtoList;
    let giftInfoDtoList = orderInfoList.giftProductsInfoDtoList || [];

    productInfoList.push(
      productInfoDtoList.map((value: IproductInfoDto, index) => {
        let operationArr: IoperationDto[] = [];
        if (isComment && value.isSendComment == 1) {
          operationArr.push({
            type: "button",
            text: "去评价",
            className: "addcart",
            callback: () => {
              window.location.href =
                "/myConsulation?productId=" +
                value.productId +
                "&commentType=" +
                2 +
                "&sku=" +
                value.skuId +
                "&orderId=" +
                value.orderId +
                "&orderType=" +
                orderList.ORDERLISTSTATUS;
            },
          });
        }
        return (
          <OrderListContentGoods
            key={"productInfoList" + index}
            productInfoDtoList={value}
            orderType={orderType}
            operationArr={operationArr}
            label={value.skuType == "5" ? "gift" : undefined}
          />
        );
      }),
    );
    giftInfoDtoList.map((value, index) => {
      giftInfoList.push(
        <OrderListContentGoods
          key={"giftInfoDtoList" + index}
          productInfoDtoList={value}
          label={"gift"}
        />,
      );
    });
    let newArr = productInfoList.concat(giftInfoList);
    setProductInfo(newArr);
  }, [orderInfoList.productInfoDtoList]);

  return (
    <div className="myOrderList-content">
      <OrderListContentTop
        orderId={orderInfoList.orderId}
        orderStatus={orderStatus}
        orderOriginStatus={orderInfoList.orderOriginStatus}
        orderType={orderInfoList.orderType}
        orderDepositDtoList={orderInfoList.orderDepositDtoList}
        nowOrderStatus={orderList.ORDERLISTSTATUS}
        orderInfoList={orderInfoList}
        checkBoxValue={checkBoxValue}
        joinDepositChecked={joinDepositChecked}
      />
      {deliveryInfo}
      <div
        className="toOrderDetail"
        onClick={(e) => {
          toOrderDetail(e);
        }}
      >
        {productInfo}
        {stage}
        <OrderListGoodsTotal
          totalPayAmount={orderInfoList.totalPayAmount}
          productQuantity={orderInfoList.productQuantity}
          shippingFee={orderInfoList.shippingFee}
          giftProductQuantity={orderInfoList.giftProductQuantity}
          orderInfoList={orderInfoList}
          showDepositSteps={showDepositSteps}
        />
      </div>

      {orderStatus && orderInfoList && (
        <OrderListContentBottom
          orderInfoList={orderInfoList}
          orderStatus={orderStatus}
          index={index}
          orderListStatus={orderListStatus}
          setIndex={setIndex}
        />
      )}
    </div>
  );
};
export default OrderListContent;
