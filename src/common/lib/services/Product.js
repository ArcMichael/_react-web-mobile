import request from "../request";
import { qsStringify } from "./utils";

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

/**
 * @typedef {{
 * brandEN: string;
 * discountDto: {
 *    costPrice:string;
 *    price: string;
 *    skuId: number;
 *    spuId: number;
 * }
 * imagePath: string;
 * maxPrice: number;
 * minPrice: number;
 * productCN:  string;
 * productDetailUrl:  string;
 * productId: number;
 * }} HistoryBrowsingProduct
 */

/**
 *  @typedef {{
 * productId:number;
 * pageNo:number;
 * pageSize:number;
 * }} GetProductCommentListParams
 * */

/**
 * @typedef {{
 *  avatarUrl: string;
 *  content: string;
 *  createTime: string;
 *  nickName: string;
 * }} ReplyDTO
 * */

/**
 *  @typedef {{
 *  cardType: string;
 *  commentImageDtos: []
 *  content: string;
 *  createTime: string;
 *  createTimeStamp: number;
 *  isEssenceComment: number;
 *  kolUserLevel: null
 *  nickName: string;
 *  photo: string;
 *  postId: null
 *  productId: number;
 *  productName: string;
 *  replyDto: ReplyDTO;
 *  score: number;
 *  type: number;
 *  userId: number;
 *  uuid: string;
 * }} CommentDTO
 * */

/**
 *  @typedef {CommonResponse & {
 *  results:{
 *  currentPage: number;
 *  hasNext: boolean
 *  numberOfContent: number;
 *  pageSize: number;
 *  productScore: number;
 *  totalPages: number;
 *  totalRecord: number;
 *  commentDtos: CommentDTO[];
 *  };
 * }} GetProductCommentResp
 * */

export default class Product {
  static API = `/v2/product`;
  static V1API = `/v1/product`;

  static Product = {
    /**
     * @param {string[]} products
     * @return {Promise<CommonResponse & { results: HistoryBrowsingProduct[] }>}
     */
    getHistoryBrowsingProducts: products => {
      return request(`${Product.API}/product/history-browsing/products?channel=MOBILE`, {
        method: "POST",
        body: JSON.stringify({
          queryBody: products,
        }),
      }).then(res => {
        return res.json();
      });
    },
    /**
     *
     * @param {GetProductCommentListParams} params
     * @returns {Promise<GetProductCommentResp>}
     */
    getProductCommentList: params => {
      return request(`${Product.V1API}/comment/commentList?${qsStringify(params)}`, {
        method: "GET",
      }).then(res => {
        return res.json();
      });
    },
  };
}
