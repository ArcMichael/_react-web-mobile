import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import CommonTop from "@/components/CommonTop";
import CommonPageTitle from "@/components/CommonPageTitle";
import { urlGetParams } from "@/lib/url";
import { GetSingleCookie } from "@/lib/Tools";
import * as OrderList from "@/actions/orderList";
import OrderListContent from "@/components/MyOrder/OrderList/OrderListContent";
import GuessYouLike from "@/components/PlpPage/GuessYouLike";
import AlipayFunctionPopup from "@/components/AlipayFunction/AlipayFunctionPopup";
import OrderPayConfirm from "@/components/MyOrder/OrderDetail/OrderPayConfirm";
import MergePayPopup from "@/components/MyOrder/OrderDetail/MergePayPopup";
import OrderDetailAction from "@/lib/services/OrderDetail";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import * as commonVenders from "@/actions/commonVenders";
import AdvertisingModule from "./components/AdvertisingModule";
import OrderListTab from "./components/OrderListTab";
import OrderListEmpty from "./components/OrderListEmpty";
import { IorderInfoList, orderList } from "./interface";
import Recommend from "./components/Recommend"
if (__DEV__ && isBrowser()) {
  require("../../../../public/style/default.scss");
  require("./style/orderList.scss");
}

interface IOrderListShow {
  orderInfoList: IorderInfoList[];
  pageNo: number;
  pageSize: number;
  totalCount: number;
  unPaidDepositCounts: number;
}

interface IOrder {
  results: IOrderListShow;
}
const MyOrderList: React.FunctionComponent = () => {
  const [orderListItem, setOrderListItem] = useState<Array<ReactNode>>([]);
  const [itemLength, setItemLength] = useState(true);
  const [pageNo] = useState(1);
  const [pageSize] = useState(15);
  const [pageNoDPP, setPageNoDPP] = useState(1);
  const [pageNoDID, setPageNoDID] = useState(1);
  const [pageNoDIP, setPageNoDIP] = useState(1);
  const [pageNoDF, setPageNoDF] = useState(1);
  const [pageNoAll, setPageNoAll] = useState(1);
  const [newPageSizeAll, setNewPageSizeAll] = useState(15);
  const [newPageSizeDPP, setNewPageSizeDPP] = useState(15);
  const [newPageSizeDID, setNewPageSizeDID] = useState(15);
  const [newPageSizeDIP, setNewPageSizeDIP] = useState(15);
  const [newPageSizeDF, setNewPageSizeDF] = useState(15);
  const [unPaidDepositCounts, setUnPaidDepositCounts] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [showAlipay, setShowAlipay] = useState(false);
  const [showSlik, setShowSlik] = useState(true);
  const [showOrderPayConfirm, setShowOrderPayConfirm] = useState(false);
  const [showMergePay, setShowMergePay] = useState(false);
  const [singInfo, setSingInfo] = useState<IorderInfoList>();
  const dispatch = useDispatch();
  const orderList = useSelector<RootState, orderList>((s) => s.orderList);
  const orderStatus = orderList.ORDERLISTSTATUS;
  const getOrderList = () => {
    let status = urlGetParams(window.location, "orderType");
    let tabStatus = status;
    if (tabStatus == "all") {
      tabStatus = "";
    }
    const orderTime = "";
    OrderList.switchComment("O", (callback: any) => {
      if (callback) {
        setIsComment(true);
      }
    });
    dispatch(
      OrderList.orderList(
        pageNo,
        pageSize,
        orderTime,
        tabStatus,
        (callback: IOrder) => {
          if (callback.results) {
            dispatch(OrderList.orderListShow(callback));
            setUnPaidDepositCounts(callback.results.unPaidDepositCounts);
            if (status !== "all") {
              let newOrderStatus = "";
              dispatch(
                OrderList.orderList(
                  pageNo,
                  pageSize,
                  orderTime,
                  newOrderStatus,
                  (callback: IOrder) => {
                    setUnPaidDepositCounts(
                      callback.results.unPaidDepositCounts
                    );
                  }
                )
              );
            }
            if (status != "DID") {
              let newOrderStatus = "DID";
              dispatch(
                OrderList.orderList(
                  pageNo,
                  pageSize,
                  orderTime,
                  newOrderStatus,
                  (callback: IOrder) => {
                    setUnPaidDepositCounts(
                      callback.results.unPaidDepositCounts
                    );
                  }
                )
              );
            }
            if (status != "DPP") {
              let newOrderStatus = "DPP";
              dispatch(
                OrderList.orderList(
                  pageNo,
                  pageSize,
                  orderTime,
                  newOrderStatus,
                  (callback: IOrder) => {
                    setUnPaidDepositCounts(
                      callback.results.unPaidDepositCounts
                    );
                  }
                )
              );
            }
            if (status != "DIP") {
              let newOrderStatus = "DIP";
              dispatch(
                OrderList.orderList(
                  pageNo,
                  pageSize,
                  orderTime,
                  newOrderStatus,
                  (callback: IOrder) => {
                    setUnPaidDepositCounts(
                      callback.results.unPaidDepositCounts
                    );
                  }
                )
              );
            }
            if (status != "DF") {
              let newOrderStatus = "DF";
              dispatch(
                OrderList.orderList(
                  pageNo,
                  pageSize,
                  orderTime,
                  newOrderStatus,
                  (callback: IOrder) => {
                    setUnPaidDepositCounts(
                      callback.results.unPaidDepositCounts
                    );
                  }
                )
              );
            }
          }
        }
      )
    );
  };
  const clickShowmore = useCallback(() => {
    let status = orderStatus;
    // debugger;
    let newPageNo = 0;
    if (status == "all") {
      newPageNo = pageNoAll + 1;
    } else if (status == "DPP") {
      newPageNo = pageNoDPP + 1;
    } else if (status == "DID") {
      newPageNo = pageNoDID + 1;
    } else if (status == "DIP") {
      newPageNo = pageNoDIP + 1;
    } else if (status == "DF") {
      newPageNo = pageNoDF + 1;
    }
    let newPageSize = pageSize;
    let orderTime = "";
    if (orderStatus == "all") {
      status = "";
    }
    //根据用户ID获取订单列表
    if (orderList.ORDERLISTRESULTSHOW) {
      dispatch(
        OrderList.orderListMore(
          newPageNo,
          newPageSize,
          orderTime,
          status,
          (callback: IOrder) => {
            if (callback.results) {
              if (status == "") {
                callback.results.orderInfoList.map((value) => {
                  orderList.ORDERLISTRESULTALL.results.orderInfoList.push(
                    value
                  );
                  dispatch(
                    OrderList.orderListShow(
                      Object.assign({}, orderList.ORDERLISTRESULTALL)
                    )
                  );
                  setPageNoAll(newPageNo);
                  setNewPageSizeAll(newPageSizeAll + 15);
                });
              } else if (status == "DPP") {
                callback.results.orderInfoList.map((value) => {
                  orderList.ORDERLISTRESULTM.results.orderInfoList.push(value);
                  dispatch(
                    OrderList.orderListShow(
                      Object.assign({}, orderList.ORDERLISTRESULTM)
                    )
                  );
                  setPageNoDPP(newPageNo);
                  setNewPageSizeDPP(newPageSizeDPP + 15);
                });
              } else if (status == "DIP") {
                callback.results.orderInfoList.map((value) => {
                  orderList.ORDERLISTRESULTI.results.orderInfoList.push(value);
                  dispatch(
                    OrderList.orderListShow(
                      Object.assign({}, orderList.ORDERLISTRESULTI)
                    )
                  );
                  setPageNoDIP(newPageNo);
                  setNewPageSizeDIP(newPageSizeDIP + 15);
                });
              } else if (status == "DID") {
                callback.results.orderInfoList.map((value) => {
                  orderList.ORDERLISTRESULTS.results.orderInfoList.push(value);
                  dispatch(
                    OrderList.orderListShow(
                      Object.assign({}, orderList.ORDERLISTRESULTS)
                    )
                  );
                  setPageNoDID(newPageNo);
                  setNewPageSizeDID(newPageSizeDID + 15);
                });
              } else if (status == "DF") {
                callback.results.orderInfoList.map((value) => {
                  orderList.ORDERLISTRESULTD.results.orderInfoList.push(value);
                  dispatch(
                    OrderList.orderListShow(
                      Object.assign({}, orderList.ORDERLISTRESULTD)
                    )
                  );
                  setPageNoDF(newPageNo);
                  setNewPageSizeDF(newPageSizeDF + 15);
                });
              }
              let resData = callback.results;
              if (resData.pageSize * resData.pageNo < resData.totalCount) {
                setShowMore(true);
              } else {
                setShowMore(false);
              }
            }
          }
        )
      );
    }
  }, [orderStatus, orderList.ORDERLISTRESULTSHOW]);
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
    if (GetSingleCookie(document.cookie, "UID")) {
      commonVenders.pushEmarsys([
        "setCustomerId",
        GetSingleCookie(document.cookie, "UID"),
      ]);
    }
    getOrderList();
  }, []);
  useEffect(() => {
    if (orderList.ORDERLISTRESULTSHOW) {
      let orderListItem: Array<ReactNode> = [];
      let orderListSize;
      let orderInfoList = orderList.ORDERLISTRESULTSHOW.results.orderInfoList;
      if (
        orderList.ORDERLISTRESULTSHOW &&
        orderList.ORDERLISTRESULTSHOW.results &&
        orderList.ORDERLISTRESULTSHOW.results.orderInfoList &&
        orderList.ORDERLISTRESULTSHOW.results.orderInfoList.length > 0
      ) {
        orderInfoList = orderList.ORDERLISTRESULTSHOW.results.orderInfoList;
        orderListSize = orderList.ORDERLISTRESULTSHOW.results.totalCount;
      }
      if (!orderInfoList || orderInfoList.length <= 0) {
        setItemLength(false);
      } else {
        setItemLength(true);
      }
      orderInfoList.map((value: IorderInfoList, index: number) => {
        orderListItem.push(
          <OrderListContent
            orderInfoList={value}
            key={index + value.orderId}
            orderListStatus={orderStatus}
            orderType={value.orderType}
            isComment={isComment}
            index={index}
            setIndex={setIndex}
          />
        );
      });
      setOrderListItem(orderListItem);
      if (orderStatus == "all") {
        if (orderListSize > 15) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } else if (orderStatus == "DPP") {
        if (orderListSize > 15) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } else if (orderStatus == "DID") {
        if (orderListSize > 15) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } else if (orderStatus == "DIP") {
        if (orderListSize > 15) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } else if (orderStatus == "DF") {
        if (orderListSize > 15) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    }
  }, [orderList.ORDERLISTRESULTSHOW, orderStatus]);
  return (
    <div className="myOrderList" id="myOrderList">
      <CommonTop />
      <CommonPageTitle _isBackV2={true} _title="我的订单" _isCustomer={true} />
      <AdvertisingModule />
      <OrderListTab />
      {orderList.ORDERLISTRESULTSHOW&&orderStatus == "all"&&<Recommend orderList={orderList} />}
      <div
        className={`myOrderList-depositNoPay ${
          unPaidDepositCounts == 0 ? "hid" : ""
        }`}
        onClick={() => {
          window.location.href = `/v2/html/bookingOrder?orderType=${orderStatus}`;
        }}
      >
        <div className="myOrderList-depositNoPay-content">
          你有{unPaidDepositCounts}笔预售定金订单
        </div>
        <div className="myOrderList-depositNoPay-tips">
          <span>点击查看</span>
          <img
            src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
            alt=""
          />
        </div>
      </div>
      {itemLength ? (
        <div>{orderListItem}</div>
      ) : (
        <OrderListEmpty _status={orderStatus} />
      )}
      {showMore && (
        <div
          className="view-more"
          onClick={() => {
            clickShowmore();
          }}
        >
          <span>查看更多</span>
          <img
            src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
            alt=""
          />
        </div>
      )}
      <div className={orderStatus == "DPP" && itemLength ? "hid" : ""}>
        <GuessYouLike
          _title="推荐"
          type="search"
          listTitle="我的订单:"
          listType="Guess You Like_OrderList"
        />
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

export default MyOrderList;
