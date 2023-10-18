import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import * as Regexp from "../lib/regexp";
import { isIOS } from "../lib/device";

/**
 * @param {string} path
 */
function getUrlByPathAndSearch(path: string) {
  let windowSearch = window.location.search;
  if (!windowSearch) return path;
  if (path.indexOf("?") > -1) return `${path}${windowSearch.replace("?", "&")}`;
  return `${path}${windowSearch}`;
}

/**
 * 根据当前的pathname, 拼成oia下的pathname
 * 获取oia域名下的url地址
 */
export const getOiaUrlByCurrentPathname = () => {
  const { pathname, search, hostname } = window.location;
  if (hostname.match(/stage|localhost|127.0.0.1/)) {
    return `https://stageoia.sephora.cn${pathname}${search}`;
  }
  return `https://oia.sephora.cn${pathname}${search}`;
};

export type getSchemaUrlParams =
  | {
      productId: string | number;
      skuId: string | number;
    }
  | string;

/**
 * 根据路径获取schema url
 * @param {getSchemaUrlParams?} params
 */
export const getSchemaUrl = (params?: getSchemaUrlParams) => {
  const pathName = window.location.pathname;
  let schemaPath = "sephora://home";
  if (pathName.indexOf("campaign") > -1)
    schemaPath = `sephora://openurl?url=${encodeURIComponent(
      window.location.origin + window.location.pathname
    )}`;
  if (pathName.indexOf("weeklyspecials") > -1)
    schemaPath = `sephora://openurl?url=${encodeURIComponent(
      window.location.origin + window.location.pathname
    )}`;
  if (pathName.indexOf("rewardsBoutique") > -1)
    schemaPath = `sephora://openurl?url=${encodeURIComponent(
      window.location.origin + window.location.pathname
    )}`;
  // if (pathName.indexOf("hot") > -1) jumpApp = `sephora://ecommerce/list?type=hot&k=${encodeURIComponent(urlGetParams(window.location, 'k'))}`
  // if (pathName.indexOf("search") > -1) jumpApp = `sephora://ecommerce/list?type=search&k=${encodeURIComponent(urlGetParams(window.location, 'k'))}`
  if (pathName.indexOf("hot") > -1) schemaPath = `sephora://`;
  if (pathName.indexOf("search") > -1) schemaPath = `sephora://`;
  if (pathName.indexOf("brand") > -1)
    schemaPath = `sephora://brand?id=${
      pathName.split("/")[2].split("-")[
        pathName.split("/")[2].split("-").length - 1
      ] || 1
    }`;
  if (pathName.indexOf("category") > -1)
    schemaPath = `sephora://ecommerce/list?type=normal&categoryId=${
      pathName.split("/")[2]
    }`;
  if (pathName.indexOf("product") > -1) {
    schemaPath = `sephora://product?productid=${Regexp.pathnameProductId(
      window.location
    )}`;
    if (Regexp.searchSkuId(window.location)) {
      schemaPath = `sephora://product?productid=${Regexp.pathnameProductId(
        window.location
      )}&skuid=${Regexp.searchSkuId(window.location)}`;
    }
    if (typeof params === "object" && params.productId && params.skuId) {
      schemaPath = `sephora://product?productid=${params.productId}&skuid=${params.skuId}`;
    }
    if (
      pathName.indexOf("exclusive") > -1 ||
      pathName.indexOf("vaproductlist") > -1
    ) {
      schemaPath = `sephora://`;
    }
  }
  if (pathName.indexOf("beautyCommunity") > -1 && typeof params === "string") {
    schemaPath = params;
  }
  return getUrlByPathAndSearch(schemaPath);
};

export const getVaDownloadLink = (params: { skuId: string }) => {
  let jumpApp = "sephora://home";
  if (params && params.skuId) {
    jumpApp = `sephora://ecommerce/va/skus/${params.skuId}`;
  }
  return getUrlByPathAndSearch(jumpApp);
};
export function getHrefLink() {
  if (isIOS()) {
    return getOiaUrlByCurrentPathname();
  }
  return getSchemaUrl();
}
export function downLoadApp() {
  const pathName = window.location.pathname;
  setTimeout(() => {
    window.location.href = `/public/download.html${
      pathName.indexOf("vaproductlist") > -1 ? "?source=va" : ""
    }`;
  }, 500);
}
export function getUTMSource() {
  let source = {} as any;
  let utmSource = "";
  try {
    if (GetSingleCookie2({ key: "order_source" })) {
      source = JSON.parse(
        decodeURIComponent(GetSingleCookie2({ key: "order_source" }))
      );
    }
    for (const x in source) {
      if (x === "utm_source") {
        utmSource = source[x];
      }
    }
  } catch (error) {
    utmSource = "";
  }
  return utmSource;
}
export function downLoadAppStore() {
  const ios = "https://itunes.apple.com/cn/app/sephora/id561859697?mt=8";
  let android = getUTMSource()
    ? "http://m.sephora.cn/apk/download.html?utm_source=" + getUTMSource()
    : "http://m.sephora.cn/apk/download.html";
  const weChat = "https://m.sephora.cn/apk/download.html";
  const isIOS = !!navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
  const isAndroid =
    navigator.userAgent.indexOf("Android") > -1 ||
    navigator.userAgent.indexOf("Linux") > -1;
  const isWeChat = !!navigator.userAgent.toLowerCase().match(/micromessenger/i);
  if (isWeChat) {
    window.open(weChat);
  }
  if (isAndroid) {
    setTimeout(function () {
      try {
      } catch (e) {
        console.log(e);
      }
      if (confirm("确定下载SEPHORA")) {
        if (
          judgeVersion(
            {
              version: "6.23.0",
            },
            getAppMessage()
          )
        ) {
          alert("请先去应用宝下载最新版SEPHORA App");
        } else {
          window.location.href = android;
        }
        // window.location.href = publicDownLoadHtml
      }
    }, 0);
  }
  if (isIOS) {
    setTimeout(() => {
      window.location.href = ios;
      //window.location.href = publicDownLoadHtml
    }, 500);
  }
}

function getAppMessage() {
  var userAgent = window.navigator.userAgent;
  var tagString = "sephora/app";
  if (userAgent.indexOf(tagString, userAgent.length - tagString.length) != -1) {
    var regex =
      /^(\w+\/[0-9.]{1,9}) \((\w+|\w+ \w+); (\w+ [0-9.]{1,9}); (Scale\/[0-9.]{1,4})\) .* sephora\/app$/;
    var result = userAgent.match(regex);
    if (result) {
      var deveiceInfo = {
        type: result[2],
        scale: result[4].split("/")[1],
        name: result[3].split(" ")[0],
        version: result[3].split(" ")[1],
        applicationName: result[1].split("/")[0],
        applicationVersion: result[1].split("/")[1],
      };
      return deveiceInfo;
    }
    return "";
  } else {
    return "";
  }
}

function judgeVersion(
  config: {
    version: string;
  },
  appMessage: any
) {
  let isUpdate = false;
  if (appMessage) {
    let version = appMessage.applicationVersion;
    let mainVersion = parseInt(version && version.split(".")[0]);
    let secondaryVersion = parseInt(version && version.split(".")[1]);
    let revisionNumber = parseInt(version && version.split(".")[2]);
    if (config && config.version) {
      if (mainVersion < parseInt(config.version.split(".")[0])) isUpdate = true;
      if (
        parseInt(config.version.split(".")[0]) == mainVersion &&
        secondaryVersion < parseInt(config.version.split(".")[1])
      )
        isUpdate = true;
      if (
        parseInt(config.version.split(".")[0]) == mainVersion &&
        parseInt(config.version.split(".")[1]) == secondaryVersion &&
        revisionNumber < parseInt(config.version.split(".")[2])
      )
        isUpdate = true;
    }
    //  if (isUpdate) alert('请先去应用宝下载最新版SEPHORA App')
  }
  return isUpdate;
}
