import React from "react";
import { connect } from "react-redux";
import { getSearchBoxText } from "../../actions/search";
import Sensor from "../../Utils/sensor/index";
import { CheckCampaignCode } from "../../lib/Tools";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";
class HotSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultList: [],
    };
  }
  componentWillUpdate() {}
  clickME(content, link, omniture) {
    
    let linkhref = `/hot/?k=${content}`;
    link && (linkhref = link);
    linkhref = CheckCampaignCode(linkhref, omniture);
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_Search##getSensorData##HotSearch.js##20",
      banner_type: "search",
      banner_content: content,
      banner_belong_area: "searchview",
      banner_to_url: linkhref,
      banner_to_page_type: linkhref,
      banner_ranking: "",
      belong_team: "Search",
      campaign_code: linkhref || omniture || "",
      key_word_tpye: "ClickTerm",
      key_word_tpye_details: "Hot",
    });
    GoogleAnalytics.pushV2({
      event: "search",
      // recommendContent: "",
      searchCategory: "热门搜索",
      cat55:"热门搜索",
      searchTerm: content,
      kw55:content,
    });
    window.location.href = linkhref;
  }
  componentDidMount() {
    let that = this;
    window.addEventListener(
      "pageshow",
      function () {
        that.props.getSearchBoxText((callback) => {
          that.setState({ resultList: callback });
        });
      },
      false
    );
  }
  componentWillUnmount() {
    window.removeEventListener("pageshow", function () {}, false);
  }
  render() {
    const { resultList } = this.state;
    let resultListArr = [];
    if (
      resultList &&
      resultList.resourceList &&
      resultList.resourceList.length
    ) {
      resultListArr = resultList.resourceList.map((data, index) => {
        if (index < 10) {
          return (
            <li key={`HotSearch_${index}`}>
              <div
                onClick={this.clickME.bind(
                  this,
                  data.content,
                  data.link,
                  data.omniture
                )}
              >
                {data.content}
              </div>
            </li>
          );
        }
      });
    }
    return (
      <div>
        <div className="hotsearch">
          <div className="hot_top">
            <div className="ht_left">
              <em className="ht_img" />
              <span className="ht_text">热门搜索</span>
            </div>
          </div>
          <div className="hot_content">
            <ul>{resultListArr}</ul>
          </div>
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
