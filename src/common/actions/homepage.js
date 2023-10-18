import { HOMEPAGE } from "../constants/ActionTypes";

/**
 * @typedef {import('redux').Dispatch} Dispatch
 */

export default class ActionHomepage {
  /** @type {Dispatch} - description */
  dispatch = null;

  /**
   * @param {Dispatch} dispatch
   */
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  /**
   * @param {object} param0
   * @param {string} param0.tabKey
   * @param {1 | 2} param0.session
   * @param {import('@/reducers/homepage').TabSession1 | import('@/reducers/homepage').TabSession2} param0.data
   */
  updateTabData = ({ tabKey, session, data }) => {
    this.dispatch({
      type: HOMEPAGE.UPDATE_TAB,
      payload: {
        tabKey,
        session,
        data,
      },
    });
  };
  /**
   * @param {import('@/reducers/homepage').HomepageState['session1']} session1
   */
  updateHomeSession1 = session1 => {
    this.dispatch({
      type: HOMEPAGE.UPDATE_HOME_SESSION1,
      payload: session1,
    });
  };
}
