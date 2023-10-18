import "core-js";
import "regenerator-runtime/runtime";
import React from "react";
import { hydrate } from "react-dom";
import { loadableReady } from "@loadable/component";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import App from "./App";

const { store, history } = configureStore(window.__INITIAL_STATE__);

export const hi = history;

loadableReady(() => {
  const root = document.getElementById("root");
  hydrate(
    <Provider store={store as any}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    root
  );
});
