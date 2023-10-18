import React, { useEffect, useState } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
if (__DEV__ && isBrowser()) {
  require("../../../../public/style/common/_common_order_deposit.scss");
}
import { OrderDepositDto } from "@/containers/MyOrder/OrderDetail/interface";

interface DepositStepsProps {
  orderDepositList: OrderDepositDto[];
  orderOriginStatus: string;
  estimatedDeliveryTime?: string;
  countDownInterval?: number;
  countDownIntervalTime?: number;
}

interface depositStepsData {
  depositPayStatus?: string;
  stepStr?: string;
  payStatusStr?: string;
  countDownDes?: string;
  remainTime: number;
  depositOrFinalpay?: string;
  price?: number;
  isGrey: boolean;
}

const stepGroup = ["定金阶段", "尾款阶段"];
const depositOrFinalpayGroup = ["商品定金", "商品尾款"];
const payStatusGroup = ["待支付", "已支付", "待开启", "已关闭", "部分支付"];

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

const DepositSteps: React.FunctionComponent<DepositStepsProps> = ({
  orderDepositList,
  orderOriginStatus,
  estimatedDeliveryTime,
  countDownInterval = 0,
  countDownIntervalTime = 0,
}) => {
  const [showDepositSteps, setShowDepositSteps] = useState(false);
  const [depositStepsData, setDepositStepsData] = useState<depositStepsData[]>(
    []
  );
  const [countDown, setCountDown] = useState("");
  useEffect(() => {
    if (
      orderDepositList &&
      orderDepositList.length > 0 &&
      orderOriginStatus !== "V" &&
      orderOriginStatus !== "G" &&
      orderOriginStatus !== "Y" &&
      !(
        orderOriginStatus === "X" &&
        orderDepositList[0].depositPayStatus !== "1"
      )
    ) {
      setShowDepositSteps(true);
    }
  }, [orderOriginStatus, orderDepositList]);
  useEffect(() => {
    // 整理定金数据
    if (showDepositSteps && orderDepositList) {
      let depositStepsData = orderDepositList.map((item, index) => {
        //商品定金是否已支付完成
        let isDepositFinish;
        if (orderDepositList) {
          isDepositFinish = orderDepositList[0].depositPayStatus === "1";
        }
        let detailData = item;

        let {
          depositPayStatus,
          orderDepositAmount,
          payCancelRemainingTime,
          payStartRemainingTime,
        } = detailData;

        let stepStr = "",
          payStatusStr = "",
          countDownDes = "",
          remainTime = 0,
          depositOrFinalpay = "",
          price,
          isGrey = false;

        price = orderDepositAmount;
        stepStr = stepGroup[index];
        depositOrFinalpay = depositOrFinalpayGroup[index];
        payStatusStr = payStatusGroup[parseInt(depositPayStatus)];
        if (payStatusStr === "已支付") {
          // 灰色字体
          isGrey = true;
        }
        remainTime = [
          payCancelRemainingTime,
          0,
          payStartRemainingTime,
          0,
          payCancelRemainingTime,
        ][parseInt(depositPayStatus)];

        if (index === 0) {
          remainTime !== 0 && (countDownDes = "关闭");
          depositPayStatus === "3" && (payStatusStr = "待支付");
          depositPayStatus === "4" && (payStatusStr = "部分支付");
        } else if (index === 1) {
          remainTime = isDepositFinish ? remainTime : 0;
          remainTime =
            orderOriginStatus === "BB" ? payCancelRemainingTime : remainTime;
          remainTime !== 0 &&
            (countDownDes = ["关闭", "", "开启", "", "关闭"][
              parseInt(depositPayStatus)
            ]);
          depositPayStatus === "3" && (countDownDes = "");
          if (orderOriginStatus === "X") {
            payStatusStr = "已关闭";
            countDownDes = "";
            remainTime = 0;
          }
        }
        return {
          depositPayStatus: depositPayStatus, //判断状态
          stepStr: stepStr, //显示文字：阶段1，阶段2
          payStatusStr: payStatusStr, //显示文字： 未支付，已支付，未开始，已关闭
          countDownDes: countDownDes, //阶段二中倒计时的提示文字
          remainTime: remainTime, //获取的有效剩余时间
          depositOrFinalpay: depositOrFinalpay, //显示文字：商品定金，商品尾款
          price: price, //显示价格
          isGrey, // 已完成该阶段，字体变灰
        };
      });
      setDepositStepsData(depositStepsData);
    }
  }, [showDepositSteps, orderDepositList]);
  useEffect(() => {
    // 倒计时
    if (depositStepsData.length) {
      depositStepsData.forEach((item, index) => {
        if (item.remainTime) {
          countDownIntervalTime = item.remainTime;
          let countTime = getCountDown(item.remainTime);
          let countDown = `${countTime.days}天${countTime.hours}时${countTime.minutes}分后${item.countDownDes}`;
          let countDownOne = `${countTime.hours}时${countTime.minutes}分${countTime.secounds}秒后${item.countDownDes}`;
          let countText = countTime.days == "00" ? countDownOne : countDown;
          if (item.depositPayStatus === "3" && index === 0) {
            countDown = `00天00时00分00秒后关闭`;
          } else {
            countDownInterval = window.setInterval(() => {
              countDownIntervalTime -= 1;
              if (countDownIntervalTime === 0) {
                window.location.reload();
                return;
              }
              let countTime = getCountDown(countDownIntervalTime);
              let countDown = `${countTime.days}天${countTime.hours}时${countTime.minutes}分后${item.countDownDes}`;
              let countDownOne = `${countTime.hours}时${countTime.minutes}分${countTime.secounds}秒后${item.countDownDes}`;
              let countText = countTime.days == "00" ? countDownOne : countDown
              setCountDown(countText);
            }, 1000);
            return function () {
              clearInterval(countDownInterval);
            };
          }
          // setCountDown(countDown);
          setCountDown(countText);
        }
      });
    }
  }, [depositStepsData]);
  let EDTIconColorIsGery = true; //预计到货时间是否是灰
  if (depositStepsData && depositStepsData.length === 2) {
    if (depositStepsData[0].isGrey && depositStepsData[1].isGrey) {
      EDTIconColorIsGery = false;
    }
  }
  // 商品价格保持小数点后有两位，不足补零
  const getZero = (num) => {
    if(typeof(num) == 'number'){ // 判断是否为数字类型   数字类型自动  舍0
        num = num.toString() // 先转成  字符串类型
        if(num.indexOf(".") != -1){ // 判断 有无小数点  0 表示 有小数点  -1  表示没有小数点
            let b = num.split('.') // 根据小数点  转换字符串为数组   
            if(b[1].length == 1){ // 判断 有几位小数  如果有一位  加一个0 
                b = b.join('.')
                b += '0'
                num = b
            }
        }else {
            num += '.00'
        }
    }else if(typeof(num) == 'string'){ // 同理
        if(num.indexOf(".") != -1){
            let b = num.split('.')
            if(b[1].length == 1){
                b = b.join('.')
                b += '0'
                num = b
            }
        }else {
            num += '.00'
        }
    }
    return num
  }


  return showDepositSteps ? (
    <div className="orderdetail-page-deposit">
      <div
        className={`orderdetail-page-deposit-left ${
          EDTIconColorIsGery ? "" : "toBottom"
        } ${estimatedDeliveryTime ? "" : "short"} ${
          !(depositStepsData[1] && depositStepsData[1].isGrey) && orderOriginStatus === "X" ? "toBottom" : ""
        }`}
      />
      <div className="orderdetail-page-deposit-right">
        {depositStepsData.map((item, index) => {
          let isGrey = item.isGrey;
          if (index === 1 && !depositStepsData[0].isGrey) {
            isGrey = true;
          }
          return (
            <div
              className={`info-row-step ${isGrey ? "grey" : ""}`}
              key={"info-row-step-" + index}
            >
              <em />
              <div className="info-row">
                {item.stepStr}
                <span className={"span"}>{item.payStatusStr}</span>
                <label className="label">
                  {item.remainTime ? countDown : ""}
                </label>
              </div>
              <div className="info-row">
                {item.depositOrFinalpay}
                <span className={"label commonFontPrice "}>
                  {"¥" + getZero(item.price)}
                </span>
              </div>
            </div>
          );
        })}
        {estimatedDeliveryTime && (
          <div className={`info-row-step ${EDTIconColorIsGery ? "grey" : ""}`}>
            <em />
            <div className="info-row-step-deliveryTime">
              {estimatedDeliveryTime}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default DepositSteps;
