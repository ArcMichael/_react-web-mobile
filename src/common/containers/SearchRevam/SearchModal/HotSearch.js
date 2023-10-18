import React from "react";
import { connect } from "react-redux";
import { getSearchBoxText } from "@/actions/search";
import Sensor from "@/Utils/sensor/index";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";

/**
 * @typedef {{
 * resultList: any[];
 * }} HotSearchProps
 */

/**
 * @extends {React.Component<HotSearchProps>}
 */
class HotSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  clickME(content, link, omniture) {
    let path=window.location.pathname+window.location.search
    path=path.replace("=","~")
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_Search##getSensorData##HotSearch.js##20",
      banner_type: "search",
      banner_content: content,
      banner_belong_area: "searchview",
      banner_to_url: link,
      banner_to_page_type: link,
      banner_ranking: "",
      belong_team: "Search",
      campaign_code: link || omniture || "",
      key_word_tpye: "ClickTerm",
      key_word_tpye_details: "Hot",
    });
    GoogleAnalytics.pushV2({
      event: "search",
      // recommendContent: content,
      searchCategory: "热门搜索",
      cat55:"热门搜索",
      searchTerm: content,
      kw55: content,
    });
    if (link) window.location.href = link+"&isHotFrom=1"+"&searchF="+path;
  }

  componentDidMount() {
    // let that = this;
    // window.addEventListener(
    //   'pageshow',
    //   function(e) {
    //     that.props.getSearchBoxText(callback => {
    //       that.setState({ resultList: callback });
    //     });
    //   },
    //   false,
    // );
  }

  componentDidUpdate() {
    const ul = document.getElementById("hot-ul");
    const li = document.querySelectorAll("#hot-ul>li");
    li &&
      li.forEach((v) => {
        if (v.offsetTop > 36) {
          if (v) {
            ul.style.height = "2rem";
            ul.style.overflow = "hidden";
          }
        }
      });
  }

  render() {
    const { resultList } = this.props;
    let resultListArr = [];
    // if (resultList && resultList.resourceList && resultList.resourceList.length) {
    //   resultListArr = resultList.resourceList.map((data, index) => {
    //     if (index < 10) {
    //       return (
    //         <li key={`HotSearch_${index}`} className="active">
    //           <div onClick={this.clickME.bind(this, data.content, data.link, data.omniture)}>{data.content}</div>
    //         </li>
    //       );
    //     }
    //   });
    // }
    if (resultList && resultList && resultList.length) {
      resultListArr = resultList.map((data, index) => {
        return (
          <li
            key={`HotSearch_${index}`}
            className={data.contentDetails[0].highLight ? "active" : ""}
          >
            <div
              onClick={this.clickME.bind(
                this,
                data.contentDetails[0].text,
                data.contentDetails[0].link,
                data.omniture,
              )}
            >
              {data.contentDetails[0].text}
            </div>
          </li>
        );
      });
    }
    return (
      <div className="hotsearch">
        <div className="hot_top">
          <div className="ht_left">
            <em className="ht_img" />
            <span className="ht_text">搜索发现</span>
          </div>
        </div>
        <div className="hot_content">
          <ul id="hot-ul">{resultListArr}</ul>
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  getSearchBoxText,
})(HotSearch);
