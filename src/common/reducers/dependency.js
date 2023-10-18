import { DEPENDENCY } from '../constants/ActionTypes'

const initialState = {
  GOOGLE_ANALYTICS: false,
}

export default function(state = initialState, action = {}) {
  const GOOGLE_ANALYTICS = action.GOOGLE_ANALYTICS
  switch (action.type) {
    case DEPENDENCY.GOOGLE_ANALYTICS:
      return Object.assign({}, state, {
        GOOGLE_ANALYTICS,
      })
    default:
      return state
  }
}