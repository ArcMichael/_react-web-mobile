import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import SearchUtil from "@/components/Search/utils";
import EsBrandWall from "@/lib/services/EsBrandWall";
import Marketing from "@/lib/services/Marketing";
import isBrowser from "@/Utils/utils/isBrowser";
import { historyArr, autoSuggest } from "@/actions/search";
import DefaultImg from "@/components/Search/DefaultImg";
import { SetSingleCookie2V2, GetSingleCookie2V2 } from "@/lib/Tools";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import CdnImage from "@/components/CdnImage";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import BrowserHistoryProducts from "./SearchModal/BrowserHistoryProducts";
import HotSearch from "./SearchModal/HotSearch";
import HistorySearch from "./SearchModal/HistorySearch";
import { urlGetParams } from "@/lib/url";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/searchRevam.scss");
}
// isSearchFrom:品牌关键词 isHotFrom:热词返回不留关键词 searchF:返回replace标志位

class SearchRevamp extends Component {
  searchInputRef = null;

  constructor(props) {
    super(props);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handlePressEnter = this.handlePressEnter.bind(this);
    this.disableScroll = this.disableScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getAllBrand = this.getAllBrand.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.forwardDetail = this.forwardDetail.bind(this);
    this.openResult = this.openResult.bind(this);
    this.closeResult = this.closeResult.bind(this);
    this.heights = this.heights.bind(this);
    this.compositionstart = this.compositionstart.bind(this);
    this.compositionend = this.compositionend.bind(this);
    this.searchPage = this.searchPage.bind(this);
    this.routerFrom = this.routerFrom.bind(this);
    this.InputDomFunc = this.InputDomFunc.bind(this);
    this.state = {
      allBrand: [],
      hotSearch: [],
      resultList: "",
      cpLock: true,
      listLock: false,
      kwds: "",
    };
  }

  static BrandSession = "ALLBRAND";

  componentWillUnmount() {
    sessionStorage.removeItem(SearchRevamp.BrandSession);
  }

  componentDidUpdate() {
    if ($(this.refs.searchInputEl)) {
      $(this.refs.searchInputEl).focus();
    }
  }
  componentDidMount() {
    this.open();
    window.addEventListener("resize", this.handleResize.bind(this));
    if ($(this.refs.searchInputEl)) {
      $(this.refs.searchInputEl).focus();
    }
  }
  routerFrom() {
    console.log(document.referrer);
  }
  PopupConfirmSearch() {
    Marketing.MktSimpleGroupController.commonBanner("mobile:select:hot").then(
      (res) => {
        if (res.status === 0 && res.results) {
          this.setState({
            hotSearch: res.results,
          });
        }
      }
    );
  }
  getAllBrand() {
    const sessionBrandWall = sessionStorage.getItem(SearchRevamp.BrandSession);
    if (sessionBrandWall) {
      this.setState({
        allBrand: JSON.parse(sessionBrandWall),
      });
      return;
    }
    EsBrandWall.getAll().then((res) => {
      if (res.status === 0 && Array.isArray(res.results)) {
        sessionStorage.setItem(
          SearchRevamp.BrandSession,
          JSON.stringify(res.results)
        );
        this.setState({
          allBrand: res.results,
        });
      }
    });
  }

  open() {
    const { afterOpen } = this.props;

    let kwds = sessionStorage.getItem("keywords");
    if (kwds) {
      this.setState(
        {
          kwds,
        },
        () => {
          this.inputChange();
          sessionStorage.removeItem("keywords");
        }
      );
    }
    let inputShow=urlGetParams(window.location, "keywords")
    if (inputShow) {
      this.inputChange()
    }
    this.PopupConfirmSearch();
    this.getAllBrand();
    this.clearInput();
    afterOpen && afterOpen();
  }
  close() {
    const { afterClose } = this.props;
    const root = document.getElementById("root");
    if (root) root.style.display = "block";
    if (afterClose) afterClose();
  }

  disableScroll(e) {
    e.preventDefault();
  }

  clearInput() {
    if (this.refs.searchInputEl) {
      $(this.refs.searchInputEl).val = null;
      $(this.refs.searchInputEl).focus();
    }
  }

  /**
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} event
   */
  handlePressEnter(event) {
    if (event.key === "Enter") {
      this.handleClick(event.target.value);
    }
  }

  /**
   * search搜索跳转逻辑梳理
   *
   * 1. 输入框有值
   *    1.1. 输入框全是空格，则清空输入框，让用户重新输入
   *    1.2. 是品牌则跳转到品牌页
   *    1.3. 普通跳转到 /search/?k=页
   * 2. 输入框无值
   *    2.1  跳转到热词页 /hot/?k=
   * @param {string?} value
   */
  handleClick(value) {
    const searchInputEl = $(this.refs.searchInputEl);
    const query = getLocationQuery();
    let path = window.location.pathname + window.location.search;
    path=path.replace("=","~")

    // 1. 输入框有值
    if (value) {
      // 1.1. 输入框全是空格，则清空输入框，让用户重新输入
      if (!value.trim()) {
        this.clearInput();
        return;
      }
      GoogleAnalytics.pushV2({
        event: "search",
        searchCategory: "自然搜索",
        cat55: "自然搜索",
        searchTerm: value,
        kw55: value,
      });
      SearchUtil.setSearchHistory(value);
      SearchUtil.trackingCode(
        value,
        "/search/?k=" + value,
        "ManualInput",
        "Organic"
      );
      let brandUrl = SearchUtil.getBrandUrl(value, this.state.allBrand);
      // 优先热词匹配
      const { hotSearch } = this.state;
      let hotLink = null;
  
      if (hotSearch && hotSearch.length > 0) {
        hotSearch.map((item) => {
          if (item.contentDetails && item.contentDetails.length > 0) {
            item.contentDetails.map((item1) => {
              if (item1.text == value) {
                hotLink = item1.link + "&isHotFrom=1" + "&searchF=" + path;
              }
            });
          }
        });
      }
      if (hotLink) {
        window.location.href=hotLink
        return
      }
      // 1.2. 是品牌则跳转到品牌页
      if (brandUrl) {
        window.location.href =
          brandUrl +
          "?isSearchFrom=" +
          value +
          "&searchF=" +
          path +
          "&elKey=" +
          searchInputEl.val();
        return;
      }
      // 1.3. 普通跳转到 /search/?k=页
      window.location.href =
        `/search/?k=${value.trim()}` +
        "&searchF=" +
        path +
        "&elKey=" +
        searchInputEl.val();
      return;
    } else {
      let { searchPlaceholder } = query;
      if (searchPlaceholder)
        GoogleAnalytics.pushV2({
          event: "search",
          searchCategory: "预设",
          cat55: "预设",
          searchTerm: searchPlaceholder,
          kw55: searchPlaceholder,
        });
    }
    // 2.1 跳转到热词页 /hot/?k=
    let { searchPlaceholder } = query;
    let obj = {};
    obj.content = searchPlaceholder;
    SearchUtil.searchHotKeyword(obj, path);
  }
  clcikBack() {
    let rout = sessionStorage.getItem("rout");
    if (rout) {
      // 返回分类页面
      // sessionStorage.removeItem("categoryNum")
      window.location.href = rout;
    } else {
      window.location.href = "/";
    }
  }
  inputChange(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const that = this;
    const searchInputEl = $(this.refs.searchInputEl);
    const em = searchInputEl.parents(".tc_input").find(".search_e_close");
    const val = searchInputEl.val();

    em.css("visibility", "visible");
    if (val === "") {
      if (this.state.cpLock) {
        em.css("visibility", "hidden");
        that.closeResult();
        that.setState({ resultList: { results: null } });
      }
      return;
    }
    this.props.autoSuggest(val, (callback) => {
      if (callback && callback.results && !callback.results.code) {
        that.setState({ resultList: callback });
        em.css("visibility", "visible");
        let value = $(this.refs.searchInputEl).val();
        if (value != "") {
          that.openResult();
        }
      }
    });
  }
  forwardDetail(url, type, val, valType, content) {
    let path = window.location.pathname + window.location.search;
    path=path.replace("=","~")
    // 判断如果是热词就走热词
    const { hotSearch } = this.state;
    let hotLink = null;

    if (hotSearch && hotSearch.length > 0) {
      hotSearch.map((item) => {
        if (item.contentDetails && item.contentDetails.length > 0) {
          item.contentDetails.map((item1) => {
            if (item1.text == val) {
              hotLink = item1.link + "&isHotFrom=1" + "&searchF=" + path;
            }
          });
        }
      });
    }
   
    this.closeResult();
    if (type === "keyword" || type === "brand") {
      let oldcookie = GetSingleCookie2V2({ key: "n_history" });
      let newcookie = [];
      if (oldcookie && oldcookie !== "false") {
        newcookie = oldcookie.split("=%");
        newcookie.map((data, index) => {
          data === val && newcookie.splice(index, 1);
        });
        // newcookie.length > 10 && newcookie.pop();
        newcookie.unshift(val);
        const newcookies = newcookie.join("=%");
        SetSingleCookie2V2({
          key: "n_history",
          value: newcookies,
          domain: ".sephora.cn",
        });
      } else {
        newcookie.unshift(val);
        SetSingleCookie2V2({
          key: "n_history",
          value: val,
          domain: ".sephora.cn",
        });
      }
      this.props.historyArr(newcookie);
    }
    SearchUtil.trackingCode(content || val, url, "ClickTerm", valType, "");
    window.location.href = hotLink || url;
  }
  openResult() {
    const that = this;
    this.heights();
    bodyScrollTop.set(0);
    const searchInputEl = $(this.refs.searchInputEl);
    const searchResultList = $(this.refs.searchResultList);
    searchResultList.scrollTop(0);
    const em = searchInputEl.parents(".tc_input").find(".search_e_close");
    em.css("visibility", "visible");
    this.setState({
      listLock: true,
    });
    const val = searchInputEl.val();
    if (val !== "" && this.state.resultList.results != null) {
      searchResultList
        .stop()
        .animate({ height: that.state.searchListHeight + "px" }, 100, "swing");
    }
  }
  closeResult(eClose) {
    const searchInputEl = $(this.refs.searchResultList);
    searchInputEl.stop().animate({ height: "0px" }, 500, "swing");
    const searchInputEls = $(this.refs.searchInputEl);
    const em = searchInputEls.parents(".tc_input").find(".search_e_close");
    em.css("visibility", "hidden");
    this.setState({
      listLock: false,
    });
    // 会唤起弹出框
    if (eClose) {
      $(this.refs.searchInputEl).val("").focus();
    }
  }
  handleResize() {
    if (
      this.state.listLock &&
      this.state.resultList &&
      this.state.resultList.results != null
    ) {
      this.heights();
      const searchResultList = $(this.refs.searchResultList);
      searchResultList.height(this.state.searchListHeight);
    }
  }
  // 获取高度
  heights() {
    const searchResultList = $(this.refs.searchResultList);
    const hWin = document.documentElement.clientHeight;
    const offTop = searchResultList.offset().top - $(window).scrollTop();
    let height;
    height = hWin - offTop;
    if (this.state.searchListHeight) {
      this.setState({
        searchListHeight: height,
      });
    } else {
      this.state.searchListHeight = height;
    }
  }
  compositionstart() {
    this.setState({
      cpLock: false,
    });
  }
  compositionend() {
    this.setState({
      cpLock: true,
    });
  }
  searchPage(event) {
    if (event.key === "Enter") {
      this.handleClick(event.target.value);
    }
  }
  InputDomFunc = (keys) => {
    const query = getLocationQuery();
    const { searchPlaceholder } = query;
    return (
      <input
        className="search_input"
        id="search_input"
        ref="searchInputEl"
        autoComplete="off"
        type="search"
        onClick={this.clickSearchInput}
        placeholder={searchPlaceholder || "请输入关键字搜索"}
        defaultValue={keys}
        onInput={this.inputChange}
        onKeyUp={this.searchPage}
        // onFocus={this.onFocusInput}
        onCompositionStart={this.compositionstart}
        onCompositionEnd={this.compositionend}
        // onBlur={this.onBlurInput}
      />
    );
  };
  render() {
    const that = this;
    const urlPrev = "";
    const query = getLocationQuery();

    const { kwds } = this.state;
    const { keywords } = query;
    let resultList = {
      suggestList: [],
      topProductList: [],
      suggestCategoryDtoList: [],
    };
    resultList = this.state.resultList;
    resultList = resultList.results;
    let liList = [];
    let productList = [];
    const searchInputEl = $(this.refs.searchInputEl);

    if (resultList) {
      if (resultList.suggestList && resultList.suggestList.length) {
        //let cate = resultList.suggestCategoryDtoList&&resultList.suggestCategoryDtoList[0];
        const style = {};
        resultList.suggestList.map((item, key) => {
          if (key >= 3) return false;
          let brandUrl = SearchUtil.getBrandUrl(
            item.suggestKeyWord,
            this.state.allBrand
          );
          liList.push(
            <li
              key={"top-li" + key}
              className="first"
              style={style}
              onClick={() => {
                let path = window.location.pathname + window.location.search;
                path=path.replace("=","~")
                GoogleAnalytics.pushV2({
                  event: "search",
                  recommendContent: item.suggestBrandEn,
                  searchCategory: "下拉推荐单",
                  cat55: "下拉推荐单",
                  searchTerm: item.suggestBrandEn,
                  kw55: item.suggestBrandEn,
                });
                that.forwardDetail.call(
                  that,
                  brandUrl
                    ? urlPrev +
                        `${brandUrl}?isSearchFrom=${encodeURI(
                          item.suggestKeyWord
                        )}&searchF=${path}&elKey=${searchInputEl.val()}`
                    : urlPrev +
                        "/search/?k=" +
                        encodeURI(item.suggestKeyWord) +
                        "&searchF=" +
                        path +
                        "&elKey=" +
                        searchInputEl.val(),
                  "keyword",
                  item.suggestKeyWord,
                  "Recommend",
                  null
                );
              }}
            >
              <a title={item.suggestKeyWord}>{item.suggestKeyWord}</a>
              {item.suggestKeyWordCount !== 0 && !!item.suggestKeyWordCount && (
                <p>{item.suggestKeyWordCount + "条"}</p>
              )}
            </li>
          );
        });
      }
      if (
        resultList.suggestBrandDtoList &&
        resultList.suggestBrandDtoList.length
      ) {
        resultList.suggestBrandDtoList.map((item, key) => {
          if (key >= 3) return false;
          liList.push(
            <li
              key={"brand-li" + key}
              className="first"
              onClick={() => {
                let path = window.location.pathname + window.location.search;
                path=path.replace("=","~")
                GoogleAnalytics.pushV2({
                  event: "search",
                  recommendContent: item.suggestBrandEn,
                  searchCategory: "下拉推荐单",
                  cat55: "下拉推荐单",
                  searchTerm: item.suggestBrandEn,
                  kw55: item.suggestBrandEn,
                });
                that.forwardDetail.call(
                  that,
                  urlPrev +
                    `/brand/${item.suggestBrandEn}-${
                      item.suggestBrandId
                    }/?isSearchFrom=${encodeURI(item.suggestBrandEn)}` +
                    "&searchF=" +
                    path +
                    "&elKey=" +
                    searchInputEl.val(),
                  "brand",
                  item.suggestBrandEn,
                  "Recommend Brand",
                  item.suggestBrandEn
                );
              }}
            >
              <a title={item.suggestBrandEn}>{item.suggestBrandEn}</a>
              {/* 判断条数开关 0为关闭 */}
              {item.suggestBrandCount !== 0 && !!item.suggestBrandCount && (
                <p>{item.suggestBrandCount + "条"}</p>
              )}
            </li>
          );
        });
      }
      if (
        resultList.suggestProductList &&
        resultList.suggestProductList.length
      ) {
        resultList.suggestProductList.map((item, key) => {
          if (key >= 6) return false;
          productList.push(
            <div
              className="product_onecont"
              key={"bottom-li" + key}
              onClick={() => {
                GoogleAnalytics.pushV2({
                  event: "search",
                  searchCategory: "产品推荐",
                  cat55: "产品推荐",
                  searchTerm: `${item.brandEN}${item.productCN}`,
                  kw55: `${item.brandEN}${item.productCN}`,
                });
                that.forwardDetail.call(
                  that,
                  "/product/" +
                    item.productId +
                    ".html?isSearchFrom=" +
                    searchInputEl.val(),
                  null,
                  null,
                  "Recommend Product",
                  `${item.brandEN}|${item.productCN}|${item.productId}`
                );
              }}
            >
              {/* <a  title={item.suggestProductName} >{item.suggestProductName}</a> */}

              <DefaultImg
                imgUrl={item.imagePath ? item.imagePath + "350x350.jpg" : ""}
                defaultimg="http://s1.sephorastatic.cn/wcsfrontend/products/nopic_150x150.jpg"
              />
              <p className="product_onecont_brandEn">
                {item.brandEN ? item.brandEN : ""}
              </p>
              <p className="product_onecont_brandCn">
                {item.productCN ? item.productCN : ""}
              </p>
              {/* <p className="product_onecont_price"><span>￥</span>{ (item.minPrice?Number(item.minPrice).toFixed(2):"")+(item.maxPrice?("~"+symbol+Number(item.maxPrice).toFixed(2)):"") }</p> */}
              <p className="product_onecont_price">
                <span>￥</span>
                {item.minPrice ? Number(item.minPrice).toFixed(2) : ""}
                <em>{item.maxPrice ? "~" : ""}</em>
                <span>{item.maxPrice ? "￥" : ""}</span>
                {item.maxPrice ? Number(item.maxPrice).toFixed(2) : ""}
              </p>
            </div>
          );
        });
      }
    }
    const eClose = true;

    return (
      <div className="SearchShadowCover">
        <div className="SearchShadowCover-warp">
          <div className="SearchShadowCover-top">
            <div className="title">搜索</div>
            <div className="close" onClick={this.clcikBack.bind(this)}>
              取消
            </div>
          </div>
          <div className="top_center">
            <div className="tc_input" id="tc_input">
              <CdnImage
                className="search_top_img"
                src="/soa/nmobile/img/search/search-input-icon.png"
              />
              {kwds ? this.InputDomFunc(kwds) : null}
              {!kwds ? this.InputDomFunc(keywords) : null}

              {typeof window !== "undefined" &&
              $(this.refs.searchInputEl).val() ? (
                <CdnImage
                  className="input_close_search"
                  onClick={this.closeResult.bind(this, eClose)}
                  src="/soa/nmobile/img/icon-input-del.png"
                />
              ) : null}
            </div>
          </div>
          {/* 最近搜索 */}
          <HistorySearch allBrand={this.state.allBrand} hotSearch={this.state.hotSearch}/>
          {/* 搜索发现 */}
          <HotSearch resultList={this.state.hotSearch} />
          {/* 历史浏览 */}
          {<BrowserHistoryProducts />}
          <div className="associative_search" ref="searchResultList">
            <ul className="search-item">{liList}</ul>
            <div className="product_recommendation">
              {productList.length ? (
                <h1 className="product_recommendation_hd">产品推荐</h1>
              ) : (
                ""
              )}
              {productList}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (s) => {
  const { BrandAllcon } = s;
  return {
    BrandAllcon,
  };
};
export default connect(mapStateToProps, {
  autoSuggest,
  historyArr,
})(SearchRevamp);
