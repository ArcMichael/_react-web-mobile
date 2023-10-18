import React, { Component } from "react";
import { connect } from "react-redux";
import Sensor from "@/Utils/sensor/index";
import CdnImage from "@/components/CdnImage";
import {
  couponsPostmailExchange,
  couponsExchange,
  exchangeDetail,
} from "../../../../lib/BLL";
import { GetSingleCookie } from "../../../../lib/Tools";
import { urlGetParams } from "../../../../lib/url";
import { popupAlert, popupComponent } from "../../../../actions/popup";
import PopupAlert from "../../../PopupAlert";
import * as device from "../../../../lib/device";
import { setupWeChat } from "../../../../actions/dependency";
import { exchangeRecordDetail } from "../../../../actions/rewardsBoutique";
import { WeChatPath } from "../../util";
import Utils from "@/lib/utils";
export class detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponInfo: null,
      confirmExchange: false,
      isAllowClick: false,
      PopupComonent: null,
      brandId: false
    };
  }
  clickExchange() { 
    const { couponInfo } = this.state;
    if (couponInfo && couponInfo.type == 5) {
      if (device.device_inMiniProgramsEnvironment()) {
        const store = GetSingleCookie(document.cookie, "storeNo") ? GetSingleCookie(document.cookie, "storeNo") : urlGetParams(window.location, "storeNo") || "";
        if (Utils.getEnv("restfulEnv") === "production") {
          // 线下
          if (store) {
            wx.miniProgram.navigateTo({
              url: `/sp/web?nto=1&url=${encodeURIComponent(
                `https://wx.sephora.cn/sephora_view/survey_sephora_shop/sephora.html#/appointment_appointmenthome?itemId=${couponInfo.id}&exchange=${couponInfo.integral}&channel=2&store=${store}`
              )}`
            });
          } else {
            // 线上
            wx.miniProgram.navigateTo({
              url: `/sp/web?nto=1&url=${encodeURIComponent(
                `https://wx.sephora.cn/sephora_view/survey_sephora_shop/sephora.html#/appointment_appointmenthome?itemId=${couponInfo.id}&exchange=${couponInfo.integral}&channel=2`
              )}`
            });
          }
        } else {
          if (store) {
            wx.miniProgram.navigateTo({
              url: `/sp/web?nto=1&url=${encodeURIComponent(
                `https://wxsit.sephora.cn/sephora_view/survey_sephora_shop/sephora.html#/appointment_appointmenthome?itemId=${couponInfo.id}&exchange=${couponInfo.integral}&channel=2&store=${store}`
              )}`
            });
          } else {
            // 线上
            wx.miniProgram.navigateTo({
              url: `/sp/web?nto=1&url=${encodeURIComponent(
                `https://wxsit.sephora.cn/sephora_view/survey_sephora_shop/sephora.html#/appointment_appointmenthome?itemId=${couponInfo.id}&exchange=${couponInfo.integral}&channel=2`
              )}`
            });
          }
        }
      } else {
        // app
        if (Utils.getEnv("restfulEnv") === "production") {
          window.location.href = `https://wx.sephora.cn/sephora_view/survey_sephora_shop/sephora.html#/appointment_appointmenthome?itemId=${couponInfo.id}&exchange=${couponInfo.integral}&channel=APP`
        } else {
          window.location.href = `https://wxsit.sephora.cn/sephora_view/survey_sephora_shop/sephora.html#/appointment_appointmenthome?itemId=${couponInfo.id}&exchange=${couponInfo.integral}&channel=APP`
        }
      }
    } else {
      Sensor.go('pointMall_detail_click', {
        button_name: '立即兑换',
      });
      this.setState({
        confirmExchange: true,
      });
    }
  }
  clickConfirm(type, couponInfo) {
    Sensor.go('pointMall_detail_click', {
      button_name: '确认兑换',
    });
    this.setState({
      isAllowClick: true,
    });
    const { popupAlert, popupComponent } = this.props;
    const { brandId } = this.state
    let data = {
      cardNo: GetSingleCookie(document.cookie, 'cardNo')
        ? GetSingleCookie(document.cookie, 'cardNo')
        : urlGetParams(window.location, 'cardno') || '',
      itemId: window.location.pathname.match('[^/]+(?!.*/)')[0],
      storeNo: GetSingleCookie(document.cookie, 'storeNo')
        ? GetSingleCookie(document.cookie, 'storeNo')
        : urlGetParams(window.location, 'storeNo') || '',
      brandId: brandId === false ? null : brandId
    };

    let channel = device.isDevice();
    // 付邮申领兑换接口
    if (couponInfo && couponInfo.redemptionType === 2) {
      data.channel = channel;
      couponsPostmailExchange(data)
        .then((res) => {
          this.setState({
            isAllowClick: false,
          });
          if (res && res.endValidityDate && res.recordId) {
            console.log(res);
            if (device.device_inMiniProgramsEnvironment()) {
              window.location.href = `/v2/html/postmailSuccess/${res.recordId
                }?token=${urlGetParams(
                  window.location,
                  "token"
                )}&uid=${urlGetParams(
                  window.location,
                  "uid"
                )}&cardno=${urlGetParams(
                  window.location,
                  "cardNo"
                )}&endValidityDate=${res.endValidityDate}`;
            } else {
              window.location.href = `/v2/html/postmailSuccess/${res.recordId}?endValidityDate=${res.endValidityDate}`;
            }
          }
        })
        .catch(error => {
          this.setState({
            isAllowClick: false,
          });
          if (error.errorCode === 11010) {
            popupComponent(1, 'RetentionInfo', {
              // results,
            });
          } else {
            popupAlert(1, 'PopupErrorToast', { _title: '兑换失败', _text: error.errorMessage, _autoClose: true });
          }
        });
    } else {
      couponsExchange(data)
        .then((res) => {
          this.setState({
            isAllowClick: false,
          });
          if (res && res.recordId) {
            let recordId = res.recordId;
            if (type === 4) {
              this.props.exchangeRecordDetail({ recordId }, res => {
                if (res && res.egiftSecret) {
                  if (device.device_inMiniProgramsEnvironment()) {
                    wx.miniProgram.navigateTo({
                      url: `/sp/mem/jump-mini?eGiftSecret=${res.egiftSecret}`,
                    });
                  } else {
                    window.location.href = `/v2/html/exchangeReceiveSuccess/${res.egiftSecret}`
                  }
                }
              });
            } else if (device.device_inMiniProgramsEnvironment()) {
              window.location.href = `/v2/html/exchangeSuccess/${res.recordId
                }?token=${urlGetParams(
                  window.location,
                  "token"
                )}&uid=${urlGetParams(
                  window.location,
                  "uid"
                )}&cardno=${urlGetParams(window.location, "cardNo")}`;
            } else {
              if (device.device_inMiniProgramsEnvironment()) {
                window.location.href = `/v2/html/exchangeSuccess/${res.recordId}?token=${urlGetParams(window.location, 'token')}&uid=${urlGetParams(
                  window.location,
                  'uid',
                )}&cardno=${urlGetParams(window.location, 'cardNo')}`;

              } else {
                window.location.href = `/v2/html/exchangeSuccess/${res.recordId}`;

              }
            }
          }
        })
        .catch(error => {
          this.setState({
            isAllowClick: false,
          });
          if (error.errorCode === 11010) {
            popupComponent(1, 'RetentionInfo', {
              // results,
            });
          } else {
            popupAlert(1, 'PopupErrorToast', { _title: '兑换失败', _text: error.errorMessage, _autoClose: true });
          }
        });
    }
  }

  componentDidMount() {
    // console.log(device.isDevice());
    require.ensure([], () => {
      const PopupComonent = require('../../../Popup').default;
      this.setState({
        PopupComonent,
      });
    });
    const { setupWeChat } = this.props;
    if (device.device_inMiniProgramsEnvironment()) {
      setupWeChat({});
      document.title = "详情";
    }

    const couponId = window.location.pathname.match("[^/]+(?!.*/)")[0];
    const brandId =
      urlGetParams(window.location, "brandId") &&
      urlGetParams(window.location, "brandId").split("?")[0];
    const storeNo = GetSingleCookie(document.cookie, "storeNo")
      ? GetSingleCookie(document.cookie, "storeNo")
      : urlGetParams(window.location, "storeNo") || "";
    exchangeDetail({
      couponId,
      cardNo: GetSingleCookie(document.cookie, "cardNo")
        ? GetSingleCookie(document.cookie, "cardNo")
        : urlGetParams(window.location, "cardno") || "",
      storeNo,
      brandId,
    }).then((res) => {
      this.setState({
        couponInfo: res,
        brandId,
        storeNo,
      });
    });
  }
  clickCloseDialog(e) {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      confirmExchange: false,
    });
  }
  render() {
    const {
      couponInfo,
      confirmExchange,
      isAllowClick,
      PopupComonent,
      storeNo,
      brandId,
    } = this.state;
    let statusResult;
    let detailType;
    let tips;

    if (couponInfo && couponInfo.convertible == 1) {
      statusResult = (
        <button className="deatil_exchange" style={{ opacity: 1 }} onClick={this.clickExchange.bind(this)}>
          {(couponInfo && couponInfo.type == 5) ? '立即兑换并预约' : '立即兑换'}
        </button>
      );
    } else
      if (couponInfo && couponInfo.marginIntegral) {
        statusResult = (
          <div className="deatil_insufficient">
            <div className={brandId === false ? "title" : "titlecenter"}>您还差 {couponInfo && couponInfo.marginIntegral}积分即可兑换</div>
            {brandId === false && <a className="gain_btn" href="/v2/html/gainPoint">
              赚积分
            </a>}
          </div>
        );
      } else if (couponInfo && couponInfo.stockStatus === 0) {
        statusResult = (
          <div className="deatil_insufficient">
            <div className="title">我们正在努力补货中</div>
            <a className="gain_btn" onClick={() => {
              let backUrl;
              const url =
                brandId === false
                  ? "/v2/html/rewardsBoutique"
                  : `/v2/html/rewardsBrand/${brandId}`;
              if (device.device_inMiniProgramsEnvironment()) {
                backUrl = WeChatPath(url)
              } else {
                backUrl = url;
              }
              window.location.href = backUrl
            }}>
              再看看
            </a>
          </div>
        );
      }
    // 1-产品券/3-优惠券/4-丝享卡
    if (
      (couponInfo && couponInfo.type === 1) ||
      (couponInfo && couponInfo.type === 4)
    ) {
      detailType = (
        <div className="detail_content_goods">
          <img src={`${couponInfo && couponInfo.imageUrl}S.jpg`} alt="" className="detail_pic_goods" />
          <div className="detail_name">{couponInfo && couponInfo.title}</div>
          <div className="detail_point_goods">
            {couponInfo && couponInfo.integral}{" "}
            <span>{couponInfo && couponInfo.unit}</span>
          </div>
        </div>
      );
    } else if (couponInfo && couponInfo.imageUrl) {
      detailType = (
        <div className="detail_content_other">
          <div style={{ display: 'flex' }}>
            <img style={{ width: "1.6rem", height: "1.6rem" }} src={`${couponInfo && couponInfo.imageUrl}S.jpg`} alt="" className="detail_pic" />
            <div className="detail_name">{couponInfo && couponInfo.title}</div>
          </div>
          <div className="detail_point_other">
            {couponInfo && couponInfo.integral}{" "}
            <span>{couponInfo && couponInfo.unit}</span>
          </div>
        </div>
      );
    }
    if (
      (couponInfo && couponInfo.type === 1) ||
      (couponInfo && couponInfo.redemptionType === 2)
    ) {
      if (storeNo) {
        tips = (
          <div>
            <CdnImage
              className={
                device.isDevice() === "mobile"
                  ? "tips_icon_browser"
                  : "tips_icon"
              }
              src="/soa/nmobile/img/exchange_tips_red.png"
              alt=""
            />
            <p>
              温馨提示：<span>您正在兑换的礼品券仅限当前门店使用，兑换前请与美力顾问核实产品的实际库存。</span>
            </p>
          </div>
        );
      } else if (couponInfo && couponInfo.redemptionType === 2) {
        tips = (
          <div>
            <CdnImage
              className={
                device.isDevice() === "mobile"
                  ? "tips_icon_browser"
                  : "tips_icon"
              }
              src="/soa/nmobile/img/exchange_tips_red.png"
              alt=""
            />
            <p>
              温馨提示：
              <span>完成线上购买可随单获赠，或单独支付邮费获赠。</span>
            </p>
          </div>
        );
      } else {
        tips = (
          <div>
            <CdnImage
              className={
                device.isDevice() === "mobile"
                  ? "tips_icon_browser"
                  : "tips_icon"
              }
              src="/soa/nmobile/img/exchange_tips_red.png"
              alt=""
            />
            <p>
              温馨提示：<span>您正在兑换的礼品券仅限线上任意购买随单赠。</span>
            </p>
          </div>
        );
      }
    } else if (couponInfo && couponInfo.type === 4) {
      tips = (
        <div>
          <CdnImage
            className={
              device.isDevice() === "mobile" ? "tips_icon_browser" : "tips_icon"
            }
            src="/soa/nmobile/img/exchange_tips_red.png"
            alt=""
          />
          <p>
            温馨提示：<span>确认兑换后请继续完成丝享卡领卡步骤</span>
          </p>
        </div>
      );
    }
    return (
      <div className="detail_page">
        <div id="apptitle">详情</div>
        {detailType}
        {couponInfo && couponInfo.description ? (
          <div className="detail_message">
            <p className="message_title">使用规则</p>
            <p
              className="message_txt"
              dangerouslySetInnerHTML={{
                __html: couponInfo && couponInfo.description,
              }}
            />
          </div>
        ) : (
          ''
        )}

        <div className="detail_goods" dangerouslySetInnerHTML={{ __html: couponInfo && couponInfo.content }} />
        {statusResult}
        {confirmExchange ? (
          <div
            className="detail_dialog"
            onClick={this.clickCloseDialog.bind(this)}
          >
            <div className="detail_info">
              <img
                onClick={this.clickCloseDialog.bind(this)}
                className="detail_close"
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/close_icon.png"
                alt=""
              />
              <div className="detail_msg">
                <img
                  src={`${couponInfo && couponInfo.imageUrl}300x300.jpg`}
                  alt=""
                />
                <div style={{ flexGrow: 1 }}>
                  <div className="name">{couponInfo && couponInfo.title}</div>
                  <div className="info">
                    <p>数量：1</p>
                    <p className="point">
                      {couponInfo && couponInfo.integral} <span>积分</span>{' '}
                    </p>
                  </div>
                </div>
              </div>

              <button
                className={['info_exchange', isAllowClick ? 'unClick' : ''].join(' ')}
                onClick={this.clickConfirm.bind(this, couponInfo && couponInfo.type, couponInfo)}
                disabled={isAllowClick ? 'disabled' : ''}
              >
                确认兑换
              </button>
              <div className="tips">{tips}</div>
            </div>
          </div>
        ) : (
          ''
        )}
        {PopupComonent ? <PopupComonent key="popupComonent" /> : null}
        <PopupAlert _zIndex={1001} />
      </div>
    );
  }
}

const mapStateToProps = () => ({});


export default connect(mapStateToProps, { popupAlert, popupComponent, setupWeChat, exchangeRecordDetail })(detail);
