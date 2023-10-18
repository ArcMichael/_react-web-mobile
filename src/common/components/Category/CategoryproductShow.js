/**
 * Created by ZHAN561 on 2017/4/20.
 */

import React, { Component } from "react";
import CategoryProducts from "./CategoryProducts";
import Sensor from "../../Utils/sensor";
import getConfigs from "../../../isomorphisms/getConfigs";

const configs = getConfigs();

class CategoryproductShow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.hrefClick.bind(this);
  }

  hrefClick(href, content, _index) {
    // 神策 -- 广告运营位
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_Category##hrefClick##CategoryproductShow.js##23",
      banner_type: "tag",
      banner_content: content,
      banner_current_page_type: "Navigation-page",
      banner_belong_area: "Navigation",
      banner_to_url: href,
      banner_to_page_type: "List-page",
      banner_ranking: `2-${_index}`,
      belong_team: "Operation",
      page_id: "MB_1000201",
      action_id: "1000201_002",
      $element_position: "一级分类|二级分类",
      postion: _index + 1,
    });
  }

  render() {
    const { obj, Id, _index } = this.props;
    let hrefs = "";
    let productCont = [];
    if (obj.childCategories) {
      if (obj.childCategories.length == 0) {
        return false;
      }
      productCont = obj.childCategories.map((el, index) => {
        return <CategoryProducts key={index} Id={Id} leveid={obj.id} obj={el} _index={index} secLevelObj={obj} />;
      });
    }
    if (configs.abtest) {
      hrefs = configs.abtest;
    }
    hrefs += `/category/${obj.id}-${Id}/page1/`;
    return (
      <div className="category_productCont_menu">
        <a
          href={hrefs}
          className="product_head"
          onClick={this.hrefClick.bind(this, hrefs, obj.nameCN, _index)}
        >
          <span>{obj.nameCN}</span>
          <em />
        </a>
        <ul className="category_products">{productCont}</ul>
      </div>
    );
  }
}

export default CategoryproductShow;
