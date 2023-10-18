import React, { Component } from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import getRunEnv from "isomorphisms/getRunEnv";
import CdnImage from "@/components/CdnImage";
import QuestionItem from "../../components/GiftIntelligentRecommendation/QuestionItem";
import { urlGetParams } from "../../lib/url";
import * as device from "../../lib/device";
import { setupWeChat } from "../../actions/dependency";
import { popupAlert } from "../../actions/popup";
import PopupAlert from "../../components/PopupAlert";
import Sensor from "../../Utils/sensor";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/giftIntelligentRecommendation.scss");
}

export class GiftIntelligentRecommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStart: false,
    };
  }
  componentDidMount() {
    localStorage.removeItem("selectInfo");
    this.getShareInfo();
  }
  getShareInfo() {
    const { setupWeChat } = this.props;
    if (isBrowser()) {
      let env = getRunEnv();
      let host = "https://m.sephora.cn";
      if (env === "stage") {
        host = "https://stagem.sephora.cn";
      } else if (env === "ebf") {
        host = "https://ebfm.sephora.cn";
      }
      if (device.device_inMiniProgramsEnvironment()) {
        setupWeChat({
          callback: () => {
            wx &
              wx.miniProgram.postMessage({
                data: {
                  imageUrl:
                    "https://ssl1.sephorastatic.cn/soa/nmobile/img/giftRecommend/gift_share.jpeg",
                  path: `sp/web?url=${host}/v2/html/gift_intelligent_recommendation&activityCode=${urlGetParams(
                    window.location,
                    "activityCode"
                  )}&questionCode=${urlGetParams(
                    window.location,
                    "questionCode"
                  )}`,
                  title: "即刻互动，4步解锁心意爱礼",
                },
              });
          },
        });
        document.title = "臻心选礼";
      }
      // else if (device.isApp()) {
      //   window.getShareInfo = function() {
      //     dynamic.sepBridge().then(sep => {
      //       let miniProgramUsername = Utils.getMiniProgramUsername();
      //       let data = {
      //         title: "即刻互动，4步解锁心意爱礼",
      //         text: "",
      //         businessCode: 0,
      //         thumbImageUrl: "",
      //         imageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/giftRecommend/gift_share.jpeg",
      //         url: `${host}/v2/html/gift_intelligent_recommendation?activityCode=${urlGetParams(
      //           window.location,
      //           "activityCode",
      //         )}&questionCode=${urlGetParams(window.location, "questionCode")}`,
      //         miniProgramPath: `/pages/webView?url=${encodeURIComponent(
      //           `${host}/v2/html/gift_intelligent_recommendation?activityCode=${urlGetParams(
      //             window.location,
      //             "activityCode",
      //           )}&questionCode=${urlGetParams(window.location, "questionCode")}`,
      //         )}`,
      //         miniProgramUsername,
      //         miniProgramScene: "scene1",
      //         success: function(res) {
      //           if (res.usePost) {
      //             popupAlert(1, "PopupToast", { _text: "图片已保存到本地相册", _autoClose: true });
      //           } else {
      //             popupAlert(1, "PopupToast", { _text: "分享成功", _autoClose: true });
      //           }
      //         },
      //         failure: function(err) {
      //           popupAlert(1, "PopupToast", { _text: err.message, _autoClose: true });
      //         },
      //       };
      //       sep.shareApp && sep.shareApp(data);
      //     });
      //   };
      // }
    }
  }
  clickStart() {
    Sensor.go("giftSelectionClick", {
      button_name: "立即选礼",
      commodity_sku: "",
      OP_code: "",
    });
    this.setState({ isStart: true });
  }
  render() {
    let { isStart } = this.state;
    let content;
    if (isStart) {
      content = (
        <div className="gift_intelligent_recommendation">
          <div className="gift_intelligent_box">
            <QuestionItem />
          </div>
        </div>
      );
    } else {
      content = (
        <div className="landing-bg">
          <CdnImage
            className="landing-img"
            src="/soa/nmobile/img/giftRecommend/landing_page.png"
          />
          <div onClick={this.clickStart.bind(this)} className="gift-btn">
            {/* 立即选礼 */}
            {/* <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/giftRecommend/landing_gift.png" alt="" />{" "} */}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div id="apptitle">臻心选礼</div>
        {content}
        <PopupAlert _zIndex={1001} />
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
const mapDispatchToProps = {
  setupWeChat,
  popupAlert,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GiftIntelligentRecommendation);
