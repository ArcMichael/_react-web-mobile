import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import browserHistory from "@/store/browserHistory";
import { urlGetParams } from "@/lib/url";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import { judgeTypeOfPlp } from "@/lib/Tools";
import Sensor from "@/Utils/sensor";
import * as actions from "../../../../actions/plpPage";
import Image from "../../../Images/render";
class CategoryStrockList extends Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
    this.state = {
      results: [],
    };
  }
  componentDidMount() {
    const { results } = this.state; // TODO: 请移除无用state
    console.log(results);
  }

  change() {
    let {
      _index,
      type,
      actions,
      classtype,
      products,
      useInventory,
      changeState,
      pushLevel,
      maxFilterPrice,
      minFilterPrice,
      seotype,
    } = this.props;
    let hasInventory = "";
    let condition = "";
    let conditionin = [];
    let brandId = "";
    let eventName;
    let pageType = judgeTypeOfPlp();
    let promotionIds = "";
    let searchType = "";
    let maxFilterPriceTrue = maxFilterPrice;
    let minFilterPriceTrue = minFilterPrice;
    if (classtype == "strock") {
      let buttonPositionMap = {
        "Category List": ["category", "giftSet", "couponSet", "exclusive"],
        "Search List": ["search", "hot"],
        "Brand List": ["brand"],
      };
      let buttonPosition = Object.keys(buttonPositionMap).find((item) =>
        buttonPositionMap[item].find((page) => page === pageType)
      );

      if (useInventory) {
        hasInventory = 0;
        eventName = "取消仅看有货";
      } else {
        hasInventory = 1;
        eventName = "选择仅看有货";
      }

      if (eventName) {
        GoogleAnalytics.push({
          buttonPosition: buttonPosition,
          eventName: eventName,
          event: "ButtonClick",
        });
      }
      // 切换仅看有货
      changeState(!useInventory, "useInventory");
    } else {
      // 切换选中item
      let newPushLevel = pushLevel.map((el, index) => {
        if (index == type) {
          if (seotype == "c") {
            // 价格区间只能单选
            el.forEach((element, ind) => {
              if (ind === _index) {
                el[_index].change = !el[_index].change;
              } else {
                element.change = false;
              }
            });
            changeState("", "minFilterPrice");
            changeState("", "maxFilterPrice");
            maxFilterPriceTrue = "";
            minFilterPriceTrue = "";
          } else {
            el[_index].change = !el[_index].change;
          }
        }
        return el;
      });
      changeState(newPushLevel, "pushLevel");
      if (useInventory) {
        hasInventory = 1;
      } else {
        hasInventory = 0;
      }
    }

    pushLevel.map((el) => {
      el.map((obj) => {
        if (obj.change) {
          conditionin.push({
            type: obj.seohd,
            cont: obj.seo,
          });
        }
      });
    });
    for (var num = 0; num < conditionin.length; num++) {
      if (num < conditionin.length - 1) {
        if (conditionin[num].type == conditionin[num + 1].type) {
          condition += conditionin[num].cont + ",";
        } else {
          condition += conditionin[num].cont + "-";
        }
      } else if (num == conditionin.length - 1) {
        if (conditionin.length == 1) {
          condition = conditionin[num].cont;
        } else {
          if (conditionin[num].type == conditionin[num - 1].type) {
            condition += conditionin[num].cont;
          } else {
            condition += conditionin[num].cont;
          }
        }
      }
    }
    if (pageType === "couponSet") {
      promotionIds = urlGetParams(window.location, "promotionIds");
      searchType = "coupon";
    }
    if (pageType === "giftSet") {
      searchType = "giftSet";
    }
    if (pageType === "exclusive") {
      searchType = "exclusiveSephora";
    }
    if (pageType === "brand") {
      brandId = browserHistory.getCurrentLocation().pathname;
      brandId = brandId.split("/");
      if (brandId.length > 2) {
        brandId = brandId[2].split("-")[brandId[2].split("-").length - 1];
      }
    }
    let paramsMap = {
      couponSet: {
        filters: condition,
        hasInventory,
        promotionIds: promotionIds,
        searchType,
        maxFilterPrice: maxFilterPriceTrue,
        minFilterPrice: minFilterPriceTrue,
      },
      giftSet: {
        filters: condition,
        hasInventory,
        searchType,
        maxFilterPrice: maxFilterPriceTrue,
        minFilterPrice: minFilterPriceTrue,
      },
      exclusive: {
        filters: condition,
        hasInventory,
        searchType,
        maxFilterPrice: maxFilterPriceTrue,
        minFilterPrice: minFilterPriceTrue,
      },
      brand: {
        brandId, //品牌id
        brandCategoryId: (products && products.categoryId) || "", //分类id
        filters: condition,
        hasInventory,
        maxFilterPrice: maxFilterPriceTrue,
        minFilterPrice: minFilterPriceTrue,
      },
      search: {
        keyWords: (products && products.keyWords) || "", //二级id
        filters: condition,
        version: 1,
        verion: 1,
        hasInventory,
        maxFilterPrice: maxFilterPriceTrue,
        minFilterPrice: minFilterPriceTrue,
      },
      category: {
        categoryId: (products && products.categoryId) || "",
        filters: condition,
        hasInventory,
        maxFilterPrice: maxFilterPriceTrue,
        minFilterPrice: minFilterPriceTrue,
      },
      hot: {
        hotWords: (products && products.hotWords) || "", //二级id
        filters: condition,
        hasInventory,
        maxFilterPrice: maxFilterPriceTrue,
        minFilterPrice: minFilterPriceTrue,
      },
      purchaserecordcon: {
        countOnly: false,
        filters: condition, //筛选条件
        hasInventory, //查看有货商品
        pageNum: 1, //页码
        pageSize: 20, //每页显示产品数量
        sortField: (products && products.sortField) || "1", //排序字段
        sortMode: (products && products.sortMode) || "desc", //排序方式
        maxFilterPrice: maxFilterPriceTrue,
        minFilterPrice: minFilterPriceTrue,
      },
    };
    let param = {};
    if (paramsMap[pageType]) {
      param = paramsMap[pageType];
    }
    actions.quickscreenNum(param, (num) => {
      changeState(num.results, "CATEGORYQUANTITY");
    }); // 获取筛选商品数量
    const { obj } = this.props;


    Sensor.go("ListProductClick", {
      categoryId: obj.categoryId || "",
      brand_id: obj.brandId,
      button_name: obj.brandNameCN,
      brand_cn: obj.brandNameCN,
      action_id: "1000202_010",
      page_id: "MB_1000202",
       $element_target_url:location.href,
    });
  }

  render() {
    let { obj, _index, changenum, classtype, seotype, useInventory } =
      this.props;
    let classcur = "";
    let imgshow = "none";
    let valname = "block";
    if (classtype == "strock") {
      if (useInventory) {
        classcur = "cur";
      }
    } else {
      if (changenum) {
        if (changenum[_index].change) {
          classcur = "cur";
        }
      }
    }
    if (seotype == "a") {
      imgshow = "block";
      valname = "none";
      classcur += " logo";
    }

    return (
      <label className={classcur} onClick={this.change}>
        <span style={{ display: valname }}>{obj.valueName}</span>
        <span>{obj.brandNameCN}</span>
        {classcur === "cur logo" ? null : (
          <Image
            _alt=""
            _src={obj.brandLogoPath}
            style={{ display: imgshow }}
          />
        )}
      </label>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
  })
)(CategoryStrockList);
