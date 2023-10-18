import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { popupAlert } from "@/actions/popup";
import AlipayFunctionPopup from "@/components/AlipayFunction/AlipayFunctionPopup";
import OrderDetailAction from "@/lib/services/OrderDetail";
import MergePayPopup from "@/components/MyOrder/OrderDetail/MergePayPopup";
import OrderPayConfirm from "@/components/MyOrder/OrderDetail/OrderPayConfirm";
import AdressModule from "@/components/MyOrder/OrderDetail/AdressModule";
import DepositSteps from "@/components/MyOrder/OrderDetail/DepositSteps";
import GuessYouLike from "@/components/PlpPage/GuessYouLike";
import AddtoCartAnimation from "@/components/MyOrder/OrderDetail/AddtoCartAnimation";
import PopupAlertDefault from "@/components/PopupAlert/PopupAlertDefault";
import PopupCleaning from "@/components/PopupAlert/PopupCleaning";
import PopupToast from "@/components/PopupAlert/PopupToast";
import * as utilCookieUtil from "@/Utils/cookieUtil";
import { urlGetAllParams } from "@/lib/url";
import isBrowser from "@/Utils/utils/isBrowser";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import OrderDetailAvertising from "./components/OrderDetailAvertising";
import OrderDetailButton from "./components/OrderDetailButton";
import OrderDetailOrderInfo from "./components/OrderDetailOrderInfo";
import OrderDetailProducts from "./components/OrderDetailProducts";
import OrderDetailAddressPart from "./components/OrderDetailAddressPart";
import OrderDetailDeepLink from "./components/OrderDetailDeepLink";
import OrderDetailCancelOrder from "./components/OrderDetailCancelOrder";
import OrderDetailPageTitle from "./components/OrderDetailPageTitle";
import OtherBuy from "@/components/MyOrder/OrderDetail/AdressModule/OtherBuy";
import Sensor from "@/Utils/sensor";

import { ProductInfoDto, addressContent, orderInfo } from "./interface";
if (__DEV__ && isBrowser()) {
  require("./style/orderdetailpage.scss");
}
declare var window: Window & { WeixinJSBridge: any };
declare var document: Document & { attachEvent?: any };
let intervalTime: number;
let interval: number;

interface productsArray {
  name: string;
  id: string;
  price: string;
  brand: string;
  variant: string;
  quantity: number;
}

interface addressDataContent extends addressContent {
  phone?: string;
  address?: string;
}

interface buyAgainData {
  type: number;
  channel: string;
  quantity: number;
  checked: number;
  skuId: string;
}

interface setStateParams {
  showAlipay?: boolean;
  showOrderPayConfirm?: boolean;
  showMergePay?: boolean;
  addressData?: addressDataType;
  showAddress?: showAddressType;
  newOrderId?: string;
  hasClickAddtoCart?: boolean;
}

export type showAddressType = "all" | "modify" | "add" | "Province" | "";
export interface addressDataType {
  defaultAddress?: addressContent;
  allAddress: addressContent[];
  modifyData?: addressContent;
}

export type setState = (data: setStateParams) => void;

const onBridgeReady = (
  newOrderId: string,
  webPayType: string,
  orderDetailData: orderInfo
) => {
  let WECHATOPENIDWX = utilCookieUtil.GetSingleCookie(
    document.cookie,
    "WECHAT_OPENID_WX"
  );
  if (WECHATOPENIDWX && WECHATOPENIDWX.indexOf("=") == -1) {
    utilCookieUtil.SetSingleCookie2({
      key: "WECHAT_OPENID_WX",
      value: WECHATOPENIDWX + "=",
    });
  }
  let paramsTwo = {
    orderId: newOrderId,
    type: webPayType,
    paymentCode: "WxPay",
    openId: utilCookieUtil.GetSingleCookie(document.cookie, "WECHAT_OPENID_WX"),
  };
  OrderDetailAction.payInfo(paramsTwo).then((json) => {
    if (json && json.results && json.results.payUrl) {
      let dataObj = JSON.parse(json.results.payUrl);
      let timeStamp = dataObj.timeStamp + "";
      window.WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          timeStamp: timeStamp,
          appId: dataObj.appId,
          nonceStr: dataObj.nonceStr,
          package: dataObj.package,
          signType: dataObj.signType,
          paySign: dataObj.paySign,
        },
        function (res: any) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            let href = "/orderPaymentSuccess?orderId=" + newOrderId;
            if (
              orderDetailData.mergeOrders &&
              orderDetailData.mergeOrders.length > 1
            ) {
              href = href + "&mergeOrDeposit=true";
            }
            window.location.href = href;
          } else {
            alert("支付失败,请重新支付!");
          }
        }
      );
    }
  });
};

//查询订单状态
const queryOrderStatus = (params: string, orderDetailData: orderInfo) => {
  OrderDetailAction.queryOrderStatus(params).then((callback) => {
    if (callback) {
      if (
        callback == "C" ||
        callback == "I" ||
        (orderDetailData.orderDepositList &&
          orderDetailData.orderDepositList[0] &&
          orderDetailData.orderDepositList[0].depositPayStatus != "1" &&
          callback == "B")
      ) {
        let href = "/orderPaymentSuccess?orderId=" + params;
        if (
          orderDetailData.mergeOrders &&
          orderDetailData.mergeOrders.length > 1
        ) {
          href = href + "&mergeOrDeposit=true";
        }
        window.location.href = href;
        clearInterval(interval);
        return;
      }
      intervalTime = intervalTime + 2000;
      if (intervalTime > 60000) {
        clearInterval(interval);
      }
    }
  });
};

// 立即支付
const openMergeOrders = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  orderDetailData: orderInfo,
  setState: setState
) => {
  if (
    orderDetailData &&
    orderDetailData.mergeOrders &&
    orderDetailData.mergeOrders.length > 1
  ) {
    setState({
      showMergePay: true,
    });
  } else {
    orderPayConfirm(e, orderDetailData, setState);
  }
};
//展示确认定金模块
const orderPayConfirm = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  orderDetailData: orderInfo,
  setState: setState
) => {
  let orderId = window.location.pathname.split("-")[1].split(".")[0];
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
  if (orderDetailData.orderType == "2") {
    if (
      orderDetailData.orderDepositList[0].depositAmountType == "1" &&
      (orderDetailData.orderDepositList[0].depositPayStatus == "0" ||
        orderDetailData.orderDepositList[0].depositPayStatus == "3" ||
        orderDetailData.orderDepositList[0].depositPayStatus == "4")
    ) {
      if (orderDetailData.orderDepositList[0].depositPayStatus == "0") {
        // 打开确认定金弹窗
        setState({
          showOrderPayConfirm: true,
        });
      } else {
        if (orderDetailData.orderStatus === "DPP") {
          setState({
            showAlipay: true,
          });
        }
      }
    } else if (
      orderDetailData.orderDepositList[1].depositAmountType == "2" &&
      (orderDetailData.orderDepositList[1].depositPayStatus == "0" ||
        orderDetailData.orderDepositList[1].depositPayStatus == "4")
    ) {
      if (orderDetailData.orderStatus === "DPP") {
        setState({
          showAlipay: true,
        });
      }
    } else if (
      orderDetailData.orderDepositList[1].depositAmountType == "2" &&
      orderDetailData.orderDepositList[1].depositPayStatus == "3"
    ) {
      alert("已过尾款支付时间，无法支付尾款");
      return;
    }
  } else {
    if (orderDetailData.orderStatus === "DPP") {
      setState({
        showAlipay: true,
      });
    }
  }
  GoogleAnalytics.push({
    buttonPosition: "我的订单",
    eventName: "立即支付",
    orderId: orderId,
    event: "ButtonClick",
  });
};

const queryAllAddress = (type: string, setState: setState) => {
  OrderDetailAction.queryDefaultAddressAction(
    JSON.stringify({
      queryBody: { orderType: type },
    })
  ).then((json) => {
    let defaultAddress: addressContent | undefined;
    if (json && json.results) {
      let adressData = json.results.map((item: addressContent) => {
        const newObj: addressDataContent = Object.assign({}, item);
        newObj.phone = item.mobilePhone
          ? item.mobilePhone.substring(0, 3) +
            "****" +
            item.mobilePhone.substring(7, 11)
          : item.telephone;
        newObj.address =
          item.addrProvince +
          item.addrCity +
          (item.addrDistrict ? item.addrDistrict : "") +
          item.addrDetail +
          (item.zipcode ? "," + item.zipcode : "");
        if (item.check == "1") {
          //默认地址为用户选择的地址
          defaultAddress = item;
        }
        return newObj;
      });
      // 展示地址
      setState({
        addressData: {
          defaultAddress,
          allAddress: adressData,
        },
        showAddress: "all",
      });
    } else {
      if (json.status === 0 && json.results === null) {
        // 展示地址
        setState({
          addressData: {
            allAddress: [],
          },
          showAddress: "all",
        });
      }
    }
  });
};

const initOrderInfo = (setOrderDetailData: React.Dispatch<orderInfo>) => {
  // 获取数据
  let orderId = ""; //订单号
  orderId = window.location.pathname.split("-")[1].split(".")[0];
  OrderDetailAction.queryOrderDetailAction(orderId).then((json) => {
    if (json && json.results && json.status == 0) {
      setOrderDetailData(json.results);
    }
  });
};

const goCart = (orderDetailData: orderInfo) => {
  if (
    orderDetailData &&
    orderDetailData.realProducts &&
    orderDetailData.realProducts.length
  ) {
    let queryBody = [
      {
        skuId: orderDetailData.realProducts[0].skuId,
        checked: "1",
        orderId: orderDetailData.orderId,
        type: "1",
        userId: "100008",
      },
    ];
    OrderDetailAction.mergeAndSubmit({ queryBody: queryBody }).then((json) => {
      if (json && json.results && parseInt(json.results) > 0) {
        window.location.href = `/cart?source=ORDERDETAIL`;
      }
    });
  }
};

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

const OrderDetail: React.FunctionComponent = () => {
  const [newOrderId, setNewOrderId] = useState("");
  const [webPayType, setWebPayType] = useState("");
  const [orderDetailData, setOrderDetailData] = useState({} as orderInfo);
  const [orderStatue, setOrderStatue] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [mTotalAmount, setMTotalAmount] = useState("");

  const [showAlipay, setShowAlipay] = useState(false);
  const [showMergePay, setShowMergePay] = useState(false);
  const [showOrderPayConfirm, setShowOrderPayConfirm] = useState(false);
  const [addressData, setAddressData] = useState({} as addressDataType);
  const [showAddress, setShowAddress] = useState("" as showAddressType); // 是否展示地址弹窗与弹窗种类
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(""); // 预计发货时间
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [showDeeplink, setShowDeeplink] = useState(false);
  const [showSlik, setShowSlik] = useState(true);
  const [showAdvertising, setShowAdvertising] = useState(true);
  const [hasClickAddtoCart, setHasClickAddtoCart] = useState(false);
  const [timer, setTimer] = useState(-1); // popup
  const dispatch = useDispatch();
  const popup_component: any = useSelector<RootState>(
    (state) => state.popup_component
  );
  useEffect(() => {
    initOrderInfo(setOrderDetailData);
    let orderId = ""; //订单号
    orderId = window.location.pathname.split("-")[1].split(".")[0];
    setNewOrderId(orderId);
  }, []);
  useEffect(() => {
    // 第一次进入时自动调起支付
    if (!newOrderId || !orderDetailData) return;
    let x;
    let payWay = ""; //支付方式
    let type = ""; // 微信支付方式中type 1-公众号 2-h5
    let urlObject = urlGetAllParams(window.location);
    let openId = utilCookieUtil.GetSingleCookie(
      document.cookie,
      "WECHAT_OPENID_WX"
    ); //公众号支付需要参数,优先从cookie获取
    for (x in urlObject) {
      if (x == "payWay") {
        payWay = urlObject[x];
      }
      if (x == "type") {
        type = urlObject[x];
      }
      if (x == "u") {
        openId = urlObject[x];
        utilCookieUtil.SetSingleCookie2({
          key: "WECHAT_OPENID_WX",
          value: openId,
        }); //将openid放入cookie
      }
    }
    let isAutoCallPay = utilCookieUtil.GetSingleCookie(
      document.cookie,
      "isAutoCallPay"
    );
    if (isAutoCallPay == "0") {
      utilCookieUtil.SetSingleCookie2({
        key: "isAutoCallPay",
        value: "orderDetailPage",
      }); //将openid放入cookie
      if (payWay == "wechat") {
        //调起支付
        if (type == "1") {
          //公众号
          setWebPayType("1");
        } else if (type == "2") {
          //h5
          let paramsTwo = {
            orderId: newOrderId,
            type: type,
            paymentCode: "WxPay",
            openId: " ",
          };
          OrderDetailAction.payInfo(paramsTwo).then((json) => {
            if (json && json.results && json.results.payUrl) {
              let nextUurl = json.results ? json.results.payUrl : "";
              window.location = nextUurl;
              intervalTime = 2000;
              interval = window.setInterval(function () {
                queryOrderStatus(newOrderId, orderDetailData);
              }, intervalTime);
            }
          });
        }
      } else if (payWay == "alipay") {
        //支付宝
        let params = {
          orderId: newOrderId,
          type: type,
          paymentCode: "AliPay",
          openId: " ",
        };
        OrderDetailAction.payInfo(params).then((json) => {
          if (json && json.results && json.results.payUrl) {
            let nextUurl = json.results ? json.results.payUrl : "";
            var fragment = document.createDocumentFragment();
            let tempDiv = document.createElement("div");
            let nodes = null;
            nodes = tempDiv.childNodes;
            tempDiv.innerHTML = nextUurl;
            for (var i = 0, length = nodes.length; i < length; i += 1) {
              fragment.appendChild(nodes[i].cloneNode(true));
            }
            let hasScript = fragment.querySelectorAll("script");
            document.getElementsByTagName("body")[0].appendChild(fragment);
            if (hasScript) {
              for (let i = 0; i <= hasScript.length - 1; i++) {
                eval(hasScript[i].innerText);
              }
            }
          }
        });
      }
    }
  }, [newOrderId, orderDetailData]);
  useEffect(() => {
    // 微信支付
    if (!webPayType) return;
    if (typeof window.WeixinJSBridge == "undefined" && orderDetailData) {
      if (document.addEventListener) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          () => onBridgeReady(newOrderId, webPayType, orderDetailData),
          false
        );
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", () =>
          onBridgeReady(newOrderId, webPayType, orderDetailData)
        );
        document.attachEvent("onWeixinJSBridgeReady", () =>
          onBridgeReady(newOrderId, webPayType, orderDetailData)
        );
      }
    } else {
      onBridgeReady(newOrderId, webPayType, orderDetailData);
    }
  }, [webPayType, orderDetailData]);
  const setState: setState = useCallback((data) => {
    for (let k in data) {
      switch (k) {
        case "showAlipay":
          setShowAlipay(data[k] as boolean);
          break;
        case "showOrderPayConfirm":
          setShowOrderPayConfirm(data[k] as boolean);
          break;
        case "showMergePay":
          setShowMergePay(data[k] as boolean);
          break;
        case "addressData":
          setAddressData(data[k] as addressDataType);
          break;
        case "showAddress":
          setShowAddress(data[k] as showAddressType);
          break;
        case "newOrderId":
          setNewOrderId(data[k] as string);
          break;
        case "hasClickAddtoCart":
          setHasClickAddtoCart(data[k] as boolean);
          break;
        default:
          break;
      }
    }
  }, []);
  useEffect(() => {
    // 预计发货时间
    if (orderDetailData && orderDetailData.realProducts) {
      let estimatedDeliveryTimeProduct = orderDetailData.realProducts.find(
        (item: ProductInfoDto) => {
          return item.estimatedDeliveryTime;
        }
      );
      if (estimatedDeliveryTimeProduct) {
        setEstimatedDeliveryTime(
          estimatedDeliveryTimeProduct.estimatedDeliveryTime
        );
      }
    }
  }, [orderDetailData]);
  const cancelOrder = useCallback(() => {
    // if (orderDetailData&&orderDetailData.orderType!=="2") {
    //   if (orderDetailData.orderOriginStatus=="M") {
    //     // 待付款取消
    //     setShowCancelOrder(true);
    //   }else{
    //      setShowDeeplink(true)
    //   }
    // }else
    // B尾款未开始
    // BB尾款待支付
    // debugger
    let orderId = window.location.pathname.split("-")[1].split(".")[0];
    GoogleAnalytics.push({
      buttonPosition: "我的订单",
      eventName: "取消订单",
      orderId: orderId,
      event: "ButtonClick",
    });
    if (orderDetailData && orderDetailData.orderType == "2") {
      if (
        orderDetailData.orderDepositList &&
        orderDetailData.orderDepositList[1] &&
        orderDetailData.orderDepositList[1].depositPayStatus == "1"
      ) {
        setShowDeeplink(true);
        return;
      }
    }
    setShowCancelOrder(true);
  }, [orderDetailData]);

  const buyAgain = useCallback((orderDetailData: orderInfo) => {
    let orderId = window.location.pathname.split("-")[1].split(".")[0];
    let arr: buyAgainData[] = [];
    let productsArray: productsArray[] = [];
    let spuList: string[] = [];
    let skuList: string[] = [];
    let numberList: number[] = [];
    if (orderDetailData && orderDetailData.realProducts) {
      orderDetailData.realProducts.map((item: ProductInfoDto) => {
        spuList.push(item.productId);
        skuList.push(item.skuId);
        numberList.push(item.quantity);

        if (item.skuId) {
          let channel = "MOBILE";
          if (
            window &&
            window.navigator &&
            window.navigator.userAgent &&
            window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
          ) {
            channel = "WECHAT";
          }
          arr.push({
            type: 1,
            channel: channel,
            quantity: item.quantity,
            checked: 1,
            skuId: item.skuId,
          });
          productsArray.push({
            //  adding a product to a shopping cart.
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
    //批量再次购买
    OrderDetailAction.batchRepurchase({ queryBody: arr }).then((json) => {
      if (json && json.results && !json.results.code) {
        Sensor.go("orderRelatedPage_click", {
          OP_code: spuList.join(",") || null,
          commodity_sku: skuList.join(","),
          commodity_number: numberList.join(","),
          button_name: "再来一单",
          current_url: window.location.href,
        });
        GoogleAnalytics.push({
          buttonPosition: "我的订单",
          eventName: "再次购买",
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
          json &&
          json.results &&
          json.results.code &&
          (json.results.code == 40051299 ||
            json.results.code == 40051399 ||
            json.results.code == 40052199 ||
            json.results.code == 40053099 ||
            json.results.code == 40051039 ||
            json.results.code == 40073099 ||
            json.results.code == 40050169)
        ) {
          dispatch(
            popupAlert(1, "PopupCleaning", {
              _title: json.results.code,
              _text: json.results.message,
              _autoClose: true,
            })
          );
          // alert(json.results.message);
        } else {
          window.location.href = "/cart";
        }
      }
    });
  }, []);
  return (
    <div className="myorder_detail_container">
      <OrderDetailPageTitle
        title={orderStatue}
        orderDetailData={orderDetailData}
        setOrderStatue={setOrderStatue}
        totalAmount={totalAmount}
        setTotalAmount={setTotalAmount}
        setMTotalAmount={setMTotalAmount}
        openMergeOrders={(e) => openMergeOrders(e, orderDetailData, setState)}
        setShowSlik={setShowSlik}
        goCart={() => goCart(orderDetailData)}
      />
      <div>
        {orderDetailData && (
          <OrderDetailAddressPart
            orderDetailData={orderDetailData}
            queryAllAddress={() =>
              queryAllAddress(orderDetailData.orderType, setState)
            }
          />
        )}
        {/* 其他人还买了 */}
        {orderDetailData && orderDetailData.orderStatus == "DF" && <OtherBuy />}
        {orderDetailData && orderDetailData.orderType === "2" && (
          <DepositSteps
            orderDepositList={orderDetailData.orderDepositList}
            orderOriginStatus={orderDetailData.orderOriginStatus}
            estimatedDeliveryTime={estimatedDeliveryTime}
          />
        )}
        {orderDetailData && (
          <OrderDetailProducts
            orderDetailData={orderDetailData}
            setState={setState}
          />
        )}
        {orderDetailData && orderDetailData.accumulatePoints && (
          <div className="myorder_detail_integral_info">
            <span>{orderDetailData.accumulatePoints}</span>
            <div className="flex-change">
              <a className="go_rewardsBoutique" href="/v2/html/rewardsBoutique">
                去使用
              </a>
              <em className="expand_icon icon-right" />
            </div>
          </div>
        )}
        {orderDetailData && (
          <OrderDetailOrderInfo orderDetailData={orderDetailData} />
        )}
        {orderDetailData && (
          <OrderDetailButton
            orderDetailData={orderDetailData}
            openMergeOrders={(e) =>
              openMergeOrders(e, orderDetailData, setState)
            }
            cancelOrder={cancelOrder}
            goCart={() => goCart(orderDetailData)}
            buyAgain={() => buyAgain(orderDetailData)}
            lookLogistics={lookLogistics}
          />
        )}
        {/* 猜你喜欢待支付不要 */}
        {((orderDetailData && orderDetailData.orderStatus !== "DPP") ||
          (orderDetailData &&
            orderDetailData.orderStatus === "DPP" &&
            orderDetailData.orderDepositList?.find(
              (it) => it.depositAmountType === "1"
            )?.depositPayStatus === "1")) && (
          <GuessYouLike
            _title="推荐"
            type="search"
            listTitle="订单详情:"
            listType="Guess You Like_OrderDetail"
          />
        )}
        <OrderDetailAvertising
          show={showAdvertising}
          close={() => setShowAdvertising(false)}
        />
      </div>
      <AlipayFunctionPopup
        isShow={showAlipay}
        paymethod={orderDetailData ? orderDetailData.payMethod : ""}
        payType={orderDetailData ? orderDetailData.orderType : ""}
        togglePopup={() => setShowAlipay(!showAlipay)}
        totalMount={mTotalAmount || totalAmount}
        orderId={newOrderId}
        showSlik={showSlik}
      />
      <MergePayPopup
        show={showMergePay}
        mergeOrders={(orderDetailData && orderDetailData.mergeOrders) || []}
        callback={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          orderPayConfirm(e, orderDetailData, setState)
        }
        close={() => setShowMergePay(false)}
      />
      {showAddress && (
        <AdressModule
          addressData={addressData}
          showAddress={showAddress}
          setState={setState}
          queryAllAddress={() =>
            queryAllAddress(orderDetailData.orderType, setState)
          }
          type={orderDetailData.orderType}
          orderId={newOrderId}
          initOrderInfo={() => initOrderInfo(setOrderDetailData)}
        />
      )}
      <OrderPayConfirm
        show={showOrderPayConfirm}
        close={() =>
          setState({
            showOrderPayConfirm: false,
          })
        }
        orderDepositList={orderDetailData?.orderDepositList}
        callback={() =>
          setState({
            showAlipay: true,
            showOrderPayConfirm: false,
          })
        }
      />
      {orderDetailData && (
        <OrderDetailCancelOrder
          orderDetailData={orderDetailData}
          close={() => setShowCancelOrder(false)}
          show={showCancelOrder}
        />
      )}
      <OrderDetailDeepLink
        show={showDeeplink}
        close={() => setShowDeeplink(false)}
      />
      <AddtoCartAnimation
        hasShowAdvertising={showAdvertising}
        hasClickAddtoCart={hasClickAddtoCart}
      />
      {popup_component.POPUP_ALERT_STATE === 1 &&
        popup_component.POPUP_ALERT_MODULE === "PopupAlertDefault" && (
          <PopupAlertDefault timer={timer} setTimer={setTimer} />
        )}
      {popup_component.POPUP_ALERT_STATE === 1 &&
        popup_component.POPUP_ALERT_MODULE === "PopupCleaning" && (
          <PopupCleaning timer={timer} setTimer={setTimer} />
        )}
      {popup_component.POPUP_ALERT_STATE === 1 &&
        popup_component.POPUP_ALERT_MODULE === "PopupToast" && (
          <PopupToast timer={timer} setTimer={setTimer} />
        )}
    </div>
  );
};

export default OrderDetail;
