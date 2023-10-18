import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import OrderListGoods from "@/components/MyOrder/OrderList/OrderListContentGoods";
import OrderDetailAction from "@/lib/services/OrderDetail";
import BuyAgainAnimation from "@/components/MyOrder/OrderDetail/buyAgain";
import { setState } from "@/containers/MyOrder/OrderDetail/index";
import { getQueryCartProdTotalQuantity } from "@/actions/cart";
import { ProductInfoDto, orderInfo } from "../interface";
import OrderDetailDelivery from "./OrderDetailDelivery";
import Sensor from "@/Utils/sensor";

interface OrderDetailProductsProps {
  orderDetailData: orderInfo;
  setState: setState;
}

interface priceData {
  key: string;
  value: any;
  text: string;
  orderOriginStatus: string;
  exitOrderOriginStatus: string;
  orderStatus: string;
  orderType: string;
  exitOrderType: Array<string>;
  balancePay?: boolean;
  balancePayTime?: boolean;
  depositPayTime?: boolean;
  partPayTime?: boolean;
  partPay?: boolean;
  style?: boolean;
  depositPay?: boolean;
  allExit?: boolean;
}

interface valueMap {
  depositAmount: number;
  sumOfMoney: number;
}

let canBuyAgain = true;

const orderPriceBox: priceData[] = [
  {
    key: "totalAmount",
    value: "",
    text: "商品总额",
    style: false,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["1", "2", "3"],
    allExit: true,
    balancePayTime: false,
    depositPayTime: false,
    partPayTime: false,
  },
  {
    key: "orderDepositAmount",
    value: "",
    text: "定金金额",
    style: false,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["2"],
    allExit: true,
    balancePayTime: false,
    depositPayTime: false,
    partPayTime: false,
  },
  {
    key: "discountAdjustment",
    value: "",
    text: "折扣金额",
    style: true,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["1", "2", "3"],
    balancePay: true,
  },
  {
    key: "couponAdjustment",
    value: "",
    text: "优惠券抵扣",
    style: true,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["1", "2", "3"],
    balancePay: true,
  },
  {
    key: "depositAmount",
    value: "",
    text: "定金金额",
    style: false,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["2"],
    depositPay: true,
  },
  {
    key: "depositAmount",
    value: "",
    text: "已付定金",
    style: false,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["2"],
    balancePay: true,
  },
  {
    key: "sumOfMoney",
    value: "",
    text: "尾款总额",
    style: false,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["2"],
    balancePay: true,
  },
  {
    key: "shipping",
    value: "",
    text: "运费",
    style: false,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["1", "2", "3"],
    balancePay: true,
  },
  {
    key: "amountPaid",
    value: "",
    text: "已付金额",
    style: false,
    orderOriginStatus: "",
    exitOrderOriginStatus: "F",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["1", "2", "3"],
    partPay: true,
  },
  {
    key: "totalPayment",
    value: "",
    text: "应付总额",
    style: false,
    orderOriginStatus: "",
    exitOrderOriginStatus: "",
    orderStatus: "",
    orderType: "",
    exitOrderType: ["1", "2", "3"],
    balancePay: true,
  },
  // {
  //   key: "totalPayment",
  //   value: "",
  //   text: "应付总额2",
  //   style: false,
  //   orderOriginStatus: "",
  //   exitOrderOriginStatus: "",
  //   orderStatus: "",
  //   orderType: "",
  //   exitOrderType: ["2"],
  //   balancePay: true,
  // },
];

const OrderDetailProducts: React.FunctionComponent<OrderDetailProductsProps> =
  ({ orderDetailData, setState }) => {
    const [priceData, setPriceData] = useState<Array<priceData | null>>([]);
    const [showMore, setShowMore] = useState(false);
    const [totalPrice, setTotalPrice] = useState<React.ReactNode>(null);
    const [allowComment, setAllowComment] = useState<React.ReactNode>(false);
    const [products, setProducts] = useState<React.ReactNode[]>([]);
    const dispatch = useDispatch();
    const buyAgain = useCallback(
      (products: ProductInfoDto, index: number, setState: setState) => {
        if (!canBuyAgain) return;
        setState({
          hasClickAddtoCart: true,
        });
        canBuyAgain = false;
        // let imgs = document.querySelectorAll(".goodsImg");
        // let targetDom = null;
        // if (imgs.length > 0) {
        //   targetDom = imgs[index].children[0];
        // }
        // 再次购买
        OrderDetailAction.addToCart({
          queryBody: [
            {
              type: 1,
              channel: "MOBILE",
              quantity: 1,
              checked: 1,
              skuId: products.skuId,
            },
          ],
        }).then((json) => {
          Sensor.go("orderRelatedPage_click", {
            OP_code: products.productId || null,
            commodity_sku: products.skuId,
            commodity_number: 1,
            button_name: "加购物车",
            current_url: window.location.href,
          });
          if (json && json.results && !json.results.code) {
            let imgs = document.querySelectorAll(".goodsImg");
            let targetDom = null;
            if (imgs.length > 0) {
              targetDom = imgs[index].children[0];
            }
            if (targetDom) {
              new BuyAgainAnimation(targetDom, () => {
                dispatch(getQueryCartProdTotalQuantity({}));
                canBuyAgain = true;
              });
            } else {
              canBuyAgain = true;
            }
          } else {
            alert("加入购物车失败！");
            canBuyAgain = true;
          }
        });
      },
      []
    );
    useEffect(() => {
      if (orderDetailData) {
        let newPriceData = orderPriceBox.map((data) => {
          let tmp = Object.assign({}, data);
          tmp.value = orderDetailData[data.key as keyof orderInfo];
          if (
            data.key === "totalPayment" &&
            orderDetailData.orderStatus == "DPP" &&
            orderDetailData.orderOriginStatus == "F"
          ) {
            tmp.value = orderDetailData.amountPayable;
          }
          if (orderDetailData.orderType == "2") {
            let valueMap: valueMap = {
              depositAmount:
                orderDetailData.orderDepositList[0].orderDepositAmount,
              sumOfMoney:
                orderDetailData.orderDepositList[1].orderDepositAmount,
            };
            let value = Object.keys(valueMap).find((item) => item === data.key);
            tmp.value =
              valueMap[value as keyof valueMap] ||
              orderDetailData[data.key as keyof orderInfo];

            let depositDone =
              orderDetailData.orderDepositList[0].depositPayStatus === "1";
            tmp.balancePayTime = depositDone; // 定金已支付
            tmp.depositPayTime = !depositDone; // 定金未支付

            tmp.partPayTime = !!orderDetailData.orderDepositList.find(
              (item) => item.depositPayStatus === "4"
            ); // 部分支付
            if (
              data.key == "totalPayment" &&
              orderDetailData.amountPaid &&
              orderDetailData.orderDepositList[0].depositPayStatus === "4"
            ) {
              tmp.allExit = true;
              // tmp.balancePayTime = depositDone;
              // if (data.key === "totalPayment") {
              //   console.log(tmp);
              // }
            }

            // 定金金额的显示控制  定金待支付
            if (
              data.key === "orderDepositAmount" &&
              (orderDetailData.orderDepositList[0].depositPayStatus === "0" ||
                (["X", "Y"].includes(orderDetailData.orderOriginStatus) &&
                  orderDetailData.orderDepositList[0].depositPayStatus !== "1"))
            ) {
              tmp.value =
                orderDetailData.orderDepositList[0].orderDepositAmount;
            } else if (data.key === "orderDepositAmount") {
              tmp.value = "";
            }
          }

          if (
            (data.key == "discountAdjustment" ||
              data.key == "couponAdjustment") &&
            orderDetailData[data.key] == "0.00"
          ) {
            tmp.style = false;
          }
          tmp.orderOriginStatus = orderDetailData.orderOriginStatus;
          tmp.orderStatus = orderDetailData.orderStatus;
          tmp.orderType = orderDetailData.orderType;

          if (tmp.exitOrderType.indexOf(orderDetailData.orderType) < 0) {
            // 该金额不存在当前的订单类型中
            return null;
          }
          if (
            orderDetailData.orderStatus !== "DPP" ||
            orderDetailData.orderOriginStatus != tmp.exitOrderOriginStatus
          ) {
            if (
              orderDetailData.orderOriginStatus == tmp.exitOrderOriginStatus
            ) {
              return null;
            }
            if (orderDetailData.orderType === "2") {
              if (
                !tmp.allExit &&
                (!tmp.balancePayTime || !tmp.balancePay) &&
                (!tmp.depositPayTime || !tmp.depositPay) &&
                (!tmp.partPayTime || !tmp.partPay)
              ) {
                return null;
              }
            } else if (tmp.exitOrderOriginStatus == "F") {
              return null;
            }
          }
          return tmp;
        });
        let data: Array<priceData | null> = newPriceData.filter(
          (item) => item && item.value
        ); // 去除null
        data.unshift(data.pop() as priceData); // 最后一位金额是付款金额，需放到第一位
        setPriceData(data);
        if (orderDetailData.orderStatus === "DPP") {
          setShowMore(true);
        }
      }
    }, [orderDetailData]);
    useEffect(() => {
      if (priceData.length > 0 && priceData[0]) {
        let totalPrice = null;
        let value = priceData[0].value;
        let text = priceData[0].text.indexOf("应") >= 0 ? "需付款" : "实付款";
        // 获取定金支付状态
        let depositFirst =
          (orderDetailData.orderDepositList &&
            orderDetailData.orderDepositList.find(
              (it) => it.depositAmountType === "1"
            )?.depositPayStatus) ||
          null;
        let depositLast =
          (orderDetailData.orderDepositList &&
            orderDetailData.orderDepositList.find(
              (it) => it.depositAmountType === "2"
            )?.depositPayStatus) ||
          null;
        // 定金取消 且 定金未支付
        if (
          depositFirst != "1" &&
          ["X", "Y"].includes(priceData[0].orderOriginStatus) &&
          priceData[0].orderType === "2"
        ) {
          text = "";
        }
        // 定金已付，尾款未付，且订单自动取消
        else if (
          depositFirst === "1" &&
          depositLast !== "1" &&
          ["X", "Y"].includes(priceData[0].orderOriginStatus) &&
          priceData[0].orderType === "2"
        ) {
          text = "应付总额";
        }
        // 定金已付，尾款已付，且订单手动取消
        else if (
          depositFirst === "1" &&
          depositLast === "1" &&
          ["X", "Y"].includes(priceData[0].orderOriginStatus) &&
          priceData[0].orderType === "2"
        ) {
          text = "实付款";
        } else {
          // if(priceData[0].orderType === "2" && )
          if (
            priceData[0].orderType === "2" &&
            priceData[0].orderStatus === "DPP" &&
            orderDetailData.orderDepositList &&
            ["4", "0"].includes(
              orderDetailData.orderDepositList[0].depositPayStatus
            )
          ) {
            text = "需付定金";
            if (orderDetailData.orderDepositList[0].depositPayStatus == "4") {
              value = orderDetailData.amountPayable;
            }
          }
          if (
            priceData[0].orderType === "2" &&
            priceData[0].orderStatus === "DPP" &&
            orderDetailData.orderDepositList &&
            ["4", "0"].includes(
              orderDetailData.orderDepositList[1].depositPayStatus
            )
          ) {
            text = "需付尾款";
            if (orderDetailData.orderDepositList[1].depositPayStatus === "4") {
              value = orderDetailData.amountPayable;
            }
          }
          if (
            priceData[0].orderStatus !== "DPP" &&
            !["X", "Y"].includes(priceData[0].orderOriginStatus)
          ) {
            text = "实付款";
          }
          if (["B", "BB"].includes(priceData[0].orderOriginStatus)) {
            text = "需付尾款";
          }
          // 取消订单，且是定金 订单
          if (
            ["X", "Y"].includes(priceData[0].orderOriginStatus) &&
            priceData[0].orderType === "2"
          ) {
            text = "需付尾款";
          }
          if (priceData[0].text === "需付定金") {
            text = priceData[0].text;
          }
        }

        totalPrice = (
          <div>
            <span>{text}</span>
            <span> ¥ </span>
            <span>{value}</span>
          </div>
        );
        setTotalPrice(text ? totalPrice : null);
        // if (text === "应付款") {
        //   setShowMore(true);
        // }
      }
    }, [priceData]);
    useEffect(() => {
      if (
        orderDetailData &&
        orderDetailData.orderStatus == "DF" &&
        orderDetailData.orderOriginStatus == "D"
      ) {
        OrderDetailAction.allowComment("Q").then((json) => {
          if (json && json.results && json.results == "1") {
            setAllowComment(true);
          }
        });
      }
    }, [orderDetailData]);

    useEffect(() => {
      let productsList: React.ReactNode[] = [];
      if (orderDetailData && orderDetailData.realProducts) {
        productsList.push(
          ...orderDetailData.realProducts.map(
            (products: ProductInfoDto, index: number) => {
              let operationArr = [];
              if (
                products.isSendComment === 1 &&
                allowComment &&
                products.returnStatus !== "RRRF"
              ) {
                operationArr.push({
                  type: "button",
                  text: "去评价",
                  className: "addcart",
                  callback: () => {
                    window.location.href =
                      "/myConsulation?productId=" +
                      products.productId +
                      "&commentType=" +
                      2 +
                      "&sku=" +
                      products.skuId +
                      "&orderId=" +
                      products.orderId +
                      "&orderType=" +
                      "DF";
                  },
                });
              }
              if (products.currentReturnStatus) {
                operationArr.push({
                  type: "text",
                  text: products.currentReturnStatus,
                  callback: () => {
                    window.location.href = `/myAccount/returnDetails?orderId=${products.orderId}&skuId=${products.skuId}`;
                  },
                  className: "red-text addcartApply",
                });
              }
              if (products.returnStatus) {
                operationArr.push({
                  type: "button",
                  text: "申请售后",
                  callback: () => {
                    console.log(products.skuId);
                    window.location.href = `/myAccount/applyReturn?orderId=${products.orderId}&skuId=${products.skuId}&returnStatus=${products.returnStatus}`;
                  },
                  className: "addcart addcartApply",
                });
              }
              if (products.buyAgain) {
                operationArr.push({
                  type: "button",
                  text: "再次购买",
                  className: "addcart",
                  callback: () => {
                    buyAgain(products, index, setState);
                  },
                });
              }
              return (
                <li key={products.skuId} className="myorder_detail_product">
                  <OrderListGoods
                    productInfoDtoList={products}
                    orderType={orderDetailData.orderType}
                    operationArr={operationArr}
                    key={new Date().getTime()}
                    label={products.skuType == "5" ? "gift" : undefined}
                  />
                </li>
              );
            }
          )
        );
      }
      if (orderDetailData && orderDetailData.giftProducts) {
        productsList.push(
          ...orderDetailData.giftProducts.map((products: ProductInfoDto) => {
            return (
              <li key={products.skuId} className="myorder_detail_product">
                <OrderListGoods
                  productInfoDtoList={products}
                  orderType={orderDetailData.orderType}
                  label="gift"
                />
              </li>
            );
          })
        );
      }
      setProducts(productsList);
    }, [orderDetailData, allowComment]);
    if (!orderDetailData) return null;
    return (
      <div className="myorder_detail_products_container">
        <div className="myorder_detail_products">
          <OrderDetailDelivery
            deliveryData={orderDetailData.deliveryData}
            deliverySummary={orderDetailData.deliverySummary}
            deliveryTime={orderDetailData.deliveryTime}
          />
          <ul>{products}</ul>
        </div>
        {priceData.length > 0 && (
          <div className="myorder_detail_products_price">
            <div className="price_main">
              <span className="price_main_quantity">
                共
                {orderDetailData.realProductsCount +
                  orderDetailData.giftProductsCount}
                件商品
              </span>
              {orderDetailData.giftProductsCount ? (
                <span className="price_main_gift_quantity">
                  （含{orderDetailData.giftProductsCount}件赠品）
                </span>
              ) : null}
              <div className="price_main_price">{totalPrice}</div>
              <em
                onClick={() => setShowMore(!showMore)}
                className={`expand_icon ${showMore ? "open" : "close"}`}
              />
            </div>
            {showMore ? (
              <div>
                {priceData.map((item, index) => {
                  if (!index) return null;
                  // if (item && item.text === "应付总额") return null;
                  if (item) {
                    return (
                      <div
                        className="price_others"
                        key={`price_others_${index}`}
                      >
                        <span className="price_text">{item.text}</span>
                        <span className="price_price">
                          {item.style ? "-¥" : "¥"}
                          {item.value}
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  };

export default OrderDetailProducts;
