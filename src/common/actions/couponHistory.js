import * as actions from "../lib/BLL";
import * as types from "../constants/ActionTypes";

export const couponHistory = (params, callback) => (dispatch, getState) => {
  dispatch(
    actions.getCouponHistory({
      onlyKey: "getCouponHistory",
      url: `/v2/promotion/pxCoupon/getHistoryCouponList/${params.pageNum}/${params.pageSize}`,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && json.status == 0) {
      let results = json.results;
      if (params.pageNum > 1) {
        let obj = {},
          records = getState().myAccount.myHistoryCoupon.records.concat(
            results.records
          );
        obj.currentPage = results.currentPage;
        obj.records = records;
        obj.totalRecordsCount = results.totalRecordsCount;
        obj.totalSize = results.totalSize;

        dispatch({
          type: types.MY_ACCOUNT.MY_COUPON_HISTORY,
          data: obj,
        });
      } else {
        dispatch({
          type: types.MY_ACCOUNT.MY_COUPON_HISTORY,
          data: results,
        });
      }
    }
    callback && callback(json);
  });
};
