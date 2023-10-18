import { MY_ACCOUNT_COUPON } from '../constants/ActionTypes'

const initialPopupState = [];

export default function(state = initialPopupState, action = {}) {
  switch (action.type) {
    case MY_ACCOUNT_COUPON.MY_ACCOUNT_COUPON:
      return action.data
    default:
      return state
  }
}
