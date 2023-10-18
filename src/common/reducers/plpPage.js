import { PLPPAGE } from "../constants/ActionTypes";

const initialState = {
  products: {},
  brandCon: {},
  obtainData: {},
};

export default function(state = initialState, action = {}) {
  const products = action.data;
  const brandCon = action.data;
  switch (action.type) {
    case PLPPAGE.PRODUCTS:
      return Object.assign({}, state, {
        products,
      });
    case PLPPAGE.BRANDCON:
      return Object.assign({}, state, {
        brandCon,
      });
    case PLPPAGE.OBTAINDATA:
      return Object.assign({}, state, {
        obtainData: action.data,
      });
    default:
      return state;
  }
}
