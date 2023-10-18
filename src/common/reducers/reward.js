import { REWARD } from '../constants/ActionTypes'

/**
 * @typedef {{
    * ruleShow: boolean,
    * }} RewardState
    */
const initialState = {
    ruleShow: false
}
/*
 * 用于存放设备尺寸信息
 */
export default function (state = initialState, action = {}) {
    switch (action.type) {
        case REWARD.RULESHOW:
            return Object.assign({}, state, { ruleShow: action.data })
        default:
            return state
    }
}