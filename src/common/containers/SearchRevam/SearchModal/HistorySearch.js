import React from "react";
import { connect } from "react-redux";
import {
  SetSingleCookie2V2,
  GetSingleCookie2V2,
  DelSingleCookie2,
} from "@/lib/Tools";
import { historyArr, historybrows } from "@/actions/search";
import Sensor from "@/Utils/sensor/index";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import PopupAlert from "@/components/PopupAlert";
import { popupAlert } from "@/actions/popup";
import SearchUtil from "@/components/Search/utils";
import CdnImage from "@/components/CdnImage";

class HistorySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      needHidden: false, //  超出2行 需要隐藏
      showAll: false,
    };
    this.clickAll = this.clickAll.bind(this);
  }
  componentDidMount() {
    let oldcookie = GetSingleCookie2V2({ key: "n_history" }); //'的加上到家=%口红=%就会=%11=%1=%安徽省调换=%卡上的分离的=%111111实践活动111=%的加上到家=%口红=%就会=%11=%1=%安徽省调换=%卡上的分离的=%111111111=%豆浆粉=%口红=%就会=%11=%1=%安徽'// ;
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
    const { BrandAllcon, allBrand } = this.props;
    let path=window.location.pathname+window.location.search
    path=path.replace("=","~")
    let brandUrl = SearchUtil.getBrandUrl(data, allBrand);
    // 同步是否是品牌词
    if (brandUrl) {
      this.setCookieFunc(data);
      window.location.href = brandUrl + "?isSearchFrom=" + encodeURI(data)+"&searchF="+path+"&isHotFrom=1";
      return;
    }
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
              linkhref = `/brand/${cont.brandNameEN}-${cont.brandId}/`+"&isHotFrom=1";
            }
            if (cont && cont.brandNickNames && cont.brandNickNames.length) {
              cont.brandNickNames.map((oj) => {
                if (
                  oj &&
                  (oj === data ||
                    oj === data.toUpperCase() ||
                    oj === data.toLowerCase())
                ) {
                  linkhref = `/brand/${cont.brandNameEN}-${cont.brandId}/`+"&isHotFrom=1";
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
      // recommendContent: data,
      searchCategory: "历史搜索",
      cat55: "历史搜索",
      searchTerm: data,
      kw55: data,
    });

    // A/B 搜索跳转
    this.setCookieFunc(data);
    // 优先匹配热词
    const { hotSearch } = this.props;
    let hotLink = null;

    if (hotSearch && hotSearch.length > 0) {
      hotSearch.map((item) => {
        if (item.contentDetails && item.contentDetails.length > 0) {
          item.contentDetails.map((item1) => {
            if (item1.text == data) {
              hotLink = item1.link + "&isHotFrom=1" + "&searchF=" + path;
            }
          });
        }
      });
    }
   
    window.location.href =hotLink|| linkhref+"&searchF="+path+"&isHotFrom=1";
  }
  setCookieFunc(data) {
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
  }
  clickAll() {
    const { popupAlert, historyArr } = this.props;
    popupAlert(1, "PopupCleaning", {
      _text: "是否清空搜索记录",
      _btnWord: "确定",
      _cancel: true,
      _callback: () => {
        let oldcookie = GetSingleCookie2V2({ key: "n_history" });
        if (oldcookie && oldcookie !== "false") {
          DelSingleCookie2({ key: "n_history", domain: ".sephora.cn" });
          historyArr([]);
          popupAlert(0, "PopupCleaning");
        }
      },
    });
  }
  componentDidUpdate(prevProps, prevState) {
    let Pixel = 750 / document.documentElement.clientWidth;
    let { needHidden } = prevState;
    if (!needHidden) {
      let ul = document.getElementById("ul");
      let li = document.querySelectorAll("#ul>li");
      let displayNoneDom = [];
      li &&
        li.forEach((v) => {
          if (
            (v.offsetTop * Pixel) / 100 > 0 &&
            (v.offsetTop * Pixel) / 100 <= 0.74
          ) {
            if (((v.offsetLeft + v.clientWidth) * Pixel) / 100 + 0.16 > 6.34) {
              displayNoneDom.push(v);
            }
          } else if ((v.offsetTop * Pixel) / 100 > 0.74) {
            this.setState({ needHidden: true });
            displayNoneDom.push(v);
          }
        });

      if (displayNoneDom.length) {
        ul.style.height = "1.44rem";
        ul.style.overflow = "hidden";
        displayNoneDom.forEach((v) => {
          v.style.display = "none";
        });
      }
    }
  }
  clickShowMore() {
    let Pixel = 750 / document.documentElement.clientWidth;
    let { showAll } = this.state;
    let ul = document.getElementById("ul");
    let li = document.querySelectorAll("#ul>li");
    let displayNoneDom = [];
    if (showAll) {
      this.setState({ showAll: false });
      li &&
        li.forEach((v) => {
          if (
            (v.offsetTop * Pixel) / 100 > 0 &&
            (v.offsetTop * Pixel) / 100 <= 0.74
          ) {
            if (((v.offsetLeft + v.clientWidth) * Pixel) / 100 + 0.16 > 6.34) {
              displayNoneDom.push(v);
            }
          } else if ((v.offsetTop * Pixel) / 100 > 0.74) {
            this.setState({ needHidden: true });
            displayNoneDom.push(v);
          }
        });
      if (displayNoneDom.length) {
        ul.style.height = "1.44rem";
        ul.style.overflow = "hidden";
        displayNoneDom.forEach((v) => {
          v.style.display = "none";
        });
      }
    } else {
      this.setState({ showAll: true });
      li &&
        li.forEach((v) => {
          v.style.display = "block";
          if (
            (v.offsetTop * Pixel) / 100 > 1.48 &&
            (v.offsetTop * Pixel) / 100 <= 2.22
          ) {
            if (((v.offsetLeft + v.clientWidth) * Pixel) / 100 + 0.16 > 6.34) {
              displayNoneDom.push(v);
            }
          } else if ((v.offsetTop * Pixel) / 100 > 2.22) {
            if (v) {
              displayNoneDom.push(v);
            }
          }
        });
      if (displayNoneDom.length) {
        ul.style.height = "2.88rem";
        ul.style.overflow = "hidden";
        displayNoneDom.forEach((v) => {
          v.style.display = "none";
        });
      }
      ul.style.height = "auto";
      let more = this.refs["arrow-more"];
      more.style.position = "relative";
      more.style.bottom = "0";
    }
  }
  render() {
    const { HISTORY_ARR } = this.props;
    let { needHidden, showAll } = this.state;
    let hotlist;
    const that = this;
    hotlist =
      HISTORY_ARR &&
      HISTORY_ARR.map((data, index) => {
        const dataDe = data;
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
      });
    let historyNum = false;
    if (HISTORY_ARR) {
      const arr = HISTORY_ARR;
      historyNum = arr.length;
    }

    return (
      <div className="history" style={historyNum ? {} : { display: "none" }}>
        <div className="hot_top">
          <div className="ht_left">
            <em className="ht_img" />
            <span className="ht_text">最近搜索</span>
          </div>
          <div className="ht_right">
            <span className="ht_change" onClick={this.clickAll} />
          </div>
        </div>

        {hotlist && (
          <div className="hot_content">
            <ul id="ul" ref={"content"} className={"content"}>
              {hotlist && hotlist}
              {needHidden ? (
                <CdnImage
                  style={showAll ? { transform: "rotate(180deg)" } : {}}
                  ref="arrow-more"
                  className="history-more"
                  src="/soa/nmobile/img/icon-search-more.png"
                  alt=""
                  onClick={this.clickShowMore.bind(this)}
                />
              ) : null}
            </ul>
          </div>
        )}

        <PopupAlert />
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
  popupAlert,
})(HistorySearch);
