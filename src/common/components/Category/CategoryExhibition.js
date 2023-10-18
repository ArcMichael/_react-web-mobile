/*
 * @Author: summer
 * @Date: 2021-06-Th 02:31:23
 * @Last Modified by:   summer
 * @Last Modified time: 2021-06-Th 02:31:23
 * 分类右侧内容
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import { categoryImg } from "../../actions/category";
import { CheckCampaignCode } from "../../lib/Tools";
import CategoryproductShow from "./CategoryproductShow";
import Sensor from "../../Utils/sensor";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";
import DataLink from "../Atoms/DataLink";
import { scrollTop } from "../../actions/view";
import CdnImage from "../CdnImage";
class CategoryExhibition extends Component {
  constructor(props) {
    super(props);
    this.addbanner = this.addbanner.bind(this);
    this.bannerUrl = this.bannerUrl.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.state = {};
  }

  componentDidMount() {
    // const { startX, endX } = this.state; // TODO: 请移除无用state
    // console.log(startX, endX);
    let currenturl = this.props.location.pathname;
    currenturl = currenturl.split("/")[2];
    bodyScrollTop.set(0);
    const body = {
      head: {
        token: "string",
        userId: "string",
      },
      queryBody: {
        locationLabel: `MOBILE:CATEGORYPAGE:LEVEL1:${currenturl}`,
        memberGroupId: 0,
      },
    };
    this.props.categoryImg(body, this.addbanner);
  }

  touchStart(e) {
    e.preventDefault();
    let touch = e.touches[0]; //获取第一个触点
    let loadnext = false;
    let loadPre = false;
    // 记录触点初始位置
    if (this.isBottom() && this.state.bottomText) {
      loadnext = true;
    }
    if (this.isTop() && this.state.topText) {
      loadPre = true;
    }
    this.setState({
      // startX: touch.pageX, // 页面触点X坐标
      startY: touch.pageY, // 页面触点Y坐标
      loadnext,
      loadPre,
    });
  }

  touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0]; // 获取第一个触点
    // 记录触点初始位置
    this.setState({
      // endX: touch.pageX, // 页面触点X坐标
      endY: touch.pageY, // 页面触点Y坐标
    });
  }

  touchEnd() {
    const { CategoryConts } = this.props;
    const { showTopText } = this.state;
    // 清除文字
    if (!this.isTop() && showTopText) {
      this.setState({
        topText: ``,
        showTopText: false,
      });
    }

    if (
      Math.abs(this.state.endY) < Math.abs(this.state.startY) &&
      this.state.loadnext
    ) {
      CategoryConts &&
        CategoryConts.results &&
        CategoryConts.results.map((item, index) => {
          if (
            item.id == window.location.pathname.replace(/[^0-9]/gi, "") &&
            this.state.showBottomText
          ) {
            if (index < CategoryConts.results.length - 1) {
              window.location.href = `/category/${CategoryConts.results[index + 1].id
                }/`;
            } else {
              window.location.href = "/v2/html/categorybrand";
            }
          }
        });
    } else if (
      Math.abs(this.state.endY - this.state.startY) > 0 &&
      this.isBottom()
    ) {
      CategoryConts &&
        CategoryConts.results &&
        CategoryConts.results.map((item, index) => {
          if (item.id == window.location.pathname.replace(/[^0-9]/gi, "")) {
            if (index < CategoryConts.results.length - 1) {
              this.setState({
                bottomText: `上拉进入 ${CategoryConts.results[index + 1].nameCN
                  }`,
                showBottomText: true,
              });
            } else {
              this.setState({
                bottomText: `上拉进入 品牌`,
                showBottomText: true,
              });
            }
          }
        });
    }
    if (
      Math.abs(this.state.endY) > Math.abs(this.state.startY) &&
      this.state.loadPre
    ) {
      CategoryConts &&
        CategoryConts.results &&
        CategoryConts.results.map((item, index) => {
          if (
            item.id == window.location.pathname.replace(/[^0-9]/gi, "") &&
            this.state.showTopText
          ) {
            if (index < CategoryConts.results.length && index !== 0) {
              window.location.href = `/category/${CategoryConts.results[index - 1].id
                }/`;
            }
          }
        });
    } else if (
      Math.abs(this.state.startY - this.state.endY) > 30 &&
      this.isTop()
    ) {
      CategoryConts &&
        CategoryConts.results &&
        CategoryConts.results.map((item, index) => {
          if (item.id == window.location.pathname.replace(/[^0-9]/gi, "")) {
            console.log(index, CategoryConts);
            if (index < CategoryConts.results.length && index !== 0) {
              this.setState({
                topText: `下拉进入 ${CategoryConts.results[index - 1].nameCN}`,
                showTopText: true,
              });
            }
          }
        });
    }
  }

  isBottom() {
    const { clientHeight, scrollTop } = this.props;
    const _scrollTop = scrollTop(bodyScrollTop.get()).SCROLL_TOP;
    const scrollHeight = this.contentNode.scrollHeight;
    // console.log(clientHeight + _scrollTop - scrollHeight);
    const isBottom = clientHeight + _scrollTop > scrollHeight + 85;
    // console.log("isBottom---", isBottom);
    return isBottom;
  }
  isTop() {
    const { scrollTop } = this.props;
    const _scrollTop = scrollTop(bodyScrollTop.get()).SCROLL_TOP;
    const isTop = _scrollTop <= 0;

    return isTop;
  }
  bannerUrl(Href, content) {
    const { name } = this.props;
    GoogleAnalytics.push({
      event: "promotionClick",
      ecommerce: {
        promoClick: {
          promotions: [
            {
              id: null,
              name,
              creative: "Banner",
              position: "Navigation List",
            },
          ],
        },
      },
      eventCallback() {
        /* document.location = promoObj.destinationUrl; */
      },
    });
    if (Href == "javascript:;") return;
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_Category##bannerUrl##CategoryExhibition.js##64",
      banner_type: "campaign",
      banner_content: content,
      banner_current_url: "Navigation-page",
      banner_belong_area: "Navigation",
      banner_to_url: Href,
      banner_to_page_type: Href,
      banner_ranking: "",
      belong_team: "Operation",
      campaign_code: Href,
    });
  }

  addbanner() {
    const { name } = this.props;
    GoogleAnalytics.push({
      ecommerce: {
        promoView: {
          promotions: [
            {
              id: null,
              name,
              creative: "banner",
              position: "Navigation List",
            },
          ],
        },
      },
    });
  }

  render() {
    const { CategoryConts, category, name } = this.props;
    const { bottomText, showBottomText, showTopText, topText } = this.state;
    let currentImg = "";
    let Href = "";
    let content = "";
    let omniture = "";
    let categoryintro = [];
    if (CategoryConts) {
      if (CategoryConts.results) {
        for (var i = 0; i < CategoryConts.results.length; i++) {
          if (CategoryConts.results[i].checked) {
            categoryintro = CategoryConts.results[i].childCategories.map(
              (el, index) => {
                return (
                  <CategoryproductShow
                    Id={CategoryConts.results[i].id}
                    key={index}
                    obj={el}
                    _index={index}
                    firstLevelObj={CategoryConts.results[i]}
                  />
                );
              }
            );
          }
        }
      }
    }
    if (
      category &&
      category.CATEGORYIMG &&
      category.CATEGORYIMG.results &&
      category.CATEGORYIMG.results.resourceList.length > 0
    ) {
      currentImg = category.CATEGORYIMG.results.resourceList[0].imagePath;
      Href = category.CATEGORYIMG.results.resourceList[0].link
        ? CheckCampaignCode(
          category.CATEGORYIMG.results.resourceList[0].link,
          category.CATEGORYIMG.results.resourceList[0].omniture
        )
        : "javascript:;";
      content = category.CATEGORYIMG.results.resourceList[0].content;
      omniture = category.CATEGORYIMG.results.resourceList[0].omniture;
    }
    return (
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
        {currentImg && (
          <div className="category_product_Img">
            <DataLink
              _Href={Href}
              _Omniture={omniture}
              _Sensor={{
                eventKey: "clickBanner_App_Mob",
                value: {
                  $lib_detail:
                    "M_Category##bannerUrl##CategoryExhibition.js##64",
                  banner_type: "campaign",
                  banner_content: content,
                  banner_current_url: "Navigation-page",
                  banner_belong_area: "Navigation",
                  banner_to_url: Href,
                  banner_to_page_type: Href,
                  banner_ranking: `1-${1}-4`,
                  belong_team: "Operation",
                  campaign_code: Href,
                  page_id: "MB_1000201",
                  action_id: "1000201_004",
                },
              }}
              _GA={{
                event: "promotionClick",
                ecommerce: {
                  promoClick: {
                    promotions: [
                      {
                        id: null,
                        name,
                        creative: "Banner",
                        position: "Navigation List",
                      },
                    ],
                  },
                },
                eventCallback() {
                  /* document.location = promoObj.destinationUrl; */
                },
              }}
              children={<img src={currentImg} />}
            />
          </div>
        )}

        {categoryintro}
        {showBottomText && (
          <div className="bottom-text">
            <CdnImage src="/soa/nmobile/img/top_brace_icon.png" />
            {bottomText}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  CategoryConts: state.CategoryConts,
  category: state.categoryOne,
  CategoryConfigConts: state.CategoryConfigConts,
  BrandAll: (state.BrandAll && state.BrandAll.results) || [],
  HotBrandAllcon: (state.HotBrandAllcon && state.HotBrandAllcon.results) || [],
  clientHeight: state.view.CLIENT_HEIGHT,
});
export default connect(mapStateToProps, {
  categoryImg,
  scrollTop,
})(withRouter(CategoryExhibition));
