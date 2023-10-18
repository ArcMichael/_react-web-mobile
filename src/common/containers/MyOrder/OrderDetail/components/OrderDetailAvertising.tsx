import React, { useEffect, useState } from "react";
import OrderDetailAction from "@/lib/services/OrderDetail";

const OrderDetailAvertising: React.FunctionComponent<{
  show: boolean;
  close: () => void;
}> = ({ show, close }) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    OrderDetailAction.advertTxt({
      queryBody: { locationLabel: "MOB:ORDERPAGE:TOP_TEXT_CAROUSEL" },
    }).then((json) => {
      if (
        json.results &&
        json.results.resourceList &&
        json.results.resourceList[0] &&
        json.results.resourceList[0].content
      ) {
        setContent(json.results.resourceList[0].content);
      } else {
        close();
      }
    });
  }, []);
  if (!content || !show) {
    return null;
  }
  return (
    <div className="order_detail_advertising">
      <div className="advertising_close">
        <img
          src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupCloseIcon_white.png"
          onClick={close}
        />
      </div>
      <div className="advertising_content">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default OrderDetailAvertising;
