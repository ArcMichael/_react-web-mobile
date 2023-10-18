import { VIEW } from "../constants/ActionTypes";

const initialState = {
  CLIENT_HEIGHT: false,
  SCROLL_TOP: false,
};
/*
 * 用于存放设备尺寸信息
 */
export default function(state = initialState, action = {}) {
  switch (action.type) {
    case VIEW.CLIENT_HEIGHT:
      return Object.assign({}, state, { CLIENT_HEIGHT: action.CLIENT_HEIGHT });
    case VIEW.SCROLL_TOP:
      return Object.assign({}, state, { SCROLL_TOP: action.SCROLL_TOP });
    default:
      return state;
  }
}
