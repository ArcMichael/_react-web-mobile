import { GOOGLE_ANALYTICS } from '../constants/ActionTypes'

const initialState = {
  USER: false,
  PUSHV2:[]
}

export default function(state = initialState, action = {}) {
  const USER = action.USER
  const PUSHV2 = action.PUSHV2
  switch (action.type) {
    case GOOGLE_ANALYTICS.USER:
      return Object.assign({}, state, {
        USER,
      })
    case GOOGLE_ANALYTICS.PUSHV2:
      return Object.assign({}, state, {
        PUSHV2,
      })
    default:
      return state
  }
}