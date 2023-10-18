/*
 * @Author: summer
 * @Date: 2020-10-22 17:08:56
 * @function mgm申领
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import Dynamic from "@/Utils/Dynamic";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import isBrowser from "@/Utils/utils/isBrowser";
import { urlGetParams } from "../../lib/url";
import PopupAlert from "../../components/PopupAlert";
import Video from "../../components/Video/index";
import { getActivityEventInfo } from "../../actions/mgmTrialIndex";
import * as device from "../../lib/device";
import CurrentComponentCommonTop from "../../components/CommonTop";
import MgmProgressBar from "../../components/Mgm/MgmProgressBar";
import Image from "../../components/ImagesLazyLoad/index";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/MgmTrialIndex.scss");
}

const dynamic = new Dynamic();
if (isBrowser()) {
  window.getShareData = function () {
    let shareV2Info = JSON.parse(localStorage.getItem("shareV2Info"));
    if (shareV2Info) {
      return shareV2Info;
    }
  };
}

export class MgmTrialIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderData: null,
      currentGuideIndex: 0,
      showRule: true,
      closeGuideStyle: "close_guide_0",
      toFixedTop: false,
    };
  }
  componentDidMount() {
    this.props.getActivityEventInfo((callback) => {
      this.setState({
        renderData: callback,
        showGuide: callback.showGuide,
      });
    });
    if (isBrowser()) {
      window.addEventListener("scroll", this.bindHandleScroll);
    }
    if (device.isApp()) {
      let eventId = urlGetParams(window.location, "eventId");
      let params = {
        screenName: `campaign_mgmTrialApplicationIndex_${eventId}`,
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
  bindHandleScroll = () => {
    const scrollTop = bodyScrollTop.get();
    if (scrollTop > this.ref.getBoundingClientRect().height / 2) {
      this.setState({
        showRule: false,
      });
    } else {
      this.setState({
        showRule: true,
      });
    }
    if (scrollTop > 345) {
      this.setState({
        toFixedTop: true,
      });
    } else {
      this.setState({
        toFixedTop: false,
      });
    }
  };
  componentWillUnmount() {
    window.removeEventListener("scroll", this.bindHandleScroll);
  }
  userClick() {
    const { renderData } = this.state;
    if (renderData && renderData.applyStatus == 1) {
      let param = renderData && renderData.shareInfo;
      dynamic.sepBridge().then((sep) => {
        sep.probationShare && sep.probationShare(param);
      });
    } else {
      window.location.href = renderData && renderData.btnHref;
    }
  }
  clickRankList(showRankList) {
    const { renderData } = this.state;
    let btnText = "";
    if (renderData.giftEventStepInfo) {
      if (renderData.giftEventStepInfo.giftEventStepDtos[0].applyStatus === 1) {
        btnText = renderData.canNotApplyButtonTxt;
      } else {
        btnText = renderData.assistanceRankButtonTxt;
      }
    } else {
      if (renderData.applyStatus === 1) {
        btnText = renderData.canNotApplyButtonTxt;
      } else {
        btnText = renderData.assistanceRankButtonTxt;
      }
    }

    window.location.href = `/v2/html/mgmRankList?eventId=${urlGetParams(
      window.location,
      "eventId"
    )}&btnText=${renderData && encodeURIComponent(btnText)}&eventStatus=${
      renderData.eventStatus
    }&showRankList=${showRankList}&leaderboardNum=${renderData.leaderboardNum}`;
  }
  clickGuide() {
    localStorage.setItem(`${urlGetParams(window.location, "eventId")}`, true);
    const { renderData } = this.state;
    let index = this.state.currentGuideIndex;
    index++;
    if (index < renderData.guideImageUrlList.length) {
      this.setState({
        currentGuideIndex: index,
        closeGuideStyle: `close_guide_${index}`,
      });
    } else {
      this.setState({
        showGuide: true,
      });
    }
  }
  clickCloseGuide() {
    localStorage.setItem(`${urlGetParams(window.location, "eventId")}`, true);
    this.setState({
      showGuide: true,
    });
  }
  clickToBottom() {
    document.querySelector("#rule").scrollIntoView();
  }
  clickToTop() {
    document.querySelector("#top").scrollIntoView();
  }
  render() {
    const {
      renderData,
      currentGuideIndex,
      showGuide,
      showRule,
      closeGuideStyle,
      toFixedTop,
    } = this.state;
    return (
      <div className="mgm_page_index" id="top" ref={(ref) => (this.ref = ref)}>
        <CurrentComponentCommonTop />
        <div id="apptitle">申领试用</div>
        <div id="shareType">1</div>
        {/* <img
          className="mgm_page_Image"
          src={
            renderData &&
            renderData.backgroudUrlList &&
            renderData.backgroudUrlList.length > 0 &&
            renderData.backgroudUrlList[0].url
          }
        /> */}
        {renderData &&
          renderData.backgroudUrlList &&
          renderData.backgroudUrlList.length > 0 &&
          renderData.backgroudUrlList[0].url && (
            <Image
              className="mgm_page_Image"
              src={
                renderData &&
                renderData.backgroudUrlList &&
                renderData.backgroudUrlList.length > 0 &&
                renderData.backgroudUrlList[0].url
              }
            />
          )}
        {renderData &&
        renderData.avatarArr &&
        renderData.avatarArr.length > 0 ? (
          <div
            className={[
              "mgm_page_applyButton",
              toFixedTop ? "to_fixed_top" : "",
            ].join(" ")}
          >
            <div className="mgm_avatar">
              {renderData &&
                renderData.avatarArr.length > 0 &&
                renderData.avatarArr.map((item, index) => {
                  if (item && item.partnerAvatarUrl) {
                    return (
                      <img
                        key={index}
                        src={item.partnerAvatarUrl}
                        style={{ zIndex: `${99 - index}` }}
                        alt=""
                      />
                    );
                  } else {
                    return (
                      <Image
                        key={index}
                        style={{ zIndex: `${99 - index}` }}
                        src="https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm_none.png"
                        alt=""
                      />
                    );
                  }
                })}
            </div>
            <button
              className="ad_desc"
              disabled={
                renderData && renderData.rankBtnStatus ? "disabled" : ""
              }
              onClick={this.clickRankList.bind(this, 0)}
            >
              <div id="wrapper" className="wrapper">
                <div className="inner">
                  <p
                    className={
                      renderData && renderData.adDesc.length > 10
                        ? "animate"
                        : "txt"
                    }
                  >
                    {renderData && renderData.adDesc}
                  </p>
                </div>
              </div>
              <div className="arrow_right">
                <Image
                  className="mgm_page_Image"
                  src="https://ssl1.sephorastatic.cn/soa/nmobile/img/Icons_Arrow_Outlined_grey.png"
                />{" "}
              </div>
            </button>
          </div>
        ) : null}
        {renderData && renderData.giftEventStepInfo ? (
          <MgmProgressBar _giftEventStepInfo={renderData.giftEventStepInfo} />
        ) : null}
        <div className="mgm_page_show">
          {renderData &&
            renderData.backgroudUrlList &&
            renderData.backgroudUrlList.length > 0 &&
            renderData.backgroudUrlList.slice(1).map((item, index) => {
              // 1---> video  2--->image
              if (item.type === 1) {
                return item.url ? (
                  <Video
                    key={`backgroudUrlList-${index}`}
                    src={item.url}
                    type="mp4"
                    height="420px"
                    width="750px"
                    poster="https://ssl1.sephorastatic.cn/soa/nmobile/img/defaultCover.jpg"
                  />
                ) : null;
              } else if (item.type === 2) {
                return (
                  <a
                    key={`backgroudUrlList-${index}`}
                    href={item.link ? item.link : "javascript:;"}
                  >
                    {/* <img className="mgm_page_con_backgroudUrl" src={item.url} /> */}
                    <Image
                      className="mgm_page_con_backgroudUrl"
                      src={item.url}
                    />
                  </a>
                );
              }
            })}
        </div>
        {renderData && renderData.descriptionText ? (
          <div className="mgm_page_con_description">
            <p className="mgm_page_con_description-title">活动细则</p>
            <p
              className="mgm_page_con_description-con"
              dangerouslySetInnerHTML={(() => {
                return {
                  __html: renderData.descriptionText.replace(/\n/g, "<br />"),
                };
              })()}
             />
          </div>
        ) : null}
        {renderData && renderData.showRank ? (
          <button
            disabled={renderData && renderData.rankBtnStatus ? "disabled" : ""}
            className="mgm_rank_list"
            onClick={this.clickRankList.bind(this, 1)}
          >
            排行榜
          </button>
        ) : (
          ""
        )}
        <div id="rule" />
        {/* href={renderData && renderData.btnHref ? renderData.btnHref : 'javascript:;'} */}
        {renderData && renderData.btnText ? (
          <a className="mgm_apply_btn">
            <button
              onClick={this.userClick.bind(this)}
              className={
                renderData && renderData.btnStatus === 1 ? "unClick" : ""
              }
              disabled={
                renderData && renderData.btnStatus === 1 ? "disabled" : ""
              }
            >
              {renderData && renderData.btnText}
            </button>
          </a>
        ) : null}
        {/* 引导图 */}
        {!showGuide &&
        renderData &&
        renderData.guideImageUrlList &&
        renderData.guideImageUrlList.length > 0 ? (
          <div className="guide_img" onClick={this.clickGuide.bind(this)}>
            {renderData.guideImageUrlList.map((val, i) => {
              return (
                <div
                  key={`img_${i}`}
                  className={[
                    `guide_img_${i}`,
                    i == currentGuideIndex ? "display_status" : "",
                  ].join(" ")}
                >
                  {/* <img src={val} alt="" /> */}
                  <Image src={val} />
                  <div
                    className={closeGuideStyle}
                    onClick={this.clickCloseGuide.bind(this)}
                   />
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
        {showRule && renderData ? (
          <a onClick={this.clickToBottom.bind(this)}>
            <Image
              className="right_arrow_top"
              src=" https://ssl1.sephorastatic.cn/soa/nmobile/img/Icons_Backtobottom.png"
            />
          </a>
        ) : (
          <a onClick={this.clickToTop.bind(this)}>
            <Image
              className="right_arrow_top"
              src=" https://ssl1.sephorastatic.cn/soa/nmobile/img/Icons_Backtotop.png"
            />
          </a>
        )}
        <PopupAlert />
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  getActivityEventInfo,
})(MgmTrialIndex);
