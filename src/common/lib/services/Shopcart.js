import request from '../request';

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

export default class Shopcart {
  static API = `/v1/shopcart`;

  /**
   *
   * @param {number} pageNumber
   * @param {number} pageSize
   * @return {Promise<CommonResponse & { results:number; }>}
   */
  static getShopcartProdTotal = () => {
    return request(`${Shopcart.API}/queryCartProdTotalQuantity`).then(res => {
      return res.json();
    });
  };
}
