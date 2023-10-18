import * as url from "./url";

export function pathnameProductId(location) {
  if (location.pathname === location.pathname.replace(/^\/product\/([a-zA-Z0-9]+)\.html/, "$1"))
    return false;
  return location.pathname.replace(/^\/product\/([a-zA-Z0-9]+)\.html/, "$1");
}

export function searchProductId(location) {
  return url.urlGetParams(location, "productId") || false;
}

export function searchSkuId(location) {
  return url.urlGetParams(location, "sku") || false;
}
export function searchStep(location) {
  return url.urlGetParams(location, "step") || false;
}
export function searchLipsticklidsku(location) {
  return url.urlGetParams(location, "lipsticklidsku") || false;
}
export function searchLipsticksku(location) {
  return url.urlGetParams(location, "lipsticksku") || false;
}
export function searchSkulip(location) {
  return url.urlGetParams(location, "skulip") || false;
}
export function searchSkulid(location) {
  return url.urlGetParams(location, "skulid") || false;
}
export function searchCouponCode(location) {
  return url.urlGetParams(location, "code") || false;
}
//miumiu相关url参数
export function searchOdorSku(location) {
  return url.urlGetParams(location, "odorsku") || false;
}
export function searchLidSku(location) {
  return url.urlGetParams(location, "lidsku") || false;
}
export function searchBodySku(location) {
  return url.urlGetParams(location, "bodysku") || false;
}

export function pathnamePostId(location) {
  if (
    location.pathname ===
    location.pathname.replace(/^\/beautyCommunity\/([a-zA-Z]+)\/([\s\S]*)\//, "$2")
  )
    return false;
  return location.pathname.replace(/^\/beautyCommunity\/([a-zA-Z]+)\/([\s\S]*)\//, "$2");
}

export function searchK(location) {
  return url.urlGetParams(location, "k") || false;
}

export function searchState(location) {
  return url.urlGetParams(location, "state") || false;
}

export function searchCode(location) {
  return url.urlGetParams(location, "code") || false;
}

export function searchOPCode(params) {
  if (!params) return false;
  return (
    params
      .substring(params.lastIndexOf("/"), params.length)
      .replace(/^\/OP([a-zA-Z0-9]+)\.html/, "$1") || false
  );
}
