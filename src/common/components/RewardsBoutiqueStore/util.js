/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-10-14 10:08:18
 * @LastEditTime: 2021-03-12 19:09:29
 */
import Message from "@/components/Message";
import { AJAX } from "../../lib/ajax";
import * as device from "../../lib/device";
import { GetSingleCookie, SetSingleCookie2 } from "../../lib/Tools";
import { urlGetAllParams } from "../../lib/url";
import getRunEnv from "../../../isomorphisms/getRunEnv";

const PRODAPPID = "gh_e4e302a788ba";
const STAGEAPPID = "gh_8f96bdb663d6";

const PRODAPPIDSXK = "gh_896d772ca87a";
const STAGEAPPIDSXK = "gh_d73d428ac7c6";

export function getTokenByCookie() {
  return !!GetSingleCookie("Token");
}
export function getParms(key) {
  const val =
    GetSingleCookie(key) ||
    GetSingleCookie(key.toLowerCase()) ||
    urlGetAllParams(window.location)[key] ||
    urlGetAllParams(window.location)[key.toLowerCase()] ||
    "";
  return val;
}

export function setParms(parms) {
  SetSingleCookie2({ key: parms.key, value: parms.value });
}

export function isWeChat() {
  return device.isWeChat();
}
export function WeChatPath(url) {
  const cardNo = getParms("cardNo");
  const storeNo = getParms("storeNo") || getParms("store");
  const token = getParms("Token");
  if (device.isWeChat()) {
    url = `${url}?cardNo=${cardNo}&store=${storeNo}&token=${token}`;
  }
  return url;
}
// 小程序
export function getAppidWithEnv() {
  const env = getRunEnv();
  return env === "production" ? PRODAPPID : STAGEAPPID;
}
// 丝享卡
export function getAppidWithEnvSXK() {
  const env = getRunEnv();
  return env === "production" ? PRODAPPIDSXK : STAGEAPPIDSXK;
}
export function appToMiniprogram(path) {
  const btnHref = `sephora://foundation/openMiniProgram?username=${getAppidWithEnvSXK()}&path=${encodeURIComponent(
    path,
  )}`;
  return btnHref;
}

export function server(type, url, config) {
  return new Promise((resolve) => {
    const params = {};
    if (config) {
      if (config.data) {
        params.data = config.data;
      }
      if (config.headers) {
        params.headers = config.headers;
      }
    }
    AJAX(
      {
        ...params,
        type: (config && config.Method) || "GET",
        url,
      },
      (json) => {
        if (json.jQueryStatus.status === 421) {
          window.location.href = `/v2/html/rewardsBoutiqueLimit`;
        }

        json.type = type;
        if (json.errorMessage) {
          Message({
            message: json.errorMessage,
          });
        } else {
          resolve(json);
        }

        // if (json && json.results) {
        //   resolve(json.results);
        // } else {
        //  new Promise(resolve => resolve(e));
        //  resolve(json);
        // }
      },
    );
  }).catch((err) => {
    console.log(err);
  });
}
