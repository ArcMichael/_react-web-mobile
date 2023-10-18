/*
 * @Author: Leo.Si
 * @Date: 2020-07-07 10:18:36
 * @Last Modified by: cathy.peng
 * @Last Modified time: 2020-11-Tu 10:33:04
 * @function product page img banner
 */
import React from "react";
import Swiper from "react-id-swiper";
import LazyloadImage from "@/components/LazyloadImage";
import { Consumer } from "@/layout/LayoutContext";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";

class ProductInfoImg extends React.Component {
  swiper = null;

  componentDidMount() {
    const child = document.createElement("div");
    child.className = "tipWords";
    child.style = "width:100%";
    child.innerHTML = "<em></em><p>下滑查看图文详情</p>";
    this.child = child;
  }

  componentDidUpdate() {
    if (this.swiper && this.swiper.update) {
      this.swiper.update();
    }
  }

  componentWillUnmount() {
    if (this.swiper && this.swiper.destroy) {
      this.swiper.destroy();
    }
  }

  shouldComponentUpdate(nextPops) {
    if (nextPops._heroTab.ifshow !== this.props._heroTab.ifshow) {
      this.swiper.slideTo(nextPops._heroTab.tabIndexV2);
      // console.log(nextPops._heroTab.tabIndexV2, 'nextPops._heroTab.tabIndexV22222');
    }
    return true;
  }

  render() {
    const { _productData, _mySwiper, _callback, _hasVB, _richImages } =
      this.props;
    if (typeof window !== "undefined") {
      const firstChild = document.getElementsByClassName("product-info-img")[0];
      if (
        firstChild &&
        firstChild.querySelector &&
        firstChild.querySelector(".swiper-container") &&
        firstChild.querySelector(".swiper-container").querySelector
      ) {
        const node = firstChild
          .querySelector(".swiper-container")
          .querySelector(".swiper-wrapper");
        this.node = node;
      }
      const that = this;
      let pagination;
      _richImages.length<=1?pagination={ }:pagination={el: ".swiper-pagination"};
      const param = {
        preloadImages: false,
        lazy: {
          loadPrevNext: true,
        },
        pagination:pagination,
        on: {
          slideChange() {
            // _callback("tabClickfunV2", {
            //   nowIndex: this.activeIndex,
            //   ifshow: false,
            // });
            GoogleAnalytics.pushV2({
              event: "productDetailInteraction",
              // pdpInteractionDetail: "slide-image",
              pdpInteractionType: "slide-image",
            });
          },
          touchMove(swiper) {
            if (this.activeIndex === _richImages.length - 1) {
              that.node ** that.node.appendChild(that.child);
              const x = swiper && swiper.targetTouches[0].clientX;
              if (x < 100) {
                that.child.querySelector("em").style =
                  "transform:rotate(180deg)";
              } else {
                that.child.querySelector("em").style = "transform:rotate(0)";
              }
            }
          },
          // touchStart(swiper) {
          //   if (this.activeIndex === _richImages.length - 1) {
          //     x = swiper.changedTouches && swiper.changedTouches[0].clientX;
          //   }
          // },
          touchEnd() {
            if (this.activeIndex === _richImages.length - 1) {
              // const y = swiper.changedTouches[0].clientX;
              that.node.querySelector(".tipWords") &&
                that.node.querySelector(".tipWords").length > 0 &&
                that.node.removeChild(that.child);
              // if (x > y) {
              //   _callback("tabClickfun", {
              //     _mySwiper,
              //     nowIndex: 1,
              //   });
              // }
            }
          },
          click() {
            _callback("tabClickfunV2", {
              nowIndex: this.activeIndex,
              ifshow: true,
            });
          },
        },
      };
      const _single = _richImages.length <= 1 ? "product-info-img-single" : "";
      return (
        <div
          className={`product-info-img ${_single}`}
          style={{ height: "7.5rem" }}
        >
          <Consumer>
            {(layoutContext) => {
              return (
                <Swiper
                  {...param}
                  className="img"
                  ref={(node) => {
                    if (node) this.swiper = node.swiper;
                  }}
                  key={`product-info-img-${_richImages.length}-${
                    _mySwiper ? "1" : "0"
                  }`}
                >
                  {_richImages.length ? (
                    _richImages.map((item, index) => {
                      const { url, activityLabelImageUrl } = item;
                      return (
                        <div
                          key={`product-info-img-${index}`}
                          className="product-info-img-item"
                        >
                          {activityLabelImageUrl && (
                            <LazyloadImage
                              imgProps={{
                                className: "moveImg_label",
                                src: `${item.activityLabelImageUrl}640x160.png`,
                              }}
                            />
                          )}
                          <img className="moveImg_skuImagePath swiper-lazy" src={layoutContext.getImageSrcByIsSupportWeb(
                              `${url}640x640.jpg`,
                              layoutContext.isSupportWebp
                            )} alt="" srcSet="" />
                          {/* <img
                            data-src={layoutContext.getImageSrcByIsSupportWeb(
                              `${url}640x640.jpg?q=5`,
                              layoutContext.isSupportWebp
                            )}
                            data-srcset={layoutContext.getImageSrcByIsSupportWeb(
                              `${url}640x640.jpg`,
                              layoutContext.isSupportWebp
                            )}
                            className="moveImg_skuImagePath swiper-lazy"
                          /> */}
                          {/* <div className="product-info-shadow" /> */}
                        </div>
                      );
                    })
                  ) : (
                    <div
                      key="product-info-img-0"
                      className="product-info-img-item"
                    >
                      <img
                        className="moveImg_skuImagePath"
                        src={layoutContext.getImageSrcByIsSupportWeb(
                          "https://ssl1.sephorastatic.cn/wcsfrontend/products/nopic_50x50.jpg",
                          layoutContext.isSupportWebp
                        )}
                        alt=""
                        style={{
                          width: "7.5rem",
                          height: "7.5rem",
                        }}
                      />
                    </div>
                  )}
                </Swiper>
              );
            }}
          </Consumer>
          {_hasVB && (
            <div
              className="product-info-suit"
              onClick={
                _callback &&
                _callback.bind(this, "productVBDetailsPopup", {
                  skuCode:
                    _productData && _productData.sku && _productData.sku.skuCode,
                })
              }
            >
              查看套装详情
              <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/product-suit-icon.png" alt="" />
            </div>
          )}
        </div>
      );
    }
    return <div style={{ height: "6.4rem" }} />;
  }
}
export default ProductInfoImg;