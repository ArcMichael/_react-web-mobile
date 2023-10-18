import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import CommonTop from "@/components/CommonTop";
import CommonPageTitle from "@/components/CommonPageTitle";
import * as OrderList from "@/actions/orderList";
import OrderDetailAction from "@/lib/services/OrderDetail";
import OrderListContent from "@/components/MyOrder/OrderList/OrderListContent";
import CheckBox from "@/components/MyOrder/OrderList/CheckBox";
import AlipayFunctionPopup from "@/components/AlipayFunction/AlipayFunctionPopup";
import OrderPayConfirm from "@/components/MyOrder/OrderDetail/OrderPayConfirm";
import MergePayPopup from "@/components/MyOrder/OrderDetail/MergePayPopup";
import OrderListEmpty from "./components/OrderListEmpty";
import { IorderInfoList, orderList } from "./interface";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
if (__DEV__ && isBrowser()) {
  require("../../../../public/style/default.scss");
  require("./style/orderList.scss");
}
interface IOrder {
  results: IOrderListShow;
}
interface IOrderListShow {
  orderInfoList: IorderInfoList[];
  pageNo: number;
  pageSize: number;
  totalCount: number;
  unPaidDepositCounts: number;
}
interface IDeposit {
  orderId: string;
}

const BookingOrder: React.FunctionComponent = () => {
  const [itemLength, setItemLength] = useState(true);
  const [orderListItem, setOrderListItem] = useState<Array<ReactNode>>([]);
  const [pageNoDPPB, setPageNoDPPB] = useState(1);
  const [pageSize] = useState(15);
  const [totalCountDPPB, setTotalCountDPPB] = useState(0);
  const [isAllChecked, setAllChecked] = useState("1");
  const [depositChecked, setDepositChecked] = useState([]);
  const [newPageSizeDPPB, setNewPageSizeDPPB] = useState(15);
  const [showAlipay, setShowAlipay] = useState(false);
  const [showSlik, setShowSlik] = useState(true);
  const [showOrderPayConfirm, setShowOrderPayConfirm] = useState(false);
  const [showMergePay, setShowMergePay] = useState(false);
  const [singInfo, setSingInfo] = useState<IorderInfoList>();
  const dispatch = useDispatch();
  const orderList = useSelector<RootState, orderList>((s) => s.orderList);
  //   const orderStatus = orderList.ORDERLISTSTATUS;
  const getOrderList = () => {
    const orderTime = "";
    dispatch(
      OrderList.orderList(
        pageNoDPPB,
        pageSize,
        orderTime,
        "DPPB",
        (callback: IOrder) => {
          if (callback.results) {
            dispatch(OrderList.orderListShow(callback));
            setTotalCountDPPB(callback.results.totalCount);
          }
        }
      )
    );
  };
  const joinDepositChecked = useCallback(
    (type: string, data: any) => {
      // 定金预售加入/删除选中项列表
      if (data === "all") {
        // 全选
        if (type === "1") {
          if (
            orderList.ORDERLISTRESULTSHOW &&
            orderList.ORDERLISTRESULTSHOW.results &&
            orderList.ORDERLISTRESULTSHOW.results.orderInfoList
          ) {
            let dataList: any = [];
            orderList.ORDERLISTRESULTSHOW.results.orderInfoList.forEach(
              (item: IorderInfoList) => {
                if (
                  item.orderDepositDtoList &&
                  item.orderDepositDtoList[0] &&
                  item.orderDepositDtoList[0].depositPayStatus == "1" &&
                  item.orderDepositDtoList[1].depositPayStatus == "0" &&
                  item.orderOriginStatus == "B"
                ) {
                  let skuId =
                    item.productInfoDtoList &&
                    item.productInfoDtoList[0] &&
                    item.productInfoDtoList[0].skuId;
                  dataList.push({
                    skuId,
                    orderId: item.orderId,
                    userId: "100008",
                    type: "1",
                    checked: "1",
                  });
                }
              }
            );
            return setDepositChecked(dataList);
          }
        } else {
          return setDepositChecked([]);
        }
      } else {
        let dataList = [].concat(depositChecked);
        let dataContent = {
          index: [], // 修改的data若已经存在选中项中的index
          data: [], // 修改的data不在选中项中的data
        };
        data.forEach((item) => {
          let hasData = false;
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].orderId === item.orderId) {
              dataContent.index.push(i);
              hasData = true;
              break;
            }
          }
          if (!hasData) {
            let skuId =
              item.productInfoDtoList &&
              item.productInfoDtoList[0] &&
              item.productInfoDtoList[0].skuId;
            dataContent.data.push({
              orderId: item.orderId,
              skuId,
              checked: "1",
              type: "1",
              userId: "100008",
            });
          }
        });
        if (type == "1" && dataContent.data.length) {
          dataList = dataList.concat(dataContent.data);
        }
        if (type == "0" && dataContent.index.length) {
          dataContent.index.forEach((item) => {
            dataList.splice(item, 1);
          });
        }
        return setDepositChecked(dataList);
      }
    },
    [orderList.ORDERLISTRESULTSHOW, depositChecked]
  );
  const handleScroll = () => {
    let scrollHeight = document?.getElementById("myOrderList")?.scrollHeight;
    let clientHeight = window.document.documentElement.clientHeight;
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    let totalCount;
    totalCount = totalCountDPPB - newPageSizeDPPB;
    if (totalCount > 0) {
      if (scrollTop >= (scrollHeight as number) - clientHeight - 5) {
        let newPageNo = 0;
        newPageNo = pageNoDPPB + 1;
        let newPageSize = pageSize;
        let orderTime = "";
        dispatch(
          OrderList.orderListMore(
            newPageNo,
            newPageSize,
            orderTime,
            "DPPB",
            (callback: IOrder) => {
              if (callback.results) {
                callback.results.orderInfoList.map((value) => {
                  orderList.ORDERLISTRESULTDPPB.results.orderInfoList.push(
                    value
                  );
                  dispatch(
                    OrderList.orderListShow(
                      Object.assign({}, orderList.ORDERLISTRESULTDPPB)
                    )
                  );
                  setPageNoDPPB(newPageNo);
                  setNewPageSizeDPPB(newPageSizeDPPB + 15);
                });
              }
            }
          )
        );
      }
    }
  };
  const mergeAndSubmit = () => {
    if (!depositChecked.length) return;
    OrderList.mergeAndSubmit(depositChecked, "MYORDERLISTDPPB");
    
  };
  const setIndex = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (orderList.ORDERLISTRESULTSHOW) {
      if (
        orderList.ORDERLISTRESULTSHOW &&
        orderList.ORDERLISTRESULTSHOW.results &&
        orderList.ORDERLISTRESULTSHOW.results.orderInfoList &&
        orderList.ORDERLISTRESULTSHOW.results.orderInfoList.length > 0
      ) {
        let orderInfoList =
          orderList.ORDERLISTRESULTSHOW.results.orderInfoList[index];
        setSingInfo(orderInfoList);
        if (orderInfoList.mergeOrders && orderInfoList.mergeOrders.length > 1) {
          setShowMergePay(true);
        } else {
          orderPayConfirm(e, orderInfoList);
        }
      }
    }
  };
  const orderPayConfirm = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    singInfo: any
  ) => {
    let orderId = singInfo.orderId;
    //订单状态监测
    let firstOrderStatus = "";
    setInterval(() => {
      OrderDetailAction.queryOrderStatus(orderId).then((json) => {
        if (!firstOrderStatus && json && json.results) {
          firstOrderStatus = json.results;
        } else {
          if (
            json &&
            json.results &&
            firstOrderStatus &&
            firstOrderStatus != json.results
          ) {
            window.location.reload();
          }
        }
      });
    }, 5000);
    if (singInfo.orderType == 2) {
      if (
        singInfo.orderDepositDtoList[0].depositAmountType == "1" &&
        (singInfo.orderDepositDtoList[0].depositPayStatus == "0" ||
          singInfo.orderDepositDtoList[0].depositPayStatus == "3" ||
          singInfo.orderDepositDtoList[0].depositPayStatus == "4")
      ) {
        if (singInfo.orderDepositDtoList[0].depositPayStatus == "0") {
          // 打开确认定金弹窗
          setShowOrderPayConfirm(true);
        } else {
          if (singInfo.orderStatus === "DPP") {
            setShowAlipay(true);
          }
        }
      } else if (
        singInfo.orderDepositDtoList[1].depositAmountType == "2" &&
        (singInfo.orderDepositDtoList[1].depositPayStatus == "0" ||
          singInfo.orderDepositDtoList[1].depositPayStatus == "4")
      ) {
        if (singInfo.orderStatus === "DPP") {
          setShowAlipay(true);
          if (singInfo.orderDepositDtoList[0].depositPayStatus != "1") {
            if (singInfo.orderDepositDtoList[0].depositPayStatus == "4") {
              setShowSlik(false);
            }
          } else if (singInfo?.orderDepositDtoList[0].depositPayStatus == "1") {
            if (singInfo?.orderDepositDtoList[1].depositPayStatus == "4") {
              setShowSlik(false);
            }
          }
        }
      } else if (
        singInfo.orderDepositDtoList[1].depositAmountType == "2" &&
        singInfo.orderDepositDtoList[1].depositPayStatus == "3"
      ) {
        alert("已过尾款支付时间，无法支付尾款");
        return;
      }
    } else {
      if (singInfo.orderStatus === "DPP") {
        setShowAlipay(true);
      }
    }
    GoogleAnalytics.push({
      buttonPosition: "我的订单",
      eventName: "立即支付",
      orderId: orderId,
      event: "ButtonClick",
    });
  };
  useEffect(() => {
    dispatch(OrderList.orderListChange("DPPB"));
    getOrderList();
  }, []);
  useEffect(() => {
    if (totalCountDPPB > 15) {
      window.addEventListener("scroll", handleScroll);
    }
  }, [totalCountDPPB]);
  useEffect(() => {
    if (orderList.ORDERLISTRESULTSHOW) {
      let orderListItem: Array<ReactNode> = [];
      // let orderListSize;
      let orderInfoList = orderList.ORDERLISTRESULTSHOW.results.orderInfoList;
      let AllChecked2 = "1";
      if (
        orderList.ORDERLISTRESULTSHOW &&
        orderList.ORDERLISTRESULTSHOW.results &&
        orderList.ORDERLISTRESULTSHOW.results.orderInfoList &&
        orderList.ORDERLISTRESULTSHOW.results.orderInfoList.length > 0
      ) {
        orderInfoList = orderList.ORDERLISTRESULTSHOW.results.orderInfoList;
        // orderListSize = orderInfoList.length;
      }
      if (!orderInfoList || orderInfoList.length <= 0) {
        setItemLength(false);
      }
      let checkedNum = 0;
      orderInfoList.map((value: IorderInfoList, index: number) => {
        let checkBoxValue = {
          disabled: true,
          checked: false,
        };
        let checked = depositChecked.find((item: IDeposit) => {
          if (item) {
            return item.orderId === value.orderId;
          }
        });
        if (checked) {
          checkBoxValue.checked = true;
          checkedNum += 1;
        } else if (
          !checked &&
          value.orderDepositDtoList &&
          value.orderDepositDtoList[0] &&
          value.orderDepositDtoList[0].depositPayStatus == "1" &&
          value.orderDepositDtoList[1].depositPayStatus == "0" &&
          value.orderOriginStatus == "B"
        ) {
          //若该订单状态可被选中但没选中，则全选状态取消
          AllChecked2 = "0";
          // setAllChecked("0");
        }
        if (
          value.orderDepositDtoList &&
          value.orderDepositDtoList[0] &&
          value.orderDepositDtoList[0].depositPayStatus == "1" &&
          value.orderDepositDtoList[1].depositPayStatus == "0" &&
          value.orderOriginStatus == "B"
        )
          checkBoxValue.disabled = false;
        orderListItem.push(
          <OrderListContent
            orderInfoList={value}
            key={index + value.orderId}
            orderListStatus={"DPPB"}
            orderType={value.orderType}
            isComment={false}
            checkBoxValue={checkBoxValue}
            index={index}
            joinDepositChecked={(type: string, data: any) =>
              joinDepositChecked(type, data)
            }
            setIndex={setIndex}
          />
        );
      });
      if (!checkedNum) {
        // 若全都是不可选的订单，则全选取消
        // setAllChecked("0");
        AllChecked2 = "0";
      }
      setAllChecked(AllChecked2);

      setOrderListItem(orderListItem);
    }
  }, [orderList.ORDERLISTRESULTSHOW, depositChecked]);
  return (
    <div className="myOrderList" id="myOrderList">
      <CommonTop />
      <CommonPageTitle _isBackV2={true} _title="预售订单" _isCustomer={true} />
      {itemLength ? (
        <div className={"myOrderList-items-DPPB"}>{orderListItem}</div>
      ) : (
        <OrderListEmpty />
      )}
      <div className={`myOrderList-depositNoPay-bottom`}>
        <div style={{ display: "flex",alignItems:"center" }}>
          <CheckBox
            statue={isAllChecked}
            para={isAllChecked}
            callback={() => {
              joinDepositChecked(isAllChecked == "1" ? "0" : "1", "all");
            }}
           />
          <label
            className="label"
            onClick={() => {
              joinDepositChecked(isAllChecked == "1" ? "0" : "1", "all");
            }}
          >
            全选
          </label>
        </div>

        <div
          className={`myOrderList-depositNoPay-button ${
            depositChecked.length > 0 ? "" : "disabled"
          }`}
          onClick={() => {
            mergeAndSubmit();
          }}
        >
          合并去购物车结算
        </div>
      </div>
      <AlipayFunctionPopup
        isShow={showAlipay}
        paymethod={singInfo ? singInfo.payMethod : ""}
        payType={singInfo ? singInfo.orderType : "1"}
        togglePopup={() => setShowAlipay(!showAlipay)}
        totalMount={(singInfo?.mergeOrders?singInfo?.mShouldPay:false)||(singInfo?.totalPayAmount||singInfo?.totalAmount)}
        orderId={singInfo?.orderId}
        showSlik={showSlik}
       />
      <OrderPayConfirm
        show={showOrderPayConfirm}
        close={() => setShowOrderPayConfirm(false)}
        orderDepositList={singInfo ? singInfo.orderDepositDtoList : []}
        callback={() => {
          setShowAlipay(true);
          setShowOrderPayConfirm(false);
        }}
       />
      <MergePayPopup
        show={showMergePay}
        mergeOrders={(singInfo && singInfo.mergeOrders) || []}
        callback={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          orderPayConfirm(e, singInfo)
        }
        close={() => setShowMergePay(false)}
       />
    </div>
  );
};

export default BookingOrder;
