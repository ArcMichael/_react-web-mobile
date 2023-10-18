import * as types from "../constants/ActionTypes";

const initdata = {
  recommendResults: null,
  giftList: [],
  selectResData: null,
  questionCode: "",
  answerDtos:[]
};

export default (state = initdata, action) => {
  switch (action.type) {
    case types.GIFTINTELLIGENT_2.RECOMMENDRESULT:
      return Object.assign({}, state, {
        recommendResults: action.data,
      });
      break;
    case types.GIFTINTELLIGENT_2.GIFTLIST:
      return Object.assign({}, state, {
        giftList: action.data,
      });
      break;
    case types.GIFTINTELLIGENT_2.SELECTRESDATA:
      return Object.assign({}, state, {
        selectResData: action.data,
      });
    case types.GIFTINTELLIGENT_2.QUESTIONCODE:
      return Object.assign({}, state, {
        questionCode: action.data,
      });
      case types.GIFTINTELLIGENT_2.ANSWERDTOS:
        return Object.assign({}, state, {
          answerDtos: action.data,
        });
    default:
      return state;
      break;
  }
};
