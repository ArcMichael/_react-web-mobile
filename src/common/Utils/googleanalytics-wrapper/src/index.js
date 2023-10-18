/*
 *
 * Producer -- Alvin
 * Time -- 2018/7/26
 * Function -- Entry for creating Google analytics wrapper
 *
 */
import $ from "jquery";
import warning from "./utils/warning";
import __DEV__ from "./utils/__DEV__";

/*
 * Avoiding repeating of event.
 */
function dereplication(arr, eventKey, eventValue) {
  return arr.some((obj) => {
    if (obj[eventKey] === eventValue) return true;
    return false;
  });
}

function logCreator(debug) {
  return function (data, status, msg) {
    if (
      __DEV__ &&
      debug &&
      typeof console !== "undefined" &&
      typeof console.log === "function" &&
      typeof console.group === "function"
    ) {
      console.group(`GA event '${data.event}'`);
      console.log(
        `%c event name: `,
        "background:#aaa;color:#bada55",
        String(data.event)
      );
      console.log(`%c event data: `, "background:#aaa;color:#bada55", data);
      console.log(
        `%c is event success: `,
        "background:#aaa;color:#bada55",
        status
      );
      console.log(`%c message: `, "background:#aaa;color:#bada55", msg);
      console.groupEnd();
    }
  };
}

/**
 * Creates a GoogleAnalyticsWrapper.
 *
 * @param {Object} [options] The options to set config of the GoogleAnalyticsWrapper,
 * E.g, set debug as true if in development environment.
 *
 * @return {initial} The initial function is used to initialize dataLayer in window,
 * setting and pushing pageView data when initialized, memorizing initialed status for the
 * exposed function push.
 *
 * @return {push} The push function will check if the dataLayer is initialized for every
 * implementation, avoiding block the main business flow.If the parameter contains a key of
 * eventCallback, the function will be forced to trigger if the google analytics not implement
 * the eventCallback in a period of time.
 *
 */
export default function GoogleAnalyticsWrapper({ debug } = {}) {
  let _statusGTM = "notInitialized";
  const log = logCreator(debug, __DEV__);
  return {
    initial: function ({ pageView, callback } = {}) {
      window.jQuery = $;
      function setup(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        const f = d.getElementsByTagName(s)[0];
        const j = d.createElement(s);
        const dl = l !== "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "//www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
        j.onerror = function () {
          _statusGTM = "failed";
        };
        j.onload = function () {
          if (Object.hasOwnProperty.call(window.dataLayer, "push")) {
            _statusGTM = "completed";
            callback({ results: "Completed" });
          } else {
            _statusGTM = "failed";
          }
        };
      }
      if (typeof window !== "undefined") {
        window.dataLayer = pageView instanceof Object ? [pageView] : [];
        _statusGTM = "initialized";
        setup(window, document, "script", "dataLayer", "GTM-N57TLT");
        setup(window, document, "script", "dataLayerV2", "GTM-PS7PMCK");
      }
    },
    push: function (data, { onlyOnce, timeout = 500 } = {}) {
      if (data instanceof Object) {
        const { event, eventCallback } = data;

        let triggeredOnce = false;
        let eventCallbackEnhancer = null;
        if (typeof eventCallback === "function") {
          eventCallbackEnhancer = function () {
            if (!triggeredOnce) {
              triggeredOnce = true;
              eventCallback();
            }
          };
          data.eventCallback = eventCallbackEnhancer;
          setTimeout(eventCallbackEnhancer, timeout);
        }

        if (_statusGTM === "completed" && window.dataLayer instanceof Array) {
          if (onlyOnce && dereplication(window.dataLayer, "event", event)) {
            log(
              data,
              false,
              `The event '${String(
                event
              )}' is setted to push only once and already exsist in dataLayer.`
            );
            return false;
          }
          log(data, true, `success`);
          window.dataLayer.push(data);
        } else {
          log(
            data,
            false,
            `The event ${String(event)} was failed because ` +
              `the status of google tag manager is '${_statusGTM}'.`
          );
          if (typeof eventCallbackEnhancer === "function")
            eventCallbackEnhancer();
        }
      } else if (__DEV__) {
        warning(
          `google tag manager warn: type of event data must be 'object' but got ${typeof data}.`
        );
      }
    },
    pushV2: function (data, { onlyOnce, timeout = 500 } = {}) {
      if (data instanceof Object) {
        let { event, eventCallback } = data;

        let triggeredOnce = false;
        let eventCallbackEnhancer = null;
        if (typeof eventCallback === "function") {
          eventCallbackEnhancer = function () {
            if (!triggeredOnce) {
              triggeredOnce = true;
              eventCallback();
            }
          };
          data.eventCallback = eventCallbackEnhancer;
          setTimeout(eventCallbackEnhancer, timeout);
        }

        if (
          window.dataLayer instanceof Array &&
          (_statusGTM === "completed" ||
            (_statusGTM === "initialized" &&
              typeof eventCallbackEnhancer !== "function"))
        ) {
          if (onlyOnce && dereplication(window.dataLayer, "event", event)) {
            log(
              data,
              false,
              `The event '${String(
                event
              )}' is setted to push only once and already exsist in dataLayer.`
            );
            return false;
          }
          log(data, true, `success`);
          window.dataLayerV2.push(data);
        } else {
          log(
            data,
            false,
            `The event ${String(event)} was failed because ` +
              `the status of google tag manager is '${_statusGTM}'.`
          );
          if (typeof eventCallbackEnhancer === "function")
            eventCallbackEnhancer();
        }
      } else if (__DEV__) {
        warning(
          `google tag manager warn: type of event data must be 'object' but got ${typeof data}.`
        );
      }
    },
  };
}
