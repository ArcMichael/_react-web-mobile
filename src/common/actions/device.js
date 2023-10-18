import { DEVICE } from '../constants/ActionTypes'
import * as device from '../lib/device'

// 第二步地址相关
export const isWeChat = () => (dispatch, ) => {
  const _isWeChat = device.isWeChat()
  dispatch({ type: DEVICE.IS_WEIXIN, IS_WEIXIN: _isWeChat })
}