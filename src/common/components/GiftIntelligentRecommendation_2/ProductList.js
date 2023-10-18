import React, { Component } from "react";
import { connect } from "react-redux";
import {
  changeProductStatus_2,
  setGiftList_2,
} from "../../actions/giftIntelligentRecommendation";
import * as device from "../../lib/device";
import { GetSingleCookie } from "../../lib/Tools";
import { urlGetParams } from "../../lib/url";
import Sensor from "../../Utils/sensor";
import CdnImage from "../CdnImage";
// import { copySync } from "fs-extra";
let giftList = [];
export class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      sku: "",
      index: "",
    };
    this.skuObj = {};
    this.jumpDetail = this.jumpDetail.bind(this);
  }
  componentDidMount() { }
  componentWillReceiveProps(newProps) {
    if (newProps != this.props) {
      let records = newProps.recommendResults.categorySkuDtos[0].records;
      records &&
        records.map((val) => {
          if (this.skuObj[val.skuId]) {
            val.checked = true;
          } else {
            val.checked = false;
          }
        });
      changeProductStatus_2(Object.assign({}, newProps.recommendResults));
    }
  }
  openModal(item, flag, index) {
    this.setState({ sku: item, flag, index });
    Sensor.go("giftSelectionClick", {
      button_name: "",
      action_id: "1000802_005",
      commodity_sku: `${item.skuId}`,
      OP_code: `${item.spuId}`,
    });
  }
  jumpDetail(skuId, spuId) {
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.navigateTo({
        url: `/pages/productDetail?productId=${spuId}&skuId=${skuId}`,
      });
    } else if (skuId) {
      window.location.href = `/product/${spuId}.html?sku=${skuId}`;
    } else {
      window.location.href = `/product/${spuId}.html`;
    }
    Sensor.go("giftSelectionClick", {
      button_name: "",
      action_id: "1000802_950",
      commodity_sku: `${skuId}`,
      OP_code: `${spuId}`,
    });
  }
  addCart(left, top, path, checked) {
    if (!checked&&(!this.state.flag)) {
      let bar = document.createElement("div");
      bar.style.position = "absolute";
      bar.style.left = left + "px";
      bar.style.top = top + "px";
      bar.style.width = "0.533rem";
      bar.style.height = "0.533rem";
      bar.style.borderRadius = "50%";
      bar.style.backgroundImage = `url(${path}280x280.jpg)`;
      bar.style.backgroundRepeat = "no-repeat";
      bar.style.backgroundSize = "cover";
      bar.style.zIndex = 20;
      bar.style.backgroundColor = "white";
      bar.style.transition =
        "left .6s linear, top .6s cubic-bezier(0.5, -0.5, 1, 1)";

      document.body.appendChild(bar);
      setTimeout(() => {
        let target = document.querySelector(".btm_left");
        let targetRects = target.getBoundingClientRect();
        let targetX = targetRects.left;
        let targetY = targetRects.top;
        bar.style.left = targetX + target.offsetWidth / 2 + "px";
        bar.style.top = targetY + "px";
      }, 0);
     bar&&bar.addEventListener("webkitTransitionEnd", ()=>{
        bar.remove();
      });
    }
  }
  clcikSelect(skuId, _index, index, path, checked) {
    let { recommendResults, setGiftList_2, changeProductStatus_2 } = this.props;
    let event = document.querySelectorAll(".product_status")[index];
    let targetRects = event.getBoundingClientRect();
    let x = targetRects.left;
    let y = targetRects.top;
    if (
      device.device_inMiniProgramsEnvironment()
        ? urlGetParams(window.location, "token")
        : GetSingleCookie(document.cookie, "Token")
    ) {
      recommendResults.categorySkuDtos[_index].records.forEach((v) => {
        if (v.skuId == skuId) {
          v.checked = !v.checked;
        }
      });
      changeProductStatus_2(Object.assign({}, recommendResults));
      recommendResults &&
        recommendResults.categorySkuDtos[0].records.map((item) => {
          if (item.checked && item.skuId == skuId) {
            giftList.push(item);
          }
          if (!item.checked && item.skuId == skuId) {
            giftList = giftList.filter((val) => val.skuId !== skuId);
          }
        });
      setGiftList_2(giftList);
      if (giftList.length > 0) {
        const skuMap = giftList.map((item) => {
          return item.skuId;
        });
        this.skuObj = {};
        skuMap.forEach((val) => {
          this.skuObj[val] = true;
        });
      } else {
        this.skuObj = {};
      }
      this.addCart(x, y, path, checked);
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
    Sensor.go("giftSelectionClick", {
      button_name: "",
      action_id: "1000802_002",
      commodity_sku: `${skuId}`,
      OP_code: `${skuId}`,
    });
  }
  render() {
    let { records, _index } = this.props;
    let { flag, sku, index } = this.state;
    let ErrorImage =
      "https://ssl1.sephorastatic.cn/wcsfrontend/products/nopic_";
    let productitem =
      records &&
      records.length > 0 &&
      records.map((item, index) => {
        return (
          <div
            className="product_item"
            key={`product_item_${index}`}
            style={{ position: "relative" }}
          >
            <div
              className="product_detail_new"
              onClick={() => {
                this.jumpDetail(item.skuId, item.spuId);
              }}
            >
              详情
            </div>
            <img
            src={(item.imagePath ? item.imagePath : ErrorImage) +"280x280.jpg?f=webp&q=10"}
            onClick={()=>{this.openModal(item,true,index)}}
          />
            <p className="product_name">
              {item.brandName} {item.productName} {item.saleAttrs}
            </p>
            <p className="product_desc">{item.tag}</p>
            <div
              className="product_bottom"
              onClick={this.clcikSelect.bind(
                this,
                item.skuId,
                _index,
                index,
                item.imagePath,
                item.checked
              )}
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
      <div>
        {records.length === 0 ? (
          <div className="recommend-none">
            <p className="none-text none-text-top">
              抱歉，当前品类暂时没有商品推荐，请看看
            </p>
            <p className="none-text">其他品类或重新测试</p>
            <div
              className="rese-btn"
              onClick={() => {
                window.location.href = `/campaign/share/giftFinder${window.location.search}`;
              }}
            >
              <img
                className="reset-img"
                src="https://sslstage1.sephorastatic.cn/soa/mobile/images/Icons_Refresh.png"
              />{" "}
              重新测试
            </div>
          </div>
        ) : (
          <div
            className="product_list"
            style={{ position: "static" }}
            ref={(ref) => {
              this.scrollWrap = ref;
            }}
          >
            {productitem}
            <div style={{width:"100%"}}>
            <div
              className="rese-btn"
              onClick={() => {
                window.location.href = `/campaign/share/giftFinder${window.location.search}`;
              }}
            >
              <img
                className="reset-img"
                src="https://sslstage1.sephorastatic.cn/soa/mobile/images/Icons_Refresh.png"
              />{" "}
              重新测试
            </div>
          </div>
            {flag ? (
              <div>
                <div className="frame_0" />
                <div className="frame_1">
                  <div className="frame_content">
                    {sku && (
                      <div className="frame_top">
                        <img
                          className="sku_image"
                          src={sku.imagePath + "280x280.jpg"}
                        />
                        <div className="frame_pro">{sku.brandName} {sku.productName} {sku.saleAttrs}</div>
                        <div className="frame_tag">{sku.tag}</div>
                        <div className="frame_price">￥{sku.price}</div>
                      </div>
                    )}
                    <div
                      className={sku.checked ? "frameed_btn" : "frame_btn"}
                      onClick={
                        sku.checked
                          ? ""
                          : this.clcikSelect.bind(
                            this,
                            sku.skuId,
                            _index,
                            index,
                            sku.imagePath,
                            sku.checked
                          )
                      }
                    >
                      {sku.checked ? "已在清单中" : "加入清单"}
                    </div>
                    <div
                      className="frame_detail"
                      onClick={() => {
                        this.jumpDetail(sku.skuId, sku.spuId);
                      }}
                    >
                      查看详情
                    </div>
                  </div>
                  <img
                    className="frame-close"
                    onClick={() => {
                      this.setState({ flag: false });
                    }}
                    src="https://ssl1.sephorastatic.cn/soa/mobile/images/errorIcon.png"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recommendResults: state.giftIntelligentNew.recommendResults,
    giftList: state.giftIntelligentNew.giftList,
  };
};

const mapDispatchToProps = {
  changeProductStatus_2,
  setGiftList_2,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
