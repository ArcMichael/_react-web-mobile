import { isBrowser } from "@/lib/get-isClient";
import * as React from "react";
import { useDispatch } from "react-redux";

// import CdnImage from "@/components/CdnImage";
import ShareH5 from "./service";
import { urlGetParams } from "@/lib/url";
import { addToCartCommon } from "@/actions/product";
// addToCart("addtocart", 1)(dispatch, getState)
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/common/_common_page_title.scss");
  require("./index.scss");
}
interface IOrderShareH5 {}
const OrderShareH5: React.FunctionComponent<IOrderShareH5> = () => {
  const [list, setList] = React.useState([]);
  const [checkAll, setCheckAll] = React.useState(false);
  const dispatch = useDispatch();

  // const closeWindow = () => {
  //   var userAgent = navigator.userAgent;
  //   if (
  //     userAgent.indexOf("Firefox") !== -1 ||
  //     userAgent.indexOf("Chrome") !== -1
  //   ) {
  //     window.location.replace("about:blank");
  //   } else {
  //     window.opener = null;
  //     window.open("", "_self");
  //   }
  //   window.close();
  // };
  const setCheck = (item, index) => {
    let arr = JSON.parse(JSON.stringify(list));
    arr[index].checked = !arr[index].checked;
    setList(arr);
  };
  const checkAllFunc = () => {
    let arr = JSON.parse(JSON.stringify(list));

    if (checkAll) {
      arr.map((item) => (item.checked = false));
    } else {
      arr.map((item) => (item.checked = true));
    }
    setList(arr);
  };
  const addToCart = () => {
    let arr = list.filter((item) => {
      if (item.checked) {
        item.checked = 1;
        item.type = 1;
        item.channel =
          window &&
          window.navigator &&
          window.navigator.userAgent &&
          window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
            ? "WECHAT"
            : "MOBILE";
        return item;
      }
    });
    if (arr && arr.length) {
      dispatch(
        addToCartCommon({
          params: arr,
          callback: () => {
            window.location.href = "/cart";
          },
        })
      );
    }

    console.log(arr);
  };
  React.useEffect(() => {
    let orderId = urlGetParams(window.location, "shareId");
    if (orderId) {
      ShareH5.getShareList(orderId).then((res: any) => {
        if (res) {
          // res.push(res[0])
          setList(res);
        }
      });
    }
  }, []);
  React.useEffect(() => {
    if (list && list.length > 0) {
      let flag = list.every((item) => item.checked);
      setCheckAll(flag);
    }
  }, [list]);
  return (
    <div>
      <div className="share-h5-title">
        <div className="share-icon">
          {/* <CdnImage
            src="/soa/nmobile/img/giftRecommend/btm_close.png"
            alt=""
            onClick={() => {
              closeWindow();
            }}
          /> */}
        </div>
        <div className="share-icon-title">好物分享</div>
      </div>
      {list && list.length > 0 && (
        <ul className="share-shop-list">
          {list.map((item, index) => {
            return (
              <li key={item.skuCode}>
                <div
                  className="share-check"
                  onClick={() => {
                    setCheck(item, index);
                  }}
                >
                  {item.checked ? (
                    <img
                      className="share-icon"
                      src="https://ssl1.sephorastatic.cn/soa/mobile/images/checkbox_mid.png"
                      alt=""
                    />
                  ) : (
                    <img
                      className="share-icon"
                      src="https://ssl1.sephorastatic.cn/soa/mobile/images/uncheckedCircle_mid.png"
                      alt=""
                    />
                  )}
                </div>
                <div className="share-shop">
                  <img
                    className="shop-img"
                    src={item.defaultImagePath + "150x150.jpg"}
                    alt=""
                  />
                  <div className="share-shop-info">
                    <div className="info-top">
                      <div className="info-title">
                        {item.productNameEN + item.productNameCN}
                      </div>
                      <div className="info-price">￥{item.offerPrice}</div>
                    </div>
                    <div className="info-attr">
                      <div className="info-attr-left">
                        <span>规格</span>
                        <span>
                          {item.skuSaleAttrDto &&
                            (item.skuSaleAttrDto.spec ||
                              item.skuSaleAttrDto.custom)}
                        </span>
                      </div>
                      <div className="info-num">x{item.quantity}</div>
                    </div>
                    <div className="info-icon">
                      <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/guarantee-good.png" />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="share-bottom">
        <div className="share-checkAll" onClick={checkAllFunc}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {checkAll ? (
              <img
                className="share-icon"
                src="https://ssl1.sephorastatic.cn/soa/mobile/images/checkbox_mid.png"
                alt=""
              />
            ) : (
              <img
                className="share-icon"
                src="https://ssl1.sephorastatic.cn/soa/mobile/images/uncheckedCircle_mid.png"
                alt=""
              />
            )}
            <span>全选</span>
          </div>
        </div>
        <div
          className="add-cart-share"
          onClick={() => {
            addToCart();
          }}
        >
          加入购物车
        </div>
      </div>
    </div>
  );
};

export default OrderShareH5;
