import * as constType from "../constants/ActionTypes";

export const popupComponent = (
  state,
  module,
  parameters,
  callbackKey,
  callbackValue
) => {
  return (dispatch) => {
    dispatch({
      type: constType.POPUP_COMPONENT.POPUP_NORMAL,
      POPUP_STATE: state,
      POPUP_MODULE: module,
      POPUP_PARAMETERS: parameters,
      POPUP_CALLBACK_KEY: callbackKey,
      POPUP_CALLBACK_VALUE: callbackValue,
    });
  };
};

export const popupAlert = (
  state,
  module,
  parameters,
  callbackKey,
  callbackValue
) => {
  return (dispatch) => {
    dispatch({
      type: constType.POPUP_COMPONENT.POPUP_ALERT,
      POPUP_ALERT_STATE: state,
      POPUP_ALERT_MODULE: module,
      POPUP_ALERT_PARAMETERS: parameters,
      POPUP_ALERT_CALLBACK_KEY: callbackKey,
      POPUP_ALERT_CALLBACK_VALUE: callbackValue,
    });
  };
};
