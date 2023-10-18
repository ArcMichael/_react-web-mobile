import "isomorphic-fetch";
import { loggers } from "./log";

require("es6-promise").polyfill();
type RequestInitList = RequestInit & {
  timeout?: number;
};

const logger = loggers.req;
const oldFetchfn = fetch; //拦截原始的fetch方法
const FectchAjax = (requestInfo: RequestInfo, options: RequestInitList) => {
  //定义新的fetch方法，封装原有的fetch方法
  var fetchPromise = oldFetchfn(requestInfo, options);
  var timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("fetch timeout"));
    }, options.timeout);
  });
  return Promise.race([fetchPromise, timeoutPromise]);
};
const request = (requestInfo: RequestInfo, options: RequestInitList) => {
  return FectchAjax(requestInfo, options)
    .then((response) => {
      logger.info(`${options.method || "GET"} - ${requestInfo} success`);
      return response;
    })
    .catch((error) => {
      logger.error(
        new Error(
          `${options.method || "GET"} - ${requestInfo} - ${error.message}`
        )
      );
      throw error;
    });
};

export default request;
