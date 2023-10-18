import { REGISTER } from '../constants/ActionTypes'

const initialGAState = {
  pageStatus: 'registerEnter',
  card_list: '',
  registerInfo: ''
}

export default function (state = initialGAState, action = {}) {
  switch (action.type) {
    case REGISTER.PAGE_STATUS:
      return Object.assign({}, state, {
        pageStatus: action.data,
      })
    case REGISTER.CARD_LIST:
      return Object.assign({}, state, {
        card_list: action.data,
      })
    case REGISTER.USER_INFO:
      return Object.assign({}, state, {
        registerInfo: action.data,
      })
    default:
      return state
  }
}

