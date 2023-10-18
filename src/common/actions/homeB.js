import * as homeB from "../constants/HomeB";
import { textAdvertiseAjax } from "../lib/BLL";

export const getInitialHomeB = () => (dispatch, getState) => {
  getSearchBoxText && getSearchBoxText()(dispatch, getState);
};
// 获取首页热搜的关键词
export const getSearchBoxText = () => (dispatch) => {
  dispatch(
    textAdvertiseAjax({
      onlyKey: "homeSearchText",
      url: "/v1/marketing/MktSimpleGroupController/simpleTextGroup",
      type: "POST",
      data: {
        queryBody: {
          locationLabel: "MOBILE:HOMEPAGE:SEARCHBOX_TEXT_B",
          memberGroupId: 0,
        },
      },
    })
  ).then((json) => {
    if (
      json &&
      json.results &&
      json.results.resourceList &&
      json.results.resourceList.length > 0
    ) {
      dispatch({
        type: homeB.HOMEB.HOMEB_SEARCH_TEXT,
        data: json.results.resourceList,
      });
    }
  });
};

// 获取是否显示进入美In社区广告位
export const getCommunity = () => (dispatch) => {
  dispatch(
    textAdvertiseAjax({
      onlyKey: "getCommunity",
      url: "/v1/marketing/MktSimpleGroupController/simpleImageGroup",
      type: "POST",
      data: {
        queryBody: { locationLabel: "MOBILE:HOMEPAGE:BEAUTY:COMMUNITY_B" },
      },
    })
  ).then((json) => {
    if (
      json &&
      json.results &&
      json.results.resourceList &&
      json.results.resourceList.length > 0
    ) {
      dispatch({
        type: homeB.HOMEB.HOMEB_COMMUNITY,
        data: json,
      });
    }
  });
};
