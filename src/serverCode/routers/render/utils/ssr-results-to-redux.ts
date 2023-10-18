const specialReducers = ["homepage", "productFirstSection"];

/**
 * @typedef {import('./getSyncFetch').NodeFetchResponse} NodeFetchResponse
 */

/**
 *
 * @param {NodeFetchResponse['fetchResponse']} params
 */

/**
 *
 * @param {NodeFetchResponse['fetchResponse']} params
 */
export const getPreloadedState = (params) => {
  /** @type {import('@/store/configureStore').RootState} - description */
  const preLoadedState = {};
  const fetchResponse = params.fetchResponse;

  Object.keys(fetchResponse).forEach((item) => {
    const reducerName = specialReducers.find((reducerItem) =>
      item.match(reducerItem)
    );
    if (reducerName) {
      preLoadedState[reducerName] = preLoadedState[reducerName] || {};
      switch (reducerName) {
        case "productFirstSection":
          preLoadedState[reducerName][item.replace(`${reducerName}.`, "")] =
            fetchResponse[item] ? fetchResponse[item] : null;
          break;
        default:
          preLoadedState[reducerName][item.replace(`${reducerName}.`, "")] =
            fetchResponse[item] ? fetchResponse[item].results : null;
          break;
      }
    } else {
      preLoadedState[item] = {};
      preLoadedState[item].results = fetchResponse[item]
        ? fetchResponse[item].results
        : null;
      preLoadedState[item].metadata = fetchResponse[item]
        ? fetchResponse[item].metadata
        : null;
      preLoadedState[item].message = fetchResponse[item]
        ? fetchResponse[item].message || [item] + " Success"
        : "";
    }
  });
  return preLoadedState;
};
