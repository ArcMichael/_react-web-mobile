import React, { Component } from "react";
import { connect } from "react-redux";
import Dynamic from "@/Utils/Dynamic";
import { getCdnImageUrl } from "@/components/CdnImage";
import { getProfileInfo, getDonatePosterBanner } from "../../../../lib/BLL";
import CurrentComponentCommonTop from "../../../CommonTop/index";
import * as device from "../../../../lib/device";
import { popupAlert } from "../../../../actions/popup";
import PopupAlert from "../../../PopupAlert";
import { exchangeRecordDetail } from "../../../../actions/rewardsBoutique";
import { setupWeChat } from "../../../../actions/dependency";

import { WeChatPath } from "../../util";
import Image from "../../../ImagesLazyLoad/index";
import getRunEnv from "../../../../../isomorphisms/getRunEnv";

const dynamic = new Dynamic();
export class certificate extends Component {
  constructor(props) {
    super(props);
    this.getDonatePoster = this.getDonatePoster.bind(this);
    this.state = {
      recordId: null,
      // donateNo: '',
    };
    this.postMessage = this.postMessage.bind(this);
  }

  postMessage() {
    const env = getRunEnv();
    let host = "https://m.sephora.cn";
    if (env === "stage") {
      host = "https://stagem.sephora.cn";
    } else if (env === "ebf") {
      host = "https://ebfm.sephora.cn";
    }
    wx &
      wx.miniProgram.postMessage({
        data: {
          imageUrl: `https://ssl1.sephorastatic.cn/soa/nmobile/img/donate_poster_banner.jpg?${Date.parse(
            new Date()
          )}`,
          path: `sp/web?nto=1&ncn=1&url=${host}/v2/html/intergalDonate`,
          title: "积分公益捐",
        },
      });
  }

  componentDidMount() {
    const { recordId } = this.state; // TODO: 请移除无用state
    console.log(recordId);
    const { setupWeChat } = this.props;
    const that = this;
    if (device.device_inMiniProgramsEnvironment()) {
      setupWeChat({
        callback: () => {
          that.postMessage();
        },
      });
      document.title = "";
    }
    getProfileInfo().then((res) => {
      this.setState({
        userInfo: res,
      });
    });
    this.getDonatePoster();
  }

  getDonatePoster() {
    getDonatePosterBanner({}).then((res) => {
      this.setState({
        donatePoster: res.imagePath,
      });
    });
  }

  clcikShare() {
    const { popupAlert } = this.props;
    // let donateNo = this.state.certificateInfo.donateNo;
    let miniProgramUsername;
    const env = getRunEnv();
    if (env === "production") {
      miniProgramUsername = "gh_e4e302a788ba";
    } else {
      miniProgramUsername = "gh_8f96bdb663d6";
    }
    let host = "https://m.sephora.cn";
    if (env === "stage") {
      host = "https://stagem.sephora.cn";
    } else if (env === "ebf") {
      host = "https://ebfm.sephora.cn";
    }
    const config = {
      title: "积分公益捐",
      text: "邀请您参与丝芙兰微笑公益行动，为兔唇宝宝助力",
      thumbImageUrl: `https://ssl1.sephorastatic.cn/soa/nmobile/img/donate_thumbImageUrl.jpg?${Date.parse(
        new Date()
      )}`, // 分享的图 图片尺寸1:1
      imageUrl: `https://ssl1.sephorastatic.cn/soa/nmobile/img/donate_poster_banner.jpg?${Date.parse(
        new Date()
      )}`, // 海报的图 图片尺寸5:4
      url: `${host}/v2/html/intergalDonate`,
      miniProgramPath: `/pages/webView?url=${encodeURIComponent(
        `${host}/v2/html/intergalDonate`
      )}&nto=1&ncn=1`,
      miniProgramUsername,
      miniProgramScene: "scene1",
      businessCode: 1,
      postWithCodeType: "WechatCode",
      miniImageUrl: `${this.state.donatePoster}`, // 二维码的图
      // donateNo: `证书编号：${donateNo}`,
      donateNo: "1",
      qrText: "扫码参与\n积分公益捐", // 小程序分享文案
      withUserInfo: true, // 生成图片是否需要用户信息
      success(res) {
        if (res.usePost) {
          popupAlert(1, "PopupToast", {
            _text: "图片已保存到本地相册",
            _autoClose: true,
          });
        } else {
          popupAlert(1, "PopupToast", { _text: "分享成功", _autoClose: true });
        }
      },
      failure(err) {
        popupAlert(1, "PopupToast", { _text: err.message, _autoClose: true });
      },
    };
    if (device.device_inMiniProgramsEnvironment()) {
      // by summer
      wx.miniProgram.navigateTo({ url: `/sp/mem/points-poster` });
    } else {
      dynamic.sepBridge().then((sep) => {
        sep.shareApp && sep.shareApp(config);
      });
    }
  }

  render() {
    const { userInfo } = this.state;
    return (
      <div className="certificate_page">
        {/* <div id="apptitle">捐赠证书</div> */}
        <CurrentComponentCommonTop />
        <p className="certificate_title">感谢您的爱心</p>
        <div className="certificate_content">
          <Image
            className="certificate_banner"
            src="https://ssl1.sephorastatic.cn/soa/nmobile/img/sephroa_banner.jpg"
            alt=""
          />

          <Image
            src={
              userInfo && userInfo.photo
                ? userInfo.photo
                : "https://ssl1.sephorastatic.cn/soa/pc/images/test-defaultImage.png"
            }
            className="avatar"
          />

          <p className="name">{userInfo && userInfo.nickName}</p>
          <p className="certificate_subtitle">
            <Image src={getCdnImageUrl("/soa/nmobile/img/donatetext.png")} />
          </p>
          <p className="desc">
            感谢您助力 <span>【丝芙兰微笑公益行动】</span>,
            为唇腭裂儿童绽放笑容奉献您的爱心，您捐出的每一个积分都是帮助他们的温暖力量。
          </p>
          <div className="certificate_txt_box" />
          <Image
            className="bottom_logo"
            src={getCdnImageUrl("/soa/nmobile/img/sephora_donate_logo.png")}
            alt=""
          />
        </div>
        <div className="share_btn" onClick={this.clcikShare.bind(this)}>
          分享
        </div>
        <a
          className="back_home"
          onClick={() => {
            let backUrl;
            if (device.device_inMiniProgramsEnvironment()) {
              backUrl = WeChatPath(`/v2/html/rewardsBoutique`);
            } else {
              backUrl = `/v2/html/rewardsBoutique`;
            }
            window.location.href = backUrl;
          }}
        >
          返回积分商城
        </a>
        <PopupAlert _zIndex={1001} />
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  popupAlert,
  exchangeRecordDetail,
  setupWeChat,
})(certificate);
