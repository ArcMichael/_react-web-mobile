import type { Action } from "redux";

const createCommonReducer = () => {
  const initialState = {};
  return (state = initialState, action = {} as Action) => {
    switch (action.type) {
      default:
        return state;
    }
  };
};

export default createCommonReducer;
