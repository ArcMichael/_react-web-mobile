import { DEPENDENCY } from "../constants/ActionTypes";
import * as google from "../Mapping/google";
import * as wechat from "../Utils/wechat";
import GoogleAnalytics from "../Utils/GoogleAnalytics";

export const setupGoogleAnalytics =
  ({ callback = function () {} }) =>
  (dispatch) => {
    const pathname = window.location.pathname;

    // PV static || activity
    const pageView = google.google_basic(pathname);

    GoogleAnalytics.initial({
      pageView,
      callback: function ({ results = false }) {
        if (results === "Completed") {
          dispatch({ type: DEPENDENCY.GOOGLE_ANALYTICS, GOOGLE_ANALYTICS: results });
          callback(results);
        }
      },
    });
  };
export const setupWeChat =
  ({ callback = function () {} }) =>
  (dispatch) =>
    wechat.setupWeChat({
      callback: function ({ results = false }) {
        if (results) {
          dispatch({ type: DEPENDENCY.WECHAT_JS_BRIDGE, WECHAT_JS_BRIDGE: results });
          callback(results);
        }
      },
    });
