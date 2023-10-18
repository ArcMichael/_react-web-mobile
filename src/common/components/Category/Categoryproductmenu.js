/*
 * @Author: summer
 * @Date: 2021-06-Th 02:30:44
 * @Last Modified by:   summer
 * @Last Modified time: 2021-06-Th 02:30:44
 * 左侧菜单
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions/category";
import * as actionBll from "../../lib/BLL";
import CategorymemuUrl from "./CategorymemuUrl";
import CategoryMenuList from "./CategoryMenuList";
import { typeofArray } from "../../Utils";
import Sensor from "../../Utils/sensor";

class Categoryproductmenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memu: [
        { name: "品牌", Url: "/v2/html/categorybrand" },
        // { name: "推荐", Url: "/v2/html/categoryrecommend" },
        // { name: "智能推荐", Url: "/v2/html/categoryintelligent" },
      ],
    };
    this.hrefClick = this.hrefClick.bind(this);
  }
  hrefClick(href, content, index) {
    //神策 -- 广告运营位
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_Category##hrefClick##Categoryproductmenu.js##26",
      banner_type: "tag",
      banner_current_page_type: "Navigation-page",
      banner_content: content,
      banner_belong_area: "Navigation",
      banner_to_url: href,
      banner_to_page_type: "List-page",
      banner_ranking: `1-${index + 1}`,
      belong_team: "Operation",
      postion: index + 1,
      action_id: "1000201_001",
      page_id: "MB_1000201",
      $element_position:"一级分类"
    });
  }
  componentDidMount() {
    let that = this;
    actionBll.advertTxt({ queryBody: { locationLabel: "MOBILE:CATEGORY:TOTLE_TEXT" } }, callback => {
      if (
        callback &&
        callback.results &&
        callback.results.resourceList &&
        typeofArray(callback.results.resourceList) &&
        callback.results.resourceList.length > 0 &&
        callback.results.resourceList[0].link
      ) {
        that.setState({
          memu: [{ name: "美力学院", Url: callback.results.resourceList[0].link }],
        });
      }
    });
    /*actions.getGroupCategory(body)*/
  }

  render() {
    let { CategoryConts, CategoryConfigConts } = this.props;
    let memuUrl = [];
    let memuList = [];
    let memuConfigList = [];
    let heightcon = "";
    if (this.state.memu && this.state.memu.length) {
      memuUrl = this.state.memu.map((el, index) => {
        return <CategorymemuUrl key={index} obj={el} _index={index} callback={this.hrefClick} />;
      });
      heightcon = Number(heightcon) + this.state.memu.length * 90;
    }

    if (CategoryConts) {
      if (CategoryConts.results && CategoryConts.results.length && CategoryConts.results instanceof Array) {
        memuList = CategoryConts.results.map((el, index) => {
          return <CategoryMenuList key={index} obj={el} _index={index} callback={this.hrefClick} />;
        });
        //heightcon=(this.state.memu.length+CategoryConts.results.length)*122+112+88;
        heightcon = Number(heightcon) + CategoryConts.results.length * 90;
      }
    }

    if (CategoryConfigConts) {
      //CategoryConfigConts 礼物套装--本周特惠
      if (
        CategoryConfigConts.results &&
        CategoryConfigConts.results.groups &&
        CategoryConfigConts.results.groups.length
      ) {
        memuConfigList = CategoryConfigConts.results.groups.map((el, index) => {
          el.name = el.title.content;
          el.name = String(el.name).substring(0, 4);
          if (el.title.link) el.Url = el.title.link;
          // if (el.name == "推荐") el.Url = "/v2/html/categoryrecommend";
          // if (el.name == "智能推荐") el.Url = "/v2/html/categoryintelligent";
          return <CategorymemuUrl key={index + 1} obj={el} _index={index + 1} callback={this.hrefClick} />;
        });
        heightcon = Number(heightcon) + CategoryConfigConts.results.groups.length * 90;
      }
    }

    heightcon = Number(heightcon) + 160 + 180;
    return (
      <div className="category_product_menu" >
        <div className="left_menu" >
          <div style={{ height: `${heightcon / 100}rem` }}>
            {memuList}
            {memuUrl}
            {memuConfigList}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    category: state.categoryOne,
    CategoryConts: state.CategoryConts,
    CategoryConfigConts: state.CategoryConfigConts,
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(Categoryproductmenu);
