import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import browserHistory from "@/store/browserHistory";
import OiaWrap from "@/components/OiaWrap";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import isBrowser from "@/Utils/utils/isBrowser";
import { initial, getPlpListData, advertImg } from "../../actions/plpPage";
import Image from "../../components/ImagesLazyLoad/index";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/giftSet.scss");
}
// 优惠券去使用落地页
class GiftSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", // 埋点用
      url: "/v3/search-service/product/list/giftset", // 保存接口参数
      giftImg: null, // 图片
      CurrentComponentCommonTop: null,
      CurrentComponentDeepLink: null,
      PopupAlert: null,
      SearchListPrompt: null,
      ProductList: null,
      PlpScreenComp: null,
      PlpSearch: null,
    };
  }

  componentDidMount() {
    const { initial, advertImg } = this.props;
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
      minFilterPrice = location.query.minFilterPrice || "";
      maxFilterPrice = location.query.maxFilterPrice || "";
    }

    const url = `/v3/search-service/product/list/giftset?filters=${filters}&hasInventory=${hasInventory}&pageNum=${pageNum}&pageSize=${pageSize}&sortField=${sortField}&sortMode=${sortMode}&filterActivity=false&channel=MOBILE&minFilterPrice=${minFilterPrice}&maxFilterPrice=${maxFilterPrice}`;
    params.url = url; // 保存参数
    params.onlyKey = "giftSet";
    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        CurrentComponentDeepLink: require("../../components/DeepLink/index")
          .default,
        PopupAlert: require("../../components/PopupAlert").default,
        SearchListPrompt: require("../../components/PlpPage/SearchListPrompt")
          .default,
        ProductList: require("../../components/PlpPage/ProductList").default,
        PlpScreenComp: require("../../components/PlpPage/PlpScreenComp")
          .default,
        PlpSearch: require("../../components/PlpPage/PlpSearch").default,
      });
    });
    initial(params).then((results) => {
      // 获取列表参数
      if (results) {
        const name = "商品列表:礼物套装";
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
    advertImg(
      {
        queryBody: {
          locationLabel: "MOBILE:GIFTSUIT:ALL",
        },
      },
      (callback) => {
        if (
          callback &&
          callback.results &&
          callback.results.resourceList &&
          Array.isArray(callback.results.resourceList) &&
          callback.results.resourceList.length > 0
        ) {
          this.setState({
            giftImg: callback.results.resourceList,
          });
        }
      }
    );
  }
  render() {
    const {
      name,
      url,
      CurrentComponentCommonTop,
      CurrentComponentDeepLink,
      PopupAlert,
      giftImg,
      SearchListPrompt,
      ProductList,
      PlpScreenComp,
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
            <PlpScreenComp quickData={products.quickFilters} url={url} />
          )}
        </div>
        {SearchListPrompt &&
          products &&
          ((products.swapWords && products.swapWords.length) ||
            products.notFoundKeyWord) && (
            <SearchListPrompt products={products} />
          )}
        {giftImg ? (
          <div className="category_gift_img">
            <a href={giftImg && giftImg[0].link}>
              <Image src={giftImg && giftImg[0].imagePath} alt="" />
            </a>
          </div>
        ) : (
          ""
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
  advertImg: bindActionCreators(advertImg, dispatch),
  dispatch,
});
export default OiaWrap(connect(mapStateToProps, mapDispatchToProps)(GiftSet));
