/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-10-20 11:10:06
 * @LastEditTime: 2021-03-22 12:45:14
 */
import React, { Component } from "react";
import Swiper from "react-id-swiper";
import isBrowser from "@/Utils/utils/isBrowser";
import Dynamic from "@/Utils/Dynamic";
import { gainPointBanner } from "../../lib/BLL";
import * as device from "../../lib/device";
import { setupWeChat } from "../../Utils/wechat";
import { getParms } from "../../components/RewardsBoutiqueStore/util";
import { LocationToH5 } from "../../lib/MPTools";
import Image from "../../components/ImagesLazyLoad/index";

const dynamic = new Dynamic();

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/exchange.scss");
}
const params = {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  loop: false,
};
export default class gainPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointRuleBanner1: [],
      pointRuleBanner2: [],
      pointRuleBanner3: [],
      pointRuleBanner4: [],
      store: false,
    };
  }
  componentDidMount() {
    if (device.device_inMiniProgramsEnvironment()) {
      setupWeChat({});
      document.title = "赚积分";
      const store = getParms("store");
      this.setState({ store });
    }
    dynamic.sepBridge().then((sep) => {
      sep.hideCloseButton && sep.hideCloseButton();
    });
    gainPointBanner().then((res) => {
      this.setState({
        pointRuleBanner1: res.pointRuleBanner1,
        pointRuleBanner2: res.pointRuleBanner2,
        pointRuleBanner3: res.pointRuleBanner3,
        pointRuleBanner4: res.pointRuleBanner4,
      });
    });
  }
  renderSwiper(bannerImgInfo, type) {
    const { store } = this.state;
    if (bannerImgInfo && bannerImgInfo.length > 0) {
      if (bannerImgInfo.length === 1) {
        params.loop = false;
        params.pagination = {};
      }

      return (
        <Swiper className="swiper-container" {...params}>
          {bannerImgInfo.map((item, index) => (
            <div key={index + "_" + item.baseImgUrl}>
              <a
                onClick={() => {
                  if (type && store) return false;
                  if (device.device_inMiniProgramsEnvironment()) {
                    if (item.mpUrl) {
                      wx.miniProgram.reLaunch({
                        url: item.mpUrl,
                      });
                    } else {
                      window.location.href = item.linkUrl;
                    }
                  } else {
                    if (item.linkUrl) {
                      LocationToH5(item.linkUrl, false);
                      // window.location.href = item.linkUrl
                    }
                  }
                }}
              >
                <Image
                  className="swiperImage"
                  src={
                    (item && item.gifImgUrl) ||
                    `${item && item.baseImgUrl}S.jpg`
                  }
                  size={150}
                  offset={0}
                />
                {/*<img*/}
                {/*  className="swiperImage"*/}
                {/*  src={(item && item.gifImgUrl) || `${item && item.baseImgUrl}S.jpg`}*/}
                {/*  size={150}*/}
                {/*  offset={0}*/}
                {/*/>*/}
              </a>
            </div>
          ))}
        </Swiper>
      );
    }
  }
  render() {
    let {
      pointRuleBanner1,
      pointRuleBanner2,
      pointRuleBanner3,
      pointRuleBanner4,
    } = this.state;

    return (
      <div className="gainpoint_page">
        <div id="apptitle">赚积分</div>
        {pointRuleBanner1 &&
          pointRuleBanner1.length > 0 &&
          this.renderSwiper(pointRuleBanner1, true)}
        {pointRuleBanner2 &&
          pointRuleBanner2.length > 0 &&
          this.renderSwiper(pointRuleBanner2)}
        <div className="point-usage-content">
          <p className="point-usage">积分使用</p>
          {pointRuleBanner3 &&
            pointRuleBanner3.length > 0 &&
            this.renderSwiper(pointRuleBanner3)}
          {pointRuleBanner4 &&
            pointRuleBanner4.length > 0 &&
            this.renderSwiper(pointRuleBanner4, true)}
        </div>
      </div>
    );
  }
}
