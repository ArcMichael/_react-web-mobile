'use strict'

import { COMMONVENDERS } from '../constants/ActionTypes'

const initialGAState = {
  emarsysParamsQueue: [],
}

export default function (state = initialGAState, action = {}) {
  switch (action.type) {
    case COMMONVENDERS.EMARSYS_QUEUE:
      return Object.assign({}, state, {
        emarsysParamsQueue: [...state.emarsysParamsQueue, action.emarsysParam],
      })
    default:
      return state
  }
}