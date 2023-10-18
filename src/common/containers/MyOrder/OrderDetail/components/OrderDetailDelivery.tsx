import React, { useState, useEffect } from "react";
import Dynamic from "@/Utils/Dynamic";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import { DeliveryDataDto } from "@/containers/MyOrder/OrderDetail/interface";
declare var moment: any;
const dynamic = new Dynamic();

interface OrderDetailDeliveryProps {
  deliveryData?: DeliveryDataDto[];
  deliverySummary: string;
  deliveryTime: string;
}

const lookLogistics = () => {
  let orderId = window.location.pathname.split("-")[1].split(".")[0];
  window.location.href = "/logisticsInfo?orderId=" + orderId;
  GoogleAnalytics.push({
    buttonPosition: "我的订单",
    eventName: "查看物流",
    orderId: orderId,
    event: "ButtonClick",
  });
};
const OrderDetailDelivery: React.FunctionComponent<OrderDetailDeliveryProps> = ({
  deliverySummary,
  deliveryTime,
  deliveryData,
}) => {
  const [momentDidMount, setMomentDidMount] = useState(false);
  useEffect(() => {
    dynamic.moment().then(() => {
      setMomentDidMount(true);
    });
  }, []);
  if (!deliverySummary || !deliveryTime) return null;
  if (deliveryData && deliveryData.length > 1) {
    return (
      <div className="myorder_detail_products_delivery">
        <p className="delivery_summary">
          {/* 本单商品已拆分为{deliveryData && deliveryData.length}个包裹发货 */}
          {deliverySummary}
        </p>
        {deliveryData.map((item, index) => {
          return (
            <div key={`delivery_packages_${index}`}>
              <div className="delivery_packages">包裹{index + 1}:</div>
              <div className="delivery_packages_info">
                <div className="delivery_trackingInfo">{item.trackingInfo}</div>
                <div className="delivery_updateTime">
                  {momentDidMount && moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
            </div>
          );
        })}
        <em onClick={lookLogistics} />
      </div>
    );
  }
  return (
    <div className="myorder_detail_products_delivery single">
      <div className="delivery_trackingInfo">{deliverySummary}</div>
      <div className="delivery_updateTime">{deliveryTime}</div>
      <em onClick={lookLogistics} />
    </div>
  );
};

export default OrderDetailDelivery;
