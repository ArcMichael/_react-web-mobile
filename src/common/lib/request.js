import { GetSingleCookie } from "./Tools";
import { getShuMeiDeviceId } from "./shumeiUtils";
import getConfigs from "../../isomorphisms/getConfigs";

require("es6-promise").polyfill();
require("isomorphic-fetch");

const configs = getConfigs();
const api = configs.api;

/**
 * @typedef {{
 *  errorCode:number | null;
 *  errorMessage:string | null;
 *  status:0 | 1;
 *  timeStamp:number;
 * }} CommonResponse
 */

const getPreConfig = () => {
  /** @type {RequestInit} - description */
  const config = {
    headers: {},
  };
  if (typeof window !== "undefined") {
    const Token = GetSingleCookie(window.document.cookie, "Token");
    const UID = GetSingleCookie(window.document.cookie, "UID");
    config.headers.Token = Token;
    config.headers.UID = UID;
    config.headers.channel = "MOBILE";
    config.headers["Content-Type"] = "application/json";
    config.headers.NDFingerPrint = getShuMeiDeviceId();
  }
  return config;
};

/**
 *
 * @param {string} url
 * @param {RequestInit & { baseUrl:string }?} config
 * @param {string?} base
 */
const request = (url, config) => {
  const initConfig = getPreConfig();
  const { baseUrl: base, ...restConfig } = config || {};
  const baseUrl = base || `https://${api}`;
  return fetch(`${baseUrl}${url}`, { ...initConfig, ...restConfig });
};

export default request;
