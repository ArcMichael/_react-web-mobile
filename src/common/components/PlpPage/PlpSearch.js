import React, { Component } from "react";
import { connect } from "react-redux";
import { getHotword } from "@/actions/search";
import { urlGetParams } from "@/lib/url";
import { UserOutlined, SearchOutlined } from "@/components/Icons";
import { judgeTypeOfPlp } from "@/lib/Tools";
import Sensor from "@/Utils/sensor/index";
class PlpSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchPlaceholder: null,
      isSearchFrom: "", //S10变更 品牌从搜索进入还是显示品牌名称
      isLogin:
        this.props.globalReference &&
        this.props.globalReference.USER_USERCARDINFO,
      pageType: "",
      promotionIds: "", // 优惠券去使用参数
      code: "", // 优惠券去使用参数
      keyWords: "", // 优惠券去使用参数
    };
    this.getKeywords = this.getKeywords.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.clearPlaceholderAnimation = this.clearPlaceholderAnimation.bind(this);
    this.callback = this.callback.bind(this);
    this.searchForCoupon = this.searchForCoupon.bind(this);
    this.setKeyFrom = this.setKeyFrom.bind(this);
    this.searchInput = React.createRef();
  }
  SearchModalRef = null;

  timerObj = null;
  static CreateWorker = () => {
    if (typeof Worker === "undefined") {
      return {};
    }
    const workderFunc = `
   // let index = 0;
   let timer = null;
   let cacheKeywords = null;
   const clear = () => {
     if (timer) {
       clearInterval(timer);
       timer = null;
     }
   };

   const startset = keywords => {
     let index = 0;
     if (Array.isArray(keywords) && keywords.length > 0) {
       clear();
       cacheKeywords = keywords;
       timer = setInterval(() => {
         if (index >= keywords.length - 1) {
           index = -1;
         }
         index++;
         postMessage(keywords[index]);
       }, 3000);
     }
   };
   const restart = () => {
     if (cacheKeywords) {
       startset(cacheKeywords);
     }
   };

   onmessage = e => {
     if (Array.isArray(e.data) && e.data.length > 0) {
       startset(e.data);
     }
     if (e.data === 'stop') {
       clear();
     }
     if (e.data === 'start') {
       restart();
     }
   };
   `;

    let blob = new Blob([workderFunc], { type: "text/javascript" });
    let worker = new Worker(URL.createObjectURL(blob));
    return worker;
  };
  componentDidMount() {
    let state = {};
    let pageType = judgeTypeOfPlp();
    let that = this;
    this.setState({
      hotKey: urlGetParams(window.location, "k"),
    });
    this.setState({
      isSearchFrom: urlGetParams(window.location, "isSearchFrom"),
    });
    if (!this.props.keywords && pageType !== "couponSet") {
      this.worker = PlpSearch.CreateWorker();
      this.worker.onmessage = (e) => {
        if (e.data) {
          that.setState({
            searchPlaceholder: e.data,
          });
        }
      };
    }
    if (pageType === "couponSet") {
      state.promotionIds = urlGetParams(window.location, "promotionIds") || "";
      state.code = urlGetParams(window.location, "code") || "";
      state.keyWords = urlGetParams(window.location, "keyWords") || "";
    }
    state.pageType = pageType;
    this.setState(state);
    this.props.getHotword();
  }
  componentWillUnmount() {
    this.clearPlaceholderAnimation();
    if (this.worker) {
      this.worker.terminate();
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { globalReference = {} } = this.props;
    const { USER_USERCARDINFO } = globalReference;
    if (
      JSON.stringify(nextProps.search) !== JSON.stringify(this.props.search)
    ) {
      const keywords = this.getKeywords(nextProps.search.GETHOTSEARCHWORD);
      this.setState({
        searchPlaceholder: keywords[0] || null,
      });
      if (this.worker) {
        this.worker.postMessage(keywords);
      }
    }
    if (USER_USERCARDINFO !== nextProps.globalReference.USER_USERCARDINFO) {
      this.setState({
        isLogin: Boolean(nextProps.globalReference.USER_USERCARDINFO),
      });
    }
  }
  getKeywords(GETHOTSEARCHWORD) {
    /** @type {ResourceItem[]} - description */
    let keywords = [];
    if (GETHOTSEARCHWORD) {
      const { results } = GETHOTSEARCHWORD;
      if (results) {
        const { resourceList } = results;
        if (Array.isArray(resourceList)) {
          return resourceList;
        }
      }
    }
    return keywords;
  }
  clearPlaceholderAnimation() {
    if (this.worker) {
      this.worker.postMessage("stop");
    }
  }
  handleClick() {
    let pageType = judgeTypeOfPlp();
    const { keywords } = this.props;
    const { searchPlaceholder, isSearchFrom } = this.state;
    let keyword;
    let hotFlag = urlGetParams(window.location, "isHotFrom");
    let url = urlGetParams(window.location, "searchF")
    url = url && url.replace("~", "=")

    if (pageType === "search") {
      keyword = keywords ? keywords : "";
      if (hotFlag) {
        if (url) {
          window.location.replace(url)
        } else {
          window.location.href = `/v2/html/search_revamp`
        }
      } else {
        window.location.href = `/v2/html/search_revamp?keywords=${keyword}`;

      }
    } else if (pageType === "couponSet") {
    } else {
      keyword = urlGetParams(window.location, "k")
        ? urlGetParams(window.location, "k")
        : "";
      if (isSearchFrom) {
        keyword = isSearchFrom;
      }
      if (!keyword) {
        window.location.href = `/v2/html/search_revamp?searchPlaceholder=${searchPlaceholder && searchPlaceholder.content
          }`;
      } else {
        if (hotFlag) {
          if (url) {
            window.location.replace(url)
          } else {
            window.location.href = `/v2/html/search_revamp`
          }
        } else {
          window.location.href = `/v2/html/search_revamp?keywords=${keyword}`;
        }
      }
      Sensor.go("clickBanner_App_Mob", {
        action_id: "1000001_987",
        page_id: "MB_1000202",
        banner_type: "search",
        banner_content: "点击搜索框",
        banner_belong_area: "Searchbar",
        banner_to_page_type: "Function-page",
        banner_current_page_type: "home",
        banner_current_url: window.location.href,
        banner_to_url: `/v2/html/search_revamp?keywords=${keyword}`
      });
    }
  }
  callback() {
    this.setKeyFrom();
    let url = urlGetParams(window.location, "searchF")
    url = url && url.replace("~", "=")

    if (url) {
      window.location.replace(url)
    } else {
      window.history.go(-1);
      window.location.replace(document.referrer)
    }
    Sensor.go("$AppClick", {
      action_id: "1000001_999",
      page_id: "MB_1000202",
      $element_content: "返回"
    });
  }
  setKeyFrom() {
    let { isSearchFrom, hotKey } = this.state;
    let { keywords } = this.props;
    let hotFlag = urlGetParams(window.location, "isHotFrom");
    let elKey = urlGetParams(window.location, "elKey");
    if (hotFlag && hotFlag == 1) {
      sessionStorage.removeItem("keywords");
    } else {
      sessionStorage.setItem(
        "keywords",
        elKey || isSearchFrom || keywords || hotKey || ""
      );
    }
  }

  clickDelInput(e) {
    let pageType = judgeTypeOfPlp();
    e.stopPropagation();
    window.location.href = `/v2/html/search_revamp`;
    if (pageType === "couponSet") {
      window.location.search.replace(/&keyWords=.*?&/, "&keyWords=&");
      window.location.href = `/v2/html/search_revamp${window.location.search}`;
    }
  }
  searchForCoupon(e) {
    const { pageType, promotionIds, code } = this.state;
    if (pageType === "couponSet") {
      e.stopPropagation();
      let searchInputValue = this.searchInput.current.value;
      if (searchInputValue == "") return;
      let hasInventory = urlGetParams(window.location, "hasInventory") || "0";
      let filters = urlGetParams(window.location, "filters") || "";
      window.location.href =
        window.location.pathname +
        `?hasInventory=${hasInventory}&currentPage=1&pageSize=20&sortField=2&sortMode=desc&filters=${filters}&promotionIds=${promotionIds}&code=${code}&keyWords=${searchInputValue}`;
    }
  }
  render() {
    const {
      searchPlaceholder,
      isLogin,
      pageType,
      keyWords,
      isSearchFrom,
      hotKey,
    } = this.state;
    const style = {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      color: "#262626",
      display: "inline-flex",
      alignItems: "center",
    };
    return (
      <div className="top-common-search">
        <div className="category-title" onClick={this.callback}>
          <img
            src="https://ssl1.sephorastatic.cn/soa/mobile/images/top_back.png"
            alt=""
          />
        </div>
        <div className="category-input" onClick={this.handleClick}>
          <SearchOutlined
            size="0.4rem"
            color="#262626"
            style={{ margin: "0 0.1rem" }}
            onClick={this.searchForCoupon}
          />
          <div style={style}>
            {pageType === "couponSet" ? (
              <input
                autoComplete="off"
                defaultValue={keyWords}
                onClick={(e) => e.stopPropagation()}
                ref={this.searchInput}
              />
            ) : this.props.keywords || !!isSearchFrom || !!hotKey ? (
              <li>
                <span>{this.props.keywords || isSearchFrom || hotKey}</span>
                <em className="search-close" onClick={this.clickDelInput} />
              </li>
            ) : (
              <span>{searchPlaceholder ? searchPlaceholder.content : ""}</span>
            )}
          </div>
        </div>
        {isLogin ? (
          <UserOutlined
            size="0.6rem"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/myAccount";
                Sensor.go("clickBanner_App_Mob", {
                  action_id: "1000202_998",
                  page_id: "MB_1000202",
                  banner_type: "tag",
                  banner_content: "我的",
                  banner_current_url: window.location.href,
                  banner_current_page_type: "home",
                  banner_belong_area: "Bottom Navigation",
                  banner_to_url: "/myAccount",
                  banner_to_page_type: "我的:Function-page",
                  banner_ranking: "我的:5",
                  campaign_code: "",
                  key_word_tpye: "",
                  key_word_tpye_details: "",
                });
              }
            }}
          />
        ) : (
          <a
            href={`/login?historyLocation=${encodeURIComponent(
              window.location.pathname.replace("/", "").replace("?", "&")
            )}${window.location.search.replace("?", "&")}`}
            style={{ fontSize: "0.24rem" }}
          >
            登录
          </a>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  globalReference: state.globalReference,
  search: state.search,
});
export default connect(mapStateToProps, {
  getHotword,
})(PlpSearch);
