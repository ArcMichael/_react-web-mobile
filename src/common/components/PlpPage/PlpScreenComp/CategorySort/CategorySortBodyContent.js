import React, { Component } from "react";
import browserHistory from "@/store/browserHistory";
import { urlGetParams } from "@/lib/url";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import { judgeTypeOfPlp } from "@/lib/Tools";
import Sensor from "@/Utils/sensor";

class CategorySortBodyContent extends Component {
  constructor(props) {
    super(props);
    this.sortUrl = this.sortUrl.bind(this);
    this.jumpHandle = this.jumpHandle.bind(this);
    this.state = {
      currenturl: null,
      pageType: "",
      promotionIds: "", // 优惠券页面参数
      code: "", // 优惠券页面参数
      keyWords: "", // 搜索关键字
      dataString: "",
    };
  }

  componentDidMount() {
    let { products } = this.props,
      data = window && window.location.search && window.location.search.split("&"),
      dataString = "&brand";
    if (products && products.filters) {
      //没有筛选值时 品牌快捷筛选一直显示 如果有不是在外部选中则不显示
      dataString = data[data.length - 1] !== "brand" ? "" : "&brand";
    }
    this.setState({
      currenturl: browserHistory.getCurrentLocation().pathname,
      promotionIds: urlGetParams(window.location, "promotionIds"),
      code: urlGetParams(window.location, "code"),
      keyWords: urlGetParams(window.location, "keyWords") ? urlGetParams(window.location, "keyWords") : "",
      pageType: judgeTypeOfPlp(),
      dataString,
    });
  }

  jumpHandle() {
    const {
      pageType,
      promotionIds, // 优惠券页面参数
      code, // 优惠券页面参数
      keyWords, // 搜索关键字
      currenturl,
      dataString,
    } = this.state;
    const { products, obj } = this.props;
    let sortField = obj.id,
      sortMode = "desc",
      eventName;
    let eventNameMap = ["", "综合排序", "", "按新品排序", "按人气排序"];
    eventName = eventNameMap[obj.id];

    // 埋点
    let buttonPositionMap = {
      "Category List": ["category", "giftSet", "couponSet", "exclusive"],
      "Search List": ["search", "hot"],
      "Brand List": ["brand"],
    };
    let buttonPosition = Object.keys(buttonPositionMap).find(item =>
      buttonPositionMap[item].find(page => page === pageType),
    );
    let id;

    const { thirdCategoryId, secondCategoryId, rootCategoryId, currentBrand } = products;
    if (eventName) {
      GoogleAnalytics.pushV2({
        event: "sort",
        sortCategory: "综合",
        sortSubCategory: eventName,
      });
      id = thirdCategoryId
        ? `${thirdCategoryId}-${secondCategoryId}-${rootCategoryId}`
        : secondCategoryId
          ? `${secondCategoryId}-${rootCategoryId}`
          : rootCategoryId;

      GoogleAnalytics.push({
        buttonPosition: buttonPosition,
        eventName: eventName,
        event: "ButtonClick",
      });
    }

    let hasInventory = products.hasInventory;
    let filters = products.filters;
    let pageSize = products.pageSize;
    let minFilterPrice = products.minFilterPrice;
    let maxFilterPrice = products.maxFilterPrice;
    let paramMap = {
      // 各个页面参数的关系对象
      category: {
        hasInventory,
        pageSize: "20",
        sortField,
        sortMode,
        minFilterPrice,
        maxFilterPrice,
        dataString,
      },
      search: {
        k: products.keyWords,
        hasInventory,
        currentPage: "1",
        pageSize,
        sortField,
        sortMode,
        filters,
        minFilterPrice,
        maxFilterPrice,
      },
      hot: {
        k: products.hotWords,
        hasInventory,
        currentPage: "1",
        pageSize,
        sortField,
        sortMode,
        filters,
        minFilterPrice,
        maxFilterPrice,
      },
      brand: {
        hasInventory,
        pageSize,
        sortField,
        sortMode,
        minFilterPrice,
        maxFilterPrice,
      },
      giftSet: {
        hasInventory,
        currentPage: "1",
        pageSize: "20",
        sortField,
        sortMode,
        filters,
        minFilterPrice,
        maxFilterPrice,
      },
      couponSet: {
        hasInventory,
        currentPage: "1",
        pageSize: "20",
        sortField,
        sortMode,
        filters,
        promotionIds,
        code,
        keyWords,
        minFilterPrice,
        maxFilterPrice,
      },
      exclusive: {
        hasInventory,
        currentPage: "1",
        pageSize: "20",
        sortField,
        sortMode,
        filters,
        inset: "true",
        minFilterPrice,
        maxFilterPrice,
      },
      purchaserecordcon: {
        hasInventory,
        currentPage: "1",
        pageSize: "20",
        sortField,
        sortMode,
        filters,
        inset: "true",
        minFilterPrice,
        maxFilterPrice,
      },
    };
    let search = Object.keys(paramMap[pageType])
      .map(item => {
        return item + "=" + paramMap[pageType][item];
      })
      .join("&");
    let action_id;
    switch (eventName) {
      case "综合排序":
        action_id = "1000202_001"
        break;
      case "按新品排序":
        action_id = "1000202_001"
        break;
      case "按人气排序":
        action_id = "1000202_001"
        break;
      case "销量":
        action_id = "1000202_005"
        break;
      case "价格":
        action_id = "1000202_006"
        break;
      case "筛选":
        action_id = "1000202_007"
        break;
      default:
        break;
    }

    Sensor.go("ListClick", {
      button_name: eventName,
      categoryId: id,
      brand_cn: currentBrand && currentBrand.brandNameCN,
      brand_id: currentBrand && currentBrand.brandId,
      key_words: keyWords,
      action_id,
      page_id: "MB_1000202",
      $element_target_url: `${currenturl} + "?" + ${search}`
    });

    window.location.href = currenturl + "?" + search;
  }

  sortUrl() {
    let { sort, categorysort } = this.props;
    if (sort) {
      categorysort(0, "sort");
    }
    this.jumpHandle();
  }

  render() {
    let { obj, products } = this.props;
    let classDown = "category_down";
    if (products) {
      if (products.sortField == obj.id) {
        classDown = "category_down cur";
      }
    }

    return (
      <a href="javascript:;" onClick={this.sortUrl} className={classDown}>
        <span>{obj.name}</span>
        <em />
      </a>
    );
  }
}

export default CategorySortBodyContent;
