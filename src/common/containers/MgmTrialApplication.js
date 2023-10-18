/*
 * @Author: leo.si
 * @Date: 2019-07-10 17:18:26
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-22 18:16:24
 * @function 小程序试用申领Mob版本
 */

import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { getGiftEventInfo, userClikcButton, offlineButton } from "../actions/mgmTrialApplication";
import Video from "../components/Video/index";
import PopupAlert from "../components/PopupAlert";
import { urlGetParams } from "../lib/url";
import * as device from "../lib/device";
import Image from "../components/ImagesLazyLoad/index";
import CurrentComponentCommonTop from "../components/CommonTop";
if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/MgmTrialApplication.scss");
}
class MgmTrialApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderData: null,
    };
    this.userClick = this.userClick.bind(this);
  }
  componentDidMount() {
    this.props.getGiftEventInfo((callback) => {
      this.setState({
        renderData: callback,
      });
    });
    if (device.isApp()) {
      let eventId = urlGetParams(window.location, "eventId");
      let params = {
        screenName: `campaign_mgmTrialApplication_${eventId}`,
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
  userClick() {
    const { renderData } = this.state;
    if (renderData && renderData.isReceived) {
      window.location.href = renderData.btnLinkOnline;
    } else {
      this.props.userClikcButton(renderData, (callback) => {
        this.setState({
          renderData: callback,
        });
      });
    }
  }
  clickOfflineBtn() {
    // 线下领取
    const { renderData } = this.state;
    // 如果领取了就直接跳转

    if (renderData && renderData.offlineTypeFlag === 1) {
      // 卡券跳转小程序
      window.location.href = renderData && renderData.btnHref;
    } else {
      if (renderData && renderData.isReceived) {
        window.location.href = renderData.btnLinkOffline;
        return false;
      }
      // 调领取单，多档优惠券接口
      this.props.offlineButton(renderData, (callback) => {
        this.setState({
          renderData: callback,
        });
      });
    }
  }
  render() {
    const { renderData } = this.state;
    let descText;
    if (renderData && renderData.descriptionText) {
      descText = (
        <div className="mgm_page_con_description">
          <p className="mgm_page_con_description-title">活动细则</p>
          <p
            className="mgm_page_con_description-con"
            dangerouslySetInnerHTML={(() => {
              return { __html: renderData.descriptionText.replace(/\n/g, "<br />") };
            })()}
           />
        </div>
      );
    } else {
      renderData &&
        renderData.backgroudUrlList &&
        renderData.backgroudUrlList.length > 0 &&
        renderData.backgroudUrlList
          .slice(renderData.backgroudUrlList.length - 1)
          .map((item, index) => {
            descText = (
              <a key={`backgroudUrlList-${index}`} href={item.link ? item.link : "#"}>
                <Image className="mgm_page_con_backgroudUrl" src={item.url} />
              </a>
            );
          });
    }
    return (
      <div className="mgm_page_con">
        <div id="apptitle">申领详情</div>
        <CurrentComponentCommonTop />
        <p className="mgm_page_con_applyTitle">{renderData && renderData.applyTitle}</p>
        <Image
          className="mgm_page_con_applyImage"
          src={renderData && renderData.applyBackgroundImageUrl}
        />
        {/* <img className="mgm_page_con_applyImage" src={renderData && renderData.applyBackgroundImageUrl} /> */}
        <div className="mgm_page_con_applyButton">
          {renderData && renderData.showOnlineBtn ? (
            <button
              onClick={this.userClick}
              className={renderData && renderData.btnOnlineStatus === 1 ? "unClick" : ""}
              disabled={renderData && renderData.btnOnlineStatus === 1 ? "disabled" : ""}
            >
              {/* 线上领取按钮 */}
              {renderData && renderData.btnTextOnline}
            </button>
          ) : null}
          {renderData && renderData.showOfflineBtn ? (
            <button
              onClick={this.clickOfflineBtn.bind(this)}
              className={renderData && renderData.btnOfflineStatus === 1 ? "unClick" : ""}
              disabled={renderData && renderData.btnOfflineStatus === 1 ? "disabled" : ""}
            >
              {/* 线下领取按钮 */}
              {renderData && renderData.btnTextOffline}
            </button>
          ) : null}
        </div>
        {/* eventType 1  MGM  0  paid sampling  */}
        {renderData && renderData.eventType === "0" ? (
          <div className="mgm_page_con_show">
            {renderData &&
              renderData.backgroudUrlList &&
              renderData.backgroudUrlList.length > 0 &&
              renderData.backgroudUrlList.map((item, index) => {
                // 1---> video  2--->image
                if (item.type === 1) {
                  return item.url ? (
                    <Video
                      key={`backgroudUrlList-${index}`}
                      src={item.url}
                      type="mp4"
                      height="420px"
                      width="650px"
                      poster="https://ssl1.sephorastatic.cn/soa/nmobile/img/defaultCover.jpg"
                    />
                  ) : null;
                } else if (item.type === 2) {
                  return (
                    <a key={`backgroudUrlList-${index}`} href={item.link ? item.link : "#"}>
                      <Image className="mgm_page_con_backgroudUrl" src={item.url} />
                    </a>
                  );
                }
              })}
            {renderData && renderData.descriptionText ? (
              <div className="mgm_page_con_description">
                <p className="mgm_page_con_description-title">活动细则</p>
                <p
                  className="mgm_page_con_description-con"
                  dangerouslySetInnerHTML={(() => {
                    return { __html: renderData.descriptionText.replace(/\n/g, "<br />") };
                  })()}
                 />
              </div>
            ) : null}
          </div>
        ) : (
          descText
        )}
        <PopupAlert />
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  getGiftEventInfo,
  userClikcButton,
  offlineButton,
})(MgmTrialApplication);
