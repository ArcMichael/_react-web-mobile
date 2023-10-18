import request from '../request';

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

/**
 * @typedef {{
 *  brandId:number;
 *  brandNameCN:string;
 *  brandNameEN:string;
 *  imagePath:string;
 *  brandNickNames:string[];
 * }} BrandDTO
 */

/**
 * @typedef {Omit<BrandDTO,'brandNickNames'>} TopBrandDTO
 */

/**
 * @typedef {CommonResponse & {
 *     results: TopBrandDTO[]
 * }} GetTopBrandResponse
 */

/**
 * @typedef {{
 *  brandList:BrandDTO[];
 *  brandTitle:string;
 * }} AllBrandItem
 */

/**
 * @typedef {CommonResponse & {
 *     results: AllBrandItem[]
 * }} GetAllResposne
 */

export default class EsBrandWall {
  static API = `/v1/es/brandWall`;

  /**
   * 品牌墙左侧8个
   * @return {Promise<GetTopBrandResponse>} - description
   */
  static getTopBrand = () => {
    return request(`${EsBrandWall.API}/getTopBrand`).then(res => {
      return res.json();
    });
  };

  /**
   * 全部品牌
   * @return {Promise<GetAllResposne>} - description
   */
  static getAll = () => {
    return request(`${EsBrandWall.API}/queryAllBrands`, {
      method: 'POST',
    }).then(res => {
      return res.json();
    });
  };
}
