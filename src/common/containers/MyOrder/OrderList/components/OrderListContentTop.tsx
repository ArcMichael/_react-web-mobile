import React, { useState, useEffect, ReactNode } from "react";
import CheckBox from "@/components/MyOrder/OrderList/CheckBox";
import { copyToClipboard } from "@/lib/Tools";
import PopupToast from "./PopupToast";
import { IorderDepositDto, IorderInfoList } from "../interface";

interface Props {
  orderType: number;
  orderId: string;
  orderStatus: string;
  orderOriginStatus: string;
  orderDepositDtoList: Array<IorderDepositDto>;
  nowOrderStatus: string;
  checkBoxValue?: {
    checked: boolean;
    disabled: boolean;
  };
  joinDepositChecked?: Function;
  orderInfoList: IorderInfoList;
}

const OrderListContentTop: React.FunctionComponent<Props> = (props) => {
  const {
    orderType,
    orderDepositDtoList,
    orderId,
    orderStatus,
    orderOriginStatus,
    nowOrderStatus,
    checkBoxValue,
    orderInfoList,
    joinDepositChecked,
  } = props;

  const [status, setStatus] = useState("");
  const [statue, setStatue] = useState("0");
  const [checkBox, setCheckBox] = useState<ReactNode>();
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const copy = () => {
    // eslint-disable-next-line no-unused-expressions
    copyToClipboard &&
      copyToClipboard(orderId, () => {
        setShow(true);
        setText("复制成功");
      });
  };
  const getStatus = () => {
    let statusCommon: string = "";
    switch (orderStatus) {
      case "DPP":
        statusCommon = "待支付";
        break;
      case "DIP":
        statusCommon = "正在出库";
        break;
      case "DID":
        statusCommon = "派送中";
        break;
      case "DF":
        statusCommon = "交易完成 ";
        break;
      case "CDPP":
        statusCommon = "确认中 ";
        break;
      case "CDIP":
        statusCommon = "正在出库";
        break;
      case "CDID":
        statusCommon = "派送中";
        break;
      case "CDF":
        statusCommon = "交易完成 ";
        break;
      case "XYDF":
        statusCommon = "交易取消 ";
        break;
    }
    //orderType==1 普通商品  orderType==2 定金预售商品 orderType==3 预售商品
    if (orderType == 1 || orderType == 3) {
      setStatus(statusCommon);
      if (orderStatus == "DPP" && orderOriginStatus == "F") {
        setStatus("部分支付");
      }
    } else if (orderType == 2) {
      if (orderStatus == "DPP" || orderStatus == "CDPP") {
        if (orderOriginStatus == "MF" || orderOriginStatus == "BF") {
          setStatus("部分支付");
        } else if (
          orderDepositDtoList &&
          orderDepositDtoList[0].depositAmountType == "1"
        ) {
          if (orderDepositDtoList[0].depositPayStatus == "0") {
            setStatus("定金待支付");
          } else if (orderDepositDtoList[0].depositPayStatus == "1") {
            if (orderDepositDtoList[1].depositPayStatus == "0") {
              setStatus("尾款待支付");
              if (orderOriginStatus == "B") {
                setStatus("定金已支付");
              }
            } else if (orderDepositDtoList[1].depositPayStatus == "2") {
              setStatus("定金已支付");
            } else if (orderDepositDtoList[1].depositPayStatus == "3") {
              setStatus("交易取消");
            } else if (orderDepositDtoList[1].depositPayStatus == "4") {
              setStatus("部分支付");
            }
          } else if (orderDepositDtoList[0].depositPayStatus == "2") {
            setStatus("定金未开始");
          } else if (orderDepositDtoList[0].depositPayStatus == "3") {
            setStatus("交易取消");
          } else if (orderDepositDtoList[0].depositPayStatus == "4") {
            setStatus("部分支付");
          }
        }
      } else {
        setStatus(statusCommon);
      }
    }
    if (
      (orderStatus == "CDF" || orderStatus == "DF" || orderStatus == "XYDF") &&
      orderOriginStatus == "E"
    ) {
      setStatus("取消处理中");
    }
    if (
      (orderStatus == "CDF" || orderStatus == "DF" || orderStatus == "XYDF") &&
      orderOriginStatus == "T"
    ) {
      setStatus("退款中");
    }
    if (
      (orderStatus == "CDF" || orderStatus == "DF" || orderStatus == "XYDF") &&
      (orderOriginStatus == "V" || orderOriginStatus == "G")
    ) {
      setStatus("交易关闭");
    }
  };
  const checkouBoxClick = () => {
    if (checkBoxValue?.disabled) return;
    if (checkBoxValue?.checked) setStatue("1");

    if (joinDepositChecked) {
      joinDepositChecked(statue === "1" ? "0" : "1", [orderInfoList]);
    }
  };
  useEffect(() => {
    if (orderStatus) {
      getStatus();
    }
  }, [orderStatus]);
  useEffect(() => {
    if (nowOrderStatus == "DPPB") {
      let checkBox;
      if (checkBoxValue?.checked) {
        setStatue("1");
      } else {
        setStatue("0");
      }

      checkBox = (
        <span onClick={() => checkouBoxClick()}>
          <CheckBox
            statue={statue}
            para={statue}
            disabled={checkBoxValue?.disabled}
           />
        </span>
      );
      setCheckBox(checkBox);
    }
  }, [nowOrderStatus, checkBoxValue, statue]);

  return (
    <div className="myOrderList-content-top">
      <div className="content-top-left">
        {checkBox}
        <p>
          订单号
          <span>{orderId}</span>
        </p>
        <div className="copy" onClick={() => copy()}>
          复制
        </div>
      </div>
      <div className="content-top-status">{status}</div>
      <div style={{ position: "absolute" }}>
        <PopupToast
          _show={show}
          _text={text}
          _autoClose={true}
          _closeCallback={setShow}
        />
      </div>
    </div>
  );
};
export default OrderListContentTop;
