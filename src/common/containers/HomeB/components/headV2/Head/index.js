import React, { Component } from "react";
import { connect } from "react-redux";
import LazyloadImage from "@/components/LazyloadImage";
import Utils from "@/lib/utils";
import { getHotword } from "@/actions/search";
import Sensor from "@/Utils/sensor/index";
import settings from "@/containers/HomeB/settings";
import { UserOutlined, SearchOutlined } from "@/components/Icons";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
class Head extends Component {
  constructor(props) {
    super(props);
    this.getKeywords = this.getKeywords.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.clearPlaceholderAnimation = this.clearPlaceholderAnimation.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.state = {
      /** @type {import('@/actions/search').ResourceItem} - description */
      searchPlaceholder: null,
      /** @type {string[]} - description */
      keywords: [],
      isLogin:
        this.props.globalReference &&
        this.props.globalReference.USER_USERCARDINFO,
    };
  }
  /** @type {SearchModal} - description */
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
    const { isLogin, keywords, minihead } = this.state;
    console.log(isLogin, keywords, minihead); // TODO: 请移除无用state
    this.worker = Head.CreateWorker();
    this.worker.onmessage = (e) => {
      if (e.data) {
        this.setState({
          searchPlaceholder: e.data,
        });
      }
    };
    window.addEventListener("scroll", this.handleScroll);
    this.props.getHotword();
  }

  /**
   * @param {Event} e
   */
  handleScroll() {
    const scrollTop = bodyScrollTop.get();

    if (scrollTop >= settings.showMimiHeadTop) {
      this.setState({
        minihead: true,
      });
    } else {
      this.setState({
        minihead: false,
      });
    }
  }

  componentWillUnmount() {
    this.clearPlaceholderAnimation();
    if (this.worker) {
      this.worker.terminate();
    }
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   *
   * @param {SearchProps} nextProps
   */
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

  /**
   * @param {SearchProps['search']['GETHOTSEARCHWORD']} GETHOTSEARCHWORD
   */
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
    const { searchPlaceholder } = this.state;
    // sessionStorage.removeItem("categoryNum")
    // sessionStorage.setItem("rout",window.location.pathname)
   window.location.href = `/v2/html/search_revamp?searchPlaceholder=${searchPlaceholder.content} `;
    // let TabList;
    const {  globalReference } = this.props;
    // if (homepage) {
    //   TabList = homepage.TabList;
    // }
    // let pathname = window.location.pathname;
    // const selectedTab = TabList && TabList.find(item => {
    //   return pathname.includes(item.id) || TabList[0]
    // })
     const { USER_USERCARDINFO } = globalReference;
 
 
    Sensor.go("clickBanner_App_Mob", {
      platform_type: "mobile",
      system_type: "",
      environment_type: "",
      vip_card: "",
      vip_card_type: "",
      action_id: "1000001_987",
      page_id: "MB_1000001",
      $title: "首页",
      page_type_detail: "",
      page_type: "",
      $url_path: "",
      $url_query: "",
      $url: "",
      current_url: "",
      banner_type:"search",
      banner_content: "点击搜索框",
      banner_belong_area: "Searchbar",
      banner_to_page_type: "Function-page",
      // $element_position: selectedTab && selectedTab.name,
      banner_current_page_type: "home",
      cardNo: USER_USERCARDINFO.cardNo,
    });
  }
  onLogin() {
    console.log(111);
    window.location.href = `/login?historyLocation=${encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : "/"
    )}`;

    //去登陆埋点
    // let TabList;
    // const { homepage } = this.props;
    // if (homepage) {
    //   TabList = homepage.TabList;
    // }
    // let pathname = window.location.pathname;
    // const selectedTab = TabList && TabList.find(item => {
    //   return pathname.includes(item.id) || TabList[0]
    // })


    Sensor.go("clickBanner_App_Mob", {
      platform_type: "mobile",
      system_type: "",
      environment_type: "",
      vip_card: "",
      vip_card_type: "",
      page_id: "MB_1000001",
      action_id: "1000001_024",
      $title: "首页",
      page_type_detail: "",
      page_type: "",
      $url_path: "",
      $url_query: "",
      $url: "",
      current_url: "",

      title: "首页",
      banner_content: "登录",
      banner_current_url: "home",
      banner_current_page_type: "home",
      banner_to_url: "/login",
      banner_to_page_type: "Funtion_page",
      //$element_position: selectedTab && selectedTab.name,
    });
  }

  render() {
    const {
      globalReference,
      style,
      isLogin,
      minihead,
      animate,
      getHotword,
      ...restProps
    } = this.props;
    const staticUrl = Utils.getEnv("static");
    const logoHeight = 0.3;
    const logoWidth = (244 / 34) * logoHeight;
    const { searchPlaceholder } = this.state;

    /** @type {React.CSSProperties} - description */
    const minisyle = {
      // width: "5.44rem",
      height: "0.64rem",
      background: "#F2F2F2",
      // "boxShadow": "0rem 0.1rem 0.2rem 0rem rgba(0, 0, 0, 0.2)",
      borderRadius: "0.16rem",
    };
    const miniStyle = {
      width: "1.28rem",
      height: "0.64rem",
    };

    let classNameLogoCenter = "logo-center";
    let classNameSearchWrap = "search-wrap";

    if (animate === true) {
      classNameLogoCenter = "logo-center fadenumclass";
      classNameSearchWrap = "search-wrap InputWidth";
    } else if (animate === false) {
      classNameLogoCenter = "logo-center fadenumRevert";
      classNameSearchWrap = "search-wrap InputWidthRevert";
    }
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            overflow: "hidden",
            transition: "all 0.2s",
            ...style,
          }}
          {...restProps}
        >
          <div className={"logo"} style={{ height: "0.6rem", width: "0.6rem" }}>
            <LazyloadImage
              imgProps={{
                alt: "sephora",
                src: `${staticUrl}/soa/nmobile/img/spm-5033/logo-mini.png`,
                style: {
                  height: "100%",
                  width: "100%",
                },
              }}
            />
          </div>

          <span
            className={classNameLogoCenter}
            style={{
              fontSize: "0.6rem",
              width: `${logoWidth}rem`,
              height: `${logoHeight}rem`,
            }}
          >
            <LazyloadImage
              imgProps={{
                alt: "sephora-logo",
                src: `${staticUrl}/soa/nmobile/img/spm-5033/SEPHORA-2x.png`,
                style: {
                  height: "100%",
                  width: "100%",
                },
              }}
              shape="horizontal-rect"
            />
          </span>
          {isLogin ? (
            <UserOutlined
              size="0.6rem"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/myAccount";
                }
              }}
            />
          ) : (
            <a onClick={this.onLogin} style={{ fontSize: "0.24rem" }}>
              登录
            </a>
          )}
        </div>

        <div className={classNameSearchWrap}>
          <div
            className="left"
            style={minihead ? minisyle : null}
            onClick={this.handleClick}
          >
            <SearchOutlined
              size="0.4rem"
              color="#262626"
              style={{ margin: "0 0.1rem" }}
            />
            <span className="placeholder">
              {searchPlaceholder ? searchPlaceholder.content : ""}
            </span>
            <span className="search-text" style={minihead ? miniStyle : null}>
              搜索
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (s) => {
  const { globalReference, search, homepage } = s;
  return { globalReference, search, homepage };
};

export default connect(mapStateToProps, {
  getHotword,
})(Head);
