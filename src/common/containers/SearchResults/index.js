import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import browserHistory from "@/store/browserHistory";
import OiaWrap from "@/components/OiaWrap";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import * as utilCookieUtil from "@/Utils/cookieUtil";
import isBrowser from "@/Utils/utils/isBrowser";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import {
  initial,
  getPlpListData,
  getMatchKey,
  getMatchText,
} from "../../actions/plpPage";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/searchresults.scss");
}
// 搜索结果页
class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", // 埋点用
      url: "/v3/search-service/product/list/homepage/search-keywords", // 保存接口参数
      CurrentComponentCommonTop: null,
      CurrentComponentDeepLink: null,
      PopupAlert: null,
      PlpScreenComp: null,
      PlpSearch: null,
      ProductList: null,
      NoResults: null,
      SearchListPrompt: null,
    };
  }

  componentDidMount() {
    const { initial } = this.props;
    let upperRouter = document.referrer;
    let ipRouter = window.location.origin;
    let lastRouter = upperRouter.replace(ipRouter, "");
    if (!/search/.test(upperRouter)) {
      utilCookieUtil.SetSingleCookie2({ key: "uprouter", value: lastRouter });
    }

    const params = {
      type: "GET",
    };
    let location = browserHistory.getCurrentLocation();
    let filters = "",
      hasInventory = "",
      pageNum = "",
      pageSize = "",
      sortField = "",
      sortMode = "",
      keyWords = "",
      minFilterPrice = "",
      maxFilterPrice = "";
    // 拼接接口url参数
    if (location.query) {
      filters = location.query.filters || "";
      hasInventory = location.query.hasInventory || 0;
      pageSize = location.query.pageSize || 20;
      sortField = location.query.sortField || 1;
      pageNum = location.query.currentPage || 1;
      sortMode = location.query.sortMode || "desc";
      keyWords = location.query.k || "";
      minFilterPrice = location.query.minFilterPrice || "";
      maxFilterPrice = location.query.maxFilterPrice || "";
    }
    let pathname = "/v3/search-service/product/list/homepage/search-keywords";
    if (/search\/v2/.test(window.location.pathname)) {
      pathname = "/v2/product/homepage/search-keywords-with-ad-with-pv";
    }

    const url = `${pathname}?keyWords=${keyWords}&filters=${filters}&hasInventory=${hasInventory}&pageNum=${pageNum}&pageSize=${pageSize}&sortField=${sortField}&sortMode=${sortMode}&screen=0&filterActivity=false&channel=MOBILE&maxFilterPrice=${maxFilterPrice}&minFilterPrice=${minFilterPrice}`;
    params.url = url; // 保存参数
    params.onlyKey = "searchResultsDidmount";
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
        NoResults: require("../../components/PlpPage/NoResults").default,
        SearchListPrompt: require("../../components/PlpPage/SearchListPrompt")
          .default,
      });
    });
    initial(params).then((results) => {
      // 获取列表参数
      if (results) {
        const keyWord = results.keyWords;
        let name = `搜索结果:${keyWord}`;
        if (!results.content || results.content.length === 0) {
          name += "(无结果)";
        }
        let impressions = [];
        const buttonPosition = "Search Results";
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
        this.setState({
          name,
          url,
        });
        return results;
      }
    });
  }

  render() {
    const {
      name,
      url,
      CurrentComponentCommonTop,
      CurrentComponentDeepLink,
      PopupAlert,
      PlpScreenComp,
      PlpSearch,
      ProductList,
      NoResults,
      SearchListPrompt,
    } = this.state;
    const { products } = this.props;
    const query = getLocationQuery();
    let val = query.k || "";
    if (products) {
      val = products.keyWords;
    }
    return (
      <div>
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        <div className="plpPage_head">
          <div className="plpPage_head_search">
            {PlpSearch && (
              <PlpSearch type="search" key="CategorySearch" keywords={val} />
            )}
          </div>
          {PlpScreenComp && (
            <PlpScreenComp
              quickData={products && products.quickFilters}
              url={url}
            />
          )}
        </div>
        {products &&
          ((products.swapWords && products.swapWords.length) ||
            products.notFoundKeyWord) &&
          SearchListPrompt && <SearchListPrompt products={products} />}
        {ProductList && <ProductList name={name} url={url} />}
        {NoResults && <NoResults name={name} products={products} />}
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
  getMatchKey: bindActionCreators(getMatchKey, dispatch),
  getMatchText: bindActionCreators(getMatchText, dispatch),
  dispatch,
});
export default OiaWrap(
  connect(mapStateToProps, mapDispatchToProps)(SearchResults)
);
