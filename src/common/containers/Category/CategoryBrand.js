import React, { Component } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import CategorySearch from "@/components/Category/CategorySearch";
import BottomMenus from "@/components/BottomMenus";
import Categoryproductmenu from "@/components/Category/Categoryproductmenu";
import Commontop from "@/components/CommonTop/index";
import BrandComponent from "@/components/BrandWall";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import isBrowser from "@/Utils/utils/isBrowser";
import CdnImage from "@/components/CdnImage";
import { TrackEnterResource } from "../../lib/Tools";
import { scrollTop } from "../../actions/view";
import AnimationFrame from "../../Utils/animationFrame";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/index.scss");
  require("../../../public/style/category.scss");
}
let timestamp;
class CategoryBrand extends Component {
  constructor(props) {
    super(props);
    this.scrollmenu = this.scrollmenu.bind(this);
    this.scrollmenuEnd = this.scrollmenuEnd.bind(this);
    this.scrollmenuStart = this.scrollmenuStart.bind(this);
    this.scrollcur = this.scrollcur.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.state = {
      name: null,
      dataOffset: [],
      curId: 0,
      banners: null,
      selectletter: "",
    };
  }
  componentDidMount() {
    const { name, dataOffset, banners, startX, endX } = this.state; // TODO: 请移除无用state
    console.log(name, dataOffset, banners, startX, endX);
    TrackEnterResource();
    bodyScrollTop.set(0);
    const oDiv = document.getElementsByClassName("brand_menu")[0]; // 字母表
    oDiv &&
      oDiv.addEventListener("touchmove", this.scrollmenu, {
        passive: false,
        bubble: false,
      });
    oDiv && oDiv.addEventListener("touchend", this.scrollmenuEnd);
    oDiv &&
      oDiv.addEventListener("touchstart", this.scrollmenuStart, {
        passive: false,
        bubble: false,
      });

    let topHeight =
      document.getElementsByClassName("top-common-search")[0].clientHeight;
    window.addEventListener("scroll", () => this.scrollcur(topHeight), {
      passive: false,
      bubble: false,
    });
    const objclient = document.getElementsByClassName("brand_List"); // 品牌类
    const menuList = document.getElementsByClassName("brand_menu_list"); //字母表
    const dataoffset = [];
    for (let i = 0; i < objclient.length; i++) {
      dataoffset.push({
        name: "brandwall_sort_" + i,
        labname: "brandwall_" + i,
        clientYtop: objclient[i].getBoundingClientRect().top - topHeight,
        clientYbot: objclient[i].getBoundingClientRect().bottom - topHeight,
        menuListTop: menuList[i].getBoundingClientRect().top,
        menuListbottom: menuList[i].getBoundingClientRect().bottom,
      });
    }
    if (!this.state.dataoffset) {
      this.setState({
        dataoffset: dataoffset,
      });
    }
  }
  // componentWillUnmount() {
  //   const oDiv = document.getElementsByClassName("brand_menu")[0];
  //   oDiv.removeEventListener("touchmove");
  //   window.removeEventListener("scroll");
  // }
  scrollmenu(event) {
    event.preventDefault();
    event.stopPropagation();
    const animationFrame = new AnimationFrame();
    const { dataoffset } = this.state;
    const { BrandAll } = this.props;
    const e = event;
    let now = new Date().getTime();
    if (now - timestamp < 50) {
      return;
    }
    timestamp = now;
    // 无意触发
    if (e.touches.length > 1) {
      return;
    }
    animationFrame.callRequestAnimationFrame(() => {
      for (let a = 0; a < dataoffset.length; a++) {
        if (
          e.touches[0].clientY > dataoffset[a].menuListTop &&
          e.touches[0].clientY < dataoffset[a].menuListbottom
        ) {
          if (this.state.curId == a) {
            break;
          }
          this.setState({
            curId: a,
            showLetter: true,
            selectletter: a >= 1 ? BrandAll[a - 1].brandTitle : "",
          });
          let scrollHeight = document.documentElement.scrollHeight;
          let clientHeight = document.documentElement.clientHeight;
          if (scrollHeight - bodyScrollTop.get() - clientHeight < 100) {
            // 当前已在底部,滚动高度超过页面时阻止滚动，兼容ios
            if (scrollHeight - dataoffset[a].clientYtop - clientHeight < 100) {
              return;
            }
          }
          bodyScrollTop.set(dataoffset[a].clientYtop);
          break;
        }
      }
    });
  }

  scrollmenuEnd(event) {
    event.stopPropagation();
    let opcityNum = 1;
    setInterval(function () {
      opcityNum -= 0.1;
      if (opcityNum > 0) {
        $(".category-brand-selected").css({ opacity: opcityNum });
      } else {
        clearInterval();
      }
    }, 50);
  }
  scrollmenuStart(event) {
    $(".category-brand-selected").css({ opacity: 1 });
    timestamp = new Date().getTime();
    event.stopPropagation();
    const { dataoffset, selectletter } = this.state;
    const { BrandAll } = this.props;
    const e = event;
    const animationFrame = new AnimationFrame();
    animationFrame.callRequestAnimationFrame(() => {
      for (let a = 0; a < dataoffset.length; a++) {
        if (
          e.touches[0].clientY >= dataoffset[a].menuListTop &&
          e.touches[0].clientY <= dataoffset[a].menuListbottom
        ) {
          let state = {
            showLetter: true,
          };
          if (a >= 1 && selectletter !== BrandAll[a - 1].brandTitle) {
            state.selectletter = BrandAll[a - 1].brandTitle;
          }
          this.setState(state);
          let scrollHeight = document.documentElement.scrollHeight;
          let clientHeight = document.documentElement.clientHeight;
          if (scrollHeight - bodyScrollTop.get() - clientHeight < 100) {
            // 当前已在底部,滚动高度超过页面时阻止滚动，兼容ios
            if (scrollHeight - dataoffset[a].clientYtop - clientHeight < 100) {
              return;
            }
          }
          bodyScrollTop.set(dataoffset[a].clientYtop + 1);
        }
      }
    });
  }
  scrollcur(topHeight) {
    const { dataoffset } = this.state;
    const { BrandAll } = this.props;
    if (dataoffset && dataoffset.length > 0) {
      for (let a = 0; a < dataoffset.length; a++) {
        if (
          bodyScrollTop.get() + topHeight >= dataoffset[a].clientYtop &&
          bodyScrollTop.get() + topHeight <= dataoffset[a].clientYbot
        ) {
          this.setState({
            curId: a,
            selectletter: a >= 1 ? BrandAll[a - 1].brandTitle : "",
          });
        }
      }
    }
  }
  Scorll(i) {
    this.setState({
      curId: i,
    });
  }
  touchStart(e) {
    e.preventDefault();
    let touch = e.touches[0]; //获取第一个触点
    let loadnext = false;
    let loadPre = false;

    //记录触点初始位置
    if (this.isBottom() && this.state.bottomText) {
      loadnext = true;
    }
    if (this.isTop() && this.state.topText) {
      loadPre = true;
    }
    this.setState({
      startX: touch.pageX, // 页面触点X坐标
      startY: touch.pageY, // 页面触点Y坐标
      loadnext,
      loadPre,
    });
  }
  touchMove(e) {
    e.preventDefault();
    let touch = e.touches[0]; //获取第一个触点
    //记录触点初始位置
    this.setState({
      endX: touch.pageX, //页面触点X坐标
      endY: touch.pageY, //页面触点Y坐标
    });
  }
  touchEnd() {
    let { CategoryConfigConts, CategoryConts } = this.props;

    if (
      Math.abs(this.state.endY) < Math.abs(this.state.startY) &&
      this.state.loadnext
    ) {
      window.location.href = "/v2/html/categoryrecommend";
    } else if (
      Math.abs(this.state.endY - this.state.startY) > 0 &&
      this.isBottom()
    ) {
      this.setState({
        bottomText: `上拉进入 ${
          CategoryConfigConts &&
          CategoryConfigConts.results &&
          CategoryConfigConts.results.groups &&
          CategoryConfigConts.results.groups[0].name
        }`,
        showBottomText: true,
      });
    }
    if (
      Math.abs(this.state.endY) > Math.abs(this.state.startY) &&
      this.state.loadPre
    ) {
      let results = CategoryConts.results;
      if (this.state.showTopText) {
        window.location.href = `/category/${results[results.length - 1].id}/`;
      }
    } else if (
      Math.abs(this.state.startY - this.state.endY) > 30 &&
      this.isTop()
    ) {
      let results = CategoryConts.results;
      this.setState({
        topText: `下拉进入 ${results[results.length - 1].nameCN}`,
        showTopText: true,
      });
    }
  }
  isBottom() {
    let { clientHeight, scrollTop } = this.props;
    let _scrollTop = scrollTop(bodyScrollTop.get()).SCROLL_TOP;
    const scrollHeight = this.contentNode.scrollHeight;
    const isBottom = clientHeight + _scrollTop > scrollHeight + 120;
    return isBottom;
  }
  isTop() {
    const { scrollTop } = this.props;
    const _scrollTop = scrollTop(bodyScrollTop.get()).SCROLL_TOP;
    const isTop = _scrollTop <= 0;
    return isTop;
  }
  render() {
    let { CategoryConts, BrandAll, HotBrandAllcon } = this.props;
    const {
      dataoffset,
      curId,
      selectletter,
      showLetter,
      bottomText,
      showBottomText,
      showTopText,
      topText,
    } = this.state;
    if (CategoryConts && CategoryConts.results) {
      CategoryConts.results.map((v) => (v.checked = false));
    }
    return (
      <div className="category">
        <Commontop />
        <CategorySearch
          pageType="Navigation-page"
          typed="searchlist"
          key="1"
          proClass="fixModel"
        />
        <Categoryproductmenu />
        <div className="category_product">
          {BrandAll.length > 0 && HotBrandAllcon.length > 0 && (
            <div
              className="category_product_exhibition"
              ref={(node) => (this.contentNode = node)}
              onTouchStart={this.touchStart}
              onTouchMove={this.touchMove}
              onTouchEnd={this.touchEnd}
              onTouchCancel={this.touchEnd}
            >
              {showTopText && (
                <div className="bottom-text top-btn">
                  <CdnImage src="/soa/nmobile/img/top_brace_icon.png" />
                  {topText}
                </div>
              )}
              <BrandComponent
                {...this.props}
                Scorll={(i) => this.Scorll(i)}
                dataoffset={dataoffset}
                curId={curId}
              />
              {showLetter && (
                <div
                  style={{ top: `${(27 * curId + 320) / 100}rem` }}
                  className="category-brand-selected"
                >
                  {curId > 0 ? (
                    selectletter
                  ) : (
                    <CdnImage src="/soa/nmobile/img/magnifier_iconhot.png" />
                  )}
                </div>
              )}
              {showBottomText && (
                <div className="bottom-text">
                  <CdnImage src="/soa/nmobile/img/top_brace_icon.png" />
                  {bottomText}
                </div>
              )}
            </div>
          )}
        </div>

        <BottomMenus disableToTop />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    CategoryConts: state.CategoryConts,
    CategoryConfigConts: state.CategoryConfigConts,
    BrandAll: (state.BrandAll && state.BrandAll.results) || [],
    HotBrandAllcon:
      (state.HotBrandAllcon && state.HotBrandAllcon.results) || [],
    clientHeight: state.view.CLIENT_HEIGHT,
  };
};

export default connect(mapStateToProps, {
  scrollTop,
})(CategoryBrand);
