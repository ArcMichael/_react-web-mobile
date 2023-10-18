import { FORGOTTENPASSWORD, LOGIN } from '../constants/ActionTypes'
const initialState = {
  secondshow: null,
  loginId: null,
  pageStatus: 'loginEnter',
  LOGIN_SHOW_GRAPHIC: '',
  STORE_MEMBER_DATA: '',
  STORE_PINK_CARD: false,
  STORE_LOGIN_ID: '',
  STORE_CARD_NUM: '',
  STORE_TIP: '',
  NO_TITLE: false,
  PERSONAL_INFO: '',
  forgetRtoken:''
}
export default function (state = initialState, action = {}) {
  switch (action.type) {
    case FORGOTTENPASSWORD.SECONDSHOW:
      return Object.assign({}, state, {
        secondshow: action.SECONDSHOW,
        loginId: action.loginId,
      })
    case LOGIN.PAGE_STATUS:
      return Object.assign({}, state, {
        pageStatus: action.data,
      })
    case LOGIN.LOGIN_SHOW_GRAPHIC:
      return Object.assign({}, state, {
        LOGIN_SHOW_GRAPHIC: action.data
      })
    case LOGIN.STORE_MEMBER_DATA:
      return Object.assign({}, state, {
        STORE_MEMBER_DATA: action.data
      })
    case LOGIN.STORE_PINK_CARD:
      return Object.assign({}, state, {
        STORE_PINK_CARD: action.data
      })
    case LOGIN.STORE_LOGIN_ID:
      return Object.assign({}, state, {
        STORE_LOGIN_ID: action.data
      })
    case LOGIN.STORE_CARD_NUM:
      return Object.assign({}, state, {
        STORE_CARD_NUM: action.data
      })
    case LOGIN.STORE_TIP:
      return Object.assign({}, state, {
        STORE_TIP: action.data
      })
    case LOGIN.NO_TITLE:
      return Object.assign({}, state, {
        NO_TITLE: action.data
      })
    case LOGIN.PERSONAL_INFO:
      return Object.assign({}, state, {
        PERSONAL_INFO: action.data
      })
    case FORGOTTENPASSWORD.RTOKEN:
      return Object.assign({}, state, {
        forgetRtoken: action.data
      })
    default:
      return state
  }
}
