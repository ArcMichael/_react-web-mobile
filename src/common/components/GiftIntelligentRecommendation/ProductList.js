import React, { Component } from "react";
import { connect } from "react-redux";
import LazyloadImage from "../LazyloadImage";
import {
  changeProductStatus,
  setGiftList,
  questionRecommend,
  getPopularityList,
  goLogin,
} from "../../actions/giftIntelligentRecommendation";
import * as device from "../../lib/device";
import { GetSingleCookie } from "../../lib/Tools";
import { urlGetParams } from "../../lib/url";
import Sensor from "../../Utils/sensor";
import CdnImage from "../CdnImage";
export class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.jumpDetail = this.jumpDetail.bind(this);
  }
  componentDidMount() {}
  jumpDetail(skuId, spuId) {
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.navigateTo({
        url: `/pages/productDetail?productId=${spuId}`,
      });
    } else if (skuId) {
      window.location.href = `/product/${spuId}.html?sku=${skuId}`;
    } else {
      window.location.href = `/product/${spuId}.html`;
    }
    Sensor.go("giftSelectionClick", {
      button_name: "",
      commodity_sku: `${skuId}`,
      OP_code: `${spuId}`,
    });
  }
  clcikSelect(skuId, _index) {
    let { recommendResults, setGiftList, changeProductStatus } = this.props;
    if (
      device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token")
    ) {
      let giftList = [];
      recommendResults.categorySkuDtos[_index].records.map((v) => {
        if (v.skuId == skuId) {
          v.checked = !v.checked;
        }
      });
      changeProductStatus(Object.assign({}, recommendResults));
      recommendResults &&
        recommendResults.categorySkuDtos.map((v) => {
          v.records.map((item) => {
            if (item.checked) {
              giftList.push(item);
            }
          });
        });
      setGiftList(giftList);
    } else {
      if (device.device_inMiniProgramsEnvironment()) {
        wx.miniProgram.navigateTo({
          url: `/packagesA/pages/newLogin/newPhoneNumberAuth?redirectPath=${encodeURIComponent(
            `sp/web?nto=1&ncn=1&nui=1&url=${window.location.href}`
          )}`,
        });
      } else if (device.isApp()) {
        window.location.href =
          `${window.location.origin}/login?historyLocation=` +
          encodeURIComponent(window.location.href);
      } else {
        window.location.href = `/login?historyLocation=${encodeURIComponent(
          window.location.pathname.replace("/", "").replace("?", "&")
        )}${window.location.search.replace("?", "&")}`;
      }
    }
  }
  touchStart(e) {
    e.stopPropagation();
    let position = this.state;
    position["startX"] = e.changedTouches[0].pageX;
    position["startY"] = e.changedTouches[0].pageY;
  }
  touchMove(e) {
    e.stopPropagation();
    let position = this.state;
    position["endX"] = e.changedTouches[0].pageX;
    position["endY"] = e.changedTouches[0].pageY;
  }
  touchEnd(e) {
    e.stopPropagation();
    let position = this.state;
    let dis = position["endY"] - position["startY"];
    let {
      recommendResults,
      questionRecommend,
      currentIndex,
      changeProductStatus,
      getPopularityList,
    } = this.props;

    if (dis < -100) {
      if (recommendResults) {
        let answerCode =
          recommendResults.categorySkuDtos[currentIndex].answerCode;
        if (
          recommendResults.categorySkuDtos[currentIndex].currentPage *
            recommendResults.categorySkuDtos[currentIndex].pageSize >=
          recommendResults.categorySkuDtos[currentIndex].totalRecordsCount
        )
          return;

        let answerDtos = JSON.parse(localStorage.getItem("selectInfo"));
        let pageNo = recommendResults.categorySkuDtos[currentIndex].currentPage,
          records = recommendResults.categorySkuDtos[currentIndex].records;
        pageNo++;
        // 无推荐商品
        if (recommendResults.categorySkuDtos[currentIndex].none) {
          getPopularityList(
            { answerDtos, pageNo: pageNo, answerCode },
            (callback) => {
              if (callback) {
                records = [...records, ...callback.categorySkuDtos[0].records];
                recommendResults.categorySkuDtos.map((item) => {
                  if (item.answerCode === answerCode) {
                    item.records = [...records];
                  }
                });
                recommendResults.categorySkuDtos[currentIndex].currentPage =
                  callback.categorySkuDtos[0].currentPage;
                changeProductStatus(Object.assign({}, recommendResults));
              }
            }
          );
        } else {
          questionRecommend(
            { answerDtos, pageNo: pageNo, answerCode },
            (callback) => {
              if (callback) {
                records = [...records, ...callback.categorySkuDtos[0].records];
                recommendResults.categorySkuDtos.map((item) => {
                  if (item.answerCode === answerCode) {
                    item.records = [...records];
                  }
                });
                recommendResults.categorySkuDtos[currentIndex].currentPage =
                  callback.categorySkuDtos[0].currentPage;
                changeProductStatus(Object.assign({}, recommendResults));
              }
            }
          );
        }
      }
    }
  }
  render() {
    let { records, _index } = this.props;
    let productitem =
      records &&
      records.length > 0 &&
      records.map((item, index) => {
        return (
          <div className="product_item" key={`product_item_${index}`}>
            <LazyloadImage
              imgProps={{
                src: `${item.imagePath}280x280.jpg`,
                onClick: () => {
                  this.jumpDetail(item.skuId, item.spuId);
                },
              }}
              overflow
             />
            {/* <img
              src={`${item.imagePath}280x280.jpg`}
              alt=""
              onClick={this.jumpDetail.bind(this, item.skuId, item.spuId)}
            /> */}
            <p className="product_name">
              {item.brandName} {item.productName}
            </p>
            <p className="product_desc">{item.tag}</p>
            <div
              className="product_bottom"
              onClick={this.clcikSelect.bind(this, item.skuId, _index)}
            >
              <div className="product_price">¥{item.price}</div>
              {item.checked ? (
                <CdnImage
                  className="product_status"
                  src="/soa/nmobile/img/giftRecommend/radio_selected.png"
                />
              ) : (
                <CdnImage
                  className="product_status"
                  src="/soa/nmobile/img/giftRecommend/radio_disabled.png"
                />
              )}
            </div>
          </div>
        );
      });

    return (
      <div
        className="product_list"
        style={{ position: "static" }}
        onTouchStart={this.touchStart.bind(this)}
        onTouchMove={this.touchMove.bind(this)}
        onTouchEnd={this.touchEnd.bind(this)}
        ref={ref => {
          this.scrollWrap = ref;
        }}
      >
        {productitem}
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
  changeProductStatus,
  setGiftList,
  questionRecommend,
  getPopularityList,
  goLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
