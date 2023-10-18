import React, { useEffect, useState, useCallback } from "react";
import { startCustomerService } from "@/actions/plpPage";
import { useDispatch } from "react-redux";
import { orderInfo } from "@/containers/MyOrder/OrderDetail/interface";
import CdnImage from "@/components/CdnImage";

let countDownInterval: number;
let countDownIntervalTime: number = 0;
const OrderDetailPageTitle: React.FunctionComponent<{
  title: string;
  orderDetailData: orderInfo;
  setOrderStatue: React.Dispatch<React.SetStateAction<string>>;
  totalAmount: string;
  setTotalAmount: React.Dispatch<React.SetStateAction<string>>;
  setMTotalAmount:React.Dispatch<React.SetStateAction<string>>;
  openMergeOrders: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  setShowSlik: React.Dispatch<React.SetStateAction<boolean>>;
  goCart: () => void;
}> = ({
  title,
  orderDetailData,
  setOrderStatue,
  totalAmount,
  setTotalAmount,
  openMergeOrders,
  setShowSlik,
  setMTotalAmount,
  goCart,
}) => {
  const dispatch = useDispatch();
  const [countDown, setCountDown] = useState("00小时00分00秒");
  const [payButton, setPayButton] = useState(false);
  const [cartButton, setCartButton] = useState(false);
  const [buttonStatus, setButtonStatus] = useState("");
  const [payText, setPayText] = useState("需付款");
  //时间前面添加0
  const addZero = (Num: number) => {
    if (Num >= 10) {
      return "" + Num;
    } else if (Num > 0) {
      return "0" + Num;
    } else if (Num === 0) {
      return "00";
    }
  };
  //获取倒计时，天时分秒
  const getCountDown = (currentTime: number) => {
    let currentTimes = currentTime;

    let days = 0,
      hours = 0,
      minutes = 0,
      secounds = 0,
      remainHours = 0,
      remainMinutes = 0,
      remainSecounds = 0;

    days = Math.floor(currentTimes / 86400);
    remainHours = currentTimes % (24 * 3600);

    hours = Math.floor(remainHours / 3600);
    remainMinutes = remainHours % 3600;

    minutes = Math.floor(remainMinutes / 60);
    remainSecounds = remainMinutes % 60;

    secounds = Math.floor(remainSecounds);

    return {
      days: addZero(days),
      hours: addZero(hours),
      minutes: addZero(minutes),
      secounds: addZero(secounds),
    };
  };
  useEffect(() => {
    // 获取定金支付状态的文字
    let text = "";
    if (orderDetailData.orderType === "2") {
      let depositFirst =
        (orderDetailData.orderDepositList &&
          orderDetailData.orderDepositList.find((it) => it.depositAmountType === "1")
            ?.depositPayStatus) ||
        null;
      // 定金取消 且 定金未支付
      if (depositFirst != "1" && orderDetailData.orderOriginStatus == "X") {
        text = "";
      }
      // 定金已付，尾款未付，且订单自动取消
      else if (depositFirst === "1" && orderDetailData.orderOriginStatus == "X") {
        text = "应付总额";
      } else if (
        orderDetailData.orderStatus !== "DPP" &&
        !["X", "Y"].includes(orderDetailData.orderOriginStatus)
      ) {
        text = "实付款";
      } else if (["B", "BB"].includes(orderDetailData.orderOriginStatus)) {
        text = "需付尾款";
      }
      // 取消订单，且是定金 订单
      else if (orderDetailData.orderOriginStatus == "X") {
        text = "需付尾款";
      } else if (depositFirst === "1") {
        text = "需付尾款";
      } else {
        text = "需付定金";
      }
      setPayText(text);
    }
    // 获取订单状态与立即支付按钮
    if (!orderDetailData) return;
    if (orderDetailData.orderStatus === "DPP") {
      if (orderDetailData.orderType !== "2") {
        setOrderStatue(orderDetailData.orderOriginStatus == "F" ? "部分支付" : "待支付");
        setPayButton(true);
      } else {
        if (
          orderDetailData.orderDepositList[0].depositAmountType == "1" &&
          (orderDetailData.orderDepositList[0].depositPayStatus == "0" ||
            orderDetailData.orderDepositList[0].depositPayStatus == "3")
        ) {
          if (orderDetailData.orderDepositList[0].depositPayStatus == "0") {
            setOrderStatue("定金待支付");
            setPayButton(true);
          } else {
            setOrderStatue("交易取消");
          }
        } else if (
          orderDetailData.orderDepositList[0].depositAmountType == "1" &&
          orderDetailData.orderDepositList[0].depositPayStatus == "1"
        ) {
          let statue = "定金已支付";
          if (orderDetailData.orderDepositList[1].depositAmountType == "2") {
            switch (orderDetailData.orderDepositList[1].depositPayStatus) {
              case "0":
                if (orderDetailData.orderOriginStatus === "BB") {
                  setPayButton(true);
                  statue = "尾款待支付";
                } else {
                  setCartButton(true);
                }
                break;
              case "2":
                // if (orderDetailData.orderOriginStatus === "BB") {
                //   setCartButton(true);
                // }
                if (orderDetailData.orderType !== "2") {
                  setCartButton(true);
                }
                setButtonStatus("disabled");
                break;
              case "3":
                statue = "交易取消";
                // if (
                //   orderDetailData.orderOriginStatus === "BB" ||
                //   orderDetailData.orderOriginStatus === "MF" ||
                //   orderDetailData.orderOriginStatus === "BF"
                // ) {
                //   setPayButton(true);
                // } else {
                //   setCartButton(true);
                // }
                setButtonStatus("timeout");
                break;
              case "4":
                statue = "部分支付";
                setPayButton(true);
                break;
              default:
                break;
            }
          }
          setOrderStatue(statue);
        } else if (
          orderDetailData.orderDepositList[0].depositAmountType == "1" &&
          (orderDetailData.orderDepositList[0].depositPayStatus == "3" ||
            orderDetailData.orderDepositList[0].depositPayStatus == "4")
        ) {
          setOrderStatue("定金待支付");
          setPayButton(true);
        }
        if (
          orderDetailData.orderOriginStatus === "MF" ||
          orderDetailData.orderOriginStatus === "BF"
        ) {
          setOrderStatue("部分支付");
        }
      }
    } else if (orderDetailData.orderStatus === "DIP") {
      setOrderStatue("正在出库");
    } else if (orderDetailData.orderStatus === "DID") {
      setOrderStatue("派送中");
    } else if (orderDetailData.orderStatus === "DF") {
      if (orderDetailData.orderOriginStatus === "Y") {
        setOrderStatue("交易取消");
      } else if (orderDetailData.orderOriginStatus === "X") {
        // if (
        //   orderDetailData.orderType === "2" &&
        //   orderDetailData.orderDepositList[0] &&
        //   orderDetailData.orderDepositList[0].depositPayStatus === "1"
        // ) {
        //   setPayButton(true);
        // }
        setOrderStatue("交易取消");
      } else if (orderDetailData.orderOriginStatus === "D") {
        setOrderStatue("交易完成");
      } else if (orderDetailData.orderOriginStatus === "C") {
        setOrderStatue("交易完成");
      } else if (orderDetailData.orderOriginStatus === "R") {
        setOrderStatue("交易完成");
      } else if (orderDetailData.orderOriginStatus === "E") {
        setOrderStatue("取消处理中");
      } else if (orderDetailData.orderOriginStatus === "T") {
        setOrderStatue("退款中");
      } else if (orderDetailData.orderOriginStatus === "V") {
        setOrderStatue("交易关闭");
      } else if (orderDetailData.orderOriginStatus === "G") {
        setOrderStatue("交易关闭");
      }
    }
  }, [orderDetailData]);
  useEffect(() => {
    // 倒计时
    if (!orderDetailData.orderType && (!payButton || !cartButton)) return;
    countDownIntervalTime = orderDetailData.calcCancelTime;
    if (orderDetailData.orderType === "2") {
      let fisrtDetails = orderDetailData.orderDepositList[0],
        lastDetails = orderDetailData.orderDepositList[1];
      if (fisrtDetails.depositPayStatus === "0") {
        countDownIntervalTime = fisrtDetails.payCancelRemainingTime;
      } else if (lastDetails.depositPayStatus === "0") {
        countDownIntervalTime = lastDetails.payCancelRemainingTime;
      }
      if (orderDetailData.calcCancelTime) {
        // 订单关闭时间和 定金待支付时间，谁小，先显示谁
        countDownIntervalTime = Math.min(orderDetailData.calcCancelTime, countDownIntervalTime);
      }
    }
    if (orderDetailData.orderStatus && orderDetailData.orderStatus === "DPP") {
      if (countDownIntervalTime === 0) {
        setCountDown("00小时00分00秒");
        return;
      }

      clearInterval(countDownInterval);
      countDownInterval = window.setInterval(() => {
        let countTime = getCountDown(countDownIntervalTime);

        let countDown = `${countTime.days}天${countTime.hours}时${countTime.minutes}分`;
        let countDownOne = `${countTime.hours}时${countTime.minutes}分${countTime.secounds}秒`;
        let countText = countTime.days == "00" ? countDownOne : countDown;
        if (
          orderDetailData.orderType == "2" &&
          orderDetailData.orderDepositList &&
          orderDetailData.orderDepositList.length > 0
        ) {
          // 定金预售已付定金且尾款未开始时，部分支付时
          if (
            (orderDetailData.orderDepositList[0].depositAmountType == "1" &&
              orderDetailData.orderDepositList[0].depositPayStatus == "0") ||
            orderDetailData.orderOriginStatus === "BB" ||
            orderDetailData.orderDepositList[1].depositPayStatus == "4" ||
            orderDetailData.orderDepositList[0].depositPayStatus == "4"
          ) {
            setCountDown(countText);
          }

          if (
            orderDetailData.orderDepositList[0].depositAmountType == "1" &&
            orderDetailData.orderDepositList[0].depositPayStatus == "1" &&
            orderDetailData.orderDepositList[1].depositAmountType == "2" &&
            orderDetailData.orderDepositList[1].depositPayStatus == "0"
          ) {
            setCountDown(countText);
          }
        } else {
          setCountDown(countText);
        }
        if (countDownIntervalTime == 0) {
          clearInterval(countDownInterval);
          return;
        }
        countDownIntervalTime -= 1;
      }, 1000);
      return function () {
        clearInterval(countDownInterval);
      };
    }
  }, [orderDetailData, payButton]);
  useEffect(() => {
    // 金额
    if (!orderDetailData) return;
    let amount = orderDetailData.totalPayment;
    if (orderDetailData.orderType === "2") {
      if (
        orderDetailData.orderOriginStatus === "BF" ||
        orderDetailData.orderOriginStatus === "MF"
      ) {
        // 部分支付
        amount = orderDetailData.amountPayable;
        setShowSlik(false);
      }
      if (
        orderDetailData.orderDepositList[0].depositAmountType == "1" &&
        (orderDetailData.orderDepositList[0].depositPayStatus == "0" ||
          orderDetailData.orderDepositList[0].depositPayStatus == "3")
      ) {
        amount = orderDetailData.orderDepositList[0].orderDepositAmount + "";
      }
    } else {
      if (orderDetailData.orderOriginStatus === "F") {
        // 部分支付
        amount = orderDetailData.amountPayable;
      }
    }
    if (orderDetailData.mergeOrders && orderDetailData.mergeOrders.length > 1) {
      // amount = orderDetailData.mShouldPay;
      setMTotalAmount(orderDetailData.mShouldPay)
    }
    setTotalAmount(amount);
  }, [orderDetailData]);
  const buttonClick = useCallback(
    (fn, e) => {
      if (buttonStatus === "timeout") {
        return alert("已过尾款支付时间，无法支付尾款");
      } else if (buttonStatus === "disabled") {
        return;
      }
      fn(e);
    },
    [buttonStatus],
  );
  return (
    <div>
      <div className={`orderdetail-page-title ${payButton || cartButton ? "large" : "mid"}`}>
        <div className={`orderdetail-page-title-content ${payButton ? "large" : "mid"}`}>
          <span className="orderdetail-page-title-back" onClick={() => window.history.go(-1)}>
            <CdnImage src="/soa/mobile/images/order/go_back_icon_white.png" />
          </span>
          <span className="orderdetail-page-title-con">
            <span className="orderdetail-page-title-text">{title}</span>
          </span>
          <div
            onClick={() => dispatch(startCustomerService())}
            className="orderdetail-page-title-customer"
          >
            <CdnImage src="/soa/mobile/images/order/customerService_order_white.png" />
          </div>
        </div>
        <div className="orderdetail-page-title-info">
          {payButton || cartButton ? (
            <div className="orderdetail-page-order-countdown">
              <span>{payText}</span>
              <span>￥</span>
              <span>{totalAmount}</span>
              <span>剩余</span>
              <span>{countDown}</span>
              <span>关闭</span>
            </div>
          ) : null}
        </div>
      </div>
      <div className={`orderdetail-page-header ${payButton || cartButton ? "large" : "mid"}`}>
        {payButton ? (
          <div
            className="orderdetail-page-order-pay"
            onClick={(e) => buttonClick(openMergeOrders, e)}
          >
            立即支付
          </div>
        ) : null}
        {cartButton ? (
          <div
            className={`orderdetail-page-order-pay ${
              buttonStatus === "disabled" ? "disabled" : ""
            }`}
            onClick={(e) => buttonClick(goCart, e)}
          >
            去购物车结算
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetailPageTitle;
