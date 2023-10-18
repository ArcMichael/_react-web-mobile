import React, { Component } from "react";
import browserHistory from "@/store/browserHistory";
import { judgeTypeOfPlp } from "@/lib/Tools";
import { urlGetParams } from "@/lib/url";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import Sensor from "@/Utils/sensor";

class Categorysort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      pageType: "",
      promotionIds: "", // 优惠券页面参数
      code: "", // 优惠券页面参数
      keyWords: "", // 搜索关键字
      currenturl: "",
      dataString: "",
      minFilterPrice: "",
      maxFilterPrice: "",
    };
    this.sort = this.sort.bind(this);
    this.toogleSort = this.toogleSort.bind(this);
    this.showMore = this.showMore.bind(this);
    this.jumpHandle = this.jumpHandle.bind(this);
    this.openScreen = this.openScreen.bind(this);
  }

  componentDidMount() {
    const { showMore } = this.state; // TODO: 请移除无用state
    console.log(showMore);
    const { products } = this.props;
    let pageType = judgeTypeOfPlp(),
      promotionIds = urlGetParams(window.location, "promotionIds")
        ? urlGetParams(window.location, "promotionIds")
        : "",
      code = urlGetParams(window.location, "code")
        ? urlGetParams(window.location, "code")
        : "",
      keyWords = urlGetParams(window.location, "keyWords")
        ? urlGetParams(window.location, "keyWords")
        : "",
      currenturl = browserHistory.getCurrentLocation().pathname,
      data =
        window && window.location.search && window.location.search.split("&"),
      dataString = "&brand",
      minFilterPrice = urlGetParams(window.location, "minFilterPrice")
        ? urlGetParams(window.location, "minFilterPrice")
        : "",
      maxFilterPrice = urlGetParams(window.location, "maxFilterPrice")
        ? urlGetParams(window.location, "maxFilterPrice")
        : "";
    if (products && products.filters) {
      //没有筛选值时 品牌快捷筛选一直显示 如果有不是在外部选中则不显示
      dataString = data[data.length - 1] !== "brand" ? "" : "&brand";
    }
    this.setState({
      pageType,
      promotionIds,
      code,
      keyWords,
      currenturl,
      dataString,
      minFilterPrice,
      maxFilterPrice,
    });
  }

  toogleSort() {
    console.log('2222221111111111111');
    const { sort, categorysort } = this.props;

    if (sort) {
      categorysort(0, "sort", () => categorysort(0, "quickScreen"));
    } else {
      categorysort(1, "sort", () => categorysort(0, "quickScreen"));
    }
  }

  showMore() {
    let { toogleBootomMenus } = this.props;
    toogleBootomMenus();
    Sensor.go("clickBanner_App_Mob", {
      action_id: "1000202_989",
      page_id: "MB_1000202",
      banner_type: "tag",
      banner_content: "[首页, 分类, 优惠专享, 购物车, 我的]",
      banner_current_url: window.location.href,
      banner_current_page_type: "home",
      banner_belong_area: "Bottom Navigation",
    })
}

jumpHandle(type) {
  console.log('33333333');
  const {
    pageType,
    promotionIds, // 优惠券页面参数
    code, // 优惠券页面参数
    keyWords, // 搜索关键字
    currenturl,
    dataString,
    maxFilterPrice,
    minFilterPrice,
  } = this.state;
  const { products } = this.props;
  let sortField = 5,
    sortMode = "desc",
    eventName,
    sortCategory,
    sortSubCategory;
  if (type === "volume") {
    sortField = 2;
    eventName = "按销量排序";
    sortCategory = "销量";
  } else if (type === "price") {
    sortCategory = "价格";
    if (products.sortMode === "desc") {
      sortSubCategory = "价格高到低";
      eventName = "价格正序";
      sortMode = "asc";
    } else {
      sortSubCategory = "价格低到高";
      eventName = "价格倒序";
    }
  }

  // 埋点
  let buttonPositionMap = {
    "Category List": ["category", "giftSet", "couponSet", "exclusive"],
    "Search List": ["search", "hot"],
    "Brand List": ["brand"],
  };
  let buttonPosition = Object.keys(buttonPositionMap).find((item) =>
    buttonPositionMap[item].find((page) => page === pageType)
  );

  if (sortCategory) {
    GoogleAnalytics.pushV2({
      event: "sort",
      sortCategory: sortCategory,
      sortSubCategory: sortSubCategory,
    });
  }
  const { thirdCategoryId, secondCategoryId, rootCategoryId, currentBrand } =
    products;
  const id = thirdCategoryId
    ? `${thirdCategoryId}-${secondCategoryId}-${rootCategoryId}`
    : secondCategoryId
      ? `${secondCategoryId}-${rootCategoryId}`
      : rootCategoryId;
  let action_id;
  if (eventName == "按销量排序") {
    action_id = "1000202_005"
  } else if (eventName.indexOf("价格") != -1) {
    action_id = "1000202_006"
  }
  if (eventName) {
    GoogleAnalytics.push({
      buttonPosition: buttonPosition,
      eventName: eventName,
      event: "ButtonClick",
    });
  }

  let hasInventory = products.hasInventory;
  let filters = products.filters;
  let pageSize = products.pageSize;

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
      pageSize: "20",
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
      pageSize: "20",
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
      minFilterPrice,
      maxFilterPrice,
    },
  };
  let search = Object.keys(paramMap[pageType])
    .map((item) => {
      return item + "=" + paramMap[pageType][item];
    })
    .join("&");
  const { facetBrands } = products

  window.location.href = currenturl + "?" + search;
  Sensor.go("ListClick", {
    button_name: eventName,
    categoryId: id,
    brand_cn: (currentBrand && currentBrand.brandNameCN) || facetBrands[0].brandNameCN,
    brand_id: (currentBrand && currentBrand.brandId) || facetBrands[0].brandId,
    key_words: keyWords,
    action_id,
    page_id: "MB_1000202",
    $element_target_url: currenturl + "?" + search
  });
}

sort() {
  let { obj } = this.props;
  let sortType = {
    sort: this.toogleSort,
    style: this.showMore,
    volume: () => this.jumpHandle("volume"),
    price: () => this.jumpHandle("price"),
    screen: this.openScreen,
  };



  sortType[obj.type]();

}

openScreen() {
  const { keyWords } = this.state;// 搜索关键字
  const { products } = this.props;
  const { thirdCategoryId, secondCategoryId, rootCategoryId, currentBrand } =
    products;

  const id = thirdCategoryId
    ? `${thirdCategoryId}-${secondCategoryId}-${rootCategoryId}`
    : secondCategoryId
      ? `${secondCategoryId}-${rootCategoryId}`
      : rootCategoryId;
  const { categorysort } = this.props;
  const { facetBrands } = products

  Sensor.go("ListClick", {
    button_name: "筛选",
    categoryId: id,
    brand_cn: (currentBrand && currentBrand.brandNameCN) || facetBrands[0].brandNameCN,
    brand_id: (currentBrand && currentBrand.brandId) || facetBrands[0].brandId,
    key_words: keyWords,
    action_id: "1000202_007",
    page_id: "MB_1000202"
  });
  categorysort(1, "screen", () => categorysort(2, "firstShowScreen"));
}

render() {
  let { obj, products, sort, quickData } = this.props;
  let classcur = obj.class;
  if (obj.checked) {
    classcur = classcur + " current";
    if (products) {
      if (obj.type == "price") {
        if (products.sortMode == "desc") {
          classcur = classcur + " curdesc";
        } else {
          classcur = classcur + " curasc";
        }
      }

      if (obj.type == "sort") {
        if (sort) {
          classcur = classcur + " curchecked";
        } else {
          classcur = classcur + " curcheckshow";
        }
      }
    }
  } else {
    if (obj.type == "sort") {
      if (sort) {
        classcur = classcur + " curshow";
      }
    }
  }
  if (obj.name === "筛选" && quickData) {
    return null;
  }
  return (
    <a className={classcur} onClick={this.sort}>
      <span>{obj.name}</span>
      <em />
    </a>
  );
}
}

export default Categorysort;
