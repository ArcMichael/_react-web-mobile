import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import browserHistory from "@/store/browserHistory";
import OiaWrap from "@/components/OiaWrap";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import isBrowser from "@/Utils/utils/isBrowser";
import { initial, getPlpListData } from "../../actions/plpPage";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/moodresults.scss");
}
// 热搜词列表页
class Moodresults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", // 埋点用
      url: "/v3/search-service/product/list/hotwords", // 保存接口参数
      CurrentComponentCommonTop: null,
      CurrentComponentDeepLink: null,
      PopupAlert: null,
      ProductList: null,
      SearchListPrompt: null,
      NoResults: null,
      PlpScreenComp: null,
      PlpSearch: null,
    };
  }

  componentDidMount() {
    const { initial } = this.props;
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
      hotWords = "",
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
      hotWords = location.query.k || "";
      minFilterPrice = location.query.minFilterPrice || "";
      maxFilterPrice = location.query.maxFilterPrice || "";
    }

    const url = `/v3/search-service/product/list/hotwords?hotWords=${hotWords}&filters=${filters}&hasInventory=${hasInventory}&pageNum=${pageNum}&pageSize=${pageSize}&sortField=${sortField}&sortMode=${sortMode}&filterActivity=false&channel=MOBILE&minFilterPrice=${minFilterPrice}&maxFilterPrice=${maxFilterPrice}`;
    params.url = url; // 保存参数
    params.onlyKey = "moodResults";
    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        CurrentComponentDeepLink: require("../../components/DeepLink/index")
          .default,
        PopupAlert: require("../../components/PopupAlert").default,
        ProductList: require("../../components/PlpPage/ProductList").default,
        SearchListPrompt: require("../../components/PlpPage/SearchListPrompt")
          .default,
        NoResults: require("../../components/PlpPage/NoResults").default,
        PlpScreenComp: require("../../components/PlpPage/PlpScreenComp")
          .default,
        PlpSearch: require("../../components/PlpPage/PlpSearch").default,
      });
    });
    initial(params).then((results) => {
      // 获取列表参数
      if (results) {
        const name = `热搜结果:${results.keyword}`;
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
      ProductList,
      SearchListPrompt,
      NoResults,
      PlpScreenComp,
      PlpSearch,
    } = this.state;
    const { products } = this.props;
    console.log(products, "products");
    let keyword;
    if (products) {
      keyword = products.hotWords;
    }
    return (
      <div>
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        <div className="plpPage_head">
          <div className="plpPage_head_search">
            {PlpSearch && (
              <PlpSearch
                type="search"
                key="CategorySearch"
                keywords={keyword}
              />
            )}
          </div>
          {PlpScreenComp && products && (
            <PlpScreenComp quickData={products.quickFilters} url={url} />
          )}
        </div>
        {SearchListPrompt &&
          products &&
          ((products.swapWords && products.swapWords.length) ||
            products.notFoundKeyWord) && (
            <SearchListPrompt products={products} url={url} />
          )}
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
  dispatch,
});
export default OiaWrap(
  connect(mapStateToProps, mapDispatchToProps)(Moodresults)
);
