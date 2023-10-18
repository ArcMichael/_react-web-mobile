import React, { Component } from "react";
import { connect } from "react-redux";
import Swiper from "react-id-swiper";
import isBrowser from "@/Utils/utils/isBrowser";
import getRunEnv from "isomorphisms/getRunEnv";
import ProductList from "../../components/GiftIntelligentRecommendation/ProductList";
import ResultBottom from "../../components/GiftIntelligentRecommendation/ResultBottom";
import ProcessCircle from "../../components/GiftIntelligentRecommendation/ProcessCircle";
import ScrollContainer from "../../components/ScrollContainer";
import { GetSingleCookie } from "../../lib/Tools";
import {
  questionRecommend,
  getPopularityList,
  changeProductStatus,
} from "../../actions/giftIntelligentRecommendation";
import * as device from "../../lib/device";
import { setupWeChat } from "../../actions/dependency";
import { popupAlert } from "../../actions/popup";
import PopupAlert from "../../components/PopupAlert";
import { urlGetParams } from "../../lib/url";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/giftIntelligentRecommendation.scss");
}
export class RecommendResult extends Component {
  constructor(props) {
    super(props);
    this.renderSwiper = this.renderSwiper.bind(this);
    this.state = {
      showSlipModal: true,
      currentIndex: 0,
      params: {
        direction: "horizontal",
        autoplay: false,
        loop: false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          slideChange: () => {
            setTimeout(() => {
              this.handleSlideChange();
            }, 100);
          },
        },
        showList: false,
      },
    };
  }
  componentDidMount() {
    this.initData();
    this.getShareInfo();
  }
  initData() {
    let pageNo = 1;
    let answerDtos = JSON.parse(localStorage.getItem("selectInfo"));
    let { questionRecommend, getPopularityList, changeProductStatus } =
      this.props;
    questionRecommend({ answerDtos, pageNo: pageNo }, (callback) => {
      if (callback) {
        let _index;
        let flag =
          callback.categorySkuDtos &&
          callback.categorySkuDtos.some((item, index) => {
            if (item.records.length == 0) {
              _index = index;
              return true;
            } else {
              return false;
            }
          });
        if (flag) {
          getPopularityList({ pageNo }, (res) => {
            if (res.results) {
              let records = res.results.records;
              callback.categorySkuDtos[_index].records = [...records];
              callback.categorySkuDtos[_index].none = true;
              console.log(callback);
              changeProductStatus(Object.assign({}, callback));
            } else {
              changeProductStatus(Object.assign({}, callback));
            }
          });
        } else {
          changeProductStatus(Object.assign({}, callback));
        }
      }
    });
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
      //  else if (device.isApp()) {
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
  handleSlideChange() {
    let index = this.swiper ? this.swiper.activeIndex : 0;
    this.setState({ currentIndex: index }); //当前品类
  }

  renderSwiper() {
    let { recommendResults } = this.props;
    let { params, currentIndex } = this.state;
    if (
      recommendResults &&
      recommendResults.categorySkuDtos &&
      recommendResults.categorySkuDtos.length == 1
    )
      params.loop = false;
    return (
      <Swiper
        className="swiper-container"
        {...params}
        ref={(ref) => {
          this.swiper = ref && ref.swiper;
        }}
      >
        {recommendResults &&
          recommendResults.categorySkuDtos.map((item, index) => {
            return (
              <div key={`result_swiper_${index}`}>
                <div className="product_header">
                  <div>
                    {item.titleImageUrl && (
                      <img src={item.titleImageUrl} alt="" />
                    )}
                  </div>

                  <p>{item.text}</p>
                </div>
                {item && item.records.length > 0 && (
                  <div
                    className={item.none ? "none-box" : "recomend-box"}
                    style={{ height: "100%" }}
                  >
                    {item.none ? (
                      <div className="recommend-none">
                        <p className="none-text">
                          抱歉，该品类没有商品符合，看看下方礼品推荐
                        </p>
                        <div
                          className="reset-btn"
                          onClick={() => {
                            window.location.href = `/v2/html/gift_intelligent_recommendation${window.location.search}`;
                          }}
                        >
                          重新选礼
                          <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/giftRecommend/arrow_outlined.png" />{" "}
                        </div>
                      </div>
                    ) : null}
                    <ProductList
                      records={recommendResults.categorySkuDtos[index].records}
                      _index={index}
                      currentIndex={currentIndex}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </Swiper>
    );
  }
  clickKonw() {
    let expires = new Date();
    expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
    let cookieDomain = ".sephora.cn";
    document.cookie = `showSlipModal= 1;  expires= ${expires.toGMTString()}; path= /;domain=${cookieDomain}`;
    this.setState({ showSlipModal: false });
  }
  ChildrenChange(val) {
    this.setState({
      showList: val,
    });
  }
  render() {
    let { recommendResults } = this.props;
    let showSlipModal;
    if (GetSingleCookie(document.cookie, "showSlipModal")) {
      showSlipModal = false;
    } else {
      showSlipModal = this.state.showSlipModal;
    }
    return (
      <div
        className="gift_intelligent_result"
        style={{
          backgroundImage: `url(${
            recommendResults && recommendResults.backgroundImageUrl
          })`,
        }}
      >
        <div id="apptitle">臻心选礼</div>
        {/* 滑动手势 */}
        {showSlipModal &&
          recommendResults &&
          recommendResults.categorySkuDtos.length > 1 && (
            <div className="result_modal">
              <div className="modal_content">
                <img
                  className="slip_bg"
                  src="https://ssl1.sephorastatic.cn/soa/nmobile/img/giftRecommend/Slip_bg.png"
                  alt=""
                />
                <img
                  className="slip_final"
                  src={`https://ssl1.sephorastatic.cn/soa/nmobile/img/giftRecommend/Slip_final.gif?${Math.random()}`}
                  alt=""
                />
                <p className="main_title">滑动试试</p>
                <p className="sub_title">左右滑动可游览更多内容</p>
                <div className="know_btn" onClick={this.clickKonw.bind(this)}>
                  我知道了
                </div>
              </div>
            </div>
          )}
        <div style={{ height: "100%" }}>
          {recommendResults && this.renderSwiper()}
        </div>
        {recommendResults && recommendResults.budget && (
          <ProcessCircle
            changeData={this.ChildrenChange.bind(this)}
            showList={this.state.showList}
            limit={recommendResults.budget}
          />
        )}
        <ResultBottom
          changeData={this.ChildrenChange.bind(this)}
          showList={this.state.showList}
          limit={recommendResults && recommendResults.budget}
        />
        <PopupAlert _zIndex={1001} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recommendResults: state.giftIntelligent.recommendResults,
  };
};

const mapDispatchToProps = {
  questionRecommend,
  getPopularityList,
  changeProductStatus,
  setupWeChat,
  popupAlert,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScrollContainer(RecommendResult));
