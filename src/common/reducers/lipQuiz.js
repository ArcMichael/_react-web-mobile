import * as types from '../constants/ActionTypes';

const initdata = {
  skuresults: null,
};

export default (state = initdata, action) => {
  switch (action.type) {
    case types.QUIZ.QUIZ_RESULTS:
      return Object.assign({}, state, {
        skuresults: action.data,
      });
    case types.QUIZ.QUIZ_SELECTDTO:
      return Object.assign({}, state, {
        selected: action.data,
      });
      break;

    default:
      return state;
      break;
  }
};
