import * as types from '../constants/ActionTypes'

const initialState = {}

const posts = (
    state = {
      isFetching: false,
      results: null,
      errorMessage: '',
      ajaxOptions: {},
      jQueryStatus: {},
    },
    action
) => {
  switch (action.type) {
    case types.FETCH_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.errorMessage,
        results: action.results,
      })
    case types.FETCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case types.FETCH_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        results: action.results,
        errorMessage: action.errorMessage,
        ajaxOptions: action.ajaxOptions,
        jQueryStatus: action.jQueryStatus,
        lastUpdated: action.receivedAt,
      })
    default:
      return state
  }
}


export default function(state = initialState, action = {}) {
  switch (action.type) {
    case types.FETCH_ERROR:
    case types.FETCH_REQUEST:
    case types.FETCH_RECEIVE: {
      return Object.assign({}, state, {
        [action.onlyKey]: posts(state[action.onlyKey], action),
      })
    }

    default:
      return state
  }
}