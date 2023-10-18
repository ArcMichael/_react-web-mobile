import React, { useEffect, useState } from "react";
import { orderInfo } from "@/containers/MyOrder/OrderDetail/interface";

interface OrderDetailAddressPartProps {
  orderDetailData: orderInfo;
  queryAllAddress: () => void;
}
const OrderDetailAddressPart: React.FunctionComponent<OrderDetailAddressPartProps> =
  ({ orderDetailData, queryAllAddress }) => {
    const [canclick, setCanclick] = useState(false);
    const [eclipseAddress, setEclipseAddress] = useState("");
    useEffect(() => {
      let eclipseAddress =
        (orderDetailData.province || "") +
        (orderDetailData.city || "") +
        (orderDetailData.area || "") +
        (orderDetailData.address || "") +
        (orderDetailData.zipcode ? "," + orderDetailData.zipcode : "");
      setEclipseAddress(eclipseAddress);
    }, [orderDetailData]);
    useEffect(() => {
      let canclick = false;
      if (orderDetailData.orderStatus === "DPP") {
        if (
          orderDetailData.orderType == "1" ||
          orderDetailData.orderType == "3"
        ) {
          canclick = true;
          if (
            orderDetailData.orderOriginStatus == "F" ||
            orderDetailData.deliveryInfo.length > 1
          ) {
            canclick = false;
          }
        } else if (
          orderDetailData.orderDepositList[0].depositAmountType == "1" &&
          (orderDetailData.orderDepositList[0].depositPayStatus == "0" ||
            orderDetailData.orderDepositList[0].depositPayStatus == "3")
        ) {
          canclick = true;
        }
      }
      setCanclick(canclick);
    }, [orderDetailData]);
    return (
      <div
        className="common-delivery-address address-info-show "
        onClick={canclick ? queryAllAddress : () => {}}
      >
        <em className="iconC-address" />
        <p className="user-info">
          <span className="userInfo">{orderDetailData.recipientName}</span>
          <em className="phone">
            {orderDetailData.mobile ? orderDetailData.mobile : ""}
          </em>
        </p>
        <div className="address">
          <label className={`address-info ${canclick ? "sm" : ""}`}>
            {eclipseAddress}
          </label>
        </div>
        {canclick ? <em className="iconC iconC-right" /> : null}
      </div>
    );
  };

export default OrderDetailAddressPart;
