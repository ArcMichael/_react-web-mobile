import React, { Component } from "react";
import { connect } from "react-redux";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import QuickScreening from "./quickScreen/QuickScreening";
import CategorySort from "./CategorySort";
import ScreenMask from "./ScreenMask";
import CategoryScreen from "./CategoryScreen";

// 筛选、排序、快捷筛选
class PlpScreenComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quickScreen: 0, // 快捷筛选弹窗是否打开
      sort: 0, // 综合排序弹窗是否打开
      screen: 0, // 筛选弹窗是否打开
      scrollTop: 0, // 记录打开弹窗时的scroll高度
      firstShowScreen: 0, // lazyload组件在切换display时无法加载，采用首次展示才加载组件的方式
    };
    this.categorysort = this.categorysort.bind(this);
    this.clearPopup = this.clearPopup.bind(this);
  }
  categorysort(val, type, callback) {
    const { screen, sort, quickScreen } = this.state;
    let scrollTop = -1;
    if (val === 1 && !screen && !sort && !quickScreen) {
      // 打开弹窗记录滚动高度
      scrollTop = bodyScrollTop.get();
      document.getElementById("root").style.position = "fixed";
      if (type === "screen") {
        // 打开筛选弹窗时搜索需被覆盖
        document.getElementsByClassName("plpscreen")[0].style.zIndex = 204;
      }
    } else {
      let num = screen + sort + quickScreen;
      if (this.state[type] === 1 && num === 1) {
        // 弹窗全部关闭时，页面高度回到之前
        bodyScrollTop.set(this.state.scrollTop);
        document.getElementById("root").style.position = "relative";
        scrollTop = 0;
      }
    }
    this.setState(
      {
        [type]: val,
      },
      () => {
        callback && callback();
      },
    );
    if (scrollTop >= 0) {
      this.setState({
        scrollTop,
      });
    }
  }
  clearPopup() {
    let scrollTop = 0;
    document.getElementById("root").style.position = "relative";
    if (this.state.scrollTop) {
      // 弹窗全部关闭时，页面高度回到之前
      bodyScrollTop.set(this.state.scrollTop);
    }
    if (this.state.screen) {
      // 关闭筛选时恢复搜索层级
      document.getElementsByClassName("plpscreen")[0].style.zIndex = 202;
    }
    this.setState({
      quickScreen: 0,
      sort: 0,
      screen: 0,
      scrollTop,
    });
  }
  render() {
    const { quickScreen, sort, screen, firstShowScreen } = this.state;
    const { products } = this.props;
    if ((products && Object.keys(products).length) || products === null) {
      return (
        <div className={`plpPage_head_screen ${this.props.quickData ? "hasQuick" : ""}`}>
          <div className="plpscreen">
            <CategorySort
              sort={this.state.sort}
              products={this.props.products}
              categorysort={this.categorysort}
              quickData={this.props.quickData}
             />
            {this.props.quickData ? (
              <QuickScreening
                {...this.props}
                categorysort={this.categorysort}
                quickScreen={this.state.quickScreen}
               />
            ) : null}
            <ScreenMask
              quickScreen={quickScreen}
              sort={sort}
              screen={screen}
              clearPopup={this.clearPopup}
            />
            <CategoryScreen
              products={this.props.products}
              screen={screen}
              url={this.props.url}
              categorysort={this.categorysort}
              firstShowScreen={firstShowScreen}
            />
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (s) => ({
  products: s.plpPage.products,
  brandCon: s.plpPage.brandCon,
});
const mapDispatchToProps = () => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PlpScreenComp);
