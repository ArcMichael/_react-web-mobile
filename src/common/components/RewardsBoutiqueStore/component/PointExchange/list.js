import React, { Component } from "react";
import { connect } from "react-redux";
import Sensor from "@/Utils/sensor/index";
import LazyloadImage from "@/components/LazyloadImage";

import { urlGetParams } from "@/lib/url";
import { exchangeList } from "../../../../lib/BLL";
import { popupAlert } from "../../../../actions/popup";
import PopupAlert from "../../../PopupAlert";
import * as device from "../../../../lib/device";
import { setupWeChat } from "../../../../actions/dependency";
import getRunEnv from "../../../../../isomorphisms/getRunEnv";

// 兑换记录不同类型商品与按钮关系
//
// 付邮申领商品 显示去购买
// 线上商品券 显示去购买
// 线下商品券 显示兑换码
// 丝享卡 显示去领卡（领取成功后按钮隐藏）
// 公益捐 显示查看证书

// OP_code	商品OP号
// commodity_sku	货号
// button_name	去购买
// button_name	查看证书

// Sensor.go('pointMall_rewardspoint_click',{
//   button_name:'去购买'
// })

export class list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
    };
  }

  componentDidMount() {
    const { setupWeChat } = this.props;
    if (device.device_inMiniProgramsEnvironment()) {
      setupWeChat({});
      document.title = "兑换记录";
    }
    const { popupAlert } = this.props;
    this.setState({
      list: this.props.list,
    });
    const { list } = this.state; // TODO: 请移除无用state
    console.log(list);
    const data = {
      pageNum: this.state.pageNum,
      storeNo: "",
    };

    exchangeList(data)
      .then((res) => {
        this.setState({ recodList: res.content, page: res.page });
      })
      .catch((error) => {
        console.log(error);
        popupAlert(1, "PopupToast", { _text: error, _autoClose: true });
      });
  }

  clickAppointment(recordId) {
    const env = getRunEnv();
    if (device.device_inMiniProgramsEnvironment()) {
      if (env === "stage") {
        wx.miniProgram.navigateTo({
          url: `sp/web?nto=1&url=https://wxsit.sephora.cn/sephora_view/survey_sephora_shop/sephora.html#/appointment_appointmentdetail?couponId=${recordId}&channel=2&activityId=4`,
        });
      } else {
        alert("生产环境未提供");
      }
    } else {
      if (env === "stage") {
        window.location.href = `https://wxsit.sephora.cn/sephora_view/survey_sephora_shop/sephora.html#/appointment_appointmentdetail?couponId=${recordId}&channel=APP&activityId=4`;
      } else {
        alert("生产环境未提供");
      }
    }
  }

  clickBuy(productId, skuId) {
    if (typeof window !== "undefined") {
      Sensor.go("pointMall_rewardspoint_click", {
        button_name: "去购买",
        OP_code: productId,
        commodity_sku: skuId,
      });
      if (device.device_inMiniProgramsEnvironment()) {
        wx.miniProgram.navigateTo({
          url: `/pages/productDetail?productId=${productId}&skuId=${skuId}`,
        });
      } else {
        new window.SEPHORA_JSINVOKE().jumpPage({
          product: {
            productId: `${productId}`,
            skuId: `${skuId}`,
            productcn: "",
          },
        });
      }
    }
  }

  clickToReceive(egiftSecret) {
    Sensor.go("pointMall_rewardspoint_click", {
      button_name: "去领卡",
    });
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.navigateTo({
        url: `/sp/mem/jump-mini?pageType=continue-redeem&eGiftSecret=${egiftSecret}`,
      });
    } else {
      window.location.href = `/v2/html/exchangeReceiveSuccess/${egiftSecret}`;
    }
  }

  clickToOffline(val) {
    Sensor.go("pointMall_rewardspoint_click", {
      button_name: "兑换码",
    });
    if (device.device_inMiniProgramsEnvironment()) {
      window.location.href = `/v2/html/exchangeSuccess/${
        val.recordId
      }?token=${urlGetParams(window.location, "token")}`;
    } else {
      window.location.href = `/v2/html/exchangeSuccess/${val.recordId}`;
    }
  }

  touchStart(e) {
    const position = this.state;
    position.startX = e.changedTouches[0].pageX;
    position.startY = e.changedTouches[0].pageY;
  }

  touchMove(e) {
    e.stopPropagation();
    const position = this.state;
    position.endX = e.changedTouches[0].pageX;
    position.endY = e.changedTouches[0].pageY;
  }

  touchEnd(e) {
    e.stopPropagation();
    const { popupAlert } = this.props;
    const position = this.state;
    const dis = position.endY - position.startY;
    if (dis < -100) {
      if (this.state.page && this.state.page.hasNext) {
        let pageNum = this.state.pageNum;
        const records = this.state.recodList;
        pageNum++;
        exchangeList({ pageNum })
          .then((callback) => {
            if (callback) {
              this.setState({
                recodList: [...records, ...callback.content],
                pageNum,
                page: callback.page,
              });
            }
          })
          .catch((error) => {
            popupAlert(1, "PopupToast", { _text: error, _autoClose: true });
          });
      }
    }
  }

  render() {
    const { recodList } = this.state;
    if (recodList && recodList.length === 0) {
      return (
        <div>
          <div id="apptitle">兑换记录</div>
          <p className="list_none">您目前暂无兑换记录</p>
        </div>
      );
    }
    const listItem =
      recodList &&
      recodList.length > 0 &&
      recodList.map((val) => {
        /* integralUseType 1-兑换 / 2-捐助 */
        /* couponType 1:产品券 /3 折扣券+现金券 /4丝享卡 /5 全妆定制*/
        /**
         * 线下的折扣券 现金券 产品券 都是兑换码
         */
        let buttonStatus;
        if (val.integralUseType == 1) {
          if (
            val.storeNo !== "6010" &&
            val.couponType !== 4 &&
            val.couponType !== 5
          ) {
            buttonStatus = (
              <div
                onClick={this.clickToOffline.bind(this, val)}
                className="list_btn"
              >
                兑换码
              </div>
            );
          } else if (val.couponType == 1) {
            buttonStatus = (
              <div
                onClick={this.clickBuy.bind(
                  this,
                  val.productCoupon && val.productCoupon.productId,
                  val.productCoupon && val.productCoupon.skuId
                )}
                className="list_btn"
              >
                去购买
              </div>
            );
            /* status 0:失败 /1 成功 /2 待领取 */
          } else if (val.couponType == 4 && val.status === 2) {
            buttonStatus = (
              <div
                onClick={this.clickToReceive.bind(this, val.egiftSecret)}
                className="list_btn"
              >
                去领卡
              </div>
            ); /** 线下券专属 */
          } else if (val.redemptionType === 2) {
            //  付邮申领商品 去购买
            buttonStatus = (
              <div
                onClick={this.clickBuy.bind(
                  this,
                  val.productCoupon && val.productCoupon.productId,
                  val.productCoupon && val.productCoupon.skuId
                )}
                className="list_btn"
              >
                去购买
              </div>
            );
          } else if (val.couponType === 5) {
            buttonStatus = (
              <div
                className="list_btn"
                onClick={this.clickAppointment.bind(this, val.recordId)}
              >
                查看预约
              </div>
            );
          } else {
            buttonStatus = <div />;
          }
        } else {
          buttonStatus = (
            <a
              className="list_btn"
              onClick={() =>
                Sensor.go("pointMall_rewardspoint_click", {
                  button_name: "查看证书",
                })
              }
              href="/v2/html/certificate"
            >
              查看
            </a>
          );
        }

        return (
          <div className="list" key={val.recordId}>
            <div className="list_item">
              <div className="list_left">
                <LazyloadImage
                  imgProps={{
                    src: `${val.image}S.jpg`,
                    style: {
                      width: "1.6rem",
                      height: "1.6rem",
                    },
                  }}
                />
                {/* <Image size={160} src={`${val.image}S.jpg`} alt="" /> */}
                {/* <img style={{ */}
                {/*  width: "1.6rem", */}
                {/*  height: " 1.6rem" */}
                {/* }} src={`${val.image}S.jpg`} alt="" /> */}
                <div className="list_info">
                  <div>
                    <div className="time">{val.exchangeTime}</div>
                    <div className="name">{val.name}</div>
                  </div>
                  <div className="num"> x 1</div>
                </div>
              </div>
              <div className="list_right">
                <div className="list_point">
                  -{val.integral}
                  <span>{val.brandName ? val.brandName : ""}积分</span>
                </div>
                {buttonStatus}
              </div>
            </div>
          </div>
        );
      });
    return (
      <div>
        <div id="apptitle">兑换记录</div>
        <div
          className="list-page"
          onTouchStart={this.touchStart.bind(this)}
          onTouchMove={this.touchMove.bind(this)}
          onTouchEnd={this.touchEnd.bind(this)}
        >
          {listItem}
        </div>
        <PopupAlert />
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, { popupAlert, setupWeChat })(list);
