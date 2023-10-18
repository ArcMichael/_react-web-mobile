import * as types from "../constants/ActionTypes";

const initdata = {
  recommendResults: null,
  giftList: [],
  selectResData: null,
  questionCode: "",
  answerDtos: [],
  animateJson: null,
};

export default (state = initdata, action) => {
  switch (action.type) {
    case types.GIFTINTELLIGENT.RECOMMENDRESULT:
      return Object.assign({}, state, {
        recommendResults: action.data,
      });
      break;
    case types.GIFTINTELLIGENT.GIFTLIST:
      return Object.assign({}, state, {
        giftList: action.data,
      });
      break;
    case types.GIFTINTELLIGENT.SELECTRESDATA:
      return Object.assign({}, state, {
        selectResData: action.data,
      });
    case types.GIFTINTELLIGENT.QUESTIONCODE:
      return Object.assign({}, state, {
        questionCode: action.data,
      });
    case types.GIFTINTELLIGENT.ANSWERDTOS:
      return Object.assign({}, state, {
        answerDtos: action.data,
      });
    case types.GIFTINTELLIGENT.ANIMATEJSON:
      return Object.assign({}, state, {
        animateJson: action.data,
      });
    default:
      return state;
      break;
  }
};
