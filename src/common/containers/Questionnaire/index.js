/* eslint-disable import/extensions */
/* eslint-disable global-require */
import React, { Component } from "react";
// import CommonPageTitle from "@/components/CommonPageTitle";
import isBrowser from "@/Utils/utils/isBrowser";
import LazyloadImage from "@/components/LazyloadImage";
import Dynamic from "@/Utils/Dynamic";
import Sensor from "@/Utils/sensor";
import { connect } from "react-redux";
import { DelSingleCookie2 } from "@/lib/Tools";
import Answer from "./components/answer";
import ProblemList from "./components/problemList";
import Result from "./components/result";
import * as action from "../../lib/BLL";
import { setupWeChat } from "../../actions/dependency";

import getRunEnv from "../../../isomorphisms/getRunEnv";
import { urlGetParams } from "../../lib/url";
import * as device from "../../lib/device";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/questionnaire.scss");
}

const dynamic = new Dynamic();
class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      type:1,
      wxShareModal: false,
      popupTitle: null,
      homeInfo: null
    };
    this.clickShare = this.clickShare.bind(this)
    this.setValue = this.setValue.bind(this)
  }

  componentDidMount(){
    const step = urlGetParams(window.location,"step")
    this.setState({
      step: step || 1
    })
  }

  setValue(obj){
    this.setState(obj)
    if(obj.popupTitle){
      setTimeout(() => {
        this.setState({
          popupTitle: null
        })
      }, 3000);
    }
    if(obj.step){
      let url = window.location.href;
      url = url.replace(window.location.search, "");
      window.history.replaceState(
        {},
        "0",
        `${url}?id=${urlGetParams(window.location,"id")}&needrefresh=${obj.step  == 2 ? false : true}&step=${obj.step}&token=${urlGetParams(window.location,"token")}`,
      );
    }
    let that = this
    if(obj.homeInfo){
      const { setupWeChat } = this.props;
      if (device.isWeChat()) {
        setupWeChat({
          callback: () => {
            if (device.device_inMiniProgramsEnvironment()) {
              DelSingleCookie2({ key: "Token" });
              that.postMessage(obj.homeInfo);
            }
          },
        });
      }

    }
  }

  // 分享
  clickShare() {
    let that = this;
    const step = this.state.step
    Sensor.go("raffleGameClick", {
      OP_code: "",
      commodity_sku: "",
      button_name: "立即分享",
    });
   
    if (device.isWeChat()) {
      this.setState({
        wxShareModal: true,
      });
      // $("html, body").removeClass("overflow-hidden");
    } else if (device.isApp()) {
      let { coverImage } = this.state.homeInfo
      let imageUrl =
        coverImage || "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/lottery-share-banner.png";
      
      let host = "https://m.sephora.cn",
        // platforms,
        env = getRunEnv(),
        miniProgramUsername = "gh_e4e302a788ba";
      if (env === "stage") {
        host = "https://stagem.sephora.cn";
        miniProgramUsername = "gh_8f96bdb663d6";
      } else if (env === "ebf") {
        host = "https://ebfm.sephora.cn";
        miniProgramUsername = "gh_8f96bdb663d6";
      }
      let { mainTitle } = that.state.homeInfo
      let config = {
        title: mainTitle || "参与有礼 快问快答",
        text: "",
        imageUrl,
        url: `${host}/v2/html/questionnaire?id=${urlGetParams(
          window.location,
          "id"
        )}`,
        businessCode: 0,
        thumbImageUrl:"https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/sephora_default_logo.jpg",
        miniProgramUsername,
        miniProgramPath: `/pages/webView?nto=1&nui=1&url=${encodeURIComponent(
          `${host}/v2/html/questionnaire?id=${urlGetParams(
            window.location,
            "id"
          )}`
        )}`,
        success: function (res) {
          that.setValue({ popupTitle : "分享成功" })
          // 分享添加次数
          let platforms = "";
          switch (res.channel) {
            case "qq":
              platforms = "QQFriend";
              break;
            case "weibo":
              platforms = "SinaWeibo";
              break;
            case " wechat moment":
              platforms = "WechatTimeline";
              break;
            default:
              platforms = "WechatSession";
              break;
          }
          action.luckShare({activityId: urlGetParams(window.location,"id"),  platform: platforms},()=>{
            if(step === 1){
              that.answer.getHome();
            }else if(step === 3){
              that.result.getDetails(); 
            }
          })
        },
        failure: function (err) {
          that.setValue({ popupTitle : err.message })
        },
      };
      // $("html, body").removeClass("overflow-hidden");
      dynamic.sepBridge().then((sep) => {
        sep.shareApp && sep.shareApp(config);
      });
    }
  }

  postMessage(homeInfo) {
    // let { homeInfo } = this.state;
    let { coverImage, mainTitle } = homeInfo
    let imageUrl = coverImage || "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/lottery-share-banner.png";
    let host = "https://m.sephora.cn", env = getRunEnv()
    if (env === "stage") {
      host = "https://stagem.sephora.cn";
    } else if (env === "ebf") {
      host = "https://ebfm.sephora.cn";
    }
    const shareUrl = `${host}/v2/html/questionnaire?id=${urlGetParams(window.location,"id")}`
    wx & wx.miniProgram.postMessage({
      data: {
        imageUrl,
        path: `sp/web?nto=1&ncn=1&nshare=1&url=${encodeURIComponent(
          shareUrl
        )}`,
        title: mainTitle || "参与有礼 快问快答",
      }
    });
  }

  render() {
    const { step, type, wxShareModal, homeInfo, popupTitle } = this.state
    return (
      <div className="questionnaire">
        <div id="apptitle">SEPHORA问答</div>
        {/* <CommonPageTitle _title="SEPHORA有奖问答" _isBack /> */}
        { step == 1 && <Answer onRef={(ref)=> {this.answer=ref}} getRunEnv={getRunEnv} setValue={this.setValue} clickShare={this.clickShare} />}
        { step == 2 && <ProblemList homeInfo={homeInfo} setValue={this.setValue} type={type} />}
        { step == 3 && <Result onRef={(ref)=> {this.result=ref}} getRunEnv={getRunEnv} setValue={this.setValue} clickShare={this.clickShare} />}
        {wxShareModal && (
            <div
              className="award-box"
              onClick={() => {
                this.setState({ wxShareModal: false });
              }}
            >
              <LazyloadImage
                imgProps={{
                  className: "share-tips",
                  src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/share-tips.png",
                }}
              />
            </div>
          ) }
        {
          popupTitle && <div className="popup-lottery-popup-module" style={{height: popupTitle == "分享成功" ? '1.69rem' : '2.69rem'}}>
            {
              popupTitle == "分享成功" ?  null : <img
              className="popup-lottery-icon"
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/sign-disable.png"
            />
            }
          <p>{popupTitle}</p>
        </div>
        }
      </div>
    );
  }
}

// export default Questionnaire;
const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  setupWeChat
})(Questionnaire);