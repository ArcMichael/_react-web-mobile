/*
 * @Author: Leo.Si
 * @Date: 2019-12-30 17:14:41
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-06 10:13:19
 * @function h5下载app页面
 */

import React from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import LazyloadImage from "@/components/LazyloadImage";
import { downLoadAppStore } from "../Utils/index";
import * as url from "../lib/url";
import getConfigs from "../../isomorphisms/getConfigs";
import * as device from "@/lib/device";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/download.scss");
}

const configs = getConfigs();

export default class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowTip: false,
    };
    this.colseTip = this.colseTip.bind(this);
  }
  componentDidMount() {
    if (device.isWeChat()) {
      // 微信环境判断微信版本

      if (isBrowser()) {
        let wechatInfo = navigator.userAgent.match(
          /MicroMessenger\/([\d\.]+)/i
        );
        if (wechatInfo && wechatInfo.length > 0) {
          let judgewechat = wechatInfo[1].split(".");
          if (
            judgewechat[0] > 8 ||
            (judgewechat[0] == 8 && judgewechat[1] > 0) ||
            (judgewechat[0] == 8 && judgewechat[1] == 0 && judgewechat[2] >= 9)
          ) {
            // 大于8.0.9
            this.setState({
              isShowTip: true,
            });
          }
        }
      }
    }
    // if (device.isWeChat()) {
    //   // downLoadApp()
    //   downLoadAppStore();
    // } else {
    //   // document.getElementById("default_link").click();
    //   setTimeout(() => {
    //     downLoadAppStore();
    //   }, 2000);
    // }
  }
  colseTip() {
    this.setState({
      isShowTip: false,
    });
  }
  toDownLoad() {
    // downLoadApp()
    downLoadAppStore();
  }

  render() {
    const { isShowTip } = this.state;
    return (
      <div className="download_page">
        {/* <img
          className="download_page_logo"
          src=""
        /> */}
        <LazyloadImage
          imgProps={{
            className: "download_page_logo",
            src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/downloadLogo.png",
          }}
        />
        <a className="download_page_link" onClick={this.toDownLoad.bind(this)}>
          立即下载丝芙兰
        </a>
        {isShowTip && (
          <div className="download-tip">
            <img
              className="delta"
              src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/download-delta.png"
            />
            <div className="download-left">
              <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/download-logo-w.png" />
            </div>
            <div className="download-mid">
              点击在浏览器打开
              <br />
              即可下载丝芙兰APP
            </div>
            <div className="download-close" onClick={this.colseTip}>
              <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/download-close-w.png" />
            </div>
          </div>
        )}
        {url &&
        isBrowser() &&
        url.urlGetParams(window && window.location, "source") &&
        url.urlGetParams(window && window.location, "source") === "va" ? (
          <LazyloadImage
            imgProps={{
              className: "download_page_va",
              src: `${configs.static}/soa/nmobile/img/downloadVa.png`,
            }}
          />
        ) : (
          <LazyloadImage
            imgProps={{
              className: "download_page_bg",
              src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/downloadBg.png",
            }}
          />
        )}
      </div>
    );
  }
}
