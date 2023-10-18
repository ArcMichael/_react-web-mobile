import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CategorySearch from "@/components/Category/CategorySearch";
import BottomMenus from "@/components/BottomMenus";
import Categoryproductmenu from "@/components/Category/Categoryproductmenu";
import Commontop from "@/components/CommonTop/index";
import isBrowser from "@/Utils/utils/isBrowser";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import CdnImage from "@/components/CdnImage";
import { scrollTop } from "../../actions/view";
import * as actions from "../../actions/category";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/index.scss");
  require("../../../public/style/category.scss");
}
class CategoryIntelligent extends Component {
  constructor(props) {
    super(props);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.state = { banners: null };
  }
  componentDidMount() {
    const { startX, loadnext, endX } = this.state; // TODO: 请移除无用state
    console.log(startX, loadnext, endX);

    let { CategoryConfigConts } = this.props;
    let banners;
    if (
      CategoryConfigConts &&
      CategoryConfigConts.results &&
      CategoryConfigConts.results.groups &&
      CategoryConfigConts.results.groups.length > 0
    ) {
      CategoryConfigConts.results.groups.map((v) => {
        if (v.Url == window.location.pathname) {
          banners = (
            <div className="category-banner">
              {v.secondLevelDtos &&
                v.secondLevelDtos[0] &&
                v.secondLevelDtos[0].banners.length > 0 &&
                v.secondLevelDtos[0].banners.map((item, index) => {
                  return (
                    <a href={item.link} key={`banner_${index}`}>
                      <img src={item.imagePath} />
                    </a>
                  );
                })}
            </div>
          );
        }
      });
      this.setState({ banners });
    }
  }
  touchStart(e) {
    e.preventDefault();
    let touch = e.touches[0]; //获取第一个触点
    let loadnext = false;
    let loadPre = false;

    //记录触点初始位置
    if (this.state.bottomText) {
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
    if (
      Math.abs(this.state.endY) > Math.abs(this.state.startY) &&
      this.state.loadPre
    ) {
      if (this.state.showTopText) {
        window.location.href = `/v2/html/categoryrecommend`;
      }
    } else if (this.state.endY - this.state.startY > 30 && this.isTop()) {
      this.setState({
        topText: `下拉进入 推荐`,
        showTopText: true,
      });
    } else {
      this.setState({
        topText: ``,
        showTopText: false,
      });
    }
  }
  isTop() {
    const { scrollTop } = this.props;
    const _scrollTop = scrollTop(bodyScrollTop.get()).SCROLL_TOP;
    const isTop = _scrollTop <= 0;
    return isTop;
  }

  render() {
    const { banners, showTopText, topText } = this.state;
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
          <div
            className="category_product_exhibition"
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
            {banners}
          </div>
        </div>

        <BottomMenus />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    CategoryConfigConts: state.CategoryConfigConts,
  }),
  (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    scrollTop: bindActionCreators(scrollTop, dispatch),
  })
)(CategoryIntelligent);
