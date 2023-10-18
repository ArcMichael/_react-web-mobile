import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import browserHistory from "@/store/browserHistory";
import { verifyOptions } from "@/lib/Tools";
import OiaWrap from "@/components/OiaWrap";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import isBrowser from "@/Utils/utils/isBrowser";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import { initial, getPlpListData } from "../../actions/plpPage";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/categoryProductList.scss");
}
// 分类列表页
class CategoryProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", // 埋点用
      url: "/v3/search-service/product/list/category", // 保存接口参数
      CurrentComponentCommonTop: null,
      CurrentComponentDeepLink: null,
      PopupAlert: null,
      brandIfShow: true, //控制品牌筛选是否展示
      CategoryBrand: null,
      SearchListPrompt: null,
      ScreenActButton: null,
      PlpScreenComp: null,
      PlpSearch: null,
      ProductList: null,
    };
  }

  componentDidMount() {
    const { ScreenActButton } = this.state; // TODO: 请移除无用state
    console.log(ScreenActButton);
    const { initial } = this.props;
    let params = {
      type: "GET",
    };
    let location = browserHistory.getCurrentLocation();
    let categoryId = "",
      filters = "",
      hasInventory = "",
      pageNum = "",
      pageSize = "",
      sortField = "",
      sortMode = "",
      minFilterPrice = "",
      maxFilterPrice = "";
    // 拼接接口url参数
    if (location.pathname) {
      const pathname4 = location.pathname.split("/")[4];
      const pathname2 = location.pathname.split("/")[2];
      const pathname3 = location.pathname.split("/")[3];
      if (pathname2.split("-")) {
        pathname2.split("-").map((el) => {
          if (verifyOptions(el, "number", true)) {
            return (window.location.href = "/error");
          }
        });
      }
      filters = pathname4;
      categoryId = pathname2.split("-")[0] || 60001;
      pageNum = (pathname3 ? pathname3.replace("page", "") : null) || 1;
    }
    const query = getLocationQuery();
    if (query) {
      hasInventory = query.hasInventory || 0;
      pageSize = query.pageSize || 20;
      sortField = query.sortField || 1;
      sortMode = query.sortMode || "desc";
      maxFilterPrice = query.maxFilterPrice || "";
      minFilterPrice = query.minFilterPrice || "";
    }

    const url = `/v3/search-service/product/list/category?categoryId=${
      categoryId || ""
    }&filters=${filters}&hasInventory=${hasInventory}&pageNum=${pageNum}&pageSize=${pageSize}&sortField=${sortField}&sortMode=${sortMode}&filterActivity=false&channel=MOBILE&maxFilterPrice=${maxFilterPrice}&minFilterPrice=${minFilterPrice}`;
    params.url = url; // 保存参数
    params.onlyKey = "brandList";
    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        CurrentComponentDeepLink: require("../../components/DeepLink/index")
          .default,
        PopupAlert: require("../../components/PopupAlert").default,
        CategoryBrand: require("./components/CategoryBrand").default,
        SearchListPrompt: require("../../components/PlpPage/SearchListPrompt")
          .default,
        PlpScreenComp: require("../../components/PlpPage/PlpScreenComp")
          .default,
        PlpSearch: require("../../components/PlpPage/PlpSearch").default,
        ProductList: require("../../components/PlpPage/ProductList").default,
      });
    });
    initial(params).then((results) => {
      // 获取列表参数
      if (results) {
        const categoryresult = results;
        const name = categoryresult.thirdCategoryName
          ? `商品列表:${categoryresult.rootCategoryName}:${categoryresult.secondCategoryName}:${categoryresult.thirdCategoryName}`
          : categoryresult.secondCategoryName
          ? `商品列表:${categoryresult.rootCategoryName}:${categoryresult.secondCategoryName}`
          : `商品列表:${categoryresult.rootCategoryName}`;
        const level2 = `商品列表:${categoryresult.rootCategoryName}`;
        let level3 = categoryresult.secondCategoryName
          ? `商品列表:${categoryresult.rootCategoryName}:${categoryresult.secondCategoryName}`
          : `商品列表:${categoryresult.rootCategoryName}`;
        level3 = categoryresult.thirdCategoryName
          ? `商品列表:${categoryresult.rootCategoryName}:${categoryresult.secondCategoryName}:${categoryresult.thirdCategoryName}`
          : `商品列表:${categoryresult.rootCategoryName}:${categoryresult.secondCategoryName}`;
        GoogleAnalytics.push({
          event: "Navigation",
          navigationLevel: level2,
          navigationDetail: level3,
        });
        const data =
          window && window.location.search && window.location.search.split("&");
        if (results.filters) {
          // 没有筛选值时 品牌快捷筛选一直显示 如果有不是在外部选中则不显示
          data[data.length - 1] !== "brand"
            ? this.setState({ brandIfShow: false })
            : null;
        }
        let impressions = [];
        const buttonPosition = "Navigation List";
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
      brandIfShow,
      CurrentComponentCommonTop,
      CurrentComponentDeepLink,
      PopupAlert,
      CategoryBrand,
      SearchListPrompt,
      PlpScreenComp,
      PlpSearch,
      ProductList,
    } = this.state;
    const { products, obtainResults } = this.props;
    return (
      <div>
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        <div className="plpPage_head">
          <div className="plpPage_head_search">
            {PlpSearch && <PlpSearch PlpSearch type="categorylist" />}
          </div>
          {PlpScreenComp && products && <PlpScreenComp url={url} />}
        </div>
        {SearchListPrompt &&
          products &&
          ((products.swapWords && products.swapWords.length) ||
            products.notFoundKeyWord) && (
            <SearchListPrompt products={products} />
          )}
        {brandIfShow &&
          products &&
          obtainResults.facetBrands &&
          CategoryBrand && (
            <CategoryBrand products={products} obtainResults={obtainResults} />
          )}
        {ProductList && <ProductList name={name} url={url} />}
        {CurrentComponentDeepLink && <CurrentComponentDeepLink />}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = (s) => ({
  products: s.plpPage.products,
  obtainResults: s.plpPage.obtainData,
  brandCon: s.plpPage.brandCon,
});
const mapDispatchToProps = (dispatch) => ({
  initial: bindActionCreators(initial, dispatch),
  getPlpListData: bindActionCreators(getPlpListData, dispatch),
  dispatch,
});

export default OiaWrap(
  connect(mapStateToProps, mapDispatchToProps)(CategoryProduct)
);
