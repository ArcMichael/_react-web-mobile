import { DEVICE } from '../constants/ActionTypes'

const initialState = {
  IS_WEIXIN: false,
}
/*
 * 用于存放系统配置信息
 */
export default function(state = initialState, action = {}) {
  const IS_WEIXIN = action.IS_WEIXIN
  switch (action.type) {
    case DEVICE.IS_WEIXIN:
      return Object.assign({}, state, {
        IS_WEIXIN,
      })
    default:
      return state
  }
}