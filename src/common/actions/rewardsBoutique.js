import * as action from '../lib/BLL';
import * as types from '../constants/ActionTypes';

export const exchangeRecordDetail = (params, callback) => (dispatch, ) => {
  dispatch(
    action.exchangeRecordDetail({
      onlyKey: 'exchangeRecordDetail',
      url: `/v1/rewards-boutique/exchange-record/detail/${params.recordId}`,
      type: 'GET',
      isConfirm: true,
    }),
  ).then(res => {
    if (res && res.results) callback && callback(res.results);
  });
};

export const changeRule = (show) => (dispatch, ) => {
  dispatch({
    type: types.REWARD.RULESHOW,
    data: show,
  });
};