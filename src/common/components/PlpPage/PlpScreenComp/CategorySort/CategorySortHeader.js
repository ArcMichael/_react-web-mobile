import React, { Component } from "react";
import { judgeTypeOfPlp } from "@/lib/Tools";
import * as device from "@/lib/device";
import CategorySortHeaderContent from "./CategorySortHeaderContent";
import BottomMenus from "../../../BottomMenus";
class CategorySortHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [
        { name: "综合", class: "category_sort", type: "sort", checked: 0 },
        { name: "销量", class: "category_volume", type: "volume", checked: 0 },
        { name: "价格", class: "category_price", type: "price", checked: 0 },
        { name: "筛选", class: "category_filters", type: "screen" },
        { name: "...", class: "category_style", type: "style" },
      ],
      tabMore: false,
    };
    this.toogleBootomMenus = this.toogleBootomMenus.bind(this);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isClickDeeplinkClose !== this.props.isClickDeeplinkClose && nextProps.isClickDeeplinkClose) {
      document.getElementsByClassName("quickscreen")[0] &&
        (document.getElementsByClassName("quickscreen")[0].style.top = "172px");
    }
  }
  componentDidMount() {
    let { products } = this.props;
    let result = this.state.results;
    if (products) {
      if (products.sortField == 1) {
        result[0].name = "综合";
        result[0].checked = 1;
      } else if (products.sortField == 2) {
        result[1].name = "销量";
        result[1].checked = 1;
      } else if (products.sortField == 3) {
        result[0].name = "新品";
        result[0].checked = 1;
      } else if (products.sortField == 4) {
        result[0].name = "人气";
        result[0].checked = 1;
      } else if (products.sortField == 5) {
        result[2].name = "价格";
        result[2].checked = 1;
      }
      this.setState({
        results: result,
      });
    }
  }

  toogleBootomMenus() {
    let { tabMore } = this.state;
    this.setState({
      tabMore: !tabMore,
    });
  }

  render() {
    let { tabMore } = this.state;
    const { categorysort, products, sort, isShowSortHeader, quickData } = this.props;
    let pageType = judgeTypeOfPlp();
    if (pageType === "search" && products && products.content.length == 0) {
      return false;
    }

    let curClass = "category_screen";

    let contents;

    /**
     * 记录用户已购产品list
     *
     */
    if (pageType === "purchaserecord" && products) {
      if (products.sortField == 1) {
        this.state.results[0].name = "综合";
        this.state.results[0].checked = 1;
      } else if (products.sortField == 2) {
        this.state.results[1].name = "销量";
        this.state.results[1].checked = 1;
      } else if (products.sortField == 3) {
        this.state.results[0].name = "新品";
        this.state.results[0].checked = 1;
      } else if (products.sortField == 4) {
        this.state.results[0].name = "人气";
        this.state.results[0].checked = 1;
      } else if (products.sortField == 5) {
        this.state.results[2].name = "价格";
        this.state.results[2].checked = 1;
      }
    }

    contents = this.state.results.map((obj, index) => {
      return (
        <CategorySortHeaderContent
          key={index}
          obj={obj}
          _index={index}
          toogleBootomMenus={this.toogleBootomMenus}
          sort={sort}
          products={products}
          categorysort={categorysort}
          quickData={quickData}
        />
      );
    });

    if (pageType == "vaproductlist" && !device.isApp()) {
      return (
        <div className={curClass} style={{ top: "86px" }}>
          {contents}
        </div>
      );
    }
    if (!isShowSortHeader) {
      curClass += " category_hide";
    }
    return (
      <div className={curClass} style={{ top: "86px" }}>
        {contents}
        {tabMore && (
          <div className="common-page-title-tabbar" style={{ width: "100%" }}>
            <BottomMenus disableToTop />
          </div>
        )}
      </div>
    );
  }
}

export default CategorySortHeader;
