import React, { useState, ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as OrderList from "@/actions/orderList";
import { urlGetParams } from "@/lib/url";
import { orderList } from "../interface";

const OrderListTab: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const orderList = useSelector<RootState, orderList>((s) => s.orderList);
  const [currentStatus, setCurrentStatus] = useState(
    urlGetParams(window.location, "orderType") || ""
  );
  const [toFixed, setToFixed] = useState(false);
  const [tabItem, setTabItemItem] = useState<Array<ReactNode>>([]);
  const changeTab = (status: string) => {
    setCurrentStatus(status);
    document.documentElement.scrollTop = 0;
    switch (status) {
      case "all":
        dispatch(OrderList.orderListShow(orderList.ORDERLISTRESULTALL));
        break;
      case "DPP":
        dispatch(OrderList.orderListShow(orderList.ORDERLISTRESULTM));
        break;
      case "DID":
        dispatch(OrderList.orderListShow(orderList.ORDERLISTRESULTS));
        break;
      case "DIP":
        dispatch(OrderList.orderListShow(orderList.ORDERLISTRESULTI));
        break;
      case "DF":
        dispatch(OrderList.orderListShow(orderList.ORDERLISTRESULTD));
        break;
      default:
        break;
    }
    dispatch(OrderList.orderListChange(currentStatus));
  };
  useEffect(() => {
    let tabList = [
      { key: "all", value: "全部" },
      { key: "DPP", value: "待支付" },
      { key: "DIP", value: "待发货" },
      { key: "DID", value: "已发货" },
      { key: "DF", value: "已完成" },
    ];
    let tabItems: Array<ReactNode> = [];
    tabList.map((item, index) =>
      tabItems.push(
        <li
          className={currentStatus == item.key ? "cur" : ""}
          onClick={() => changeTab(item.key)}
          key={`tab_list_${index}`}
        >
          {item.value}
        </li>
      )
    );
    setTabItemItem(tabItems);
    changeTab(currentStatus);
  }, [currentStatus]);
  useEffect(() => {
    let height = document.getElementById("myOrderList-tab-con")?.getBoundingClientRect().top;
    window.addEventListener("scroll", () => {
      let scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      if (scrollTop > Number(height)) {
        setToFixed(true);
      } else {
        setToFixed(false);
      }
    });
  }, []);
  return (
    <div className={`myOrderList-tab-box `} id="myOrderList-tab-con">
      <div className={`myOrderList-tab-con ${toFixed ? "cur" : ""}`} >
        <div className="myOrderList-tab-con-offline-order">
          <div>线上订单</div>
          <div
            onClick={() => {
              window.location.href = `/myAccount/offlineOrder?orderType=${currentStatus}`;
            }}
          >
            <span>线下订单</span>
            <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/Icon-switch.png" />
          </div>
        </div>
        <ul className="myOrderList-tab">{tabItem}</ul>
      </div>
    </div>
  );
};

export default OrderListTab;
