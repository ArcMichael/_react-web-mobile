import * as action from "../lib/BLL";
import { popupAlert } from "./popup";

export const getRankingList = (rankingId, page, callback) => (dispatch) => {
  dispatch(
    action.getRankingList({
      onlyKey: "getRankingList",
      url: `/v1/product-extend/ranking/${rankingId}/MOBILE/${page}`,
      type: "GET",
    }),
  ).then((json) => {
    if (json) {
      if (json.errorMessage && !json.results) {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.errorMessage,
            _autoClose: true,
            _totalCount: 3000,
            _closeCallback: () => {},
          }),
        );
      }

      callback && callback(json.results);
    }
  });
};
