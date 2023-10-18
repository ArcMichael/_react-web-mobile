import React, { Component } from "react";
import { urlGetParams } from "../../../../lib/url";

class QuickScreeningButton extends Component {
  constructor(props) {
    super(props);
    this.quickScreenInitiaFilter = this.quickScreenInitiaFilter.bind(this);
  }

  componentDidMount() {}

  quickScreenInitiaFilter() {
    let {
        quickscreenNum,
        pageType,
        hotWords,
        keyword,
        products,
        quickscreenResetFilter,
        QUICKSCREENTAB,
        setSingleState,
      } = this.props,
      giftsetFilter = "",
      giftsetFilterCont = "",
      hasInventory = products.hasInventory,
      minFilterPrice = products.minFilterPrice || "",
      maxFilterPrice = products.maxFilterPrice || "";
    giftsetFilter = products.filters;
    // 重置时去除当前tab选项的filter
    if (QUICKSCREENTAB) {
      giftsetFilterCont = QUICKSCREENTAB.seoIdentifier;
    }
    giftsetFilter = giftsetFilter.split("-").filter((el, ) => {
      return !new RegExp(giftsetFilterCont).test(el);
    });
    giftsetFilter = giftsetFilter.join("-");
    // 仅看有货因不是商品属性，前端写死 需特殊处理
    if (QUICKSCREENTAB.name === "库存") {
      hasInventory = "0";
    }
    let val = {},
      param = "";
    const data = {
      giftSet: () => {
        param =
          "/v1/search-service/product/list/quickfilter/giftset?" +
          `seoIdentifier=${QUICKSCREENTAB.seoIdentifier}&hasInventory=${hasInventory}&filters=${giftsetFilter}&minFilterPrice=${minFilterPrice}&maxFilterPrice=${maxFilterPrice}`;
        val = {
          queryBody: {
            filters: giftsetFilter,
            hasInventory,
            searchType: "giftSet",
            maxFilterPrice,
            minFilterPrice,
          },
        };
      },
      hotWords: () => {
        param = `/v1/search-service/product/list/quickfilter/hotwords?seoIdentifier=${QUICKSCREENTAB.seoIdentifier}&hasInventory=${hasInventory}&filters=${giftsetFilter}&hotWords=${hotWords}&minFilterPrice=${minFilterPrice}&maxFilterPrice=${maxFilterPrice}`;
        val = {
          queryBody: {
            hotWords: hotWords || "",
            filters: giftsetFilter,
            hasInventory,
            maxFilterPrice,
            minFilterPrice,
          },
        };
      },
      keyword: () => {
        param = `/v1/search-service/product/list/quickfilter/keyword?seoIdentifier=${QUICKSCREENTAB.seoIdentifier}&hasInventory=${hasInventory}&filters=${giftsetFilter}&keyWords=${keyword}&minFilterPrice=${minFilterPrice}&maxFilterPrice=${maxFilterPrice}`;
        val = {
          queryBody: {
            keyWords: keyword || "",
            filters: giftsetFilter,
            hasInventory,
            maxFilterPrice,
            minFilterPrice,
          },
        };
      },
      couponSet: () => {
        let promotionIds = urlGetParams(window.location, "promotionIds");
        param =
          "/v3/search-service/product/list/coupon?" +
          `promotionIds=${promotionIds}&hasInventory=${hasInventory}&filters=${giftsetFilter}&minFilterPrice=${minFilterPrice}&maxFilterPrice=${maxFilterPrice}`;
        val = {
          queryBody: {
            filters: giftsetFilter,
            hasInventory,
            promotionIds,
            keyWords: keyword || "",
            searchType: "coupon",
            maxFilterPrice,
            minFilterPrice,
          },
        };
      },
    };
    data[pageType]();
    quickscreenNum(val.queryBody, data => {
      setSingleState("QUICKSCREENNUM", data.results);
    });
    // 保存重置后的筛选项，方便跳转页面
    setSingleState("QUICKSCREENNUMFILTER", giftsetFilter);
    setSingleState("QUICKSCREENNUMINVENTORY", hasInventory);
    quickscreenResetFilter(param, QUICKSCREENTAB.seoIdentifier);
  }

  quickScreenNotime() {
    let { QuickScreenTab, categorysort } = this.props;
    QuickScreenTab(null);
    categorysort(0, "quickScreen");
  }
  clickHref() {
    const {
      pageType,
      hotWords,
      keyword,
      products,
      QUICKSCREENNUMFILTER,
      QUICKSCREENNUMINVENTORY,
      QUICKSCREENTAB,
    } = this.props;
    const data = {
      giftSet: "/gift_set.html?",
      hotWords: `/hot/?k=${hotWords}&`,
      keyword: `/search/?k=${keyword}&`,
      couponSet: `/coupon_set.html?keyWords=${keyword || ""}&`,
    };
    let page, url;
    page = data[pageType];
    let minFilterPrice = "",
      maxFilterPrice = "";
    if (QUICKSCREENTAB.seoIdentifier !== "c") {
      minFilterPrice = products.minFilterPrice || "";
      maxFilterPrice = products.maxFilterPrice || "";
    }
    url = `${page}hasInventory=${QUICKSCREENNUMINVENTORY}&currentPage=1&pageSize=20&sortField=${products &&
      products.sortField}&sortMode=${products && products.sortMode}&filters=${
      QUICKSCREENNUMFILTER != null ? QUICKSCREENNUMFILTER : products && products.filters
    }&minFilterPrice=${minFilterPrice}&maxFilterPrice=${maxFilterPrice}`;
    if (pageType === "couponSet") {
      url += `&promotionIds=${urlGetParams(window.location, "promotionIds")}&code=${urlGetParams(
        window.location,
        "code",
      )}`;
    }
    window.location.href = url;
  }
  render() {
    let { products, QUICKSCREENTAB, QUICKSCREENNUM } = this.props,
      quickScreenButtonConfirm = "quickscreen_button_confirm";

    if (QUICKSCREENTAB) {
      if (QUICKSCREENTAB.items && QUICKSCREENTAB.items.length) {
        if (QUICKSCREENNUM && QUICKSCREENNUM === 0) {
          quickScreenButtonConfirm += " noGood";
        }
        return (
          <div className="quickscreen_button">
            <div className="quickscreen_button_num">
              <button className="quickscreen_button_reset" onClick={this.quickScreenInitiaFilter}>
                重置
              </button>
              <a onClick={this.clickHref.bind(this)} className={quickScreenButtonConfirm}>
                完成（
                {(QUICKSCREENNUM && QUICKSCREENNUM) || products.totalRecord}
                件商品）
              </a>
            </div>
          </div>
        );
      } else {
        return (
          <div className="quickscreen_button">
            <div className="quickscreen_button_notime">
              <button className="quickscreen_button_notime_confirm" onClick={this.quickScreenNotime.bind(this)}>
                完成
              </button>
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  }
}

export default QuickScreeningButton;
