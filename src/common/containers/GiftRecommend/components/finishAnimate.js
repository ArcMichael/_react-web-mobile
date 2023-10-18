import React, { Component } from "react";
import { connect } from "react-redux";
import * as device from "@/lib/device";
import getRunEnv from "isomorphisms/getRunEnv";
import lottie from "lottie-web";
import { urlGetParams } from "@/lib/url";
export class finishAnimate extends Component {
  componentDidMount() {
    this.loadAnimate();
  }
  componentWillUnmount() {
    if (this.anim) this.anim.destroy();
  }
  loadAnimate() {
    let { animateJson } = this.props;
    let container = document.getElementById("lottie");
    let host = "https://m.sephora.cn",
      env = getRunEnv();
    if (env === "stage") {
      host = "https://stagem.sephora.cn";
    } else if (env === "ebf") {
      host = "https://ebfm.sephora.cn";
    }
    let answerDtos = this.props.answerDtos;
    localStorage.setItem("selectInfo", JSON.stringify(answerDtos));
    this.anim = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: 0,
      autoplay: true,
      animationData: animateJson,
    });

    this.anim.addEventListener("complete", () => {
      if (device.device_inMiniProgramsEnvironment()) {
        wx.miniProgram.redirectTo({
          url: `/sp/web?vm=1&nto=1&url=${encodeURIComponent(
            `${host}/campaign/share/giftResult?activityCode=${urlGetParams(
              window.location,
              "activityCode"
            )}&questionCode=${urlGetParams(window.location, "questionCode")}`
          )}`,
        });
        this.anim.destroy();
      } else {
        window.location.href = `/campaign/share/giftResult${window.location.search}`;
      }
    });
  }
  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => ({
  answerDtos: state.giftIntelligent.answerDtos,
  animateJson: state.giftIntelligent.animateJson,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(finishAnimate);
