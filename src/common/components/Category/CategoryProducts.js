import React, { Component } from "react";
import Image from "@/components/ImagesLazyLoad/index";
import getConfigs from "../../../isomorphisms/getConfigs";
import Sensor from "../../Utils/sensor";

const configs = getConfigs();
class CategoryProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  hrefClick(href, content, _index) {
    // 神策 -- 广告运营位
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_Category##hrefClick##CategoryProducts.js##22",
      banner_type: "product",
      banner_content: content,
      banner_current_page_type: "Navigation-page",
      banner_belong_area: "Navigation",
      banner_to_url: href,
      banner_to_page_type: "List-page",
      banner_ranking: `3-${_index + 1}`,
      belong_team: "Operation",
      action_id: "1000201_003",
      page_id: "MB_1000201",
      $element_position: "一级分类|二级分类|三级分类",
      postion: _index + 1,
    });
  }

  render() {
    let { obj, leveid, Id, _index } = this.props,
      hrefs = "";
    if (configs.abtest) {
      hrefs = configs.abtest;
    }
    hrefs += `/category/${obj.id}-${leveid}-${Id}/page1/`;
    const Imgurl = obj.imagePath ? `${obj.imagePath}150x150.jpg` : "";
    return (
      <li>
        <a
          href={hrefs}
          className="category_Productcon"
          onClick={this.hrefClick.bind(this, hrefs, obj.nameCN, _index)}
        >
          <Image title={obj.nameCN} src={Imgurl} offset={0} />
          <p>{obj.nameCN}</p>
        </a>
      </li>
    );
  }
}

export default CategoryProducts;
