import request from "../request";
// import { getBffTestUrl } from "./utils";

const BannerEnums = {
  hometab: {
    /**
     * 首页轮播图
     */
    hero: "mobile:home:select_hero",
    /**
     * 首页轮播图下方的5个icon
     */
    selectIcons: "mobile:home:select_icon",
    /**
     * 首页公告
     */
    announcement: "mobile:home:annoucement",
    /**
     * 首页品牌墙，右侧8个
     */
    brandwall: "mobile:home:select_brandwall",
    /**
     * 首页picks
     */
    picks: "mobile:home:select_picks",
    /**
     * 首页CRM广告位
     */
    beautyChanelCrm: "mobile:home:select_beauty_channel_crm",
    /**
     * 首页美力广场part1   美力先锋站
     */
    beautyChanel1: "mobile:home:select_beauty_channel_1",
    /**
     * 首页美力广场part2   预约中心 申领中心 美妆视频
     */
    beautyChanel2: "mobile:home:select_beauty_channel_2",
    /**
     * 首页美力广场part3   其他栏目
     */
    beautyChanel3: "mobile:home:select_beauty_channel_3",
  },
  tab: {
    hero: "hero",
    icon: "icon",
    brandwall: "brandwall",
    textUnderBrandwall: "text_under_brandwall",
    adBanner1: "ad_banner1",
    product1: "product_1",
  },
};

/**
 * @typedef {import('@/containers/HomeB/TabCommonContent').TabKeyType} TabKeyType
 */

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

/**
 * @typedef {{
 *  link:string;
 *  trackingCode:string;
 *  text:string;
 *  subtitle:string;
 *  type:'text';
 * }} TextCommonDetail
 */

/**
 * @typedef {{
 *  link:string;
 *  trackingCode:string;
 *  image:string;
 *  baseImage:string;
 *  text:string;
 *  subtitle?:string;
 *  type:'image';
 * }} ImageCommonDetail
 */

/**
 * @typedef {{
 *  link:string;
 *  trackingCode:string;
 *  spuId:number;
 *  skuId:number;
 *  name:string;
 *  minPrice:string;
 *  maxPrice:string;
 *  imagePath:string;
 *  brandNameEN:string;
 *  priceTxt:string;
 *  type:'product';
 * }} ProductCommonDetail
 */

/**
 * @typedef {TextCommonDetail | ImageCommonDetail | ProductCommonDetail} ContentCommonDetail
 */

/**
 * @typedef {{
 * sequence:number;
 * name:string;
 * contentDetails:ContentCommonDetail[]
 * }} CommonBannerDTO
 */

/**
 * @typedef {CommonResponse & {
 *     results: CommonBannerDTO[]
 * }} CommonBannerResponse
 */

/**
 * @typedef {{
 *     board:TextCommonDetail[],
 *     brand:{
 *      allBrand: null;
 *      brandWall:ImageCommonDetail[],
 *     },
 *     hero:ImageCommonDetail[],
 *     icon:ImageCommonDetail[],
 *     memberInformation:TextCommonDetail,
 * }} SessionFirst
 */

/**
 * @typedef {{
 *    banner:ImageCommonDetail;
 *    title:TextCommonDetail;
 *    products:ProductCommonDetail[];
 * }} SephoraPickItem
 */

/**
 * @typedef {{
 *    sephoraPicks:SephoraPickItem[];
 * }} SessionSecond
 */

/**
 * @typedef {{
 *    beautyChannel:{
 *      large:ImageCommonDetail;
 *      small:ImageCommonDetail[];
 *      medium:ImageCommonDetail[];
 *    };
 * }} SessionThird
 */

/**
 * @typedef {CommonResponse & {
 *   results: SessionFirst;
 * }} SessionFirstResponse
 */
/**
 * @typedef {CommonResponse & {
 *   results: SessionSecond;
 * }} SessionSecondResponse
 */

/**
 * @typedef {CommonResponse & {
 *   results: SessionThird;
 * }} SessionThirdResponse
 */

/**
 * @typedef {{
 *  id:string;
 *  name:string;
 *  template:string;
 * }} TabInfo
 */

/**
 * @typedef {CommonResponse & {
 *  results : TabInfo[];
 * }} GetTabResponse
 */

/**
 * @typedef {CommonResponse & {
 *  results: {
 *      brand:{
 *        allBrand: TextCommonDetail;
 *        brandWall:ImageCommonDetail[];
 *      };
 *      hero:ImageCommonDetail[];
 *      icon:ImageCommonDetail[];
 *  };
 * }} TabSessionFirstResponse
 */
/**
 * @typedef {CommonResponse & {
 *  results: {
 *      banner1: ImageCommonDetail[];
 *      ranking: {
 *        title:TextCommonDetail;
 *        products: ProductCommonDetail[];
 *      };
 *  };
 * }} TabSessionSecondResponse
 */

/**
 * @typedef {CommonResponse & {
 *  results:{
 *     activity2:ImageCommonDetail;
 *     activity2Button:TextCommonDetail | null;
 *     activity10:ImageCommonDetail;
 *     activity10Button:TextCommonDetail | null;
 *     activity26:ImageCommonDetail;
 *     activity26Button:TextCommonDetail | null;
 *     activity33:ImageCommonDetail;
 *     activity33Button:TextCommonDetail | null;
 *     activity60:ImageCommonDetail;
 *     activity60Button:TextCommonDetail | null;
 *     aggr:{
 *        ads:(ProductCommonDetail | ImageCommonDetail)[];
 *        text:string;
 *        type:'4In1'
 *     };
 *    aggrButton:TextCommonDetail | null;
 *  };
 * }} getHomeGuessYouLikeResponse
 */

export default class Mpcms {
  static BannerEnums = BannerEnums;

  static API = `/v1/mpcms`;

  /**
   *
   * @param {TabKeyType} tabKey
   * @param {string} part
   */
  static getTabBannerKey = (tabKey, part) => {
    return `mobile:tab:${tabKey.toLocaleLowerCase()}:${part}`;
  };

  /**
   * 通用广告位接口
   * @param {string} key - description.
   * @return {Promise<CommonBannerResponse>} - description
   */
  static getCommonBannerByKey = key => {
    return request(`${Mpcms.API}/common/banner/${key}`).then(res => {
      return res.json();
    });
  };

  /**
   * 首页Session1 接口
   * @return {Promise<SessionFirstResponse>} - description
   */
  static getSessionFirst = () => {
    return request(`${Mpcms.API}/tabs/select/sections/first?channel=MOBILE`).then(res => {
      return res.json();
    });
  };
  /**
   * 首页Sephora Picks 接口
   * @return {Promise<SessionSecondResponse>} - description
   */
  static getSessionSecond = () => {
    return request(`${Mpcms.API}/tabs/select/sections/second?channel=MOBILE`).then(res => {
      return res.json();
    });
  };

  /**
   * 首页Sephora Picks 接口
   * @return {Promise<SessionThirdResponse>} - description
   */
  static getSessionThird = () => {
    return request(`${Mpcms.API}/tabs/select/sections/third?channel=MOBILE`).then(res => {
      return res.json();
    });
  };

  /**
   * 首页Sephora Picks 接口
   * @return {Promise<TabSessionFirstResponse>} - description
   */
  static getTabSessionFirst = tabKey => {
    return request(`${Mpcms.API}/tabs/${tabKey}/sections/first?channel=MOBILE`).then(res => {
      return res.json();
    });
  };
  /**
   * 首页Sephora Picks 接口
   * @return {Promise<TabSessionSecondResponse>} - description
   */
  static getTabSessionSecond = tabKey => {
    return request(`${Mpcms.API}/tabs/${tabKey}/sections/second?channel=MOBILE`).then(res => {
      return res.json();
    });
  };

  /**
   * 获取tab
   * @return {Promise<GetTabResponse>} - description
   */
  static getTabCat = () => {
    return request(`${Mpcms.API}/common/mobile/top/tabcatalog?channel=MOBILE`).then(res => {
      return res.json();
    });
  };

  /**
   * 精选tab下的猜你喜欢
   * @param {string} tabId
   * @return {Promise<getHomeGuessYouLikeResponse>} - description
   */
  static getHomeGuessYouLike = tabId => {
    return request(`${Mpcms.API}/tabs/sections/guessulike?channel=MOBILE&tab=${tabId}`, {}).then(res => {
      return res.json();
    });
  };
}
