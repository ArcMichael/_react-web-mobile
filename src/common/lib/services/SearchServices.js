import request from '../request';

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

/**
 * @typedef {{
 * activityLabelImageUrl: null
 * brandCN: string; "迪奥"
 * brandEN: string; "DIOR"
 * hasBrandWeight: string; "0"
 * hasInventory:  number;
 * hasNew:  number;
 * imagePath:string;  "https://sslstage2.sephorastatic.cn/products/2/0/1/8/9/3/1_n_new03504_"
 * maxDiscountPrice: null
 * maxDisplayPrice: null
 * minDiscountPrice:  number;
 * minDisplayPrice: null
 * productCN: string; "丝芙兰Excel商品7"
 * productDetailUrl: string; "http://stage.sephora.cn/product/984003.html"
 * productEN: string; "SEPHORA product7"
 * productId: 984003
 * salesAmount:  number;
 * skuId: string; ""
 * tagsList: any[]
 * weight:  number;
 * weightB:  number;
 * weightBrand: number;
 * }} ExclusiveProductInfo
 */

/**
 * @typedef {CommonResponse & {
 *     results: {
 * attrWords: ""
 * brandStoryUrl: null
 * brandStoryUrlForMobile: null
 * categoryId: null
 * categoryIds: ""
 * categoryTree: null
 * categoryTreeMap: {};
 * content: ExclusiveProductInfo[];
 * currentBrand: null
 * currentPage: 1
 * facetAttrs: any[];
 * facetBrands: any[];
 * facetBrandsWithSorted: any[];
 * facetCategories: []
 * filters: ""
 * funWords: ""
 * hasInventory: "0"
 * hasNext: true
 * hotWords: null
 * keyWords: null
 * notFoundKeyWord: null
 * numberOfContent: 10
 * pageSize: 10
 * productId: null
 * quickFilters: null
 * rootCategoryId: 0
 * rootCategoryName: ""
 * rootNickName: ""
 * searchType: "exclusiveSephora"
 * secondCategoryId: 0
 * secondCategoryName: ""
 * secondNickName: ""
 * sortField: "1"
 * sortMode: "desc"
 * swapWords: null
 * thirdCategoryId: 0
 * thirdCategoryName: ""
 * thirdNickName: ""
 * totalPages: 129
 * totalRecord: 1284
 * }
 * }} getExclusiveProductsResponse
 */

export default class SearchServices {
  static API = `/v1/search-service`;

  /**
   *
   * @param {number} pageNumber
   * @param {number} pageSize
   * @return {Promise<getExclusiveProductsResponse>}
   */
  static getExclusiveProducts = (pageNumber, pageSize) => {
    return request(
      `${SearchServices.API}/product/list/exclusive?filters=&hasInventory=0&pageNum=${pageNumber}&pageSize=${pageSize}&sortField=1&sortMode=desc&&channel=MOBILE`,
    ).then(res => {
      return res.json();
    });
  };
}
