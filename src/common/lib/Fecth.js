/*
 * 以下是Ajax定义以及调用
 */
import getConfigs from "isomorphisms/getConfigs";
import $ from "jquery";
import * as types from "../constants/ActionTypes";
import {
  GetSingleCookie,
  typeofString,
  GetConfirmation,
  TrackEnterResource,
} from "./Tools";
import { getShuMeiDeviceId } from "./shumeiUtils";

import * as device from "./device";
import { urlGetParams } from "./url";
import { isBrowser } from "./get-isClient";
/*
 * 发起请求action
 * @param {string} onlyKey action对应的key
 */
const requestAction = (onlyKey) => ({
  type: types.FETCH_REQUEST,
  onlyKey,
});

/*
 * 废弃请求action
 * @param {string} onlyKey action对应的key
 */
const receiveAction = (
  onlyKey,
  status,
  results,
  errorMessage,
  ajaxOptions,
  jQueryStatus
) => ({
  type: types.FETCH_RECEIVE,
  onlyKey,
  status,
  results,
  errorMessage,
  ajaxOptions,
  jQueryStatus,
});

/*
 * 处理错误action
 * @param {string} onlyKey action对应的key
 */
const errorAction = (
  onlyKey,
  status,
  results,
  errorMessage,
  ajaxOptions,
  jQueryStatus
) => ({
  type: types.FETCH_ERROR,
  onlyKey,
  status,
  results,
  errorMessage,
  ajaxOptions,
  jQueryStatus,
});
/*
 *
 * @param {string} key 唯一标识
 * @param {obeject} params 入参
 * @param {boolean} ifAllowMultipleRequest 是否允许并发请求，默认值false
 */
export const fetchAjax = (key, params) => (dispatch) => {
  return dispatch(fetchSingle(key, params));
};
/*
 * 是否可以发起请求 返回结果
 * @param {string} key action对应的key
 * @param {object} params 入参
 */
const fetchSingle = (key, params) => (dispatch, getState) => {
  const posts = getState().Response[key];
  if (shouldFetchPosts(posts)) {
    return dispatch(fetchPosts(key, params));
  }
  return Promise.resolve(posts);
};

/*
 * 是否可以发起请求
 * @param {Object} posts action对应的key
 */
const shouldFetchPosts = (posts) => {
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return true;
};

/*
 * 发起请求
 * @param {string} onlyKey action对应的key
 * @param {object} params 入参
 */
const fetchPosts = (onlyKey, params) => (dispatch) => {
  dispatch(requestAction(onlyKey));
  return AJAX(params).then((json) => {
    let jsonComplete = { ...json };
    const { isConfirm } = params;
    if (isConfirm) {
      GetConfirmation(json);
    } else {
    }
    const { status, results, errorMessage, ajaxOptions, jQueryStatus } =
      jsonComplete;
    if (jQueryStatus && jQueryStatus.status && jQueryStatus.status < 400) {
      dispatch(
        receiveAction(
          onlyKey,
          status,
          results,
          errorMessage,
          ajaxOptions,
          jQueryStatus
        )
      );
    } else {
      // timeout 或 400以上状态，报错
      dispatch(
        errorAction(
          onlyKey,
          status,
          null,
          "系统异常",
          ajaxOptions,
          jQueryStatus
        )
      );
      jsonComplete = {
        ...jsonComplete,
        errorMessage: "系统异常",
        results: null,
      };
    }
    jsonComplete.isFetching = false;
    return jsonComplete;
  });
};
// 默认ajax请求方式
const AjaxOptions = {
  type: "GET",
  dataType: "json",
  cache: false,
};
// 获取requestHeader中 cookie 信息
export function AjaxOptionsHeaders(doc, callback) {
  AjaxOptionsHeadersCookies(doc, (UID, Token) => {
    callback({
      UID,
      Token,
      NDFingerPrint: isBrowser() ? getShuMeiDeviceId() : "",
    });
  });
}

export function AjaxOptionsHeadersCookies(params, cb) {
  let relCookieID = ""; // cookie UID
  let relCookieToken = ""; // cookie Token
  if (!params.cookie) {
    // NO Cookie Callback Ghost
    return cb(relCookieID, relCookieToken);
  }
  if (device.device_inMiniProgramsEnvironment()) {
    relCookieToken =
      urlGetParams(window.location, "token") ||
      GetSingleCookie(params.cookie, "Token");
    relCookieID =
      urlGetParams(window.location, "uid") ||
      GetSingleCookie(params.cookie, "UID");
    return cb(relCookieID, relCookieToken);
  }
  if (GetSingleCookie(params.cookie, "Token")) {
    relCookieToken = GetSingleCookie(params.cookie, "Token");
  }
  if (GetSingleCookie(params.cookie, "UID")) {
    relCookieID = GetSingleCookie(params.cookie, "UID");
  }
  // match Callback Ghost
  return cb(relCookieID, relCookieToken);
}

export function AJAX(params, callback) {
  const options = {};
  TrackEnterResource();
  if (!params) {
    callback({ status: 1, message: "error total params Url" });
    return;
  }
  // object整合
  Object.assign(options, AjaxOptions);
  const configs = getConfigs();
  // request url
  options.url = `https://${configs.api}${params.url}`;
  // request data
  // re]quest contentTYPE
  if (params.formData) {
    options.data = createFormData(params.data);
    options.contentType = false;
    options.processData = false;
  } else {
    options.data = JSON.stringify(params.data);
    options.contentType = "application/json;charset=utf-8";
  }
  // request type
  if (params.type) options.type = params.type;
  // request datatype
  if (params.dataType) options.dataType = params.dataType;
  // request headers
  if (!params.headers) params.headers = { channel: "MOBILE" };
  // ajax abort
  if (params.abort) options.abort = params.abort;
  // AJAX Post Cookie
  options.xhrFields = { withCredentials: true };
  // get Heards UID Token
  return new Promise((resolve) => {
    AjaxOptionsHeaders(window.document, (header) => {
      options.headers = { ...header, ...params.headers };
      if ($ && $.ajax) {
        jQueryAjax(options, (ajaxcallback) => {
          resolve(ajaxcallback);
        });
      }
    });
  });
}

// jq ajax
export function jQueryAjax(jqoptions, callback) {
  // if( jqoptions['abort'] && globalAjax ){  // 此处有错误,要修改
  // globalAjax.abort();
  // }
  let tmpAjax = null; // --- zone
  tmpAjax = $.ajax({
    ...jqoptions,
    success(json) {
      json.jQueryStatus = {};
      json.ajaxOptions = jqoptions;
      json.jQueryStatus.status = tmpAjax.status;
      callback(GetConfirmation(jQueryFormat(json)));
    },
    error(err) {
      const json = err.responseText ? outJson(err.responseText) : {};
      json.jQueryStatus = {};
      json.ajaxOptions = jqoptions;
      json.jQueryStatus.status = tmpAjax.status;
      json.jQueryStatus.message = json.message;
      callback(GetConfirmation(jQueryFormat(json)));
    },
  });
}

export function createFormData(params) {
  if (Object.prototype.toString.call(params) !== "[object Object]" || !params)
    return;
  const formData = new FormData();
  Object.keys(params).map((item) => formData.append(item, params[item]));
  return formData;
}

export function jQueryFormat(responseText) {
  const jQueryFormatWrap = [
    "jQueryStatus",
    "results",
    "status",
    "ajaxOptions",
    "errorMessage",
    "error",
  ];
  // let deepCopyResponse = $.extend( true, responseText )
  for (const i in responseText) {
    if (jQueryFormatWrap.indexOf(i) < 0) {
      delete responseText[i];
    }
  }
  return responseText;
}

export function outJson(object) {
  if (typeofString(object)) {
    return JSON.parse(object);
  }
  return object;
}

/**
 * @typedef {{
 * ajaxOptions:{};
 * errorMessage:string | null;
 * isFetching:boolean;
 * jQueryStatus:{ status:number; }
 * }} FetchAjaxResponse
 */
