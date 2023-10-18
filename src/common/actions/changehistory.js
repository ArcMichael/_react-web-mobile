import * as actions from "../lib/BLL";

export const changehistory = (cb) => () => {
  actions.getOrderHistory((json) => {
    cb(json);
  });
};
