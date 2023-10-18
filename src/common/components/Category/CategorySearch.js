import React, { Component } from "react";
import { connect } from "react-redux";
import { getHotword } from "@/actions/search";
import settings from "@/containers/HomeB/settings";
import * as device from "@/lib/device";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import Sensor from "@/Utils/sensor";
class CategorySearch extends Component {
  constructor(props) {
    super(props);
    this.state = { searchPlaceholder: null };
    this.getKeywords = this.getKeywords.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.clearPlaceholderAnimation = this.clearPlaceholderAnimation.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }
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
    const { minihead, isLogin } = this.state; // TODO: 请移除无用state summer
    console.log(minihead, isLogin);
    this.worker = CategorySearch.CreateWorker();
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

  componentWillUnmount() {
    this.clearPlaceholderAnimation();
    if (this.worker) {
      this.worker.terminate();
    }
    window.removeEventListener("scroll", this.handleScroll);
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
    // let categoryNum=window.location.pathname.replace(/[^0-9]/gi, "")
    // console.log(window.location.pathname);
    //  sessionStorage.setItem("rout",window.location.pathname)
    Sensor.go("clickBanner_App_Mob", {
      action_id: "1000201_987",
      page_id: "MB_1000201",
      banner_content: "点击搜索框",
      banner_type: "search"
    });
    window.location.href = `/v2/html/search_revamp?searchPlaceholder=${searchPlaceholder.content}`;
  }
  render() {
    let { topModuleScroll, _scrollTop, _source } = this.props;
    const { searchPlaceholder } = this.state;
    let fixModel = this.props.proClass
      ? this.props.proClass + " top-common-search"
      : " top-common-search";
    const style = {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      color: "#262626",
    };
    if (_source && _source == "vaproductlist" && !device.isApp()) {
      return (
        <div
          className={fixModel}
          id="searchTop"
          ref="topComponent"
          style={{
            top: "0px",
            position: _scrollTop && _scrollTop > 0 ? "fixed" : "absolute",
          }}
        >
          <div className="category-title">分类</div>
          <div className="category-input">
            <span className="icon-search" />
            <div style={style}>
              <span>{searchPlaceholder ? searchPlaceholder.content : ""}</span>
            </div>
          </div>
          <div className="category-cancel">取消</div>
        </div>
      );
    }
    return (
      <div
        className={fixModel}
        id="searchTop"
        ref="topComponent"
        style={{
          top: "0px",
          position: topModuleScroll
            ? "fixed"
            : _source && _source == "vaproductlist"
              ? "absolute"
              : "fixed",
        }}
      >
        <div className="category-title">分类</div>
        <div className="category-input" onClick={this.handleClick}>
          <span className="icon-search" />
          <div style={style}>
            <span>{searchPlaceholder ? searchPlaceholder.content : ""}</span>
          </div>
        </div>
        <div
          className="category-cancel"
          onClick={() => {
            window.location.href = "/";
            Sensor.go("$WebClick", {
              action_id: "1000201_993",
              page_id: "MB_1000201",
              $element_content: "取消"
            });
          }}
        >
          取消
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  category: state.categoryOne,
  CategoryListconts: state.CategoryListconts,
  Giftsetcon: state.Giftsetcon,
  Exclusiveoffercon: state.Exclusiveoffercon,
  globalReference: state.globalReference,
  search: state.search,
});
export default connect(mapStateToProps, {
  getHotword,
})(CategorySearch);
