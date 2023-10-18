import getServerGateWay from "serverCode/utils/getServerGateWay";
import { RouterIndexParams } from "./getRouterIndex";
import SsrRequestHelper from "./ssr-request-helper";

/**
 * @typedef {import('./getRouterIndex').RouterIndexParams} RouterIndexParams
 */

export interface FetchlistItem {
  content: string;
  url: string;
  params: {
    method: "GET" | "POST" | "PUT";
    headers?: {
      UID?: RouterIndexParams["UID"];
      Token?: RouterIndexParams["Token"];
      deviceid?: string;
      "Content-Type"?: string;
      channel?: string;
    };
    body: any;
    timeout: RouterIndexParams["timeout"];
  };
}

export interface FetchListRes {
  Env: RouterIndexParams;
  fetchList: FetchlistItem[];
}

/**
 * @param {RouterIndexParams} params
 * @return {Promise<FetchListRes>}
 */
export default function getSyncList(
  params: RouterIndexParams
): Promise<FetchListRes> {
  let fetchList: FetchlistItem[] = [];
  return new Promise((resolve) => {
    getServerGateWay().then((url) => {
      switch (params.index) {
        case "Index":
          fetchList = fetchList.concat(
            SsrRequestHelper.getHomepageList(params, url)
          );
          break;
        case "homepage":
          fetchList = fetchList.concat(
            SsrRequestHelper.getHomepageList(params, url)
          );
          break;
        case "BrandAll":
          const categoryId = params.query ? params.query.categoryId : "";
          fetchList.push({
            content: "BrandAll",
            url: `http://${url}/v1/es/brandWall/queryAllBrands?categoryId=${categoryId}`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "HotBrandAllcon",
            url: `http://${url}/v1/es/brandWall/hot-brands`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          break;
        case "Hotsales":
          fetchList.push({
            content: "Hotsales",
            url: `http://${url}/v1/dp/hotsales/categories`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
                deviceid: params.deviceid || "",
                channel: params.channel,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          break;
        case "product":
          const spuId = params.pathname.split(/\/|\.html/)[2];
          const skuId = (params.query && params.query.sku) || "";
          fetchList.push({
            content: "productFirstSection.productDetailsInfo",
            url: `http://${url}/v1/product/product/skuDetailInfo`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: JSON.stringify({
                queryBody: {
                  channel: "mobile",
                  productId: spuId,
                  skuId,
                },
              }),
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "productFirstSection.productDetailsProductInfo",
            url: `http://${url}/v2/product/sku/info?productId=${spuId}&channel=MOBILE&skuId=${skuId}&_=${Date.now()}`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "productFirstSection.productDetailsRecommend",
            url: `http://${url}/v1/product/product/recommend/${spuId}/1/4`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "productFirstSection.productDetailsMktSimpleOne",
            url: `http://${url}/v1/marketing/MktSimpleGroupController/simpleImageGroup`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: JSON.stringify({
                queryBody: {
                  locationLabel: "CUSTOM:PRODUCT",
                  memberGroupId: 0,
                },
              }),
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "productFirstSection.productDetailsMktSimpleTwo",
            url: `http://${url}/v1/marketing/MktSimpleGroupController/simpleImageGroup`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: JSON.stringify({
                queryBody: {
                  locationLabel: "CUSTOM:PRODUCT:NEW",
                  memberGroupId: 0,
                },
              }),
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "productFirstSection.productDetailsMktSimpleThree",
            url: `http://${url}/v1/marketing/MktSimpleGroupController/simpleImageGroup`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: JSON.stringify({
                queryBody: {
                  locationLabel: "MIUMIU:AD",
                  memberGroupId: 0,
                },
              }),
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "productFirstSection.productDetailsCommunity",
            url: `http://${url}/v1/community/posts/product/mobile/${spuId}?pagingState=1&channel=MOBILE`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "productFirstSection.productDetailsConsulation",
            url: `http://${url}/v1/product/consulation/consulationList?productId=${spuId}&pageNo=1&pageSize=3`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "productFirstSection.productDetailsRanking",
            url: `http://${url}/v1/product-extend/ranking/${spuId}?skuId=${skuId}&channel=MOBILE`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          break;
        // 分类页
        case "Category":
          fetchList.push({
            content: "CategoryConts",
            url: `http://${url}/v1/es/groupCategory/getGroupCategory`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: JSON.stringify({
                head: {
                  token: "string",
                  userId: "string",
                },
                queryBody: params.pathname.replace(/[^0-9]/gi, "")
                  ? params.pathname.replace(/[^0-9]/gi, "")
                  : "60001",
              }),
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "CategoryConfigConts",
            url: `http://${url}/v2/marketing/classify-page/menu-bar`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
                channel: "MOBILE",
              },
              body: {},
              timeout: params.timeout,
            },
          });
          break;
        // 分类品牌页
        case "CategoryBrand":
          const categoryid = params.query.categoryId || "";
          fetchList.push({
            content: "CategoryConts",
            url: `http://${url}/v1/es/groupCategory/getGroupCategory`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: JSON.stringify({
                head: {
                  token: "string",
                  userId: "string",
                },
                queryBody: "60001",
              }),
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "CategoryConfigConts",
            url: `http://${url}/v2/marketing/classify-page/menu-bar`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
                channel: "MOBILE",
              },
              body: {},
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "BrandAll",
            url: `http://${url}/v1/es/brandWall/queryAllBrands?categoryId=${categoryid}`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "HotBrandAllcon",
            url: `http://${url}/v1/es/brandWall/hot-brands/v2`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: {},
              timeout: params.timeout,
            },
          });
          break;
        case "CategoryIntelligent":
          fetchList.push({
            content: "CategoryConts",
            url: `http://${url}/v1/es/groupCategory/getGroupCategory`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: JSON.stringify({
                head: {
                  token: "string",
                  userId: "string",
                },
                queryBody: "60001",
              }),
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "CategoryConfigConts",
            url: `http://${url}/v2/marketing/classify-page/menu-bar`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
                channel: "MOBILE",
              },
              body: {},
              timeout: params.timeout,
            },
          });
          break;
        case "CategoryRecommend":
          fetchList.push({
            content: "CategoryConts",
            url: `http://${url}/v1/es/groupCategory/getGroupCategory`,
            params: {
              method: "POST",
              headers: {
                UID: params.UID,
                Token: params.Token,
              },
              body: JSON.stringify({
                head: {
                  token: "string",
                  userId: "string",
                },
                queryBody: "60001",
              }),
              timeout: params.timeout,
            },
          });
          fetchList.push({
            content: "CategoryConfigConts",
            url: `http://${url}/v2/marketing/classify-page/menu-bar`,
            params: {
              method: "GET",
              headers: {
                UID: params.UID,
                Token: params.Token,
                channel: "MOBILE",
              },
              body: {},
              timeout: params.timeout,
            },
          });
          break;
        default:
          break;
      }
      resolve({ Env: params, fetchList });
    });
  });
}
