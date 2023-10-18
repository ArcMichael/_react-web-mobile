import { CART } from '../constants/ActionTypes';

/**
 * @typedef {{
 * QCPTQ:false | number;
 * }} CartState
 */

/**
 * 购物车信息 - 对接接口
 */
const initialState = {
  QCPTQ: false,
};
/*
 * 用于存放seo无action操作影响state的result data
 */
export default function(state = initialState, action = {}) {
  const QCPTQ = action.QCPTQ;

  switch (action.type) {
    case CART.QCPTQ:
      return Object.assign({}, state, {
        QCPTQ,
      });
    default:
      return state;
  }
}
