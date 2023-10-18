"use strict";

import { GLOBALREFERENCE } from "../constants/ActionTypes";

const initialGAState = {
  USER_SOCIALLOGIN: "",
  USER_USERCARDINFO: "",
  PAGE_LOAD_FINISH: "loading",
};

export default function (state = initialGAState, action = {}) {
  switch (action.type) {
    case GLOBALREFERENCE.USER_SOCIALLOGIN:
      return Object.assign({}, state, {
        HOMEB_SEARCH_TEXT: action.data,
      });
    case GLOBALREFERENCE.USER_USERCARDINFO:
      return Object.assign({}, state, {
        USER_USERCARDINFO: action.data,
      });
    case GLOBALREFERENCE.FINISH_PAGE_LOAD:
      return Object.assign({}, state, {
        PAGE_LOAD_FINISH: action.data,
      });
    default:
      return state;
  }
}
