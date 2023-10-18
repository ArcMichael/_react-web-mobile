import { AJAX } from "@/lib/ajax";
import * as device from "@/lib/device";
import { urlGetParams } from "@/lib/url";
import { GetConfirmation, GetSingleCookie } from "@/lib/Tools";
import {
  Params,
  ListCodeData,
  labelListCodeData,
  skuCodeData,
  skuInfoCodeData,
  likeCodeData,
} from "./interance";

// 评价中心-获取商品规格
export function getAttarList(productId: number | string, skuId?: number | null) {
  return new Promise<skuCodeData>((resolve) => {
    AJAX(
      {
        type: "GET",
        url: `/v2/product/sku/specs?productId=${productId}&channel=MOBILE${
          skuId ? "&skuId=" + skuId : ""
        }`,
        headers: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        resolve(GetConfirmation(json));
      },
    );
  });
}

// 评价中心-获取商品规格
export function getskuInfo(productId: number | string, skuId?: number | null) {
  return new Promise<skuInfoCodeData>((resolve) => {
    AJAX(
      {
        type: "GET",
        url: `/v2/product/sku/info?productId=${productId}&channel=MOBILE${
          skuId ? "&skuId=" + skuId : ""
        }`,
        headers: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        resolve(GetConfirmation(json));
      },
    );
  });
}

// 评价中心-获取评价列表
export function getCommentList(params: Params) {
  return new Promise<ListCodeData>((resolve) => {
    AJAX(
      {
        type: "POST",
        url: `/v3/product/comment/commentList`,
        data: params,
        headers: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        resolve(GetConfirmation(json));
      },
    );
  });
}

// 获取发表商品评价可选的评价标签，属性等信息 ,奖励配置文案
export function getSkuPendingCommentList(params: Params) {
  return new Promise<ListCodeData>((resolve) => {
    AJAX(
      {
        type: "POST",
        url: `/v3/product/comment/getSkuPendingCommentList`,
        data: params,
        headers: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        resolve(GetConfirmation(json));
      },
    );
  });
}

//获取某商品的评价属性分数接口
export function getSkuScoreList(spuId: string | number, skuId?: number | null) {
  return new Promise<labelListCodeData>((resolve) => {
    AJAX(
      {
        type: "GET",
        url: `/v3/product/comment/top/label/${spuId}${skuId ? "?skuId=" + skuId : ""}`,
        headers: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        resolve(GetConfirmation(json));
      },
    );
  });
}

//获取某商品的评价属性分数接口
export function getSkuLabelList(spuId: string | number, optType: number, skuId?: number | null) {
  return new Promise<labelListCodeData>((resolve) => {
    AJAX(
      {
        type: "GET",
        url: `/v3/product/comment/label/${spuId}?optType=${optType}${
          skuId ? "&skuId=" + skuId : ""
        }`,
        headers: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        resolve(GetConfirmation(json));
      },
    );
  });
}

//点赞/取消点赞接口
export function toggleLikeComment(uuid: string) {
  return new Promise<likeCodeData>((resolve) => {
    AJAX(
      {
        type: "GET",
        url: `/v1/product/comment/toggleLikeComment?commentId=${uuid}`,
        headers: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        resolve(GetConfirmation(json));
      },
    );
  });
}
