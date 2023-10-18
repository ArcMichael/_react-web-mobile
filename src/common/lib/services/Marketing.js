import request from '../request';

/**
 * @typedef {import('../request').CommonResponse} CommonResponse
 */

export default class Marketing {
  static API = `/v1/marketing`;

  static MktSimpleGroupController = {
    /**
     * 用户会员卡信息
     * @return {Promise<CommonResponse & {
     *  results: any[];
     * }>} - description
     */
    simpleTextGroup(body) {
      return request(`${Marketing.API}/MktSimpleGroupController/simpleTextGroup`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        return res.json();
      });
    },
    // Sprint 6 通用广告位 for c 获取广告位配置
    commonBanner(code){
      return request(`/v1/mpcms/common/banner/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        return res.json();
      });
    }
  };
}
