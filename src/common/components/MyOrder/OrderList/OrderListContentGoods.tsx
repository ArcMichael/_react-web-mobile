import React, { useState, useEffect, ReactNode } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import { IoperationArr } from "@/containers/MyOrder/OrderList/interface";
import { ProductInfoDto } from "@/containers/MyOrder/OrderDetail/interface";
import LazyloadImage from "../../LazyloadImage";
if (__DEV__ && isBrowser()) {
  require("../../../../public/style/common/_common_order_goods.scss");
}
interface Props {
  productInfoDtoList: ProductInfoDto;
  label?: string;
  orderType?: string;
  operationArr?: IoperationArr;
  isHideTag:boolean;
}
const OrderListContentGoods: React.FunctionComponent<Props> = (props) => {
  const { productInfoDtoList, label, orderType, operationArr,isHideTag } = props;
  const [price, setPrice] = useState<Array<ReactNode>>([]);
  const [spc, setSpc] = useState("");
  const [operationButton, setOperationButton] = useState<Array<ReactNode>>([]);
  const toProductDetail = () => {
    if (!productInfoDtoList.skuId || !productInfoDtoList.productId) return;
    window.location.href = `/product/${productInfoDtoList.productId}.html?sku=${productInfoDtoList.skuId}`;
  };
  useEffect(() => {
    if (productInfoDtoList) {
      let priceArr = [],
        spc = "";
      if (productInfoDtoList.offerPrice == productInfoDtoList.sapPrice) {
        if (productInfoDtoList.sapPrice) {
          priceArr.push(<p key="sapPrice">¥{productInfoDtoList.sapPrice}</p>);
          setPrice(priceArr);
        }
      } else {
        if (productInfoDtoList.offerPrice) {
          priceArr.push(
            <div key="productprice">
              <p>¥{productInfoDtoList.offerPrice}</p>
              {/* <p>¥{productInfoDtoList.sapPrice}</p> */}
            </div>,
          );
          setPrice(priceArr);
        }
      }
      if (productInfoDtoList.skuSaleAttrDto) {
        if (productInfoDtoList.skuSaleAttrDto.specType == "volume") {
          spc = "规格 " + productInfoDtoList.skuSaleAttrDto.spec + "ml";
        } else if (
          productInfoDtoList.skuSaleAttrDto &&
          productInfoDtoList.skuSaleAttrDto.specType &&
          productInfoDtoList.skuSaleAttrDto.specType == "weight"
        ) {
          spc = "规格 " + productInfoDtoList.skuSaleAttrDto.spec + "g";
        }

        if (
          productInfoDtoList.skuSaleAttrDto &&
          productInfoDtoList.skuSaleAttrDto.custom &&
          productInfoDtoList.skuSaleAttrDto.custom !== " "
        ) {
          spc = spc
            ? "规格 " + spc + "," + productInfoDtoList.skuSaleAttrDto.custom
            : "规格 " + productInfoDtoList.skuSaleAttrDto.custom;
        }

        setSpc(spc);
      }
      if (productInfoDtoList.productSize) {
        spc = productInfoDtoList.productSize;
        setSpc(spc);
      }
    }
    if (operationArr && operationArr.length > 0) {
      let newOperationArr: Array<ReactNode> = [];
      operationArr.map((value, index) => {
        if (value.type == "button") {
          newOperationArr.push(
            <button
              key={`button-${index}`}
              className={value.className}
              onClick={(e) => {
                e.stopPropagation();
                value.callback();
              }}
            >
              {value.text}
            </button>,
          );
        }
        if (value.type == "text") {
          // style 如果超过3个按钮就换行 
          newOperationArr.push(
            <p
              className={value.className}
              // style={operationArr.length>3?{float:"left",width:"100%"}:{}}
              onClick={(e) => {
                e.stopPropagation();
                value.callback();
              }}
            >
              {value.text}
            </p>,
          );
        }
      });
    //  if (operationArr.length>3) {
      newOperationArr.sort((a,b)=>{
        if (a&&a.type&&a.type.length&&b&&b.type&&b.type.length) {
          return a.type.length-b.type.length
        }else{
          return 0
        }
      })
    //  }
      
      setOperationButton(newOperationArr);
    }
  }, [productInfoDtoList]);

  return (
   <div style={{overflow:"hidden"}}>
      <div className="myOrderList-content-goods">
      <div className="goodsImg" onClick={() => toProductDetail()}>
        <LazyloadImage
          imgProps={{
            src: `${
              productInfoDtoList.isFullImage
                ? productInfoDtoList.defaultImagePath
                : productInfoDtoList.defaultImagePath + "150x150.jpg"
            }`,
          }}
        />
      </div>
      <div className={`goodsMessage`}>
        <div className="goods-one-line">
          {label && !isHideTag&&<span className="gift-tag">赠品</span>}
          {orderType == "2" &&!isHideTag&& <span className="presell-tag">预售</span>}
          {productInfoDtoList.skuType == "7" &&!isHideTag&& <span className="change-tag">换购</span>}
          {productInfoDtoList.activityType == "SECKILL" &&!isHideTag&& (
            <span className="presell-tag">秒杀</span>
          )}
          <span className={price.length > 0 ? "long-name" : ""}>
            {productInfoDtoList.brandNameEN}
            {productInfoDtoList.productNameCN}
          </span>
          {price}
        </div>

        <div className="goods-two-line">
          <p>{spc ? spc : ""}</p>
          <p>×{productInfoDtoList.quantity}</p>
        </div>

        <div
          className={
            orderType != "2" && productInfoDtoList.estimatedDeliveryTime ? "goods-special-desc" : ""
          }
        >
          {orderType != "2" && productInfoDtoList.estimatedDeliveryTime
            ? productInfoDtoList.estimatedDeliveryTime
            : ""}
        </div>

        <div className="goods-three-line">
          <div className="label-official">
            <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/guarantee-good.png" />
          </div>
          {operationButton.length<=3&&<div className="button-list">{operationButton}</div>}

        </div>
      </div>
    </div>
    {operationButton.length>3&&<div className="button-list fourBtn">{operationButton}</div>}

   </div>
  );
};
export default OrderListContentGoods;
