import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import OiaWrap from "@/components/OiaWrap";
import isBrowser from "@/Utils/utils/isBrowser";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import { initial, getPlpListData, couponInfo } from "../../actions/plpPage";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/couponSet.scss");
}
// 优惠券去使用落地页
class CouponSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", // 埋点用
      url: "/v3/search-service/product/list/coupon", // 保存接口参数
      CurrentComponentCommonTop: null,
      CurrentComponentDeepLink: null,
      PopupAlert: null,
      couponInfo: null,
      SearchListPrompt: null,
      CouponEmploy: null,
      PlpScreenComp: null,
      ProductList: null,
      PlpSearch: null,
    };
  }

  componentDidMount() {
    const { initial } = this.props;
    const params = {
      type: "GET",
    };
    const query = getLocationQuery();
    let filters = "",
      hasInventory = "",
      pageNum = "",
      pageSize = "",
      sortField = "",
      sortMode = "",
      keyWords = "",
      promotionIds = "",
      minFilterPrice = "",
      maxFilterPrice = "";
    // 拼接接口url参数
    if (query) {
      filters = query.filters || "";
      hasInventory = query.hasInventory || 0;
      pageSize = query.pageSize || 20;
      sortField = query.sortField || 1;
      pageNum = query.currentPage || 1;
      sortMode = query.sortMode || "desc";
      keyWords = query.keyWords || "";
      promotionIds = query.promotionIds || "";
      minFilterPrice = query.minFilterPrice || "";
      maxFilterPrice = query.maxFilterPrice || "";
    }

    const url = `/v3/search-service/product/list/coupon?filters=${filters}&hasInventory=${hasInventory}&keyWords=${keyWords}&promotionIds=${promotionIds}&pageNum=${pageNum}&pageSize=${pageSize}&sortField=${sortField}&sortMode=${sortMode}&filterActivity=false&channel=MOBILE&maxFilterPrice=${maxFilterPrice}&minFilterPrice=${minFilterPrice}`;
    params.url = url; // 保存参数
    params.onlyKey = "couponSet";
    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        CurrentComponentDeepLink: require("../../components/DeepLink/index")
          .default,
        PopupAlert: require("../../components/PopupAlert").default,
        SearchListPrompt: require("../../components/PlpPage/SearchListPrompt")
          .default,
        CouponEmploy: require("./components/CouponEmploy").default,
        PlpScreenComp: require("../../components/PlpPage/PlpScreenComp")
          .default,
        ProductList: require("../../components/PlpPage/ProductList").default,
        PlpSearch: require("../../components/PlpPage/PlpSearch").default,
      });
    });
    initial(params).then((results) => {
      // 获取列表参数
      if (results) {
        this.setState({
          name,
          url,
        });
      }
    });
    couponInfo(query.code, (res) => {
      this.setState({
        couponInfo: res,
      });
    });
  }
  render() {
    const {
      name,
      url,
      CurrentComponentCommonTop,
      CurrentComponentDeepLink,
      PopupAlert,
      couponInfo,
      SearchListPrompt,
      CouponEmploy,
      PlpScreenComp,
      ProductList,
      PlpSearch,
    } = this.state;
    const { products } = this.props;
    return (
      <div>
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        <div className="plpPage_head">
          <div className="plpPage_head_search">
            {PlpSearch && (
              <PlpSearch type="categorylist" key="CategorySearch" />
            )}
          </div>
          {PlpScreenComp && products && (
            <PlpScreenComp
              url={url}
              quickData={products && products.quickFilters}
            />
          )}
        </div>
        {CouponEmploy && couponInfo ? (
          <CouponEmploy content={couponInfo} />
        ) : null}
        {SearchListPrompt &&
          products &&
          ((products.swapWords && products.swapWords.length) ||
            products.notFoundKeyWord) && (
            <SearchListPrompt products={products} />
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
  brandCon: s.plpPage.brandCon,
});
const mapDispatchToProps = (dispatch) => ({
  initial: bindActionCreators(initial, dispatch),
  getPlpListData: bindActionCreators(getPlpListData, dispatch),
  dispatch,
});
export default OiaWrap(connect(mapStateToProps, mapDispatchToProps)(CouponSet));
