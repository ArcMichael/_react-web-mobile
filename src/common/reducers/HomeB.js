import { HOMEB } from '../constants/HomeB';

const initialGAState = {
  HOMEB_SEARCH_TEXT: '',
  HOMEB_COMMUNITY: '',
};

export default function(state = initialGAState, action = {}) {
  switch (action.type) {
    case HOMEB.HOMEB_SEARCH_TEXT:
      return Object.assign({}, state, {
        HOMEB_SEARCH_TEXT: action.data,
      });
    case HOMEB.HOMEB_COMMUNITY:
      return Object.assign({}, state, {
        HOMEB_COMMUNITY: action.data,
      });
    default:
      return state;
  }
}
