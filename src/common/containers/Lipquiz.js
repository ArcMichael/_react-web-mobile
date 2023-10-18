/*
 * @Author: Martin.song
 * @LastEditors: Martin.song
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-09-29 15:36:55
 * @LastEditTime: 2020-11-24 17:24:01
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import QuestionItem from "../components/LipQuiz/questionItem";
import { GetSingleCookie } from "../lib/Tools";
import { urlGetParams } from "../lib/url";
import * as device from "../lib/device";
import Sensor from "../Utils/sensor";
import CurrentComponentCommonTop from "../components/CommonTop";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/lipQiz.scss");
}

class LipQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStart: false,
    };
    this.bindClick = this.bindClick.bind(this);
  }
  componentDidMount() {
    let Token = GetSingleCookie(document.cookie, "Token") || urlGetParams(window.location, "token");
    if (!Token) {
      if (device.isApp()) {
        window.location.href =
          `${window.location.origin}/login?historyLocation=` +
          encodeURIComponent(window.location.href);
      } else {
        window.location.href = `/login?historyLocation=${encodeURIComponent(
          window.location.pathname.replace("/", "").replace("?", "&"),
        )}${window.location.search.replace("?", "&")}`;
      }
    }
    if (device.isApp()) {
      let params = {
        screenName: `campaign_LipQuiz`,
        screenType: "Campaign",
        URL: window.location.pathname,
      };

      let JSINVOKE = new window.SEPHORA_JSINVOKE();
      if (JSINVOKE.logEvent) {
        JSINVOKE.logEvent("customScreenView", params);
        JSINVOKE.logEvent("screen_view", params);
      }
    }
  }
  bindClick() {
    let Token = GetSingleCookie(document.cookie, "Token") || urlGetParams(window.location, "token");
    if (!Token) {
      if (device.isApp()) {
        window.location.href =
          `${window.location.origin}/login?historyLocation=` +
          encodeURIComponent(window.location.href);
      } else {
        window.location.href = `/login?historyLocation=${encodeURIComponent(
          window.location.pathname.replace("/", "").replace("?", "&"),
        )}${window.location.search.replace("?", "&")}`;
      }
    } else {
      this.setState({
        isStart: !this.state.isStart,
      });
    }
    Sensor.go("LipFinderClick", {
      button_name: "开始测试",
      commodity_sku: "",
      OP_code: "",
    });
  }
  render() {
    let { isStart } = this.state;
    return (
      <div>
        <CurrentComponentCommonTop />
        <div id="apptitle">LIP FINDER</div>
        {isStart ? (
          <QuestionItem />
        ) : (
          <div className="quiz_main_page">
            <div
              className={this.state.isStart ? "start_show" : "start_btn"}
              onClick={this.bindClick}
            >
              找到你的专属唇妆
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {})(LipQuiz);
