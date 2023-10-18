import React, { Component } from "react";
import { urlGetParams } from "@/lib/url";
class QuickScreeningBody extends Component {
  constructor(props) {
    super(props);
  }

  quickscreenFun(id, identifier) {
    let {
        QUICKSCREENTAB,
        QuickScreenTab,
        quickscreenNum,
        products,
        setSingleState,
        pageType,
        searchType,
        keyword,
        hotWords,
      } = this.props,
      screenCondition = "",
      giftsetFilter = "",
      params = {},
      hasInventory = products.hasInventory;
    switch (pageType) {
      case "giftSet":
        params = { filters: "", hasInventory: 0, searchType: "", minFilterPrice: "", maxFilterPrice: "" };
        break;
      case "keyword":
        params = { filters: "", hasInventory: 0, keyWords: "", minFilterPrice: "", maxFilterPrice: "" };
        break;
      case "hotWords":
        params = { filters: "", hasInventory: 0, hotWords: "", minFilterPrice: "", maxFilterPrice: "" };
        break;
      case "couponSet":
        params = {
          filters: "",
          hasInventory: 0,
          searchType: "",
          promotionIds: "",
          keyWords: "",
          minFilterPrice: "",
          maxFilterPrice: "",
        };
        break;
      default:
        break;
    }
    let QUICKSCREENTABcopdy = QUICKSCREENTAB && JSON.parse(JSON.stringify(QUICKSCREENTAB));
    giftsetFilter = products.filters;
    if (QUICKSCREENTABcopdy && QUICKSCREENTABcopdy.items && QUICKSCREENTABcopdy.items.length) {
      QUICKSCREENTABcopdy.items.map((el) => {
        if (el.seoIdentifier == id) {
          if (el.checked == 1) {
            if (el.valueName === "仅看有货") {
              // 仅看有货处理
              hasInventory = 0;
            }
            el.checked = 0;
          } else {
            if (el.valueName === "仅看有货") {
              // 仅看有货处理
              hasInventory = 1;
            }
            el.checked = 1;
          }
        }
      });
    }
    /**
     * 独立愉悦自己，id
     * sequence 999代表预约自己 与后台约定 更新
     * 更新后 identifier==selectAll代表全选逻辑
     */
    if (identifier == "selectAll" && QUICKSCREENTABcopdy.seoIdentifier === "i") {
      QUICKSCREENTABcopdy.items.some((el) => {
        if (el.identifier == "selectAll") {
          if (el.checked == 1) {
            QUICKSCREENTABcopdy.items.some((cont) => {
              cont.checked = 1;
            });
          } else {
            QUICKSCREENTABcopdy.items.some((cont) => {
              cont.checked = 0;
            });
          }
        }
      });
    } else {
      let checkedAll = 1;
      QUICKSCREENTABcopdy.items.some((el) => {
        if (el.identifier != "selectAll" && el.checked == 0) {
          checkedAll = 0;
        }
      });
      QUICKSCREENTABcopdy.items.some((cont) => {
        if (cont.identifier == "selectAll") {
          cont.checked = checkedAll;
        }
      });
    }

    QuickScreenTab(QUICKSCREENTABcopdy, false);
    if (QUICKSCREENTABcopdy && QUICKSCREENTABcopdy.items) {
      if (QUICKSCREENTABcopdy.name !== "库存") {
        //当前筛选的选中条件
        QUICKSCREENTABcopdy.items.map((obj) => {
          if (obj.checked == 1) {
            screenCondition += obj.seoIdentifier + ",";
          }
        });
        screenCondition = screenCondition.substring(0, screenCondition.length - 1);
        giftsetFilter = giftsetFilter.split("-").filter((con) => {
          return !new RegExp(QUICKSCREENTABcopdy.seoIdentifier).test(con);
        });
        screenCondition && giftsetFilter.push(screenCondition);
        giftsetFilter =
          giftsetFilter instanceof Array &&
          giftsetFilter.filter((cont, ) => {
            return cont != "" && cont != undefined;
          });
        giftsetFilter = giftsetFilter.join("-");
      }
    }
    let minFilterPrice = "",
      maxFilterPrice = "";
    if (QUICKSCREENTABcopdy.seoIdentifier !== "c") {
      minFilterPrice = products.minFilterPrice || "";
      maxFilterPrice = products.maxFilterPrice || "";
    }
    let param = {
      filters: giftsetFilter,
      hasInventory,
      searchType,
      hotWords,
      keyWords: keyword || "",
      minFilterPrice,
      maxFilterPrice,
      promotionIds: urlGetParams(window.location, "promotionIds"),
    };
    let getParam = {};
    for (let key in params) {
      getParam[key] = param[key];
    }
    setSingleState("QUICKSCREENNUMFILTER", giftsetFilter);
    setSingleState("QUICKSCREENNUMINVENTORY", hasInventory);
    quickscreenNum(getParam, (data) => {
      setSingleState("QUICKSCREENNUM", data.results);
    });
  }

  render() {
    let { QUICKSCREENTAB } = this.props,
      quickscreen_bdAll = [];

    if (QUICKSCREENTAB) {
      if (QUICKSCREENTAB.items && QUICKSCREENTAB.items.length) {
        quickscreen_bdAll = QUICKSCREENTAB.items.map((el, index) => {
          return (
            <label
              className="quickscreen_bd_son"
              onClick={this.quickscreenFun.bind(this, el.seoIdentifier, el.identifier)}
              key={`quickscreen_bd_son_${index}`}
            >
              <em className={el.checked == 1 ? "cur" : ""} />
              <span className={el.checked == 1 ? "cur" : ""}>{el.valueName}</span>
            </label>
          );
        });
        return <div className="quickscreen_bd">{quickscreen_bdAll}</div>;
      } else {
        return (
          <div className="quickscreen_bd">
            <div className="quickscreen_bd_notime">暂无可选项</div>
          </div>
        );
      }
    } else {
      return null;
    }
  }
}

export default QuickScreeningBody;
