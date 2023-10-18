'use strict';

import { SEARCH } from '../constants/ActionTypes';

/**
 * @typedef {{
 * GETHOTSEARCHWORD: import('@/actions/search').SimpleTextGroupRes | null,
 * EXPAND_ISTRUE: boolean,
 * HISTORY_BROWSING: string,
 * HISTORY_ARR: string,
 * IFINPUTTRUE: boolean,
 * }} SearchState
 */

const initialGlobalState = {
  GETHOTSEARCHWORD: null,
  EXPAND_ISTRUE: false,
  HISTORY_BROWSING: '',
  HISTORY_ARR: '',
  IFINPUTTRUE: true,
};

export default function(state = initialGlobalState, action = {}) {
  switch (action.type) {
    case SEARCH.GETHOTSEARCHWORD:
      return Object.assign({}, state, {
        GETHOTSEARCHWORD: action.GETHOTSEARCHWORD,
      });
    case SEARCH.EXPAND_ISTRUE:
      return Object.assign({}, state, {
        EXPAND_ISTRUE: action.EXPAND_ISTRUE,
      });
    case SEARCH.HISTORY_BROWSING:
      return Object.assign({}, state, {
        HISTORY_BROWSING: action.data,
      });
    case SEARCH.HISTORY_ARR:
      return Object.assign({}, state, {
        HISTORY_ARR: action.data,
      });
    case SEARCH.IFINPUTTRUE:
      return Object.assign({}, state, {
        IFINPUTTRUE: action.data,
      });
    default:
      return state;
  }
}
