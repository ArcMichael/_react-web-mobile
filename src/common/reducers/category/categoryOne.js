import { CATEGORY } from "../../constants/ActionTypes";

const CategoryState = {
  CATEGORYSEARCH: null,
  CATEGORYCURRENT: null,
  CATEGORYRESULTS: null,
  CATEGORYIMG: null, //图片广告位
  GETHOTSEARCHWORD: null,
};

export default function (state = CategoryState, action = {}) {
  let CATEGORYSEARCHS = action.CATEGORY_SEARCH_RESULT;
  let CATEGORYCURRENTS = action.CATEGORY_MENU_RESULT;
  let CATEGORYRESULTSS = action.CATEGORY_RESULTS_RESULT;
  let CATEGORYIMGS = action.CATEGORY_IMG_RESULT;
  switch (action.type) {
    case CATEGORY.CATEGORY_SEARCH:
      return Object.assign({}, state, {
        CATEGORYSEARCH: CATEGORYSEARCHS,
      });
      break;
    case CATEGORY.CATEGORY_MENU:
      return Object.assign({}, state, {
        CATEGORYCURRENT: CATEGORYCURRENTS,
      });
      break;
    case CATEGORY.CATEGORY_RESULTS:
      return Object.assign({}, state, {
        CATEGORYRESULTS: CATEGORYRESULTSS,
      });
      break;
    case CATEGORY.CATEGORY_IMG:
      return Object.assign({}, state, {
        CATEGORYIMG: CATEGORYIMGS,
      });
      break;
    default:
      return state;
  }
}
