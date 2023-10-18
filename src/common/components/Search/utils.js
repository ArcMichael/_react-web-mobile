import Sensor from '@/Utils/sensor';
import { CheckCampaignCode, SetSingleCookie2V2, GetSingleCookie2V2 } from '@/lib/Tools';

class SearchUtil {
  /**
   * search搜索跳转逻辑梳理
   *
   * 1. 输入框有值
   *    1.1. 输入框全是空格，则清空输入框，让用户重新输入
   *    1.2. 普通跳转到 /search/?k=页
   *    1.3. 是品牌则跳转到品牌页
   * 2. 输入框无值
   *    2.1  跳转到热词页 /hot/?k=
   */
  static validtors = () => {};

  /**
   * @param {string} val
   */
  static setSearchHistory(val) {
    if (typeof val === 'string' && val) {
      let oldcookie = GetSingleCookie2V2({ key: 'n_history' });
      let newcookie = [];
      if (oldcookie && oldcookie !== 'false') {
        newcookie = oldcookie.split('=%');
        newcookie.map((data, index) => {
          data === val && newcookie.splice(index, 1);
        });
        // newcookie.length > 10 && newcookie.pop();
        newcookie.unshift(val);
        const newcookies = newcookie.join('=%');
        SetSingleCookie2V2({ key: 'n_history', value: newcookies, domain: '.sephora.cn' });
      } else {
        newcookie.unshift(val);
        SetSingleCookie2V2({ key: 'n_history', value: val, domain: '.sephora.cn' });
      }
    }
  }

  /**
   *
   * @param {string} val
   * @param {import('@/lib/services/EsBrandWall').AllBrandItem[]} brands
   */
  static getBrandUrl(val, brands) {
    let url = '';
    if (val && typeof val === 'string' && Array.isArray(brands)) {
      let trimVal = val.trim().toLowerCase();
      brands.forEach(brand => {
        if (Array.isArray(brand.brandList)) {
          brand.brandList.forEach(brandItem => {
            if (
              (brandItem.brandNameCN && brandItem.brandNameCN.toLowerCase() === trimVal) ||
              (brandItem.brandNameEN && brandItem.brandNameEN.toLowerCase() === trimVal) ||
              (Array.isArray(brandItem.brandNickNames) &&
                brandItem.brandNickNames.some(item => item.toLowerCase() === trimVal))
            ) {
              url = `/brand/${brandItem.brandNameEN}-${brandItem.brandId}/`;
            }
          });
        }
      });
    }
    return url;
  }

  /**
   * 热词跳转
   * @param {import('@/actions/search').ResourceItem} keyword
   */
  static searchHotKeyword = (keyword,path) => {
    path=path.replace("=","~")
    if (keyword && keyword.content) {
      if (keyword.link) {
        const href = CheckCampaignCode(keyword.link, keyword.omniture);
        SearchUtil.trackingCode(keyword.content, href, 'ClickTerm', 'Default');
        window.location.href = href+"&searchF="+path;
      } else {
        SearchUtil.trackingCode(keyword.content, `/hot/?k=${keyword.content}`, 'ClickTerm', 'Default');
        window.location.href = `/hot/?k=${keyword.content}`+"&searchF="+path;
      }
    }
  };

  /**
   * 神策数据整理
   * @param {string} search_content
   * @param {string} search_link
   * @param {string} keyWordTpye
   * @param {string} valType
   */
  static trackingCode = (search_content, search_link, keyWordTpye, valType) => {
    Sensor.go('clickBanner_App_Mob', {
      $lib_detail: 'M_Search##getSensorData##SearchTop.js##370',
      banner_type: 'search',
      banner_content: search_content,
      banner_belong_area: 'searchview',
      banner_to_url: search_link,
      banner_to_page_type: search_link,
      banner_ranking: '',
      belong_team: 'Search',
      campaign_code: search_link || '',
      key_word_tpye: keyWordTpye,
      key_word_tpye_details: valType || 'Organic',
    });
  };
}

export default SearchUtil;
