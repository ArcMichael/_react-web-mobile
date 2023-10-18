import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { verifyOptions } from "@/lib/Tools";
import OiaWrap from "@/components/OiaWrap";
import isBrowser from "@/Utils/utils/isBrowser";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import browserHistory from "@/store/browserHistory";
import { initial, getPlpListData } from "../../actions/plpPage";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/brandPage.scss");
}
/**
 * @typedef {import('../../store/configureStore').RootState} RootState
 */

/**
 * @typedef {{
 * products:RootState['plpPage'].products;
 * brandCon:RootState['plpPage'].brandCon;
 * } & import("react-router").WithRouterProps} BrandPageProps
 */

/**
 * @extends {React.Component<BrandPageProps>}
 */
class BrandPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", // 埋点用
      url: "/v3/search-service/product/list/brand", // 保存接口参数
      CurrentComponentCommonTop: null,
      CurrentComponentDeepLink: null,
      PopupAlert: null,
      PlpScreenComp: null,
      PlpSearch: null,
      ProductList: null,
      BrandStory: null,
      SearchListPrompt: null,
      BrandTwoClass: null,
    };
  }

  componentDidMount() {
    const { initial } = this.props;
    const query = getLocationQuery();
    const params = {
      type: "GET",
    };
    let location = browserHistory.getCurrentLocation();
    let brandCategoryId = "",
      filters = "",
      brandId = "",
      hasInventory = "",
      pageNum = "",
      pageSize = "",
      sortField = "",
      sortMode = "",
      maxFilterPrice = "",
      minFilterPrice = "";
    // 拼接接口url参数
    if (location.pathname) {
      const pathname4 = location.pathname.split("/")[4];
      const pathname2 = location.pathname.split("/")[2];
      const pathname3 = location.pathname.split("/")[3];
      brandCategoryId = pathname4 || "";
      if (
        verifyOptions(
          pathname2.split("-")[pathname2.split("-").length - 1],
          "number",
          true
        )
      ) {
        return (window.location.href = "/error");
      }
      if (verifyOptions(pathname4, "number", true)) {
        brandCategoryId = "";
        filters = pathname4;
      }
      filters = filters || location.pathname.split("/")[5] || "";
      brandId = pathname2.split("-")[pathname2.split("-").length - 1] || 1;
      pageNum = (pathname3 ? pathname3.replace("page", "") : null) || 1;
    }
    if (query) {
      hasInventory = query.hasInventory || 0;
      pageSize = query.pageSize || 20;
      sortField = query.sortField || 1;
      sortMode = query.sortMode || "desc";
      maxFilterPrice = query.maxFilterPrice || "";
      minFilterPrice = query.minFilterPrice || "";
    }
    const url = `/v3/search-service/product/list/brand?brandCategoryId=${
      brandCategoryId || ""
    }&brandId=${brandId}&filters=${filters}&hasInventory=${hasInventory}&pageNum=${pageNum}&pageSize=${pageSize}&sortField=${sortField}&sortMode=${sortMode}&filterActivity=false&channel=MOBILE&maxFilterPrice=${maxFilterPrice}&minFilterPrice=${minFilterPrice}`;
    params.url = url; // 保存参数
    params.onlyKey = "brandList";
    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        CurrentComponentDeepLink: require("../../components/DeepLink/index")
          .default,
        PopupAlert: require("../../components/PopupAlert").default,
        PlpScreenComp: require("../../components/PlpPage/PlpScreenComp")
          .default,
        PlpSearch: require("../../components/PlpPage/PlpSearch").default,
        ProductList: require("../../components/PlpPage/ProductList").default,
        BrandStory: require("./components/BrandStory").default,
        SearchListPrompt: require("../../components/PlpPage/SearchListPrompt")
          .default,
        BrandTwoClass: require("./components/BrandTwoClass").default,
      });
    });
    initial(params).then((results) => {
      if (results.currentBrand && results.currentBrand.brandNameCN) {
        const name = `品牌:${results.currentBrand.brandNameCN}:全部产品`;
        this.setState(
          {
            name,
            url,
          },
          () => {
            // GA
            let impressions = [];
            const buttonPosition = "Brand  List";
            impressions = results.content.map((el) => {
              return {
                name: el.productCN,
                id: el.productId,
                brand: el.brandEN,
                list: buttonPosition,
                position: name,
              };
            });
            GoogleAnalytics.push({
              event: "productImpression",
              ecommerce: {
                impressions,
              },
            });
          }
        );
      }
    });
  }
  render() {
    const {
      CurrentComponentCommonTop,
      CurrentComponentDeepLink,
      PopupAlert,
      name,
      url,
      PlpScreenComp,
      PlpSearch,
      ProductList,
      BrandStory,
      SearchListPrompt,
      BrandTwoClass,
    } = this.state;
    const { products } = this.props;
    let val;
    if (products) {
      val = products.keyWords;
    }
    return (
      <div>
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        <div className="plpPage_head">
          <div className="plpPage_head_search">
            {PlpSearch && <PlpSearch type="brandpage" keywords={val} />}
          </div>
          {products && PlpScreenComp && <PlpScreenComp url={url} />}
        </div>
        {products &&
          ((products.swapWords && products.swapWords.length) ||
            products.notFoundKeyWord) &&
          SearchListPrompt && <SearchListPrompt products={products} />}
        {BrandStory && <BrandStory name={name} Brandpagecon={products} />}
        {BrandTwoClass && <BrandTwoClass brandresult={products} />}
        {ProductList && <ProductList name={name} url={url} />}
        {CurrentComponentDeepLink && <CurrentComponentDeepLink />}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = (s) => ({
  products: s.plpPage.products,
  brandCon: s.plpPage.brandCon,
});
const mapDispatchToProps = (dispatch) => ({
  initial: bindActionCreators(initial, dispatch),
  getPlpListData: bindActionCreators(getPlpListData, dispatch),
  dispatch,
});

export default OiaWrap(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(BrandPage))
);
