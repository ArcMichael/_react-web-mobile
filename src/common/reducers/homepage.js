import * as ActionTypes from "../constants/ActionTypes";

/**
 * @typedef {import('@/lib/services/Mpcms').CommonBannerDTO} CommonBannerDTO
 */

/**
 * @typedef {import('@/containers/HomeB/TabCommonContent/index').TabKeyType} TabKeyType
 */

/**
 * @typedef {import('@/lib/services/EsBrandWall').TopBrandDTO} TopBrandDTO
 */

/**
 * @typedef {import('@/lib/services/Mpcms').TabSessionFirstResponse['results']} TabSession1
 * @typedef {import('@/lib/services/Mpcms').TabSessionSecondResponse['results']} TabSession2
 */

/**
 * @typedef {{
 *  session1: TabSession1
 *  session2: TabSession2
 * }} TabDataItem
 */

/**
 * @typedef {{
 *   [K in TabKeyType]:TabDataItem;
 * }} TabDatas
 */

/**
 * @typedef {{
 *  topBrand: TopBrandDTO[],
 *  session1?: import('@/lib/services/Mpcms').SessionFirst;
 *  TabList: import('@/lib/services/Mpcms').TabInfo[];
 *  "tabDatas.SK.session1"?: TabSession1;
 *  "tabDatas.SK.session2"?: TabSession2;
 *  "tabDatas.MU.session1"?: TabSession1;
 *  "tabDatas.MU.session2"?: TabSession2;
 *  "tabDatas.FR.session1"?: TabSession1;
 *  "tabDatas.FR.session2"?: TabSession2;
 *  "tabDatas.EX.session1"?: TabSession1;
 *  "tabDatas.EX.session2"?: TabSession2;
 * }} HomepageState
 */

/** @type {HomepageState} - description */
const initState = {
  // "tabDatas.SK.session1":
  TabList: [],
  topBrand: [],
};

/**
 * @typedef {{
 *  type:typeof ActionTypes.HOMEPAGE,
 *  payload:any;
 * }} HomepageAction
 */

export default (
  state = initState,
  /** @type {HomepageAction} - description */
  action = {},
) => {
  switch (action.type) {
    case ActionTypes.HOMEPAGE.UPDATE_TAB:
      const { tabKey, session, data } = action.payload;
      let newState = { ...state };
      newState[`tabDatas.${tabKey}.session${session}`] = data;
      return newState;
    case ActionTypes.HOMEPAGE.UPDATE_HOME_SESSION1:
      return { ...state, session1: action.payload };
    default:
      return state;
  }
};
