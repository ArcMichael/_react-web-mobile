import { CART } from "../constants/ActionTypes";
import * as action from "../lib/BLL";

export const getQueryCartProdTotalQuantity = ({ options = null, callback = function () {} }) => {
  return (dispatch) => {
    action.getQueryCartProdTotalQuantity(options, (json) => {
      if (json && json.results) {
        dispatch({ type: CART.QCPTQ, QCPTQ: json.results });
        callback(json.results);
      }
    });
  };
};
