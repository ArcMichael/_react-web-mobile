/*
 * @Author: summer
 * @Date: 2021-02-Su 03:21:48
 * @Last Modified by:   summer
 * @Last Modified time: 2021-02-Su 03:21:48
 */
import React, { Component } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import { popupAlert } from "@/actions/popup";
import Swiper from "react-id-swiper";
import Dynamic from "@/Utils/Dynamic";
import { DelSingleCookie2 } from "@/lib/Tools";
import isBrowser from "@/Utils/utils/isBrowser";
import LazyloadImage from "@/components/LazyloadImage";
import CdnImage from "@/components/CdnImage";
import { urlGetParams } from "../lib/url";

import {
  getLotteryEventInfo,
  lotteryStart,
  lotteryProducts,
  lotteryMyPrize,
  lotteryGift,
  lotteryShare,
} from "../actions/LotteryActivity";
import Video from "../components/Video/index";
import LotteryItem from "../components/LotteryActivity/lotteryItem";
import PopupAlert from "../components/PopupAlert";
import { setupWeChat } from "../actions/dependency";
import * as device from "../lib/device";
import Sensor from "../Utils/sensor";
import getRunEnv from "../../isomorphisms/getRunEnv";
if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/lotteryActivity.scss");
}
const dynamic = new Dynamic();
export class LotteryActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 被选中的格子的ID
      activedId: "",
      // 中奖ID
      prizeId: null,
      // 获得prizeId之后计算出的动画次数
      times: 0,
      // 当前动画次数
      actTimes: 0,
      // 是否正在抽奖
      isRolling: false,
      goodsList: [],
      myPrize: null,
      //是否中奖
      hasPrize: false,
      prizeBgUrl: null,
      //是否有次数
      hasNums: true,
    };
    this.postMessage = this.postMessage.bind(this);
  }
  componentDidMount() {
    const { setupWeChat } = this.props;
    const { prizeId, times, actTimes } = this.state;
    console.log(prizeId, times, actTimes);
    if (device.isWeChat()) {
      setupWeChat({
        callback: () => {
          if (device.device_inMiniProgramsEnvironment()) {
            DelSingleCookie2({ key: "Token" });
          }
          this.getEventInfoDetail();
        },
      });
    } else {
      this.getEventInfoDetail();
    }
  }
  getEventInfoDetail() {
    this.props.getLotteryEventInfo((callback) => {
      this.setState({
        renderData: callback,
      });
      if (device.device_inMiniProgramsEnvironment()) {
        this.postMessage();
      }
      if (callback && callback.eventStatus) {
        this.props.lotteryProducts({ pageNo: 1 }, (callback) => {
          this.setState({
            productTitle: callback.productTitle,
            goodsList: callback.records,
          });
        });
      }
    });
  }
  handleBegin() {
    if (this.state.renderData.limitCount > 0) {
      // this.state.isRolling为false的时候才能开始抽，不然会重复抽取，造成无法预知的后果
      if (!this.state.isRolling) {
        // 点击抽奖之后，将于九宫格有关的状态都还原默认
        this.setState(
          {
            activedId: "",
            prizeId: null,
            times: 0,
            actTimes: 0,
            isRolling: true,
          },
          () => {
            // 状态还原之后才能开始真正的抽奖
            this.handlePlay();
          }
        );
      }
    } else {
      $("html, body").addClass("overflow-hidden");
      this.setState({
        hasNums: false,
      });
    }
  }
  handlePlay() {
    this.props.lotteryStart((res) => {
      if (res.results) {
        this.setState({
          prizeId: res.results.position, // 中将id，
        });
        // 随机算出一个动画执行的最小次数，这里可以随机变更数值，按自己的需求来
        let times = 3 * Math.floor(Math.random() * 5 + 4);
        this.setState({
          times: times,
        });
        // 抽奖正式开始
        let t = 40;
        let _this = this;
        (function fn() {
          let timer = setInterval(function () {
            t += 10;
            fn();
            clearInterval(timer);
          }, t);
          let num;
          if (
            _this.state.activedId === _this.state.prizeId &&
            _this.state.actTimes > _this.state.times
          ) {
            // 符合上述所有条件时才是中奖的时候，两个ID相同并且动画执行的次数大于(或等于也行)设定的最小次数
            clearInterval(timer);

            if (res.results.hasPrize) {
              _this.setState({
                hasPrize: true,
                myPrize: res.results,
                isRolling: false,
                prizeBgUrl: res.results.bgImageUrl,
              });
              $("html, body").addClass("overflow-hidden");
            } else {
              _this.setState({
                isRolling: false,
                prizeText: "谢谢参与",
                prizeBgUrl: res.results.bgImageUrl,
              });
              $("html, body").addClass("overflow-hidden");
            }
            _this.props.getLotteryEventInfo((callback) => {
              _this.setState({
                renderData: callback,
              });
            });
            return;
          }
          // 以下是动画执行时对id的判断
          if (_this.state.activedId === "") {
            num = 0;
            _this.setState({
              activedId: num,
            });
          } else {
            num = _this.state.activedId;
            if (num === 8) {
              num = 0;
              _this.setState({
                activedId: num,
              });
            } else {
              num += 1;
              _this.setState({
                activedId: num,
              });
            }
          }
          _this.setState({
            actTimes: _this.state.actTimes + 1,
          });
        })();
      } else {
        this.setState({
          isRolling: false,
        });
      }
    });
    Sensor.go("raffleGameClick", {
      OP_code: "",
      commodity_sku: "",
      button_name: "立即抽奖",
    });
  }
  getMyPrize() {
    Sensor.go("raffleGameClick", {
      OP_code: "",
      commodity_sku: "",
      button_name: "我的奖品",
    });
    let { lotteryMyPrize } = this.props;
    lotteryMyPrize((res) => {
      if (res && res.hasPrize) {
        this.setState({
          hasPrize: true,
          myPrize: res,
          prizeBgUrl: res.bgImageUrl,
        });
        $("html, body").addClass("overflow-hidden");
      } else {
        this.setState({
          prizeText: "暂无中奖记录",
          prizeBgUrl: res.bgImageUrl,
        });
        $("html, body").addClass("overflow-hidden");
      }
    });
  }
  jumpDetail(skuId, spuId) {
    Sensor.go("raffleGameClick", {
      OP_code: `${spuId ? spuId : ""}`,
      commodity_sku: `${skuId ? skuId : ""}`,
      button_name: "推荐商品",
    });
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.navigateTo({
        url: `/pages/productDetail?productId=${spuId}`,
      });
    } else {
      if (skuId) {
        window.location.href = `/product/${spuId}.html?sku=${skuId}`;
      } else {
        window.location.href = `/product/${spuId}.html`;
      }
    }
  }
  clickGift() {
    Sensor.go("raffleGameClick", {
      OP_code: "",
      commodity_sku: "",
      button_name: "查看奖品",
    });
    this.props.lotteryGift((res) => {
      if (device.device_inMiniProgramsEnvironment()) {
        wx.miniProgram.navigateTo({
          url: res.prizeForwardUrl,
        });
      } else {
        window.location.href = res.prizeForwardUrl;
      }
    });
  }
  clickShare() {
    const { popupAlert } = this.props;
    Sensor.go("raffleGameClick", {
      OP_code: "",
      commodity_sku: "",
      button_name: "立即分享",
    });
    let { renderData } = this.state;
    let that = this;
    if (device.isWeChat()) {
      this.setState({
        hasNums: true,
        wxShareModal: true,
      });
      $("html, body").removeClass("overflow-hidden");
    } else if (device.isApp()) {
      let imageUrl =
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/lottery-share-banner.png";
      if (renderData) {
        renderData.lotteryElement &&
          renderData.lotteryElement.map((v, i) => {
            if (i == 0 && v.type == 1) {
              imageUrl = v.content.imageUrl;
            }
          });
      }
      let host = "https://m.sephora.cn",
        platforms,
        env = getRunEnv(),
        miniProgramUsername = "gh_e4e302a788ba";
      if (env === "stage") {
        host = "https://stagem.sephora.cn";
        miniProgramUsername = "gh_8f96bdb663d6";
      } else if (env === "ebf") {
        host = "https://ebfm.sephora.cn";
        miniProgramUsername = "gh_8f96bdb663d6";
      }
      let config = {
        title: "幸运九宫格 美力抽不停",
        text: "",
        imageUrl,
        url: `${host}/v2/html/lotteryActivity?id=${urlGetParams(
          window.location,
          "id"
        )}`,
        businessCode: 0,
        thumbImageUrl:
          "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/sephora_default_logo.jpg",
        miniProgramUsername,
        miniProgramPath: `/pages/webView?nto=1&nui=1&url=${encodeURIComponent(
          `${host}/v2/html/lotteryActivity?id=${urlGetParams(
            window.location,
            "id"
          )}`
        )}`,
        success: function (res) {
          popupAlert(1, "PopupToast", { _text: "分享成功", _autoClose: true });
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
          that.props.lotteryShare({ platforms });
          that.setState({
            hasNums: true,
          });
          that.props.getLotteryEventInfo((callback) => {
            that.setState({ renderData: callback });
          });
        },
        failure: function (err) {
          popupAlert(1, "PopupToast", { _text: err.message, _autoClose: true });
        },
      };
      $("html, body").removeClass("overflow-hidden");
      dynamic.sepBridge().then((sep) => {
        sep.shareApp && sep.shareApp(config);
      });
    }
  }
  postMessage() {
    let { renderData } = this.state;
    let imageUrl;
    if (renderData) {
      renderData.lotteryElement &&
        renderData.lotteryElement.map((v, i) => {
          if (i == 0 && v.type == 1) {
            imageUrl = v.content.imageUrl;
          }
        });
    }
    wx &
      wx.miniProgram.postMessage({
        data: {
          imageUrl,
          path: `sp/web?nto=1&ncn=1&nshare=1&url=${encodeURIComponent(
            window.location.href
          )}`,
          title: `${renderData && renderData.mainTitle
              ? renderData.mainTitle
              : "幸运九宫格 美力抽不停"
            }`,
        },
      });
  }
  clickAddress() {
    let host = "https://m.sephora.cn",
      env = getRunEnv();
    if (env === "stage") {
      host = "https://stagem.sephora.cn";
    } else if (env === "ebf") {
      host = "https://ebfm.sephora.cn";
    }
    const { popupAlert } = this.props;
    const { myPrize } = this.state;
    if (myPrize && myPrize.lotteryEnd) {
      if (myPrize && myPrize.lotteryAddressDto) {
      } else {
        popupAlert(1, "PopupToast", { _text: "活动已结束", _autoClose: true });
      }
    } else {
      if (device.device_inMiniProgramsEnvironment()) {
        wx.miniProgram.navigateTo({
          url: `/sp/web?nto=1&nui=1&url=${encodeURIComponent(
            `${host}/myAccount/address?id=${urlGetParams(
              window.location,
              "id"
            )}&type=lottery`
          )}`,
        });
      } else {
        window.location.href = `/myAccount/address?id=${urlGetParams(
          window.location,
          "id"
        )}&type=lottery`;
      }
    }
  }
  addressDteail() {
    this.setState({
      hasAddress: true,
    });
  }
  render() {
    const {
      activedId,
      goodsList,
      renderData,
      hasPrize,
      prizeText,
      myPrize,
      prizeBgUrl,
      productTitle,
      hasNums,
      hasAddress,
      wxShareModal,
    } = this.state;
    let startBtn,
      boxBackground,
      prizeBgImage,
      styleBottom,
      params,
      address,
      palyStatus = false;
    if (renderData && renderData.btnText) {
      startBtn = renderData.btnText;
    } else {
      startBtn = (
        <div>
          <p>立即抽奖</p>
          <div className="go-text">
            <span>GO</span>
            {/* <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/go-icon.png" alt="" /> */}
          </div>
        </div>
      );
    }
    if (renderData && renderData.backgroundImage) {
      boxBackground = {
        backgroundImage: "url(" + renderData.backgroundImage + ")",
      };
    }
    prizeBgImage = {
      backgroundSize: "100%",
      backgroundImage: "url(" + prizeBgUrl + ")",
    };
    if (goodsList && goodsList.length > 0) {
      styleBottom = { marginBottom: ".8rem" };
    }
    if (
      renderData &&
      renderData.luckyInfos.length &&
      renderData.luckyInfos.length === 1
    ) {
      params = {};
    } else if (
      renderData &&
      renderData.luckyInfos.length &&
      renderData.luckyInfos.length < 5
    ) {
      params = {
        direction: "vertical",
        autoplay: false,
        loop: false,
        slidesPerView: "auto",
      };
    } else {
      params = {
        direction: "vertical",
        autoplay: {
          delay: 1000,
          disableOnInteraction: false,
        },
        slidesPerView: 4.5,
        loop: true,
        loopedSlides: 12,
        observer: true,
        observeParents: true,
        centerInsufficientSlides: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
      };
    }
    //抽奖按钮
    if (renderData) {
      if (renderData.btnStatus) palyStatus = true;
      if (renderData.shareCount) {
        if (
          renderData.shareCount == renderData.userShareCount &&
          renderData.limitCount == 0
        ) {
          palyStatus = true;
        }
      } else {
        if (renderData.limitCount == 0) palyStatus = true;
      }
    }
    if (myPrize && myPrize.lotteryAddressDto) {
      address = `${myPrize.lotteryAddressDto.province}${myPrize.lotteryAddressDto.city}${myPrize.lotteryAddressDto.district}${myPrize.lotteryAddressDto.address}`;
    }
    if (renderData && renderData.eventStatus) {
      return (
        <div className="activity-box" style={boxBackground}>
          {renderData &&
            renderData.lotteryElement &&
            renderData.lotteryElement.length > 0 &&
            renderData.lotteryElement.map((v, i) => {
              //1：图片 2：视频  3：抽奖模块
              if (v.type == 1) {
                return (
                  <a
                    key={`lottery-activity-banner-${i}`}
                    href={
                      v.content.linkUrl
                        ? v.content.linkUrl
                        : "javascript:void(0);"
                    }
                    className="lottery-banner-box"
                  >
                    <LazyloadImage
                      imgProps={{
                        key: `lottery-activity-banner-${i}`,
                        className: `lottery-activity-banner lottery-activity-banner-${i}`,
                        src: v.content.imageUrl,
                      }}
                    />

                    {v.type == 1 && i == 0 ? (
                      <div className="lottery-banner-title">
                        <p>{renderData.mainTitle}</p>
                        <p>{renderData.subTitle}</p>
                      </div>
                    ) : null}
                  </a>
                );
              } else if (v.type == 2) {
                return (
                  <Video
                    key={`backgroudUrlList-${i}`}
                    poster="https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/lottery-poster.png"
                    src={v.content}
                    type="mp4"
                  />
                );
                /* 抽奖模块 */
              } else if (v.type == 3) {
                return (
                  <div key={`lottery-activity-${i}`}>
                    <div className="lottery-activity">
                      <div className="one">
                        <LotteryItem
                          content={v.content[0]}
                          activedId={activedId}
                        />
                        <LotteryItem
                          content={v.content[1]}
                          activedId={activedId}
                        />
                        <LotteryItem
                          content={v.content[2]}
                          activedId={activedId}
                        />
                      </div>
                      <div className="one">
                        <LotteryItem
                          content={v.content[7]}
                          activedId={activedId}
                        />
                        <button
                          className={[
                            "start_button",
                            palyStatus ? "unClick" : "",
                          ].join(" ")}
                          disabled={palyStatus ? "disabled" : ""}
                          onClick={() => this.handleBegin()}
                        >
                          {startBtn}

                          {renderData && renderData.noneStatus ? (
                            <div className="left">
                              剩余{renderData && renderData.limitCount}次
                            </div>
                          ) : null}
                        </button>
                        <LotteryItem
                          content={v.content[3]}
                          activedId={activedId}
                        />
                      </div>
                      <div className="one">
                        <LotteryItem
                          content={v.content[6]}
                          activedId={activedId}
                        />
                        <LotteryItem
                          content={v.content[5]}
                          activedId={activedId}
                        />
                        <LotteryItem
                          content={v.content[4]}
                          activedId={activedId}
                        />
                      </div>
                      {/* 我的奖品 */}
                      <div className="lottery-mygift">
                        <div
                          className="mygift-left"
                          dangerouslySetInnerHTML={(() => {
                            return {
                              __html:
                                renderData.lottoTips &&
                                renderData.lottoTips.replace(/\n/g, "<br />"),
                            };
                          })()}
                        />
                        <div
                          className="mygift-right"
                          onClick={this.getMyPrize.bind(this)}
                        >
                          <div
                            className={[
                              "lottery-gift-icon",
                              renderData && renderData.hasPrize
                                ? "lottery-gift-icon-animate"
                                : "",
                            ].join(" ")}
                          />
                          <span>我的奖品</span>
                        </div>
                      </div>
                    </div>
                    <div className="lottery-info" style={styleBottom}>
                      {/* 奖品模块 */}
                      <div className="lottery-gift">
                        <p>奖品设置</p>
                        <div className="gift-box">
                          {renderData &&
                            renderData.lotteryPrize &&
                            renderData.lotteryPrize.length > 0 &&
                            renderData.lotteryPrize.map((item, index) => {
                              return (
                                <div
                                  className="gift-item"
                                  key={`gift_item_${index}`}
                                >
                                  <div>{item.prizeLevelName}</div>
                                  <LazyloadImage
                                    imgProps={{
                                      className: "gift-pic",
                                      src: item.prizeImageUrl,
                                    }}
                                  />
                                  <div>{item.prizeName}</div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      {/* 中奖名单 */}
                      <div className="lottery-list">
                        {renderData &&
                          renderData.luckyInfos &&
                          renderData.luckyInfos.length > 0 ? (
                          <div>
                            <p>中奖名单</p>
                            <ul className="list-ul">
                              {renderData &&
                                renderData.luckyInfos &&
                                renderData.luckyInfos.length > 0 ? (
                                <Swiper {...params}>
                                  {renderData &&
                                    renderData.luckyInfos &&
                                    renderData.luckyInfos.length > 0 &&
                                    renderData.luckyInfos.map((v, i) => {
                                      return (
                                        <div
                                          className="list-item"
                                          key={`list-li-${i}`}
                                        >
                                          {v}
                                        </div>
                                      );
                                    })}
                                </Swiper>
                              ) : null}
                            </ul>
                          </div>
                        ) : null}
                        {/* <div className="btn">
                          我的奖品
                        </div> */}
                      </div>

                      {/* 游戏细则 */}
                      {renderData && renderData.descriptionText ? (
                        <div className="lottery-rule">
                          <div className="rule-box-shadow" />
                          <p>活动细则</p>
                          <div
                            dangerouslySetInnerHTML={(() => {
                              return {
                                __html: renderData.descriptionText.replace(
                                  /\n/g,
                                  "<br />"
                                ),
                              };
                            })()}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              }
            })}

          {/* 推荐商品 */}
          {goodsList && goodsList.length > 0 ? (
            <div className="recommend-goods">
              <p>{productTitle}</p>
              <div className="goods-box">
                {goodsList.map((item, index) => {
                  return (
                    <div
                      className="goods-item"
                      key={`goods-item_${index}`}
                      onClick={this.jumpDetail.bind(
                        this,
                        item.skuId,
                        item.spuId
                      )}
                    >
                      <LazyloadImage
                        imgProps={{
                          src: `${item.imagePath}180x180.jpg`,
                        }}
                      />
                      <div className="goods-name">
                        {item.brandEN}
                        {item.productNameCN}
                      </div>
                      <div className="goods-price">
                        <div className="price-old">
                          {item.costPrice ? `¥${item.costPrice}` : null}
                        </div>
                        <div className="price-new">
                          {item.price ? `¥${item.price}` : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {/* 我的奖品弹框 */}
          {hasPrize ? (
            <div className={"award-box"}>
              {hasAddress ? (
                <div className="award-content">
                  <div className="award-bg address" style={prizeBgImage}>
                    <div className="award-title">中奖啦</div>
                    {myPrize && myPrize.lotteryAddressDto && (
                      <div className="award-address">
                        <div className="address-items">
                          收货人：
                          {myPrize && myPrize.lotteryAddressDto.userName}
                        </div>
                        <div className="address-items">
                          手机号码：
                          {myPrize && myPrize.lotteryAddressDto.mobile}
                        </div>
                        <div className="address-items">详细地址：{address}</div>
                      </div>
                    )}
                    <div className="address-tips">
                      请确认您的收货地址，活动结束后无法修改哦～
                    </div>
                    {myPrize && myPrize.lotteryEnd ? (
                      <CdnImage
                        className="award-btn"
                        src="/soa/nmobile/img/lottery/address-sure-btn.png"
                        onClick={() => {
                          this.setState({
                            hasPrize: false,
                            prizeText: null,
                            hasAddress: false,
                          });
                          $("html, body").removeClass("overflow-hidden");
                        }}
                      />
                    ) : (
                      <CdnImage
                        className="award-btn"
                        src="/soa/nmobile/img/lottery/address-edit-btn.png"
                        onClick={this.clickAddress.bind(this)}
                      />
                    )}
                  </div>
                  <LazyloadImage
                    imgProps={{
                      className: "award-close",
                      src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/close-icon.png",
                      onClick:() => {
                        this.setState({
                          hasPrize: false,
                          prizeText: null,
                          hasAddress: false,
                        });
                        $("html, body").removeClass("overflow-hidden");
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="award-content">
                  <div className="award-bg" style={prizeBgImage}>
                    <div className="award-title">中奖啦</div>
                    <LazyloadImage
                      imgProps={{
                        className: "award-pic",
                        src: myPrize && myPrize.prizeImageUrl,
                        onClick:this.addressDteail.bind(this)
                      }}
                     />
                    {myPrize && myPrize.prizeType == "goods" ? (
                      <div>
                        {myPrize && myPrize.lotteryAddressDto ? (
                          <LazyloadImage
                            imgProps={{
                              className: "award-btn",
                              src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/address-detail-btn.png",
                              onClick:this.addressDteail.bind(this)
                            }}
                           />
                        ) : (
                          <LazyloadImage
                            imgProps={{
                              className: "award-btn",
                              src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/address-fill-btn.png",
                              onClick:this.clickAddress.bind(this)
                            }}
                           />
                        )}
                      </div>
                    ) : (
                      <LazyloadImage
                        imgProps={{
                          className: "award-btn",
                          src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/award-btn.png",
                          onClick:this.clickGift.bind(this)
                        }}
                       />
                    )}

                    <div className="award-txt">{myPrize && myPrize.tips}</div>
                  </div>
                  <LazyloadImage
                    imgProps={{
                      className: "award-close",
                      src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/close-icon.png",
                      onClick:() => {
                        this.setState({
                          hasPrize: false,
                          prizeText: null,
                          hasAddress: false,
                        });
                        $("html, body").removeClass("overflow-hidden");
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ) : prizeText ? (
            <div className={"award-box"}>
              <div className="my-award-content">
                <div className="my-award-bg" style={prizeBgImage}>
                  <div className="none-award-title">{prizeText}</div>
                  <div
                    className="sure-btn"
                    onClick={() => {
                      this.setState({
                        hasPrize: false,
                        prizeText: null,
                        hasAddress: false,
                      });
                      $("html, body").removeClass("overflow-hidden");
                    }}
                  >
                    确定
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* 没有次数需要分享 */}
          {hasNums ? null : (
            <div className="award-box">
              <div className="award-content">
                <div className="lottery-none-nums">
                  <div className="none-txt">
                    抽奖机会已用完，分享好友可增加抽奖机会
                  </div>
                  <div
                    className="share-btn"
                    onClick={this.clickShare.bind(this)}
                  >
                    立即分享
                  </div>
                </div>
                <LazyloadImage
                  imgProps={{
                    className: "award-close",
                    src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/lottery/close-icon.png",
                    onClick:() => {
                      this.setState({
                        hasPrize: false,
                        prizeText: null,
                        hasNums: true,
                      });
                      $("html, body").removeClass("overflow-hidden");
                    }
                  }}
                />
              </div>
            </div>
          )}
          {wxShareModal ? (
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
          ) : null}
          <PopupAlert />
        </div>
      );
    } else {
      return (
        <div>
          <PopupAlert />
        </div>
      );
    }
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  getLotteryEventInfo,
  lotteryStart,
  lotteryProducts,
  lotteryMyPrize,
  setupWeChat,
  lotteryGift,
  lotteryShare,
  popupAlert,
})(LotteryActivity);
