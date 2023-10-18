import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import { urlGetParams } from "@/lib/url";
import { judgeTypeOfPlp } from "@/lib/Tools";
import Sensor from "@/Utils/sensor";
import * as actions from "../../../../actions/plpPage";

class CategoryReset extends Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.callback = this.callback.bind(this);
    this.goScreen = this.goScreen.bind(this);
    this.state = {
      currentparam: null,
      currenturl: null,
      pageType: "",
    };
  }

  componentDidMount() {
    const { currentparam } = this.state; // TODO: 请移除无用state
    console.log(currentparam);
    const pageType = judgeTypeOfPlp();
    let pathname = "";
    const { products, actions, url, location } = this.props;
    let currenturl;
    if (!products) {
      return false;
    }
    if (url) {
      pathname = url.split("?")[0];
    }
    const categoryId = products.categoryId || 60001;
    const filters = "";
    const hasInventory = 0;
    const pageNum = 1;
    const pageSize = 20;
    const sortField = products.sortField || 1;
    const sortMode = products.sortMode || "desc";
    const hotWords = products.hotWords
      ? products.hotWords
      : urlGetParams(window.location, "k");
    const promotionIds = urlGetParams(window.location, "promotionIds");
    const version = 1;
    const keyWords = products.keyWords;

    currenturl = location.pathname;
    currenturl = currenturl.split("/");
    if (currenturl.length > 2) {
      currenturl =
        currenturl[2].split("-")[currenturl[2].split("-").length - 1];
    }
    const paramsMap = {
      category: {
        categoryId,
        filters,
        hasInventory,
        pageNum,
        pageSize,
        sortField,
        sortMode, // 排序方式
      },
      search: {
        keyWords,
        version,
        filters,
        hasInventory,
        pageNum,
        pageSize,
        sortField,
        sortMode,
      },
      hot: {
        hotWords,
        filters,
        hasInventory,
        pageNum,
        pageSize,
        sortField,
        sortMode,
      },
      brand: {
        brandId: currenturl, // 品牌id
        brandCategoryId: products.categoryId || "", // 分类id
        filters,
        hasInventory,
        pageNum,
        pageSize,
        sortField,
        sortMode,
      },
      giftSet: {
        filters,
        hasInventory,
        pageNum,
        pageSize,
        sortField,
        sortMode,
      },
      couponSet: {
        filters,
        hasInventory,
        pageNum,
        pageSize,
        sortField,
        sortMode,
        promotionIds,
        keyWords: urlGetParams(window.location, "keyWords")
          ? urlGetParams(window.location, "keyWords")
          : "",
      },
      exclusive: {
        filters,
        hasInventory,
        pageNum,
        pageSize,
        sortField,
        sortMode,
      },
    };
    const param = Object.keys(paramsMap[pageType])
      .map((el) => `${el}=${paramsMap[pageType][el]}`)
      .join("&");
    const ajaxUrl = `${pathname}?${param}&channel=MOBILE`;
    actions
      .getPlpListData(
        { url: ajaxUrl, type: "GET", onlyKey: `${pageType}reset` },
        true
      )
      .then((res) => {
        actions.obtainData(res);
      });
    this.setState({
      currentparam: location.search,
      currenturl: location.pathname,
      promotionIds,
      code: urlGetParams(window.location, "code")
        ? urlGetParams(window.location, "code")
        : "",
      keyWords: urlGetParams(window.location, "keyWords")
        ? urlGetParams(window.location, "keyWords")
        : "",
      pageType,
    });
  }

  reset() {
    const { products, pushLevel, changeState, plpPage } = this.props;
    const newarr = pushLevel;
    newarr.map((el) => {
      el.map((obj) => {
        obj.change = false;
      });
    });
    changeState(false, "useInventory");
    changeState(newarr, "pushLevel");
    if (products) {
      changeState(plpPage.obtainData, "CATEGORY_RESETQUANTITY");
      changeState(plpPage.obtainData, "CATEGORYQUANTITY");
      this.callback(plpPage.obtainData);
      this.props.changeState("", "maxFilterPrice");
      this.props.changeState("", "minFilterPrice");
    }
 
  
    Sensor.go("ListClick", {
      page_id: "MB_1000202",
      action_id: "1000202_009",
      $element_target_url: window.location.href,
      categoryId: this.props.products.categoryId,
      button_name: "重置",
    });
  }

  callback(data) {
    const { products, changeState } = this.props;
    let allarry = [];
    const nextarry = [];
    const pusharry = [];
    const CategoryListall = data || products;
    if (CategoryListall) {
      // 筛选数据
      CategoryListall.facetAttrs.map((el, index) => {
        el.items.map((obj, i) => {
          const resultlist = {
            onelevel: index,
            twolevel: i,
            name: el.seoIdentifier == "a" ? obj.brandNameCN : obj.valueName,
            change: !!obj.checked,
            seo: obj.seoIdentifier,
            seohd: el.seoIdentifier,
            brandNameEN: obj.brandNameEN,
          };
          allarry.push(resultlist);
        });
        pusharry.push(allarry);
        allarry = [];

        // 筛选下拉
        const resultnext = {
          num: index,
          change: false,
          quantity: 33,
        };
        nextarry.push(resultnext);
      });
      changeState(pusharry, "pushLevel");
      changeState(nextarry, "selectLevel");
    }
  }

  goScreen() {
    const {
      screen,
      products,
      useInventory,
      pushLevel,
      categorysort,
      CATEGORYQUANTITY,
      maxFilterPrice,
      minFilterPrice,
    } = this.props;
    const { pageType } = this.state;
    const CategoryListconts = products;
    const shopnum = CATEGORYQUANTITY;
    const promotionIds = this.state.promotionIds;
    const code = this.state.code;
    const keyWords = this.state.keyWords;
    let shopallnum = "";
    let currenturl = "";
    let curgourl = "";
    const filterMidCategory = [];
    const filterSubCategory = [];
    if (CategoryListconts) {
      shopallnum =
        shopnum == null
          ? CategoryListconts.totalRecord
          : shopnum.totalRecord != null
          ? shopnum.totalRecord
          : shopnum;
    }
    let hasInventory = "";
    let condition = "";
    const conditionin = [];
    if (useInventory) {
      hasInventory = 1;
      filterMidCategory.push("库存");
      filterSubCategory.push("仅看有货");
    } else {
      hasInventory = 0;
    }

    if (pushLevel) {
      pushLevel.map((el) => {
        el.map((obj) => {
          if (obj.change) {
            CategoryListconts.facetAttrs.map((data) => {
              if (data.seoIdentifier == obj.seohd) {
                filterMidCategory.push(data.name);
                filterSubCategory.push(obj.brandNameEN || obj.name);
                const seoIdentifier = data.name;
                conditionin.push({
                  type: obj.seohd,
                  cont: obj.seo,
                  name: obj.name,
                  seoIdentifier,
                });
              }
            });
          }
        });
      });
    }

    if (pageType === "category") {
      curgourl = "category";
    } else if (pageType === "brand") {
      curgourl = "brand";
    }

    let gaArr;

    for (let num = 0; num < conditionin.length; num++) {
      if (num > 0) {
        if (
          conditionin[num].seoIdentifier == conditionin[num - 1].seoIdentifier
        ) {
          gaArr += `,${conditionin[num].name}`;
        } else {
          gaArr += `&${conditionin[num].seoIdentifier}:${conditionin[num].name}`;
        }
      } else {
        gaArr = `${conditionin[num].seoIdentifier}:${conditionin[num].name}`;
      }
      if (num < conditionin.length - 1) {
        if (conditionin[num].type == conditionin[num + 1].type) {
          condition += `${conditionin[num].cont},`;
          if (pageType === "category") {
            curgourl = "categories";
          } else if (pageType === "brand") {
            curgourl = "brands";
          }
        } else {
          condition += `${conditionin[num].cont}-`;
        }
      } else if (num == conditionin.length - 1) {
        if (conditionin.length == 1) {
          condition = conditionin[num].cont;
        } else if (conditionin[num].type == conditionin[num - 1].type) {
          condition += conditionin[num].cont;
        } else {
          condition += conditionin[num].cont;
        }
      }
    }
    if (CategoryListconts) {
      currenturl = this.state.currenturl;
      if (shopallnum) {
        if (screen) {
          categorysort(0, "screen");
          let data;
          const event = "Filter";
          let eventName = "";
          const filterName = gaArr;
          let filterCondition;
          const filterConditionMap = {
            category: {
              eventName: "Category Filter", // GA
              filterCondition: CategoryListconts.thirdCategoryName
                ? CategoryListconts.thirdCategoryName
                : CategoryListconts.secondCategoryName
                ? CategoryListconts.secondCategoryName
                : CategoryListconts.rootCategoryName, // GA
              pathname: `/${curgourl}/${currenturl.split("/")[2]}/page1/${
                condition ? `${condition}/` : ""
              }`, // 跳转pathname
            },
            search: {
              eventName: "Search Filter",
              filterCondition: CategoryListconts.keyWords,
              param: {
                // 路由额外参数
                k: CategoryListconts.keyWords,
                currentPage: 1,
                filters: condition,
              },
            },
            brand: {
              eventName: "Brand Filter",
              filterCondition: CategoryListconts.currentBrand
                ? CategoryListconts.currentBrand.brandNameEN
                : "",
              pathname: `/${curgourl}/${currenturl.split("/")[2]}/page1/${
                CategoryListconts.categoryId
                  ? `${CategoryListconts.categoryId}/`
                  : ""
              }${condition ? `${condition}/` : ""}`,
            },
            purchaserecordcon: {
              pathname: "/purchaserecord.html",
              currentPage: 1,
              filters: condition,
            },
            hot: {
              param: {
                k: CategoryListconts.hotWords,
                currentPage: 1,
                filters: condition,
              },
            },
            giftSet: {
              param: {
                currentPage: 1,
                filters: condition,
              },
            },
            couponSet: {
              param: {
                currentPage: 1,
                filters: condition,
                promotionIds,
                code,
                keyWords,
              },
            },
            exclusive: {
              param: {
                currentPage: 1,
                filters: condition,
              },
            },
          };
          // GA
          if (
            filterConditionMap[pageType].filterCondition &&
            filterConditionMap[pageType].eventName
          ) {
            eventName = filterConditionMap[pageType].eventName;
            filterCondition = filterConditionMap[pageType].filterCondition;
            data = {
              event,
              eventName,
              filterName,
              filterCondition,
            };
            GoogleAnalytics.push(data);
          }
          GoogleAnalytics.pushV2({
            event: "filter",
            filterCategory: "筛选",
            filterMidCategory: filterMidCategory.join("_"),
            filterSubCategory: filterSubCategory.join("_"),
          });
          // 跳转
          let pathname = currenturl;
          let param = {
            // 公共路由参数
            hasInventory,
            pageSize: 20,
            sortField: CategoryListconts.sortField,
            sortMode: CategoryListconts.sortMode,
            maxFilterPrice,
            minFilterPrice,
          };
          if (filterConditionMap[pageType].pathname) {
            pathname = filterConditionMap[pageType].pathname;
          }
          if (filterConditionMap[pageType].param) {
            param = Object.assign(param, filterConditionMap[pageType].param);
          }
          const jumpTarget = `${pathname}?${Object.keys(param)
            .map((el) => `${el}=${param[el]}`)
            .join("&")}`;
          window.location.href = jumpTarget;
          let shopallnum
          if (products) {
            shopallnum =
              shopnum == null
                ? products.totalRecord
                : shopnum.totalRecord != null
                  ? shopnum.totalRecord
                  : shopnum;
          }
          const shopNum = `${shopallnum}件商品`;
          Sensor.go("ListClick", {
            page_id: "MB_1000202",
            action_id: "1000202_008",
            $element_target_url: jumpTarget,
            categoryId: CategoryListconts.categoryId,
            button_name: shopNum,
          });
        }
      } else {
        // 没有跳转路径
      }
    }
  }

  render() {
    const { products, CATEGORYQUANTITY } = this.props;
    const shopnum = CATEGORYQUANTITY;
    let goUrl = "category_reset_num";
    const hrefs = "javascript:;";
    let shopallnum = "";
    if (products) {
      shopallnum =
        shopnum == null
          ? products.totalRecord
          : shopnum.totalRecord != null
          ? shopnum.totalRecord
          : shopnum;
    }

    const shopNum = `${shopallnum}件商品`;

    if (products) {
      if (shopallnum) {
      } else {
        goUrl = "category_reset_num cur";
      }
    }

    return (
      <div className="category_reset">
        <span className="category_reset_btn" onClick={this.reset}>
          重置
        </span>
        <a href={hrefs} onClick={this.goScreen} className={goUrl}>
          完成(
          <span className="category_reset_Nums">{shopNum}</span>)
        </a>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    plpPage: state.plpPage,
  }),
  (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
  })
)(withRouter(CategoryReset));
