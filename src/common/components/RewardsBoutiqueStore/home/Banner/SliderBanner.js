/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-09-29 17:15:34
 * @LastEditTime: 2021-04-20 17:49:41
 */
import React from "react";
import Swiper from "react-id-swiper";
import Sensor from "@/Utils/sensor/index";
import { isWeChat, WeChatPath } from "../../util";

const params = {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  loop: true,
  lazy: true,
};

export default class SliderBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myScore: 0,
      overScore: 0,
      overDate: 0,
    };
  }
  componentDidUpdate() {
    const { myScore, overScore, overDate } = this.state; // TODO: 请移除无用state
    console.log(myScore, overScore, overDate);
    var bannerItems = document.getElementsByClassName("swiper-slide");
    const { brandId } = this.props;
    for (var i = 0, length = bannerItems.length; i < length; i++) {
      bannerItems[i].onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e && e.target && e.target.dataset && e.target.dataset.item) {
          var bannerObj = JSON.parse(e.target.dataset.item) || {};
          if (bannerObj.button_name === "top_banner" && brandId !== null) {
            return false;
          }
          Sensor.go("pointMall_hp_click", {
            button_name: bannerObj.button_name,
          });
          if (isWeChat()) {
            if (bannerObj.mpUrl) {
              wx.miniProgram.reLaunch({
                url: bannerObj.mpUrl,
              });
            } else if (bannerObj.linkUrl) {
              window.location.href = WeChatPath(bannerObj.linkUrl);
            } else {
              return false;
            }
          } else {
            if (bannerObj.linkUrl) {
              window.location.href = bannerObj.linkUrl;
            }
            return false;
          }
        }
      };
    }
  }
  lazyGifByimg(item, index) {
    item.button_name = "top_banner";
    let imgItem = (
      <img
        id={index}
        ref={item.ref}
        className="swiperImage"
        // onLoad={loadImage}
        data-item={JSON.stringify(item)}
        src={(item && item.gifImgUrl) || `${item && item.baseImgUrl}S.jpg`}
        size={150}
      />
    );
    return imgItem;
  }
  getSlider(topBanners) {
    // topBanners[1]=topBanners[0]
    const { brandId } = this.props;
    if (topBanners.length === 1) {
      params.loop = false;
      params.pagination = {};
    }
    const silder = (
      <Swiper {...params}>
        {topBanners &&
          topBanners.length > 0 &&
          topBanners.map((item, index) => (
            <div key={index + "_" + item.baseImgUrl}>
              <div
                onClick={() => {
                  // 埋点
                  if (brandId !== null) {
                    return false;
                  } else {
                    Sensor.go("pointMall_hp_click", {
                      button_name: "top_banner",
                    });
                    if (isWeChat()) {
                      if (item.mpUrl) {
                        wx.miniProgram.reLaunch({
                          url: item.mpUrl,
                        });
                      } else if (item.linkUrl) {
                        window.location.href = item.linkUrl;
                      } else {
                        return false;
                      }
                    } else {
                      if (item.linkUrl) {
                        window.location.href = item.linkUrl;
                      }
                      return false;
                    }
                  }
                }}
              >
                {this.lazyGifByimg(item, index)}
              </div>
            </div>
          ))}
      </Swiper>
    );
    return silder;
  }
  render() {
    const { topBanners } = this.props;
    if (topBanners && topBanners.length > 0) {
      this.getSlider(topBanners);
    }
    return (
      <div>
        {topBanners && topBanners.length > 0 && this.getSlider(topBanners)}
      </div>
    );
  }
}
