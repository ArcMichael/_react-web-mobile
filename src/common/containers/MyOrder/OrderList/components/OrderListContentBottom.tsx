import React, { useState, useEffect, ReactNode } from "react";
import { useDispatch } from "react-redux";
import * as OrderList from "@/actions/orderList";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import { popupAlert } from "@/actions/popup";
// import { getBaseUrlByTarget } from "@/lib/url";
import { IorderInfoList, addDto } from "../interface";
import Sensor from "@/Utils/sensor";

interface Props {
  orderInfoList: IorderInfoList;
  orderStatus: string;
  index: number;
  orderListStatus: string;
  setIndex: Function;
}

const OrderListContentBottom: React.FunctionComponent<Props> = (props) => {
  const { orderInfoList, orderStatus, index, orderListStatus, setIndex } = props;
  let {
    giftProductsInfoDtoList,
    orderType,
    productInfoDtoList,
    orderOriginStatus,
    orderId,
    orderDepositDtoList,
    processOrderCancel,
  } = orderInfoList;
  const dispatch = useDispatch();
  const [btn, setBtn] = useState<ReactNode>();
  const [invoiceBtn] = useState<ReactNode>();
  const [countDown, setCountDown] = useState("");
  const [time, setTime] = useState(false);
  const getBtn = () => {
    const againBtn = (
      <button className="buy-again" onClick={() => bugAgain()}>
        再来一单
      </button>
    );
    const logisticsBtn = (
      <button className="check-the-logistics" onClick={() => checklogistics()}>
        查看物流
      </button>
    );
    const payBtn = (
      <button className="Immediately-pay" onClick={() => openMergeOrders()}>
        立即支付
      </button>
    );
    const payBtn2 = <button className="Immediately-pay disabled">去购物车结算</button>;
    const cartBtn = (
      <button className="Immediately-pay" onClick={() => goCart()}>
        去购物车结算
      </button>
    );
    // orderType 1--普通订单 2--定金订单 3--预售订单
    switch (orderStatus) {
      case "DPP":
        if (orderType === 2) break;
        setBtn(<div>{payBtn}</div>);
        break;
      case "DIP":
        if (orderType === 2) break;
        setBtn(<div>{againBtn}</div>);
        break;
      case "DID":
        setBtn(
          <div>
            {orderType !== 2 && againBtn}
            {logisticsBtn}
          </div>,
        );
        break;
      case "DF":
        setBtn(
          <div>
            {orderType !== 2 && againBtn}
            {/* {(orderOriginStatus !== "E" || orderType !== 1) && logisticsBtn} */}
          </div>,
        );
        break;
      case "CDPP":
        break;
      case "CDIP":
        if (orderType == 2) break;
        setBtn(<div>{againBtn}</div>);
        break;
      case "CDID":
        setBtn(
          <div>
            {orderType !== 2 && againBtn}
            {logisticsBtn}
          </div>,
        );
        break;
      case "CDF":
        setBtn(
          <div>
            {orderType !== 2 && againBtn}
            {orderOriginStatus != "E" && logisticsBtn}
          </div>,
        );
        break;
      case "XYDF":
        if (orderType == 2) break;
        setBtn(againBtn);
        break;
    }

    if (orderStatus == "DPP" && orderType == 2) {
      if (
        orderDepositDtoList &&
        orderDepositDtoList[0].depositAmountType == "1" &&
        (orderDepositDtoList[0].depositPayStatus == "0" ||
          orderDepositDtoList[0].depositPayStatus == "4")
      ) {
        setBtn(<div>{payBtn}</div>);
        setTime(true);
      } else if (
        orderDepositDtoList &&
        orderDepositDtoList[0].depositAmountType == "1" &&
        orderDepositDtoList[0].depositPayStatus == "3"
      ) {
        setBtn("");
      } else if (
        orderDepositDtoList &&
        orderDepositDtoList[1].depositAmountType == "2" &&
        orderDepositDtoList[1].depositPayStatus == "0"
      ) {
        setBtn(payBtn);
        if (orderOriginStatus === "B") {
          setBtn(cartBtn);
        }
        setTime(orderOriginStatus === "B" ? false : true);
      } else if (
        orderDepositDtoList &&
        orderDepositDtoList[1].depositAmountType == "2" &&
        orderDepositDtoList[1].depositPayStatus == "3"
      ) {
        // 点击弹窗提示
        if (
          orderOriginStatus === "BB" ||
          orderOriginStatus === "MF" ||
          orderOriginStatus === "BF"
        ) {
          // 已成单或部分支付
          setBtn(payBtn);
          setTime(true);
        } else {
          setBtn(payBtn2);
        }
      } else if (
        orderDepositDtoList &&
        orderDepositDtoList[1].depositAmountType == "2" &&
        orderDepositDtoList[1].depositPayStatus == "2"
      ) {
        // 置灰
        setBtn(payBtn2);
      } else if (
        orderDepositDtoList &&
        orderDepositDtoList[1].depositAmountType == "2" &&
        orderDepositDtoList[1].depositPayStatus == "4"
      ) {
        // 尾款部分支付
        setBtn(payBtn);
        setTime(true);
      } else {
        setBtn("");
      }
    } else if (orderStatus == "DPP" && orderType != 2) {
      setTime(true);
    }
    if (orderStatus == "XYDF" && orderType == 2) {
      if (
        orderDepositDtoList &&
        orderDepositDtoList[0].depositPayStatus == "1" &&
        orderInfoList.orderOriginStatus != "Y"
      ) {
        setBtn(payBtn);
      }
    }
    if (orderType == 3) {
      switch (orderStatus) {
        case "DPP":
          setBtn(<div>{payBtn}</div>);
          break;
        case "DIP":
          setBtn("");
          break;
        case "DID":
          setBtn(<div>{logisticsBtn}</div>);
          break;
        case "DF":
          setBtn(<div>{logisticsBtn}</div>);
          break;
        case "CDPP":
          break;
        case "CDIP":
          setBtn("");
          break;
        case "CDID":
          setBtn(<div>{logisticsBtn}</div>);
          break;
        case "CDF":
          setBtn(<div>{logisticsBtn}</div>);
          break;
        case "XYDF":
          setBtn("");
          break;
      }
    }
    if (
      (orderStatus == "DIP" || orderStatus == "CDIP") &&
      orderOriginStatus == "I" &&
      processOrderCancel
    ) {
      if (orderType === 1) {
        setBtn(<div>{againBtn}</div>);
      } else if (orderType === 2) {
        setBtn("");
      } else if (orderType === 3) {
        setBtn("");
      }
    }
    if (
      (orderStatus == "CDF" || orderStatus == "XYDF") &&
      orderOriginStatus == "E" &&
      orderType !== 2
    ) {
      setBtn(<div>{againBtn}</div>);
    }
    if (
      (orderStatus == "CDF" || orderStatus == "XYDF") &&
      orderOriginStatus == "V" &&
      orderType !== 2
    ) {
      setBtn(<div>{againBtn}</div>);
    }
    if ((orderStatus == "CDF" || orderStatus == "XYDF") && orderOriginStatus == "G") {
      setBtn(
        <div>
          {orderType !== 2 && againBtn}
          {logisticsBtn}
        </div>,
      );
    }
  };
  // 再次购买
  const bugAgain = () => {
    if (!giftProductsInfoDtoList) {
      giftProductsInfoDtoList=[]
    }
    if (!productInfoDtoList) {
      productInfoDtoList=[]
    }
    let spuList:string[]=[]
let skuList:string[]=[]
let numberList:number[]=[]



    let buyGoods = [...productInfoDtoList,...giftProductsInfoDtoList];
    let arr: addDto[] = [],
      productsArray: any = [];
    if (buyGoods) {
      buyGoods.map((item) => {
        spuList.push(item.productId)
        skuList.push(item.skuId)
        numberList.push(item.quantity)
        if (item.skuId) {
          arr.push({
            type: 1,
            channel: "MOBILE",
            quantity: item.quantity,
            checked: 1,
            skuId: item.skuId,
          });
          productsArray.push({
            name: item.brandNameCN,
            id: item.productId,
            price: item.offerPrice,
            brand: item.brandNameEN,
            variant: item.skuCode,
            quantity: item.quantity,
          });
        }
      });
    }
 Sensor.go("orderRelatedPage_click", {
  OP_code: spuList.join(",") || null,
  commodity_sku: skuList.join(","),
  commodity_number: numberList.join(","),
  button_name:"再来一单",
  current_url:window.location.href
});
    dispatch(
      OrderList.batchRepurchase(arr, (callback: any) => {
        if (callback && callback.results && !callback.results.code) {
          GoogleAnalytics.push({
            buttonPosition: "我的订单",
            eventName: "查看物流",
            orderId: orderId,
            event: "ButtonClick",
          });
          GoogleAnalytics.push({
            event: "addToCart",
            ecommerce: {
              currencyCode: "CNY",
              add: {
                products: productsArray,
              },
            },
          });
          window.location.href = "/cart";
        } else {
          if (
            callback &&
            callback.results &&
            callback.results.code )
          //   &&
          //   (callback.results.code == 40051299 ||
          //     callback.results.code == 40051399 ||
          //     callback.results.code == 40052199 ||
          //     callback.results.code == 40053099 ||
          //     callback.results.code == 40051039 ||
          //     callback.results.code == 40073099 ||
          //     callback.results.code == 40050169)
          // ) 
          {
            dispatch(
              popupAlert(1, "PopupCleaning", {
                _title: callback.results.code,
                _text: callback.results.message,
                _autoClose: true,
              }),
            );
          } else {
            window.location.href = "/cart";
          }
        }
      }),
    );
  };
  const checklogistics = () => {
    GoogleAnalytics.push({
      buttonPosition: "我的订单",
      eventName: "查看物流",
      orderId: orderId,
      event: "ButtonClick",
    });
    window.location.href = "/logisticsInfo?orderId=" + orderId + "&orderType=" + orderStatus;
  };
  // 立即支付、合并支付
  const openMergeOrders = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIndex(e, index);
  };
  const goCart = () => {
    let queryBody = [
      {
        skuId: productInfoDtoList[0].skuId,
        checked: "1",
        orderId: productInfoDtoList[0].orderId,
        type: "1",
        userId: "100008",
      },
    ];
    let source = "MYORDERLIST";
    if (orderListStatus === "DPPB") source = "MYORDERLISTDPPB";
    OrderList.mergeAndSubmit(queryBody, source);
  };
  /**
   * invoice相关按钮
   */

  // const getInvoiceBtn = () => {
  //   if (orderInfoList) {
  //     const { orderInvoiceSwitch } = orderInfoList;
  //     if (orderInvoiceSwitch === 0 || orderInvoiceSwitch === 1) {
  //       setInvoiceBtn(
  //         <button
  //           className="check-the-logistics"
  //           onClick={() => handeApplyInvoice()}
  //         >
  //           申请开票
  //         </button>
  //       );
  //     }
  //     if (orderInvoiceSwitch === 2) {
  //       setInvoiceBtn(
  //         <button
  //           className="check-the-logistics"
  //           onClick={() => handleViewInvoice()}
  //         >
  //           查看发票
  //         </button>
  //       );
  //     }
  //   }
  // };
  // const handeApplyInvoice = () => {
  //   const { orderInvoiceSwitch } = orderInfoList;
  //   if (orderInvoiceSwitch === 1) {
  //     // this.props.popup.popupAlert(1, "PopupToast", {
  //     //   _text: "已超过申请时间，请联系客服处理",
  //     //   _autoClose: true,
  //     // });
  //     // return;
  //     alert("已超过申请时间，请联系客服处理");
  //   }
  //   const url = `${getBaseUrlByTarget(
  //     60018
  //   )}/myAccount/issueInvoice?redirect=${encodeURIComponent(
  //     window.location.href
  //   )}&orderId=${orderInfoList.orderId}`;
  //   window.location.href = url;
  // };
  // const handleViewInvoice = () => {
  //   window.location.href = `${getBaseUrlByTarget(
  //     60018
  //   )}/myAccount/invoiceList/?orderId=${orderId}`;
  // };
  const getCountDown = (time: number) => {
    let end_time = time;
    let days = Math.floor(end_time / 86400) + "";
    let remainHours = end_time % (24 * 3600);

    let hours = Math.floor(remainHours / 3600) + "";
    let remainMinutes = remainHours % 3600;

    let minutes = Math.floor(remainMinutes / 60) + "";
    let remainSecounds = remainMinutes % 60;

    let secounds = Math.floor(remainSecounds) + "";
    return {
      days: days.padStart(2, "0"),
      hours: hours.padStart(2, "0"),
      minutes: minutes.padStart(2, "0"),
      secounds: secounds.padStart(2, "0"),
    };
  };
  useEffect(() => {
    getBtn();
    // getInvoiceBtn();
    if (orderInfoList) {
      let countDown;
      let timer: number;
      let countDownIntervalTime: number = 0;
      if (orderInfoList.calcCancelTime) {
        countDownIntervalTime = orderInfoList.calcCancelTime;
        timer = window.setInterval(() => {
          countDownIntervalTime -= 1;
          if (countDownIntervalTime === 0) {
            window.location.reload();
            return;
          }
          let countTime = getCountDown(countDownIntervalTime);
          countDown = `距订单关闭还有${countTime.days}天${countTime.hours}时${countTime.minutes}分`;
          let countDownOne = `距订单关闭还有${countTime.hours}时${countTime.minutes}分${countTime.secounds}秒`;
          let countDownText = countTime.days == "00" ? countDownOne : countDown;
          if (orderInfoList.orderOriginStatus == "B") countDown = "";
          setCountDown(countDownText);
        }, 1000);
        return function () {
          clearInterval(timer);
        };
      } else {
        countDown = `距订单关闭还有00天00时00分00秒`;
        setCountDown(countDown);
      }
    }
  }, []);
  return (
    <div className={!btn ? "myOrderList-content-bottom cur" : "myOrderList-content-bottom"}>
      {btn}
      {orderInfoList.calcCancelTime > 0 &&
        orderInfoList.orderStatus == "DPP" &&
        orderInfoList.orderOriginStatus !== "X" &&
        time && <div className="orderList-calcCancelTime">{countDown}</div>}
      {invoiceBtn}
    </div>
  );
};
export default OrderListContentBottom;
