import { NICHEFRAGRANCE } from '../constants/ActionTypes'


const initialPopupState = {
  INDEX: 0,
  STATE: false,
  PRELOADIMG: [],
}


export default function(state = initialPopupState, action = {}) {

  const INDEX = action.index
  const STATE = action.state
  switch (action.type) {
    case NICHEFRAGRANCE.INDEX:
      return Object.assign({}, state, {
        INDEX,
      })
    case NICHEFRAGRANCE.STATE:
      return Object.assign({}, state, {
        STATE,
      })
    case NICHEFRAGRANCE.PRELOADIMG:
      return Object.assign({}, state, {
        PRELOADIMG: action.data,
      })
    default:
      return state
  }
}
