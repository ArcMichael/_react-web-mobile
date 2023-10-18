import { VIEW } from "../constants/ActionTypes";

export const clientHeight = (clientHeight) => (dispatch) =>
  dispatch({ type: VIEW.CLIENT_HEIGHT, CLIENT_HEIGHT: clientHeight });

export const scrollTop = (scrollTop) => (dispatch) =>
  dispatch({ type: VIEW.SCROLL_TOP, SCROLL_TOP: scrollTop });
