/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-10-09 16:32:17
 * @LastEditTime: 2021-04-20 14:57:20
 */
import React from "react";
import { connect } from "react-redux";
import Swiper from "react-id-swiper";
import { popupAlert } from "@/actions/popup";
import { setupWeChat } from "@/actions/dependency";
import {
  getParms,
  server,
  WeChatPath,
  setParms,
} from "../RewardsBoutiqueStore/util";
import DonateMutation from "./DonateMutation";
import Bulletcomments from "./Bulletcomments";
import * as device from "../../lib/device";
import Image from "../ImagesLazyLoad/index";
import getRunEnv from "../../../isomorphisms/getRunEnv";

//获得banner条
const getHtmlPageUrl = "/v1/rewards-boutique/integral_donate/getHtmlPage";
//捐助接口
const postdonateUrl = "/v1/rewards-boutique/integral_donate/donate";
//捐助规格
const getStandardsUrl = "/v1/rewards-boutique/integral_donate/standards";
//捐助者列表
const getRecentListUrl =
  "/v1/rewards-boutique/integral_donate/recentDonateHistoryList";

const getUserHomepageInfourl = "/v1/portal/card/base/info";

const params = {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
  },
  loop: true,
};
class IntergalDonate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlPage: null,
      standards: null,
      remainPoint: 0,
      isShowDUnation: false,
      buttonShow: true, //发送请求时 立即捐助不生效
      showNow: false, // 接口返回时显示默认值
    };
    this.donateHandler = this.donateHandler.bind(this);
    this.cancelModale = this.cancelModale.bind(this);
    this.enderSwiper = this.renderSwiper.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }
  static isNonateComponent = false;
  getBaseInfo = (fn) => {
    let channel = "MOBILE";
    const that = this;
    const getUserHomepageInfo = server(
      "getUserHomepageInfo",
      getUserHomepageInfourl,
      {
        headers: {
          channel,
        },
      }
    );
    getUserHomepageInfo.then((value) => {
      if (value && value.jQueryStatus && value.jQueryStatus.status === 401) {
        window.location.href = `/login?historyLocation=${window.location.pathname} ${window.location.search}`;
      } else if (value && value.results && value.results.cardNo) {
        setParms({ key: "cardNo", value: value.results.cardNo });
        that.setState(
          {
            cardNo: value.results.cardNo,
          },
          () => {
            fn(value.results.cardNo);
          }
        );
      } else {
        window.location.href = `/login?historyLocation=${window.location.pathname} ${window.location.search}`;
      }
    });
  };
  postMessage() {
    let env = getRunEnv();
    let host = "https://m.sephora.cn";
    if (env === "stage") {
      host = "https://stagem.sephora.cn";
    } else if (env === "ebf") {
      host = "https://ebfm.sephora.cn";
    }
    wx &
      wx.miniProgram.postMessage({
        data: {
          imageUrl:
            "https://ssl1.sephorastatic.cn/soa/nmobile/img/donate_poster_banner.jpg?" +
            Date.parse(new Date()),
          path: `sp/web?nto=1&ncn=1&url=${host}/v2/html/intergalDonate`,
          title: "积分公益捐",
        },
      });
  }
  componentDidMount() {
    let token = getParms("Token");
    let cardNo = getParms("cardNo");
    const that = this;
    this.setState({
      cardNo,
      token,
    });

    const { setupWeChat } = this.props;

    if (device.device_inMiniProgramsEnvironment()) {
      setupWeChat({
        callback: () => {
          that.postMessage();
        },
      });
      document.title = "积分公益捐";
    }
    this.getData();
  }

  donateHandler(item) {
    const that = this;
    this.setState(
      {
        buttonShow: false,
      },
      () => {
        const cardNo = getParms("cardNo");
        const postdonate = server("donate", postdonateUrl, {
          Method: "POST",
          data: {
            standardId: item.id,
            integral: item.integral,
            money: item.value,
            cardNo: cardNo,
          },
        });
        postdonate.then(
          (data) => {
            if (data.results && data.results.recordId) {
              that.setState({
                buttonShow: true,
              });
              window.location.href = WeChatPath(`/v2/html/certificate`);
            }
          },
          () => {
            that.setState({
              buttonShow: true,
            });
          }
        );
      }
    );
  }
  otherClick = () => {
    if (this.state.remainPoint === 0) {
      return;
    }
    const { isShowDUnation } = this.state;
    const that = this;
    if (!isShowDUnation) {
      this.getBaseInfo((res) => {
        const cardNo = res || this.state.cardNo;
        that.isNonateComponent = true;
        // 捐助规格
        const getStandards = server(
          "donate",
          getStandardsUrl + `?cardNo=${cardNo}`
        );
        getStandards.then((json) => {
          this.setState({
            standards: json.results,
          });
        });
        // this.getData();
      });
    } else {
      this.cancelModale();
    }
  };
  cancelModale = () => {
    const { isShowDUnation } = this.state;
    if (!this.isNonateComponent && isShowDUnation) {
      this.setState({
        isShowDUnation: false,
      });
    }
    this.isNonateComponent = false;
  };
  showDonate = () => {
    this.setState({
      isShowDUnation: true,
    });
  };
  getData() {
    const getHtmlPage = server("getHtmlPage", getHtmlPageUrl);
    const getRecentList = server("getRecentList", getRecentListUrl);
    // 捐助背景页
    getHtmlPage.then((json) => {
      this.setState({
        htmlPage: json.results.content,
        remainPoint: json.results.remainPoint,
        bannerImgInfo: json.results.bannerImgInfo,
        showNow: true,
      });
    });
    // 捐助者列表
    getRecentList.then((json) => {
      this.setState({ bulletChatList: json.results.content });
    });
  }
  renderSwiper(bannerImgInfo) {
    if (bannerImgInfo && bannerImgInfo.length > 0) {
      if (bannerImgInfo.length === 1) {
        params.loop = false;
        params.pagination = {};
      }
      return (
        <Swiper {...params}>
          {bannerImgInfo.map((item, index) => (
            <div key={`verson-a${index}`} className="swiper-item">
              {/* {bannerImgInfo.lenght},,{index} */}
              <Image
                src={
                  (item && item.gifImgUrl) || `${item && item.baseImgUrl}S.jpg`
                }
                className="swiper-slide  swiper-lazy swiperImage"
              />
              {/*<img src={item && item.gifImgUrl || `${item && item.baseImgUrl}S.jpg`} className="swiper-slide  swiper-lazy swiperImage" />*/}
              {/* <div className="swiper-lazy-preloader" /> */}
            </div>
          ))}
        </Swiper>
      );
    }
  }
  render() {
    const {
      htmlPage,
      standards,
      remainPoint,
      showNow,
      bulletChatList,
      isShowDUnation,
      bannerImgInfo,
      buttonShow,
      token, // TODO: 请移除无用state
    } = this.state;
    console.log(this.state.bulletChatList, "外层数据");
    console.log(token);
    return (
      <div className="intergalDonateContainer" onClick={this.cancelModale}>
        <div id="apptitle">积分公益捐</div>
        <Bulletcomments bulletChatList={bulletChatList} />
        <div className="swiperBanner">
          {bannerImgInfo &&
            bannerImgInfo.length > 0 &&
            this.renderSwiper(bannerImgInfo)}
        </div>
        <div
          className="serverHtml"
          dangerouslySetInnerHTML={{ __html: htmlPage }}
         />
        <div
          onClick={this.otherClick}
          className={
            isShowDUnation && standards && remainPoint
              ? "ShowDUnationModal"
              : ""
          }
          id="otherClick"
        >
          {!standards && remainPoint > 0 && (
            <div className="donateBtnContainer" data-value="donateBtnContainer">
              <div className="modalContainer">
                <div className="normal">
                  <a
                    onClick={() => {
                      this.showDonate();
                    }}
                  >
                    立即捐赠
                  </a>
                </div>
              </div>
            </div>
          )}
          {!standards && remainPoint === 0 && showNow === true && (
            <div className="donateBtnContainer" data-value="donateBtnContainer">
              <div className="full">
                <a>感谢您的参与，今日爱心捐赠已满</a>
              </div>
            </div>
          )}
          {standards && remainPoint && (
            <DonateMutation
              key="DonateMutation_time"
              buttonShow={buttonShow}
              {...standards}
              showDonate={this.showDonate}
              cancelModale={this.cancelModale}
              isDonate={isShowDUnation}
              donateHandler={this.donateHandler}
              remainPoint={remainPoint}
            />
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, { popupAlert, setupWeChat })(
  IntergalDonate
);
