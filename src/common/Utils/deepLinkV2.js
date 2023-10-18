
import * as Regexp from "../lib/regexp";
import { isIOS } from "../lib/device";
import { urlGetParams } from "../lib/url";
function getURLParmas(path) {
  let windowSearch = window.location.search;
  if (!windowSearch) return path;
  if (path.indexOf("?") > -1) return `${path}${windowSearch.replace("?", "&")}`;
  return `${path}${windowSearch}`;
}
function getOrderId(path) {
  let windowSearch = window.location.pathname;
  if (!windowSearch) return path;
  return windowSearch.split("-")[1].split(".")[0];
}
const whiteList = {
  "order-": (type) => {
    const { pathname, search } = window.location;
    if (type && type == "Oia") {
      return `/login?historyLocation=${pathname}${search}`;
    }
    return `sephora://order?orderid=${getOrderId()}`;
  },
};

export const getOiaDownloadLink = () => {
  const { pathname, search, hostname } = window.location;
  let url = `${pathname}${search}`;
  for (const item in whiteList) {
    if (pathname.indexOf(item) > 0) {
      url = whiteList[item]("Oia");
      break;
    }
  }
  // if（
  if (hostname.match(/stage|localhost|127.0.0.1/)) {
    return `https://stageoia.sephora.cn${url}`;
  }
  return `https://oia.sephora.cn${url}`;
};

export const getCommonDownloadLink = (params) => {
  let pathName = window.location.pathname;
  const { pathname } = window.location;
  let jumpApp = "sephora://home";
  for (const item in whiteList) {
    if (pathname.indexOf(item) > 0) {
      jumpApp = whiteList[item]();
      break;
    }
  }

  if (pathName.indexOf("campaign") > -1)
    jumpApp = `sephora://openurl?url=${encodeURIComponent(
      window.location.origin + window.location.pathname,
    )}`;
  if (pathName.indexOf("weeklyspecials") > -1)
    jumpApp = `sephora://openurl?url=${encodeURIComponent(
      window.location.origin + window.location.pathname,
    )}`;
  // if (pathName.indexOf("hot") > -1) jumpApp = `sephora://ecommerce/list?type=hot&k=${encodeURIComponent(urlGetParams(window.location, 'k'))}`;
  // if (pathName.indexOf("search") > -1) jumpApp = `sephora://ecommerce/list?type=search&k=${encodeURIComponent(urlGetParams(window.location, 'k'))}`;
  if (pathName.indexOf("hot") > -1) jumpApp = `sephora://`;
  if (pathName.indexOf("search") > -1) jumpApp = `sephora://`;
  if (pathName.indexOf("brand") > -1)
    jumpApp = `sephora://brand?id=${
      pathName.split("/")[2].split("-")[pathName.split("/")[2].split("-").length - 1] || 1
    }`;
  if (pathName.indexOf("category") > -1)
    jumpApp = `sephora://ecommerce/list?type=normal&categoryId=${pathName.split("/")[2]}`;
  if (pathName.indexOf("product") > -1) {
    jumpApp = `sephora://product?productid=${Regexp.pathnameProductId(window.location)}`;
    if (Regexp.searchSkuId(window.location)) {
      jumpApp = `sephora://product?productid=${Regexp.pathnameProductId(
        window.location,
      )}&skuid=${Regexp.searchSkuId(window.location)}`;
    }
    if (params && params.productId && params.skuId) {
      jumpApp = `sephora://product?productid=${params.productId}&skuid=${params.skuId}`;
    }
    if (pathName.indexOf("exclusive") > -1 || pathName.indexOf("vaproductlist") > -1) {
      jumpApp = `sephora://`;
    }
  }
  if (pathName.indexOf("beautyCommunity") > -1 && params) {
    jumpApp = params;
  }
  //return getCampaignId(jumpApp)
  return getURLParmas(jumpApp);
};

export function getHrefLink(params) {
  if (isIOS()) {
    return getOiaDownloadLink();
  }
  return getCommonDownloadLink(params);
}

/**
 *
 * @param {string} androidUrl
 */
export function getDcComponentBottomOpenAppUrl(androidUrl) {
  if (isIOS()) {
    return getOiaDownloadLink();
  }
  return androidUrl;
}
/**
 *
 * @param {string} androidUrl
 */
export function getDcComponentBottomOpenApp(androidUrl) {
  function autoGoDownloadPage() {
    setTimeout(() => {
      window.location.href = getOiaDownloadLink();
    }, 500);
  }
  window.location.href = getDcComponentBottomOpenAppUrl(androidUrl);
  if (!isIOS()) {
    autoGoDownloadPage();
  }
}

export function downLoadApp() {
  const pathName = window.location.pathname;
  setTimeout(() => {
    window.location.href = `/public/download.html${
      pathName.indexOf("vaproductlist") > -1 ? "?source=va" : ""
    }`;
  }, 500);
}

/**
 * ios 通过oia 的universial link打开
 * andorid 通过schema
 * @param {string?} link
 */
export function CommonOpenApp(link) {
  function autoGoDownloadPage() {
    setTimeout(() => {
      window.location.href = getOiaDownloadLink();
    }, 500);
  }
  window.location.href = link || getHrefLink();
  if (!isIOS()) {
    autoGoDownloadPage();
  }
}

/**
 * @param {Function?} cb
 * @param {string?} params
 */
export function openAppBySchema(cb, params) {
  if (typeof window !== "undefined") {
    window.addEventListener(
      "pageshow",
      function () {
        if (urlGetParams(window.location, "campaignid")) {
          if (cb) cb();
          window.location.href = getCommonDownloadLink(params);
        }
      },
      false,
    );
  }
}

