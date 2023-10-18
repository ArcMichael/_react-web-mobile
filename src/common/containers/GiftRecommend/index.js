import React, { Component } from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { giftsQuestion } from "@/actions/giftIntelligentRecommendation";
import lottie from "lottie-web";
import getRunEnv from "isomorphisms/getRunEnv";
import * as device from "@/lib/device";
import { urlGetParams } from "@/lib/url";
import Dynamic from "@/Utils/Dynamic";
// import Utils from "@/lib/utils";
import { setupWeChat } from "@/actions/dependency";
import { popupAlert } from "@/actions/popup";
import QuestionOne from "./components/questionOne";
import QuestionTwo from "./components/questionTwo";
import QuestionThree from "./components/questionThree";
import QuestionFour from "./components/questionFour";
import FinishAnimate from "./components/finishAnimate.js";
const dynamic = new Dynamic();
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("./style.scss");
}
export class GiftRecommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showQuestionOne: false,
      showQuestionTwo: false,
      showQuestionThree: false,
      showQuestionFour: false,
      showFinishAnimate: false,
      fillAnimate: true,
    };
    this.clickCb = this.clickCb.bind(this);
  }
  clickCb(value) {
    this.setState(value);
  }
  componentDidMount() {
    localStorage.removeItem("selectInfo");
    this.lodaAniamte();
    this.getShareInfo();
    this.getBase64Image(
      "https://stagestatic.sephora.cn/mouse_icon1637657651801.png"
    );
  }
  lodaAniamte() {
    let container = document.getElementById("lottie");
    this.anim = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/dist/images/giftStart/rc.json",
    });
    this.anim.addEventListener("DOMLoaded", () => {
      document.getElementsByTagName("svg")[0].style.height = "auto";
    });
    this.anim.addEventListener("loopComplete", () => {
      this.anim.destroy();
      this.setState({
        showQuestionOne: true,
        fillAnimate: false,
      });
    });
  }
  getShareInfo() {
    const { setupWeChat, popupAlert } = this.props;
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
            wx.miniProgram.postMessage({
              data: {
                imageUrl:
                  "https://sslstage1.sephorastatic.cn/soa/mobile/images/gift_share_mp.jpg",
                path: `sp/web?url=${host}/campaign/share/giftFinder&activityCode=${urlGetParams(
                  window.location,
                  "activityCode"
                )}&questionCode=${urlGetParams(
                  window.location,
                  "questionCode"
                )}`,
                title: "即刻定制节日礼单",
              },
            });
          },
        });
        document.title = "臻心选礼";
      } else if (device.isApp()) {
        window.getShareInfo = function () {
          dynamic.sepBridge().then((sep) => {
            // let miniProgramUsername = Utils.getMiniProgramUsername();
            let data = {
              title: "臻心选礼",
              text: "即刻定制节日礼单",
              businessCode: 0,
              appMenuType :1,
              thumbImageUrl:
                "https://ssl1.sephorastatic.cn/soa/mobile/images/gift_share_app.jpeg",
              imageUrl:
                "https://sslstage1.sephorastatic.cn/soa/mobile/images/gift_share_mp.jpg",
              url: `${host}/campaign/share/giftFinder?activityCode=${urlGetParams(
                window.location,
                "activityCode"
              )}&questionCode=${urlGetParams(window.location, "questionCode")}&appMenuType=1`,
              // miniProgramPath: `/pages/webView?url=${encodeURIComponent(
              //   `${host}/campaign/share/giftFinder?activityCode=${urlGetParams(
              //     window.location,
              //     "activityCode"
              //   )}&questionCode=${urlGetParams(
              //     window.location,
              //     "questionCode"
              //   )}`
              // )}`,
              // miniImageUrl:
              //   "https://sslstage1.sephorastatic.cn/soa/mobile/images/gift_share_mp.jpg",
              // miniProgramUsername,
              // miniProgramScene: "scene1",
              miniImageUrl:"",
              success: (res) => {
                if (res.usePost) {
                  popupAlert(1, "PopupToast", {
                    _text: "图片已保存到本地相册",
                    _autoClose: true,
                  });
                } else {
                  popupAlert(1, "PopupToast", {
                    _text: "分享成功",
                    _autoClose: true,
                  });
                }
              },
              failure: (err) => {
                popupAlert(1, "PopupToast", {
                  _text: err.message,
                  _autoClose: true,
                });
              },
            };
            sep.shareApp(data);
          });
        };
      }
    }
  }
  getBase64Image(url) {
    var that = this;
    var image = new Image();
    image.src = url + "?v=" + Math.random(); // 处理缓存
    image.crossOrigin = "*"; // 支持跨域图片
    image.onload = () => {
      var base64 = that.drawBase64Image(image);
      that.setState({
        imgBase64: base64,
      });
    };
  }
  drawBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }
  render() {
    const {
      showQuestionOne,
      showQuestionTwo,
      showQuestionThree,
      showQuestionFour,
      showFinishAnimate,
      fillAnimate,
      imgBase64,
    } = this.state;
    return (
      <div
        className={`${showQuestionOne
          ? "giftRecommend-container"
          : "giftRecommend-containerbg"
          } ${fillAnimate ? "fill-animate" : ""}`}
        id="lottie"
      >
        <div id="apptitle">臻心选礼</div>
        {showQuestionOne && (
          <QuestionOne _clickCb={this.clickCb} imgBase64={imgBase64} />
        )}
        {showQuestionTwo && <QuestionTwo _clickCb={this.clickCb} />}
        {showQuestionThree && <QuestionThree _clickCb={this.clickCb} />}
        {showQuestionFour && <QuestionFour _clickCb={this.clickCb} />}
        {showFinishAnimate && <FinishAnimate />}
        {(showQuestionTwo || showQuestionThree || showQuestionFour) && (
          <div className={`gift-box `}>
            <div className="gift-box-item">
              <img
                className={`${showQuestionTwo ? "animate__bounceInLeft" : ""}  
                animate__animated`}
                src="https://sslstage1.sephorastatic.cn/soa/mobile/images/gift_box.png"
                alt=""
              />
              <div className="suspension-box" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, {
  giftsQuestion,
  popupAlert,
  setupWeChat,
})(GiftRecommend);
