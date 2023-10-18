/*
 * @Author: Leo.Si
 * @Date: 2020-07-02 09:39:52
 * @Last Modified by: summer
 * @Last Modified time: 2021-03-Tu 05:50:29
 * @function product details page
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { mapFuncToRun, getProductInfo, initial } from "@/actions/product";
import Sensor from "@/Utils/sensor";
import OiaWrap from "@/components/OiaWrap";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import ActionOnlineReference from "@/actions/onlineReference";
import Utils from "@/lib/utils";
import ProductContent from "./ProductContent";
import { getCookie } from "../../Utils/utils/cookie";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/product.scss");
}

/**
 * @typedef {{
 *  PAGE_LOAD_FINISH,
 * productData: {
 *   tab: {
 *     tabIndex,
 *     tabMore,
 *   },
 *   details: {
 *     detailsTabIndex,
 *     detailsData,
 *   },
 *   commentList,
 *   productInfo,
 *   milliseconds,
 *   QCPTQ,
 *   heroTab: {
 *     tabIndexV2,
 *     ifshow,
 *   },
 *   ranking,
 *   productFirstSection,
 * },
 * otherData: {
 *   beautyPosts,
 *   consulation,
 *   recommend,
 *   specs,
 *   name,
 *   recordNowNumber,
 *   lipStickOnOff,
 *   lipStickOnOff2,
 *   lipStickOnOff3,
 *   view,
 *   ifComment,
 * },
 * POPUP_ALERT_STATE:any;
 *  }} ProductProps
 * */

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentComponentCommonTop: null,
      CurrentComponentDeepLink: null
    };
  }

  sensorViewCommodityDetail() {
    this.ifSendSensorViewCommodityDetailOnce = true;
    // 神策
    Sensor.go("viewCommodityDetail", {
      OP_code: window.location.pathname.split("/")[2].split(".")[0] || null,
    });
  }

  googleAnalyticsPDP() {
    if (this.props.productData.productInfo.sku) {
      const { brandEN, productId, skuId, price, productNameCN } =
        this.props.productData.productInfo.sku;
      GoogleAnalytics.pushV2({
        eeAction: "eeProductDetail",
        products: [
          {
            brand: brandEN,
            id: skuId,
            name: productNameCN,
            price,
            productOpCode: productId,
          },
        ],
      });
    }
  }

  componentDidMount() {
    const that = this
    ActionOnlineReference.AutoOpenOnlineReference();
    Utils.afterPageShow().then(() => {
      that.props.initial();
    });

    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        CurrentComponentDeepLink: require("../../components/DeepLink/index")
          .default,
      });
    });

    // 历史浏览
    getCookie().then((cookie) => {
      let productidHistory = cookie("allpPoductid");
      const curProductid = window.location.pathname.split("/")[2].split(".")[0];
      if (productidHistory && productidHistory.length) {
        productidHistory = productidHistory.split(",");
        productidHistory.map((cont, i) => {
          if (cont == curProductid) {
            productidHistory.splice(i, 1);
          }
        });

        productidHistory.unshift(curProductid);
        if (productidHistory.length >= 12) {
          productidHistory.splice(12);
        }
        productidHistory = productidHistory.join(",");
      } else {
        productidHistory = String(curProductid);
      }
      cookie("allpPoductid", productidHistory, { expires: 365, path: "/" });
    });
  }

  UNSAFE_componentWillReceiveProps() {
    if (typeof window !== "undefined") {
      if (
        !this.ifSendSensorViewCommodityDetailOnce &&
        typeof window.sensorsDataAnalytic201505 === "object" &&
        typeof window.sensorsDataAnalytic201505.track === "function"
      ) {
        this.sensorViewCommodityDetail.call(this);
      }
    }
  }

  render() {
    const { CurrentComponentCommonTop, CurrentComponentDeepLink } = this.state;
    const {
      PAGE_LOAD_FINISH,
      mapFuncToRun,
      productData,
      otherData,
      POPUP_ALERT_STATE,
      getProductInfo
    } = this.props;
    let name = "product-page";
    if (
      (otherData && otherData.specs && otherData.specs.showOrHide) ||
      POPUP_ALERT_STATE === 1 ||
      (productData && productData.heroTab && productData.heroTab.ifshow)
    ) {
      name = "product-page product-page_hidden";
    }
    // console.log(productData.sku && productData.sku.saleAttr,"productDataproductDataproductData")
    return (
      <div className={name}>
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CurrentComponentDeepLink && (
          <CurrentComponentDeepLink
            show={otherData && otherData.showDeeplink}
          />
        )}
        <ProductContent
          _pageDone={!!(PAGE_LOAD_FINISH && PAGE_LOAD_FINISH == "done")}
          _callback={mapFuncToRun}
          _productData={productData}
          _otherData={otherData}
          getProductInfo={getProductInfo}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    globalReference,
    product,
    view,
    popup_component,
    productFirstSection,
  } = state;
  console.log(product);
  const { PAGE_LOAD_FINISH } = globalReference;
  const {
    tabIndex,
    tabMore,
    detailsTabIndex,
    detailsData,
    commentList,
    productInfo,
    beautyPosts,
    consulation,
    recommend,
    specs,
    recordNowNumber,
    name,
    lipStickOnOff,
    lipStickOnOff2,
    lipStickOnOff3,
    ifComment,
    milliseconds,
    QCPTQ,
    tabIndexV2,
    ifshow,
    ranking,
    promotionTags,
    promotionFast,
    showDeeplink,
    VBList
  } = product;
  const { POPUP_ALERT_STATE } = popup_component;
  return {
    PAGE_LOAD_FINISH,
    productData: {
      tab: {
        tabIndex,
        tabMore,
      },
      details: {
        detailsTabIndex,
        detailsData,
      },
      commentList,
      productInfo,
      milliseconds,
      QCPTQ,
      heroTab: {
        tabIndexV2,
        ifshow,
      },
      ranking,
      productFirstSection,
      promotionTags,
      promotionFast,
      VBList
    },
    otherData: {
      beautyPosts,
      consulation,
      recommend,
      specs,
      name,
      recordNowNumber,
      lipStickOnOff,
      lipStickOnOff2,
      lipStickOnOff3,
      view,
      ifComment,
      showDeeplink,
    },
    POPUP_ALERT_STATE,
  };
};

export default OiaWrap(
  connect(mapStateToProps, {
    mapFuncToRun,
    initial,
    getProductInfo
  })(Product)
);
