import React, { Component } from "react";
import browserHistory from "@/store/browserHistory";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { judgeTypeOfPlp } from "@/lib/Tools";
import QuickScreeningHead from "./QuickScreeningHead";
import QuickScreeningBody from "./QuickScreeningBody";
import QuickScreeningButton from "./QuickScreeningButton";
import { quickscreenNum, quickscreenResetFilter } from "../../../../actions/plpPage";

class QuickScreening extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QUICKSCREENTAB: null,
      QUICKSCREENNUM: null,
      QUICKSCREENNUMFILTER: null,
      quickDataNew: [],
      pageType: "",
      searchType: "",
      keyword: "",
      hotWords: "",
      QUICKSCREENNUMINVENTORY: 0, // 仅看有货
    };
    this.QuickScreenTab = this.QuickScreenTab.bind(this);
    this.setSingleState = this.setSingleState.bind(this);
    this.quickscreenResetFilter = this.quickscreenResetFilter.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.quickScreen !== this.props.quickScreen && !nextProps.quickScreen) {
      // 关闭弹窗时清空tab数据
      this.setState({
        QUICKSCREENTAB: null,
        QUICKSCREENNUMFILTER: null,
      });
    }
  }

  componentDidMount() {
    const { quickData, products } = this.props;
    let hasInventory = browserHistory.getCurrentLocation().query.hasInventory || "0";
    let quickDataNew = [
      ...quickData,
      {
        name: "仅看有货",
        seoIdentifier: "",
        sequence: 4,
        items: [
          { checked: hasInventory, identifier: "", seoIdentifier: "", valueName: "仅看有货" },
        ],
      },
    ]; // 添加仅看有货
    this.setState({ quickDataNew });
    let plpPageType = judgeTypeOfPlp();
    let pageType, searchType, keyword, hotWords;
    switch (plpPageType) {
      case "giftSet":
        pageType = "giftSet";
        searchType = "giftSet";
        break;
      case "couponSet":
        pageType = "couponSet";
        searchType = "coupon";
        keyword = products.keyWords;
        break;
      case "search":
        pageType = "keyword";
        keyword = products.keyWords;
        break;
      case "hot":
        pageType = "hotWords";
        hotWords = products.hotWords;
        break;
      default:
        break;
    }
    this.setState({
      pageType,
      searchType,
      keyword,
      hotWords,
      QUICKSCREENNUMINVENTORY: products.hasInventory,
    });
  }

  QuickScreenTab(data, ifTrue = true) {
    let newState = {};
    newState.QUICKSCREENTAB = data;
    newState.QUICKSCREENNUMFILTER = null;
    if (ifTrue) newState.QUICKSCREENNUM = null;
    this.setState(newState);
  }

  setSingleState(type, val) {
    this.setState({
      [type]: val,
    });
  }

  // 快捷筛选 重置filter
  quickscreenResetFilter(val, id) {
    const { quickscreenResetFilters } = this.props;
    if (judgeTypeOfPlp() === "couponSet") {
      let newArr;
      quickscreenResetFilters(val, (data) => {
        data &&
          data.results &&
          data.results.quickFilters &&
          data.results.quickFilters.map((v) => {
            if (id == v.seoIdentifier) {
              newArr = v;
            }
          });
        this.setState({
          QUICKSCREENTAB: newArr,
        });
      });
    } else {
      quickscreenResetFilters(val, (data) => {
        if (data && data.results) {
          this.setState({
            QUICKSCREENTAB: data.results,
          });
        }
      });
    }
  }

  render() {
    let { quickData } = this.props;
    const {
      QUICKSCREENTAB,
      quickDataNew,
      pageType,
      searchType,
      keyword,
      hotWords,
      QUICKSCREENNUM,
      QUICKSCREENNUMFILTER,
      QUICKSCREENNUMINVENTORY,
    } = this.state;
    return quickData && quickData.length > 0 ? (
      <div className="quickscreen_container">
        <div className="quickscreen">
          <QuickScreeningHead
            {...this.props}
            QUICKSCREENTAB={QUICKSCREENTAB}
            quickDataNew={quickDataNew}
            QuickScreenTab={this.QuickScreenTab}
            pageType={pageType}
          />
          <div className="quickscreen_popup">
            <QuickScreeningBody
              {...this.props}
              QuickScreenTab={this.QuickScreenTab}
              QUICKSCREENTAB={QUICKSCREENTAB}
              setSingleState={this.setSingleState}
              pageType={pageType}
              searchType={searchType}
              keyword={keyword}
              hotWords={hotWords}
            />
            <QuickScreeningButton
              QuickScreenTab={this.QuickScreenTab}
              {...this.props}
              pageType={pageType}
              hotWords={hotWords}
              keyword={keyword}
              QUICKSCREENTAB={QUICKSCREENTAB}
              QUICKSCREENNUM={QUICKSCREENNUM}
              setSingleState={this.setSingleState}
              QUICKSCREENNUMFILTER={QUICKSCREENNUMFILTER}
              quickscreenResetFilter={this.quickscreenResetFilter}
              QUICKSCREENNUMINVENTORY={QUICKSCREENNUMINVENTORY}
            />
          </div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  quickscreenNum: bindActionCreators(quickscreenNum, dispatch),
  quickscreenResetFilters: bindActionCreators(quickscreenResetFilter, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(QuickScreening);
