import qs from "qs";
import { getHistory } from "./configureStore";

const browserHistory = getHistory();

declare module "history" {
  export interface History {
    getCurrentLocation: () => History["location"];
  }
  export interface Location {
    query: {
      [K: string]: string;
    };
  }
}

browserHistory.getCurrentLocation = () => {
  browserHistory.location.query = browserHistory.location.search
    ? (qs.parse(browserHistory.location.search, {
        ignoreQueryPrefix: true,
      }) as {
        [K: string]: string;
      })
    : {};
  return browserHistory.location;
};

export const getQuery = () => {
  if (typeof window !== "undefined") {
    return browserHistory.getCurrentLocation().query;
  }
  return {};
};

export default browserHistory;
