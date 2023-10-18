import Sensor from "@/Utils/sensor/index";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import Community from "@/lib/services/Community";
import SearchServices from "@/lib/services/SearchServices";
import Mpcms from "@/lib/services/Mpcms";
import { ItemTypeEnums } from "../GuessYouLikeItem";
import discountPrice from "../../../libs/discountPrice";

/**
 * @typedef {import('../GuessYouLikeItem').DataSourceType}  GuessYouLikeDataSourceType
 */
/**
 * @typedef {import('../GuessYouLikeItem').ForInOneAdItemInfo}  ForInOneAdItemInfo
 */
/**
 * @typedef {import('../GuessYouLikeItem').ProductItemInfo}  ProductItemInfo
 */
/**
 * @typedef {import('../GuessYouLikeItem').PostItemInfo}  PostItemInfo
 */
/**
 * @typedef {import('../GuessYouLikeItem').ImageItemInfo}  ImageItemInfo
 */

export default class Utils {
  static getSensorData({ searchContent, searchlink, omniture, index, item, type, op_code, commodity_sku }) {
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_NewMobile##getSensorData##HomeGuessYouLike.js##19",
      banner_type: "product",
      banner_content: searchContent,
      banner_belong_area: type ? type + "_Guess U Like" : "Guess U Like",
      banner_to_url: searchlink,
      banner_to_page_type: "Product-detail-page",
      banner_ranking: index + 1,
      belong_team: "Site Operation",
      campaign_code: searchlink || omniture,
      op_code,
      commodity_sku,
      action_id: "1000001_019",
      page_id: "MB_1000001",
      banner_current_url: "home",
      banner_current_page_type: "home"
    });
    GoogleAnalytics.pushV2({
      event: "guessYouLike",
      listName: "guess u like > homepage",
      productId: item.id,
      productName: item.title,
      productOpCode: item.item,
    });
    GoogleAnalytics.pushV2({
      event: "eeListClick",
      list: "guess what you like plp",
      products: [
        {
          brand: item.brand,
          id: item.id,
          name: item.title,
          position: index + 1,
          productOpCode: item.item,
        },
      ],
    });
    GoogleAnalytics.pushV2({
      event: "campaignSpotClick",
      blockName: "guess u like",
      campaignCode:
        searchlink.split(/intcmp=|prodlink=|kwrec=/)[1] &&
        searchlink.split(/intcmp=|prodlink=|kwrec=/)[1].split("&")[0],
      spotName: item.title,
    });
  }

  /**
   * productIds
   * @param {number[]} ids
   * @return {Promise<import('../../../../../lib/services/Community').PostInfo[]>}
   */
  static getPostsDataByProductIds(ids) {
    return new Promise(resolve => {
      Community.news.getPostsByProductIds(ids).then(res => {
        if (res.status === 0 && res.results && Array.isArray(res.results)) {
          resolve(
            res.results.map(item => {
              return {
                ...item,
                __type__: ItemTypeEnums.post,
              };
            }),
          );
        }
      });
    });
  }

  /**
   * @param {number} limit
   */
  static getDatasBySearchServices(limit) {
    return new Promise(resolve => {
      SearchServices.getExclusiveProducts(1, limit).then(res => {
        /** @type {GuessYouLikeProductItem[]} - description */
        let guessYouLikeDatas = [];
        if (res.status === 0 && res.results && Array.isArray(res.results.content)) {
          guessYouLikeDatas = res.results.content.map(item => {
            const image = item.imagePath ? `${item.imagePath}350x350.jpg` : "";
            return {
              available: "",
              brand: "",
              c_custom_0: item.brandEN,
              c_custom_1: "",
              category: "",
              description: "",
              id: item.productId,
              image: image,
              item: item.productId,
              link: item.productDetailUrl,
              msrp: "",
              newCostPrice: "",
              newPrice: "",
              price: item.minDiscountPrice || item.minDisplayPrice,
              title: item.productCN,
              trackingCode: "",
              zoom_image: image,
            };
          });
          resolve(guessYouLikeDatas);
        }
      });
    });
  }

  /**
   * @return {Promise<import('@/lib/services/Mpcms').getHomeGuessYouLikeResponse['results']>}
   */
  static getGuessYouLikeAds(tabId) {
    return new Promise(resolve => {
      Mpcms.getHomeGuessYouLike(tabId).then(res => {
        if (res.status === 0 && res.results) {
          resolve(res.results);
        }
      });
    });
  }

  /**
   * @param {number} limit
   * @return {Promise<import('../GuessYouLikeItem/ProductItem').GuessYouLikeProductItem[]>}
   */
  static getDataByEmarsysOrSearchServices({ limit, emarsysRecommendParams, recommendParam }) {
    return new Promise(resolve => {
      const { logicType } = emarsysRecommendParams;

      if (logicType) {
        window.ScarabQueue.push([logicType.toLowerCase(), recommendParam]);
      }
      window.ScarabQueue.push([
        "recommend",
        {
          logic: logicType ? logicType + "_MOBILE" : "PERSONAL_MOBILE_HOME",
          limit: limit,
          containerId: "GuessYouLike",
          success: function (sc) {
            const param = [
              ...sc.page.products.map(({ id }) => {
                return id;
              }),
            ];
            const json = {};
            let filterList = [];
            // 第三个参数为是否排除售罄
            discountPrice(
              param,
              data => {
                const { results } = data;
                results.forEach(item => {
                  json[item.spuId] = item;
                  filterList.push(item.spuId.toString());
                });
                // 过滤
                let products = sc.page.products
                  .map(item => {
                    if (filterList.indexOf(item.id) != -1) {
                      return {
                        ...item,
                        newCostPrice: json[item.id] ? json[item.id].costPrice : "",
                        newPrice: json[item.id] ? json[item.id].price : "",
                      };
                    }
                  })
                  .filter(item => {
                    return !!item;
                  });
                resolve(products);
              },
              true,
            );
          },
        },
      ]);
      window.ScarabQueue.push(["goAsync"]);
    });
  }

  /**
   * 返回 GuessYouLikeDataSourceType[];
   * 返回数组length 60; 只含有对应位置广告位，其余位置为null
   * @return {Promise<GuessYouLikeDataSourceType[]>}
   */
  static getGuessYouLikeAdsData(tabId) {
    /** @type {GuessYouLikeDataSourceType[]} - description */
    let newData = new Array(60);
    for (let i = 0; i < 60; i++) {
      newData[i] = null;
    }
    return new Promise(resolve => {
      Utils.getGuessYouLikeAds(tabId).then(res => {
        if (res.activity2) {
          newData[1] = { aggr: res.activity2, aggrButton: res.activity2Button, __type__: ItemTypeEnums.image };
        }
        if (res.activity10) {
          newData[9] = { aggr: res.activity10, aggrButton: res.activity10Button, __type__: ItemTypeEnums.image };
        }
        if (res.activity26) {
          newData[25] = { aggr: res.activity26, aggrButton: res.activity26Button, __type__: ItemTypeEnums.image };
        }
        if (res.activity33) {
          newData[32] = { aggr: res.activity33, aggrButton: res.activity33Button, __type__: ItemTypeEnums.image };
        }
        if (res.activity60) {
          newData[59] = { aggr: res.activity60, aggrButton: res.activity60Button, __type__: ItemTypeEnums.image };
        }
        if (res.aggr && Array.isArray(res.aggr.ads) && res.aggr.ads.length > 0) {
          /** @type {ForInOneAdItemInfo} - description */
          const ForInOneItem = {
            aggr: res.aggr,
            aggrButton: res.aggrButton,
            __type__: ItemTypeEnums.fourinone,
          };
          newData[11] = ForInOneItem;
        }
        resolve(newData);
      });
    });
  }

  /**
   * 排序逻辑的 JIRA 地址和参考文档
   * ./猜你喜欢排序参考.pdf
   * ./排序逻辑参考.png
   * JIR http://jiraconfluence.chinaeast2.cloudapp.chinacloudapi.cn:7225/browse/SPM-6253
   *    1.1 获取图片广告位和4合1广告位 插入数据
   *    1.2 emarsys 推荐数据
   *    1.3 获取42号位帖子  替换数据
   * @param {Object} param0
   * @param {*} param0.emarsysRecommendParams
   * @param {*} param0.type
   * @param {string} param0.tabId
   * @param {number[]} param0.postPosList
   * @return {GuessYouLikeDataSourceType[]} descriptio
   */
  static getGuessYoueLikeDatas({ emarsysRecommendParams, tabId, type, postPosList, brand, recommendParam }) {
    return new Promise(resolve => {
      // 1.1 获取图片广告位和4合1广告位
      Utils.getGuessYouLikeAdsData(tabId).then(adsData => {
        // // 1.2 获取 emarsys 推荐数据
        const limit = 60;
        Utils.getDataByEmarsysOrSearchServices({ limit, emarsysRecommendParams, type, brand, recommendParam }).then(
          recomendsProds => {
            const postsProductsId = Array.isArray(recomendsProds) ? recomendsProds.map(item => item.id) : [];

            //   1.3 获取帖子并整合数据  替换数据
            Utils.getPostsDataByProductIds(postsProductsId).then(posts => {
              let postIndex = 0;
              let productIndex = 0;
              const showPosts = {};
              const postsProductIds = Object.values(showPosts).map(item => `${item.productId}`);
              postPosList.forEach((pos, i) => {
                const post = posts[i];
                if (post) {
                  showPosts[pos] = post;
                }
              });

              let newRecomendsExceptPosts = [];
              recomendsProds.forEach(item => {
                if (!postsProductIds.includes(`${item.id}`)) {
                  newRecomendsExceptPosts.push({
                    ...item,
                    __type__: ItemTypeEnums.product,
                  });
                }
              });

              let res = adsData.map((item, i) => {
                if (item) {
                  return item;
                }
                if (postPosList.includes(i)) {
                  const post = posts[postIndex];
                  if (post) {
                    postIndex += 1;
                    return post;
                  }
                }
                const productItem = newRecomendsExceptPosts[productIndex];
                if (productItem) {
                  productIndex += 1;
                  return productItem;
                }
                return item;
              });

              let d = [];
              for (let i = 0; i < res.length; i++) {
                const r = res[i];
                if (r) {
                  d.push(r);
                } else {
                  break;
                }
              }
              resolve(d);
            });
          },
        );
      });
    });
  }
}
