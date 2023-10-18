import React, { Component } from "react";
import { connect } from "react-redux";
import { popupAlert } from "@/actions/popup";
import Utils from "@/lib/utils";
import isBrowser from "@/Utils/utils/isBrowser";
import getRunEnv from "isomorphisms/getRunEnv";
import Message from "@/components/Message";
import { setupWeChat } from "@/actions/dependency";
import Dynamic from "@/Utils/Dynamic";
import ProcessCircle from "../../components/GiftIntelligentRecommendation_2/ProcessCircle";
import ResultBottom from "../../components/GiftIntelligentRecommendation_2/ResultBottom";
import PopupAlert from "../../components/PopupAlert";
import ProductList from "../../components/GiftIntelligentRecommendation_2/ProductList";
import { AJAX } from "../../lib/ajax";
import * as device from "../../lib/device";
import ScrollContainer from "../../components/ScrollContainer";
import { urlGetParams } from "../../lib/url";
import {
  questionRecommend_2,
  changeProductStatus_2,
} from "../../actions/giftIntelligentRecommendation";
import Sensor from "../../Utils/sensor";
// import Sensor from "../../Utils/sensor";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/giftIntelligentRecommendation.scss");
}
const dynamic = new Dynamic();
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("./style.scss");
}
export class Result extends Component {
  constructor(props) {
    super(props);
    this.renderSwiper = this.renderSwiper.bind(this);
    this.state = {
      budget: "",
      categoryCode: "",
      budgetCode: "",
      category: [],
      seleceBugent: true,
      selectVal: "",
      categoryName: "",
      op: 0,
      budgetPo: 3.2
    };
    this.left = 5;
  }
  componentDidMount() {
    this.initData();
    this.getShareInfo();
  }
  initData() {
    let bugentMap = {
      Budget1: "500元以下",
      Budget2: "500-1000元",
      Budget3: "1000-1500元",
      Budget4: "1500元以上",
    };
    let categoryMap = { Skincare: "护肤", Fragrance: "香水", MakeUp: "彩妆" };
    let pageNo = 1;
    let answerDtos = JSON.parse(localStorage.getItem("selectInfo"));
    let budget
    answerDtos.forEach((item)=>{
      if(bugentMap[item.answerCodes[0]]){
        budget=item.answerCodes[0]
      }
    })
    let params = {
      answerDtos: answerDtos,
      pageNo,
      category: "Skincare",
      budget
    };
    this.setState({
      budget: bugentMap[params.budget],
      categoryName: categoryMap[params.category],
      budgetCode: params.budget,
      categoryCode: params.category,
    });
    let { questionRecommend_2, changeProductStatus_2 } = this.props;
    questionRecommend_2(params, (callback) => {
      if (callback) {
        changeProductStatus_2(Object.assign({}, callback));
      }
    });
    //获取分类和预算
    AJAX(
      {
        type: "GET",
        url: `/v1/activity/qaa/recommend-gifts/dropDownList`,
      },
      (json) => {
        if (json.errorMessage) {
          Message({
            message: json.errorMessage,
          });
        } else {
          const category = json.results;
          this.setState({ category });
        }
      }
    );
  }
  rgbaToNum(_color, op) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var color = _color.toLowerCase();
    if (reg.test(color)) {
      if (color.length === 4) {
        var colorNew = "#";
        for (var i = 1; i < 4; i += 1) {
          colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
        }
        color = colorNew;
      }
      var colorChange = [];
      for (let i = 1; i < 7; i += 2) {
        colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
      }
      return "RGB(" + colorChange.join(",") + "," + op + ")";
    } else {
      return color;
    }
  }
  //分类切换
  handleSelectCat(e) {
    let { questionRecommend_2, changeProductStatus_2 } = this.props;
    let { budgetCode } = this.state;
    let categoryCode;
    let { category } = this.state;
    let categoryName = e.target.textContent;
    // let cateTarget = document.querySelectorAll(".cate_select");
    // let sliderTarget = document.querySelectorAll(".slider_bg");
    // if (categoryName === "护肤") {
    //   this.left = cateTarget[0].offsetLeft - sliderTarget[0].offsetWidth / 4;
    // }
    // if (categoryName === "香水") {
    //   this.left = cateTarget[1].offsetLeft - sliderTarget[0].offsetWidth / 3;
    // }
    // if (categoryName === "彩妆") {
    //   this.left = cateTarget[2].offsetLeft - sliderTarget[0].offsetWidth / 3;
    // }

    let categoryMap = category[0];
    categoryMap.forEach((val) => {
      if (categoryName === val.categoryName) {
        categoryCode = val.answerCode;
        this.setState({ categoryCode });
      }
    });
    let answerDtos = JSON.parse(localStorage.getItem("selectInfo"));
    let params = {
      answerDtos: answerDtos,
      pageNo: 1,
      category: categoryCode,
      budget: budgetCode,
    };
    questionRecommend_2(params, (callback) => {
      changeProductStatus_2(Object.assign({}, callback));
    });
    this.setState({ categoryName });
    Sensor.go("giftSelectionClick", {
      button_name: "",
      page_id: "MB_1000802",
      action_id: "1000802_001",
      page_detail: answerDtos,
    });
  }
  // 额度切换
  handleSelectBug(e) {
    let { questionRecommend_2, changeProductStatus_2 } = this.props;
    let { categoryCode, category } = this.state;
    let bugentMap = category[1];
    let budget = e.target.textContent;
    let budgetCode = "";
    bugentMap.forEach((val) => {
      if (budget === val.categoryName) {
        budgetCode = val.answerCode;
        this.setState({ budgetCode });
      }
    });
    let answerDtos = JSON.parse(localStorage.getItem("selectInfo"));
    let params = {
      answerDtos: answerDtos,
      pageNo: 1,
      category: categoryCode,
      budget: budgetCode,
    };
    questionRecommend_2(params, (callback) => {
      changeProductStatus_2(Object.assign({}, callback));
    });
    this.setState({
      selectVal: e.target.textContent,
      seleceBugent: true,
      budget: e.target.textContent,
    });
    Sensor.go("giftSelectionClick", {
      button_name: "",
      page_id: "MB_1000802",
      action_id: "1000802_001",
      page_detail: answerDtos,
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
            let miniProgramUsername = Utils.getMiniProgramUsername();
            let data = {
              title: "臻心选礼",
              text: "即刻定制节日礼单",
              businessCode: 0,
              postWithCodeType: "QRCode",
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
              miniProgramPath:"",
              miniProgramUsername,
              // miniProgramScene: "scene1",
              success: function (res) {
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
              failure: function (err) {
                popupAlert(1, "PopupToast", {
                  _text: err.message,
                  _autoClose: true,
                });
              },
            };
            sep.shareApp && sep.shareApp(data);
          });
        };
      }
    }
  }
  renderSwiper() {
    let { recommendResults } = this.props;
    let { seleceBugent, budget, category, categoryName, selectVal, budgetPo } =
      this.state;
    let bugentMap = category[1];
    let categoryMap = category[0];
    return (
      <div
        style={{ position: "relative", height: "100%" }}
        onScroll={(e) => {
          let ele_2 = document.querySelector(".gift_intelligent_result");
          let scrollTop = e.target.scrollTop;
          let ele = document.querySelector(".product_header");
          if (scrollTop > 0) {
            ele.style.height = 0;
            ele_2.style.paddingTop = 12 + "px";
            if (scrollTop < 200) {
              this.setState({ op: scrollTop / 200, budgetPo: 0 });
            }
          }
          if (scrollTop === 0) {
            this.setState({ op: 0, budgetPo: 3.4 });
            ele.style.height = 170 + "px";
          }
        }}
      >
        {recommendResults &&
          recommendResults.categorySkuDtos.map((item, index) => {
            return (
              <div style={{ overflow: "hidden", height: "100%" }}>
                <div
                  className="product_header"
                  style={{ height: "3.2rem", marginBottom: "0px" }}
                />
                {seleceBugent ? (
                  <div className="selece-bugent">
                    {categoryMap &&
                      categoryMap.map((item, key) => {
                        return (
                          <a
                            action_id="1000802_930"
                            href="javascript:void(0)"
                            key={key}
                            className="cate_select"
                            style={{
                              padding: "0 0.4rem",
                              color: `${categoryName === item.categoryName
                                  ? "#FFFFFF"
                                  : ""
                                }`,
                              backgroundColor: `${categoryName === item.categoryName
                                  ? recommendResults.color
                                  : ""
                                }`,
                            }}
                            onClick={(e) => {
                              return this.handleSelectCat(e);
                            }}
                          >
                            {item.categoryName}
                          </a>
                        );
                      })}
                    {/* <div
                      className="slider_bg"
                      style={{
                        backgroundColor: `${recommendResults.color}`,
                        left: `${this.left}px`,
                      }}
                    /> */}

                    <div
                      className="cate_select"
                      onClick={() => {
                        this.setState({ seleceBugent: false });
                      }}
                    >
                      <span>{budget}</span>
                      <img
                        className="select_arr"
                        src="https://sslstage1.sephorastatic.cn/soa/mobile/images/Icons_arrow_right.png"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="select_bag" style={{ top: `${budgetPo}rem` }}>
                    <div
                      className="bug_base_bag"
                      onClick={() => {
                        this.setState({ seleceBugent: true });
                      }}
                    >
                      <span>{budget}</span>
                      <img
                        className="select_arr_2"
                        src="https://sslstage1.sephorastatic.cn/soa/mobile/images/Icons_arrow_right.png"
                      />
                    </div>
                    {bugentMap &&
                      bugentMap.map((val, index) => {
                        return (
                          <a
                            action_id="1000802_930"
                            key={index}
                            style={{
                              backgroundColor: `${selectVal === val.categoryName
                                  ? this.rgbaToNum(
                                    recommendResults.color,
                                    "0.05"
                                  )
                                  : ""
                                }`,
                            }}
                            className={
                              selectVal === val.categoryName
                                ? "bugbag"
                                : "bug_base_bag"
                            }
                            onClick={
                              selectVal === val.categoryName
                                ? ""
                                : (e) => {
                                  return this.handleSelectBug(e);
                                }
                            }
                          >
                            <span style={{ color: "#000" }}>
                              {val.categoryName}
                            </span>
                            {selectVal === val.categoryName ? (
                              <span
                                style={{
                                  fontSize: "16px",
                                }}
                              >
                                <svg
                                  viewBox="0 0 1024 1024"
                                  className="icon-style"
                                >
                                  <path
                                    fill={this.rgbaToNum(
                                      recommendResults.color,
                                      "0.4"
                                    )}
                                    d="M392.533333 806.4L85.333333 503.466667l59.733334-59.733334 247.466666 247.466667L866.133333 213.333333l59.733334 59.733334L392.533333 806.4z"
                                  />
                                </svg>
                              </span>
                            ) : (
                              ""
                            )}
                          </a>
                        );
                      })}
                  </div>
                )}
                {
                  <div
                    className={
                      item.records.length === 0 ? "none-box" : "recomend-box"
                    }
                    style={{
                      height: "86%",
                      overflow: `${seleceBugent ? "scroll" : ""}`,
                    }}
                  >
                    <ProductList
                      records={recommendResults.categorySkuDtos[index].records}
                      _index={index}
                      currentIndex={0}
                    />
                  </div>
                }
              </div>
            );
          })}
      </div>
    );
  }
  ChildrenChange(val) {
    this.setState({
      showList: val,
    });
  }
  render() {
    let { recommendResults } = this.props;
    let { op } = this.state;
    return (
      <div>
        <div
          className="gift_intelligent_result"
          style={{
            overflow: "hidden",
            background: `linear-gradient(to bottom,${recommendResults && this.rgbaToNum(recommendResults.color, op)
              },${recommendResults && this.rgbaToNum(recommendResults.color, 0)
              }),url(${recommendResults && recommendResults.backgroundImageUrl
              }) no-repeat center / 100% 100%`,
          }}
        >
          <div id="apptitle">臻心选礼</div>
          <div style={{ height: "100%" }}>
            {recommendResults && this.renderSwiper()}
          </div>
          {/* {recommendResults && recommendResults.budget && (
          <ProcessCircle
            changeData={this.ChildrenChange.bind(this)}
            showList={this.state.showList}
            limit={recommendResults.budget}
          />
        )} */}
          <ProcessCircle
            changeData={this.ChildrenChange.bind(this)}
            showList={this.state.showList}
            color={recommendResults && recommendResults.color}
            limit={recommendResults && recommendResults.budget}
          />
          <ResultBottom
            changeData={this.ChildrenChange.bind(this)}
            showList={this.state.showList}
            limit={recommendResults && recommendResults.budget}
          />
          <PopupAlert _zIndex={1001} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  recommendResults: state.giftIntelligentNew.recommendResults,
});

const mapDispatchToProps = {
  questionRecommend_2,
  changeProductStatus_2,
  setupWeChat,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScrollContainer(Result));
