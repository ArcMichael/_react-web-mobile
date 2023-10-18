import { MY_ONLINERETURN } from '../constants/ActionTypes'
const initialGAState = {
  status: '',
  recoreReason: null,
  applyData: '',
  returnListTap: '',
  returnListData: '',
  returnListStatus: '',
  returnDetailsData: '',
  returnDetailsLogistics: '',
  refundDetails: '',
  applyNoScroll: false
}
export default function (state = initialGAState, action = {}) {
  switch (action.type) {
    case MY_ONLINERETURN.STATUS:
      return Object.assign({}, state, {
        status: action.data,
      })
    case MY_ONLINERETURN.RECORD_REASON:
      return Object.assign({}, state, {
        recoreReason: action.data,
      })
    case MY_ONLINERETURN.SAVE_APPLY_DATA:
      return Object.assign({}, state, {
        applyData: action.data,
      })
    case MY_ONLINERETURN.RETURN_LIST_TAP:
      return Object.assign({}, state, {
        returnListTap: action.data,
      })
    case MY_ONLINERETURN.RETURN_LIST_DATA:
      return Object.assign({}, state, {
        returnListData: action.data,
      })
    case MY_ONLINERETURN.RETURN_LIST_STATUS:
      return Object.assign({}, state, {
        returnListStatus: action.data,
      })
    case MY_ONLINERETURN.RETURN_DETAILS_DATA:
      return Object.assign({}, state, {
        returnDetailsData: action.data,
      })
    case MY_ONLINERETURN.RETURN_DETAILS_LOGISTICS:
      return Object.assign({}, state, {
        returnDetailsLogistics: action.data,
      })
    case MY_ONLINERETURN.REFUND_DETAILS:
      return Object.assign({}, state, {
        refundDetails: action.data,
      })
    case MY_ONLINERETURN.APPLY_NOSCROLL:
      return Object.assign({}, state, {
        applyNoScroll: action.data,
      })
    default:
      return state
  }
}


