import $ from "jquery";
import { GetSingleCookie, GetConfirmation, TrackEnterResource } from "./Tools";
import { typeofObject, typeofString } from "../Utils";
import * as device from "./device";
import { urlGetParams } from "./url";
import getConfigs from "../../isomorphisms/getConfigs";

const globalAjax = [];

export const AjaxOptions = {
  type: "GET",
  dataType: "json",
  cache: true,
};

export function AjaxOptionsHeaders(WD, cb) {
  AjaxOptionsHeadersCookies(WD, (UserId, Token) => {
    cb({ UID: UserId, Token });
  });
}

export function AjaxOptionsHeadersCookies(params, callback) {
  let relCookieID = "";
  let relCookieToken = "";
  if (device.isWeChat()) {
    relCookieToken =
      urlGetParams(window.location, "token") ||
      GetSingleCookie(params.cookie, "Token");
    relCookieID =
      urlGetParams(window.location, "uid") ||
      GetSingleCookie(params.cookie, "UID");
    return callback(relCookieID, relCookieToken);
  }

  if (!params.cookie) {
    // NO Cookie Callback Ghost
    return callback(relCookieID, relCookieToken);
  }

  if (GetSingleCookie(params.cookie, "Token")) {
    relCookieToken = GetSingleCookie(params.cookie, "Token");
  }

  if (GetSingleCookie(params.cookie, "UID")) {
    relCookieID = GetSingleCookie(params.cookie, "UID");
  }

  // NO match Callback Ghost
  return callback(relCookieID, relCookieToken);
}

/**
 * @typedef {Object} CommonResponse
 * @property {Object} jQueryStatus
 * @property {number} jQueryStatus.status
 * @property {any} ajaxOptions
 * @property {number|null} errorCode
 * @property {string|null} errorMessage
 * @property {any} results
 * @property {number} status
 * @property {number} timeStamp
 */

/**
 *
 * @param {*} params
 * @param {(json:CommonResponse) => void} callback
 */
export function AJAX(params, callback) {
  // const _Token = GetSingleCookie(window.document.cookie, 'Token')
  TrackEnterResource();
  /**
   * No Token
   */

  const options = {};

  if (!params) {
    callback({ status: 1, message: "error total params Url" });
    return;
  }

  // OBJECT_ASSIGN
  Object.assign(options, AjaxOptions);
  const configs = getConfigs();
  // URL
  options.url = `https://${configs.api}${params.url}`;

  // DATA
  options.data = JSON.stringify(params.data);

  // METHOD
  if (params.type) options.type = params.type;

  // DATA_TYPE
  if (params.dataType) options.method = params.dataType;

  // HEADERS
  if (!params["headers"]) params["headers"] = { channel: "MOBILE" };

  // CONTENT_TYPE
  options.contentType = "application/json; charset=utf-8";

  // AJAX Abort
  if (params.abort) options.abort = params.abort;

  // AJAX Post Cookie
  options.xhrFields = { withCredentials: true };

  // Get Headers UID Token
  AjaxOptionsHeaders(window.document, (cbHeader) => {
    options.headers = { ...(params.headers || {}), ...cbHeader };

    if (!options.headers.UID) delete options.headers.UID;
    if (!options.headers.Token) delete options.headers.Token;

    // IE(11) Not supported Fetch
    if ($ && $.ajax) {
      jQueryAjax(options, (ajaxCallback) => {
        callback(ajaxCallback);
      });
    }
  });
}

export function jQueryFormat(responseText) {
  return responseText;
}

export function outJson(object) {
  if (typeofString(object)) {
    return JSON.parse(object);
  }
  return object;
}

/**
 * ajax - abort + responseCatch
 * @param {*} jQueryOptions
 * @param {*} jQueryCallback
 */
export function jQueryAjax(jQueryOptions, jQueryCallback) {
  if (jQueryOptions.abort) {
    if (globalAjax[jQueryOptions.abort])
      globalAjax[jQueryOptions.abort].abort();

    globalAjax[jQueryOptions.abort] = $.ajax({
      ...jQueryOptions,
      success(json) {
        json.jQueryStatus = {};
        // json.jQueryStatus.status = tmpAjax.status;
        json.jQueryStatus.status = globalAjax[jQueryOptions.abort].status;
        json.ajaxOptions = jQueryOptions;
        jQueryCallback(GetConfirmation(jQueryFormat(json)));
      },
      error(err) {
        const json = typeofObject(err.responseText)
          ? JSON.parse(err.responseText)
          : { errResponseText: err.responseText || "" };
        json.jQueryStatus = {};
        // json.jQueryStatus.status = tmpAjax.status;
        json.jQueryStatus.status = globalAjax[jQueryOptions.abort].status;
        json.ajaxOptions = jQueryOptions;
        jQueryCallback(GetConfirmation(json));
      },
    });
  } else {
    let tmpAjax = null;

    tmpAjax = $.ajax({
      ...jQueryOptions,
      success(json) {
        json.jQueryStatus = {};
        // json.jQueryStatus.status = tmpAjax.status;
        json.jQueryStatus.status = tmpAjax.status;
        json.ajaxOptions = jQueryOptions;
        jQueryCallback(GetConfirmation(jQueryFormat(json)));
      },
      error(err) {
        const json = typeofObject(err.responseText)
          ? JSON.parse(err.responseText)
          : { errResponseText: err.responseText || "" };
        json.jQueryStatus = {};
        // json.jQueryStatus.status = tmpAjax.status;
        json.jQueryStatus.status = tmpAjax.status;
        json.ajaxOptions = jQueryOptions;
        jQueryCallback(GetConfirmation(json));
      },
    });
  }
}
