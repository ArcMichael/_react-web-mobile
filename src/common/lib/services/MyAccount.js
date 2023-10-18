import request from '../request';

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

/**
 * @typedef {{
 *  availablePoint: number
 *  birthday: string | null
 *  buyTimes: number
 *  cardNo: string
 *  cardPoints: string
 *  cardType: string
 *  cardTypeDisplay: string
 *  couponQuantity: number;
 *  firePoints: string;
 *  lessPoints: string;
 *  nextStageCardType: string;
 *  nextStagePoints: string;
 *  nickName: string;
 *  payPoints: number;
 *  photo: string;
 * }} UserCardDTO
 */

/**
 * @typedef {{
 *  address: string;
 *  area: string;
 *  birthdayVaild: number;
 *  cardEmail: null;
 *  cardMobile: null;
 *  cardNum: null;
 *  city: string;
 *  completed: null;
 *  dateofbirth: string;
 *  email: null;
 *  gender: string;
 *  id: number;
 *  loginId: string;
 *  mobile: string;
 *  mobileValidTimes: number;
 *  name: string;
 *  nickName: string;
 *  photo: string;
 *  province: string;
 *  socialBindRelationship:string;
 *  telephoneValid: number;
 * }} UserInfoDTO
 */

/**
 * @typedef {CommonResponse & {
 *  results:UserCardDTO;
 * }} UserCardInfoResponse
 */

/**
 * @typedef {CommonResponse & {
 * results:UserInfoDTO;
 * }} UserInfoResponse
 */

export default class MyAccount {
  static API = `/v1/myaccount`;

  static user = {
    /**
     * 用户会员卡信息
     * @return {Promise<UserCardInfoResponse>} - description
     */
    userCardInfo() {
      return request(`${MyAccount.API}/user/userCardInfo`).then(res => {
        return res.json();
      });
    },
    /**
     * 获取用户信息
     * @return {Promise<UserInfoResponse>} - description
     */
    getUserInfo() {
      return request(`${MyAccount.API}/user/userProfile`).then(res => {
        return res.json();
      });
    },
  };
}
