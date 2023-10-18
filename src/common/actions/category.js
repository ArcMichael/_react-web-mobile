import * as constType from "../constants/ActionTypes";
import * as actions from "../lib/BLL";

//category 菜单切换
export const menuChange = (val) => {
  return (dispatch) => {
    dispatch({ type: constType.CATEGORY.CATEGORY_MENU, CATEGORY_MENU_RESULT: val });
  };
};

//category 图片广告位
export const categoryImg = (val, callback) => {
  return (dispatch) => {
    actions.categoryImg(val, (data) => {
      if (callback) {
        callback(data);
      }
      dispatch({ type: constType.CATEGORY.CATEGORY_IMG, CATEGORY_IMG_RESULT: data });
    });
  };
};
