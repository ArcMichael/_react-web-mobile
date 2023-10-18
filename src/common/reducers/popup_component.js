import { POPUP_COMPONENT } from '../constants/ActionTypes'

/**
 *
 * @POPUP_STATE: 0:off 1: on
 * @POPUP_MODULE: module_name
 * @POPUP_PARAMETERS: parameters
 * @POPUP_CALLBACK_KEY: callback(key)
 * @POPUP_CALLBACK_VALUE: callback(value)
 */
const initialPopupState = {
  POPUP_STATE: 0,
  POPUP_MODULE: null,
  POPUP_PARAMETERS: null,
  POPUP_CALLBACK_KEY: null,
  POPUP_CALLBACK_VALUE: null,
  POPUP_ALERT_STATE: 0,
  POPUP_ALERT_MODULE: null,
  POPUP_ALERT_PARAMETERS: null,
  POPUP_ALERT_CALLBACK_KEY: null,
  POPUP_ALERT_CALLBACK_VALUE: null,
}

export default function(state = initialPopupState, action = {}) {
  const POPUP_STATE = action.POPUP_STATE


  const POPUP_MODULE = action.POPUP_MODULE


  const POPUP_PARAMETERS = action.POPUP_PARAMETERS


  const POPUP_CALLBACK_KEY = action.POPUP_CALLBACK_KEY


  const POPUP_CALLBACK_VALUE = action.POPUP_CALLBACK_VALUE

  const POPUP_ALERT_STATE = action.POPUP_ALERT_STATE


  const POPUP_ALERT_MODULE = action.POPUP_ALERT_MODULE


  const POPUP_ALERT_PARAMETERS = action.POPUP_ALERT_PARAMETERS


  const POPUP_ALERT_CALLBACK_KEY = action.POPUP_ALERT_CALLBACK_KEY


  const POPUP_ALERT_CALLBACK_VALUE = action.POPUP_ALERT_CALLBACK_VALUE
  switch (action.type) {
    case POPUP_COMPONENT.POPUP_NORMAL:
      return Object.assign({}, state, {
        POPUP_STATE,
        POPUP_MODULE,
        POPUP_PARAMETERS,
        POPUP_CALLBACK_KEY,
        POPUP_CALLBACK_VALUE,
      })
    case POPUP_COMPONENT.POPUP_ALERT:
      return Object.assign({}, state, {
        POPUP_ALERT_STATE,
        POPUP_ALERT_MODULE,
        POPUP_ALERT_PARAMETERS,
        POPUP_ALERT_CALLBACK_KEY,
        POPUP_ALERT_CALLBACK_VALUE,
      })
    default:
      return state
  }
}