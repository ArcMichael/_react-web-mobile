import React, { Component } from "react";
import Sensor from "@/Utils/sensor";
import { urlGetParams } from "@/lib/url";

class QuickScreenHeadSon extends Component {
  constructor(props) {
    super(props);
  }

  tabChange(data) {
    let { QuickScreenTab, tabData, categorysort, products, pageType } = this.props;
    if (data.name === "仅看有货") {
      // 仅看有货不展开tab，直接跳转
      let hasInventory;
      if (data.items[0].checked === "0") {
        hasInventory = "1";
      } else {
        hasInventory = "0";
      }
      const pageTypes = {
        giftSet: "/gift_set.html?",
        hotWords: `/hot/?k=${products.hotWords || ""}&`,
        keyword: `/search/?k=${products.keyWords || ""}&`,
        couponSet: `/coupon_set.html?keyWords=${products.keyWords || ""}&`,
      };
      let page, url;
      page = pageTypes[pageType];
      url = `${page}hasInventory=${hasInventory}&currentPage=1&pageSize=20&sortField=${products &&
        products.sortField}&sortMode=${products && products.sortMode}&filters=${products &&
        products.filters}&minFilterPrice=${products && products.minFilterPrice}&maxFilterPrice=${products &&
        products.maxFilterPrice}`;
      if (pageType === "couponSet") {
        url += `&promotionIds=${products.promotionIds}&code=${
          urlGetParams(window.location, "code") ? urlGetParams(window.location, "code") : ""
        }`;
      }
      return (window.location.href = url);
    }
    if (tabData && tabData.name == data.name) {
      data = null;
      categorysort(0, "quickScreen");
    } else {
      categorysort(1, "quickScreen");
    }
    if (data) {
      Sensor.go("clickBanner_App_Mob", {
        $lib_detail: "M_LIST##tabChange##QuickScreenHeadSon.js##27",
        banner_type: "tab",
        banner_current_page_type: "List-page",
        banner_content: data.name,
        banner_belong_area:
          window && window.location && window.location.pathname.indexOf("gift_set") > 0 ? "Giftlist" : "Search_result",
        banner_to_url: null,
        banner_to_page_type: "List-page",
      });
    }
    QuickScreenTab(data);
  }

  render() {
    let { data, tabData } = this.props,
      tabClass = "quickscreen_hd_son",
      tabName = "",
      showEm = true;

    if (data && data.items) {
      data.items.some((el, ) => {
        if (el.checked == 1) {
          tabName += el.valueName + ",";
        }
      });
    }
    tabName = tabName.substring(0, tabName.length - 1);
    if (tabName) {
      tabClass += " filter";
    }
    if (tabData && tabData.name == data.name) {
      tabClass += " cur";
    }
    if (data.name === "仅看有货") {
      showEm = false;
    }
    return (
      <a className={tabClass} onClick={this.tabChange.bind(this, data)}>
        <em className={showEm ? "" : "none"} />
        <span className={showEm ? "" : "center"}>{tabName || data.name}</span>
      </a>
    );
  }
}

export default QuickScreenHeadSon;
