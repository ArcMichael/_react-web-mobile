import React from "react";
import { connect } from "react-redux";
import {
  SetSingleCookie2V2,
  GetSingleCookie2V2,
  DelSingleCookie2,
} from "../../lib/Tools";
import { historyArr, historybrows } from "../../actions/search";
import Sensor from "../../Utils/sensor/index";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";
import { getCookie } from "../../Utils/utils/cookie";

class HistorySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
    };
    this.clickAll = this.clickAll.bind(this);
  }
  componentDidMount() {
    const { result } = this.state; // TODO: 请移除无用state
    console.log(result);
    let oldcookie = GetSingleCookie2V2({ key: "n_history" });
    if (oldcookie && oldcookie !== "false") {
      const newcookie = oldcookie.split("=%");
      const newcookiearr = [];
      newcookie.map((data) => {
        newcookiearr.push(data);
      });
      this.props.historyArr(newcookiearr);
    }
  }
  clickin(data) {
    // const searchKeywords = data
    const { BrandAllcon } = this.props;
    // 同步是否是品牌词
    let linkhref = `/search/?k=${data}`;
    if (BrandAllcon && BrandAllcon.results && BrandAllcon.results.length) {
      BrandAllcon.results.map((el) => {
        if (el && el.brandList && el.brandList.length) {
          el.brandList.map((cont) => {
            if (
              cont &&
              (cont.brandNameCN === data ||
                cont.brandNameEN === data ||
                cont.brandNameEN === data.toUpperCase() ||
                cont.brandNameEN === data.toLowerCase())
            ) {
              linkhref = `/brand/${cont.brandNameEN}-${cont.brandId}/`;
            }
            if (cont && cont.brandNickNames && cont.brandNickNames.length) {
              cont.brandNickNames.map((oj) => {
                if (
                  oj &&
                  (oj === data ||
                    oj === data.toUpperCase() ||
                    oj === data.toLowerCase())
                ) {
                  linkhref = `/brand/${cont.brandNameEN}-${cont.brandId}/`;
                }
              });
            }
          });
        }
      });
    }
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_Search##getSensorData##HistorySearch.js##74",
      banner_type: "search",
      banner_content: data,
      banner_belong_area: "searchview",
      banner_to_url: linkhref,
      banner_to_page_type: linkhref,
      banner_ranking: "",
      belong_team: "Search",
      key_word_tpye: "ClickTerm",
      key_word_tpye_details: "History Search",
    });
    GoogleAnalytics.pushV2({
      event: "search",
      // recommendContent: "",
      searchCategory: "历史搜索",
      cat55: "历史搜索",
      searchTerm: data,
      kw55: data,
    });
    const oldcookie = GetSingleCookie2V2({ key: "n_history" });
    const val = data;
    let newcookie = [];
    if (oldcookie && oldcookie !== "false") {
      newcookie = oldcookie.split("=%");
      newcookie.map((data, index) => {
        data === val && newcookie.splice(index, 1);
      });
      // newcookie.length > 10 && newcookie.pop();
      newcookie.unshift(val);
      const newcookies = newcookie.join("=%");
      SetSingleCookie2V2({
        key: "n_history",
        value: newcookies,
        domain: ".sephora.cn",
      });
    } else {
      newcookie.unshift(val);
      SetSingleCookie2V2({
        key: "n_history",
        value: val,
        domain: ".sephora.cn",
      });
    }
    this.props.historyArr(newcookie);
    // A/B 搜索跳转

    window.location.href = linkhref;
  }
  clickAll() {
    let oldcookie = GetSingleCookie2V2({ key: "n_history" });
    if (oldcookie && oldcookie !== "false") {
      DelSingleCookie2({ key: "n_history", domain: ".sephora.cn" });
      this.props.historyArr([]);
    }
    // 清空历史浏览
    getCookie().then((cookie) => {
      const productidHistory = cookie("allpPoductid");
      if (productidHistory && productidHistory !== "false") {
        cookie("allpPoductid", "", { expires: 7, path: "/" });
        this.props.historybrows();
      }
    });
  }
  render() {
    const { HISTORY_ARR } = this.props;
    let hotlist;
    let historyNum = false;
    const that = this;
    if (HISTORY_ARR) {
      const arr = HISTORY_ARR;
      historyNum = arr.length;
      hotlist = arr.map((data, index) => {
        const dataDe = data;
        if (index < 10) {
          return (
            <li key={index} className="lists">
              <div className="list">
                <span
                  className="listhref"
                  onClick={this.clickin.bind(that, dataDe)}
                >
                  {dataDe}
                </span>
              </div>
            </li>
          );
        }
      });
    }
    return (
      <div className="history" style={historyNum ? {} : { display: "none" }}>
        <div className="hot_top">
          <div className="ht_left">
            <em className="ht_img" />
            <span className="ht_text">历史搜索</span>
          </div>
          <div className="ht_right">
            <span className="ht_change" onClick={this.clickAll} />
          </div>
        </div>
        <div className="hot_content">
          <ul>{hotlist}</ul>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (s) => {
  const { search, BrandAllcon } = s;
  const { HISTORY_ARR } = search;
  return {
    HISTORY_ARR,
    BrandAllcon,
  };
};
export default connect(mapStateToProps, {
  historyArr,
  historybrows,
})(HistorySearch);
