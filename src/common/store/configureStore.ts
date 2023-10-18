import { createStore, compose, applyMiddleware } from "redux"; // Redux 组件
import thunkMiddleware from "redux-thunk"; // Logger
import { createBrowserHistory, createMemoryHistory } from "history";
import createRootReducer from "../reducers"; // Tree

export const isServer = !(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const getHistory = (url = "/") => {
  const history = isServer
    ? createMemoryHistory({
        initialEntries: [url],
      })
    : createBrowserHistory();
  return history;
};

export default function configureStore(preLoadedState: any, url = "/") {
  const history = getHistory(url);

  const store = createStore(
    createRootReducer(),
    preLoadedState,
    compose(applyMiddleware(thunkMiddleware)),
  );
  return {
    store,
    history,
  };
}
