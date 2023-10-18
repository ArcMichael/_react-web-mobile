/*
 * @Author: Leo.Si
 * @Date: 2020-07-07 10:18:36
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-24 20:22:31
 * @function product page img banner
 */
import React from "react";
import Swiper from "react-id-swiper";
import LazyloadImage from "@/components/LazyloadImage";
import { Consumer } from "@/layout/LayoutContext";
import "./style.scss";

let isLoaded = false;

class HeroBannerClickPopup extends React.Component {
  swiper = null;

  componentDidUpdate(prevProps) {
    if (this.swiper) {
      this.swiper.update();
      if (
        prevProps.heroTab.ifshow !== this.props.heroTab.ifshow &&
        this.props.heroTab.ifshow
      ) {
        this.swiper.slideTo(this.props.heroTab.tabIndexV2);
      }
    }
  }

  componentWillUnmount() {
    if (this.swiper && this.swiper.destroy) {
      this.swiper.destroy();
    }
  }

  render() {
    const { _productData, heroTab, _view, _callback } = this.props;

    const param = {
      initialSlide: heroTab.tabIndexV2,
      on: {
        slideChange() {
          _callback("tabClickfunV2", {
            nowIndex: this.activeIndex,
            ifshow: true,
          });
        },
        click() {
          _callback("tabClickfunV2", {
            _mySwiper: this.swiper,
            nowIndex: this.activeIndex,
            ifshow: false,
          });
        },
      },
    };
    if (heroTab.ifshow && !isLoaded) {
      isLoaded = true;
    }
    console.log(heroTab.ifshow, _view.CLIENT_HEIGHT, 1111, "heroTab.ifshow");
    return (
      <Consumer>
        {() => {
          return (
            !!_productData && (
              <div
                className="product-info-img-big"
                style={
                  heroTab.ifshow
                    ? { height: `${_view.CLIENT_HEIGHT}px` }
                    : { display: "none" }
                }
              >
                <div className="title">
                  <img
                    className="product-tab-back"
                    src="https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shape.png"
                    onClick={() => {
                      _callback("tabClickfunV2", {
                        _mySwiper: this.swiper,
                        nowIndex: this.activeIndex,
                        ifshow: false,
                      });
                    }}
                  />
                  <span>
                    {heroTab.tabIndexV2 + 1}/{_productData.length}
                  </span>
                </div>
                {isLoaded && (
                  <Swiper
                    {...param}
                    className="img"
                    ref={(node) => {
                      if (node) this.swiper = node.swiper;
                    }}
                  >
                    {_productData &&
                      _productData.map((item, index) => {
                        const { url, activityLabelImageUrl } = item;
                        return (
                          <div
                            key={`product-info-img-${index}`}
                            className="product-info-img-item"
                          >
                            <div className="bit-content">
                              {activityLabelImageUrl && (
                                <img
                                  src={`${item.activityLabelImageUrl}640x160.png`}
                                  className="moveImg_label"
                                />
                              )}
                              <LazyloadImage
                                imgProps={{
                                  src: `${url}750x750.jpg`,
                                  className: "moveImg_skuImagePath",
                                }}
                                once
                                resize
                                preventLoading
                              />
                            </div>
                          </div>
                        );
                      })}
                  </Swiper>
                )}
              </div>
            )
          );
        }}
      </Consumer>
    );
  }
}
export default HeroBannerClickPopup;
