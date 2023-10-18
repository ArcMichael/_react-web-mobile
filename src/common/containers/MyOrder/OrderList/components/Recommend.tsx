import React, { useEffect, useState } from "react";
import orderListService from "@/lib/services/OrderList";
import { SetSingleCookie2V2, GetSingleCookie2V2 } from "@/lib/Tools";

interface IRecommend {
  orderList: any;
}
const Recommend: React.FunctionComponent<IRecommend> = (props) => {
  const { orderList } = props;
  const [reList, setReList] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const hideFunc = () => {
    SetSingleCookie2V2({
      key: "n_orderRTime",
      value: "1",
      domain: ".sephora.cn",
      // domain: "localhost",
      time: 1000 * 60 * 60 * 24,
    });
    setIsShow(false);
  };
  const loadFunc = () => {
    let hasCookie = GetSingleCookie2V2({
      key: "n_orderRTime",
    });

    if (hasCookie) {
      setIsShow(false);
    }
    console.log(hasCookie);
  };
  useEffect(() => {
    const { ORDERLISTRESULTALL } = orderList;
    loadFunc();
    // 获取推荐
    let arr: string[] = [];
    if (
      ORDERLISTRESULTALL.results &&
      ORDERLISTRESULTALL.results.orderInfoList &&
      ORDERLISTRESULTALL.results.orderInfoList.length
    ) {
      ORDERLISTRESULTALL.results.orderInfoList.map((item) => {
        if (item.productInfoDtoList && item.productInfoDtoList.length) {
          item.productInfoDtoList.map((item1) => {
            arr.push(item1.skuId);
            
            if (item.orderStatus == "DPP") {
              // 前15条有待支付就隐藏
              setIsShow(false);
            }
          });
        }
      });
    }
    if (arr.length) {
      orderListService
        .getRecommend({
          channel: "MOBILE",
          skuIdList: arr,
        })
        .then((res) => {
          if (
            res &&
            res.results &&
            res.results.recommendSpuList &&
            res.results.recommendSpuList.length
          ) {
            setReList(res.results.recommendSpuList);
          }
        });
    }
  }, []);
  //   const [dataSource, setDataSource] = React.useState<IInventoryTable[]>([]);
  if (reList && reList.length >= 3) {
    return isShow ? (
      <div className="recommend-order-bg">
        <div className="recommend-order-top">
          <div className="recommend-title">常购好货</div>
          <div
            className="recommend-close"
            onClick={() => {
              hideFunc();
            }}
          >
            ×
          </div>
        </div>
        <ul className="recommend-list">
          {reList.map((item) => {
            return (
              <li
                onClick={() => {
                  window.location.href = `/product/${item.spuId}.html`;
                }}
              >
                <img src={item.image + "150x150.jpg"} alt="" />
                <div className="shop-title">
                  {item.brandName + " " + item.spuName}
                </div>
                <span className="shop-price">￥{item.minPriceText}</span>
              </li>
            );
          })}
        </ul>
      </div>
    ) : null;
  } else {
    return null;
  }
};

export default Recommend;
