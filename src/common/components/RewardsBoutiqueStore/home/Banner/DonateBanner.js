/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-10-21 15:19:55
 * @LastEditTime: 2021-03-12 19:31:37
 */
import React from "react";
import Swiper from "react-id-swiper";

import Sensor from "@/Utils/sensor/index";
import { WeChatPath } from "../../util";

const params = {
  direction: "horizontal",
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  loop: true,
};

export default class BottomBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { donationBanners } = this.props;
    return (
      <div className="BottomBannerContainer">
        <div className="title">积分公益捐</div>
        <div className="BottomBanner">
          <Swiper
            className="swiper-bottom-container"
            style={{ height: "2rem" }}
            {...params}
          >
            {donationBanners &&
              donationBanners.map((item, index) => {
                item.button_name = "bottom_banner";
                return (
                  <div
                    key={index + "_" + item.baseImgUrl}
                    data-item={JSON.stringify(item)}
                  >
                    {item && item.baseImgUrl && (
                      <img
                        data-item={JSON.stringify(item)}
                        onClick={() => {
                          Sensor.go("pointMall_hp_click", {
                            button_name: "bottom_banner",
                          });
                          window.location.href = WeChatPath(
                            `/v2/html/intergalDonate`
                          );
                        }}
                        className="swiperImage"
                        src={`${item && item.baseImgUrl}S.jpg`}
                        size={150}
                        offset={0}
                      />
                    )}
                  </div>
                );
              })}
          </Swiper>
        </div>
      </div>
    );
  }
}
