import request from "../request";
// import { getBffTestUrl } from "./utils";

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

/**
 * @typedef {{
 *   scale2:  string;
 *   scale2height:  string;
 *   scale2width:  string;
 *   scale3:  string;
 *   scale3height:  string;
 *   scale3width:  string;
 * }} ImagePathStats
 */

/**
 * @typedef {{
 *    brandNameEN: null
 *    height: number;
 *    imageHref: string;
 *    imagePath: string;
 *    imagePats: {}
 *    lookId: null
 *    name: null
 *    patternIds: null
 *    pornResult: boolean;
 *    previewPath:string;
 *    previewPaths: {}
 *    productId: string;
 *    scale: null
 *    sequence: null
 *    skuDetailList: {
 *      brandNameEN: string;
 *      name: string;
 *      productId: string;
 *      relatedToPdp: boolean;
 *      shareOrder: boolean;
 *      skuId: string;
 *      skuSpec: string;
 *      tagPosition: number;
 *      xposition: null
 *      yposition: null
 *    }[]
 *    skuId:string;
 *    status: boolean;
 *    vaFlag: boolean;
 *    width: number;
 * }} SkuTimelineElementContent;
 *
 * @typedef {{
 *    height: number;
 *    imagePath:  string;
 *    imagePats: ImagePathStats
 *    pornResult: boolean;
 *    previewPath:  string;
 *    previewPaths: ImagePathStats
 *    scale: string;
 *    sequence: null
 *    width: number;
 * }} ImageTimelineElementContent;
 *
 * @typedef {{
 *    activityScale: null
 *    content: SkuTimelineElementContent | ImageTimelineElementContent;
 *    type: 'SKU' | 'IMAGE';
 * }} TimelineElementDtos
 */

/**

 */

/**
 * @typedef {{
 * content: string;
 * elapsedTime: string;
 * postId: string;
 * shareDto: {
 *    activityScale: string;
 *    imageBaseDto: {
 *          imagePath:  string;
 *          imagePats: ImagePathStats;
 *          pornResult: boolean;
 *          previewPath:  string;
 *          previewPaths: ImagePathStats;
 *          scale: null
 *          sequence: null
 *    }
 *    imageUrl: string;
 *    miniProgramPath: null
 *    miniProgramUsername: null
 *    text:  string;
 *    thumbImageUrl:  string;
 *    title: null
 *    url:  string;
 * };
 * tagList:{
 *    content: string;
 *    tagId: number;
 * }[]
 * template:string;
 * timelineAuthorDto: {
 *    avatarUrl:string;
 *    levelUrl: string;
 *    nickname:string;
 *    openId: string;
 *    roleUrl:string;
 * }
 * timelineElementDtos: TimelineElementDtos;
 * }} TimelineProductPostBaseDto
 */

/**
 * @typedef {{
 * collected: boolean;
 * liked: boolean;
 * productId: number;
 * timelineProductPostBaseDto:TimelineProductPostBaseDto;
 * }} PostInfo
 */

export default class Community {
  static API = `/v1/community`;

  static news = {
    /**
     * 根据产品ids获取帖子
     * @param {number[]} productIds
     * @return {Promise<CommonResponse & { results: PostInfo[] }>}
     */
    getPostsByProductIds: productIds => {
      return request(`${Community.API}/new/posts/products?channel=MOBILE`, {
        method: "POST",
        body: JSON.stringify(productIds),
        headers: {
          "Content-Type": "application/json",
        },
        // baseUrl: getBffTestUrl(),
      }).then(res => {
        return res.json();
      });
    },
  };
}
