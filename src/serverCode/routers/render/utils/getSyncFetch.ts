import "isomorphic-fetch";
import request from "../../../utils/request";
import { loggers } from "../../../utils/log";
import { FetchlistItem, FetchListRes } from "./getSyncList";

const logger = loggers.req;

require("es6-promise").polyfill();

export type FetchResponse = {
  [K: string]: {
    results: any;
    metadata: any;
    message: string;
  };
};

/**
 * @typedef {object} FetchesItem
 * @property {FetchlistItem['url']} U url
 * @property {FetchlistItem['params']} P params
 * @property {FetchlistItem['content']} C content
 */

export interface FetchesItem {
  U: FetchlistItem["url"];
  P: FetchlistItem["params"];
  C: FetchlistItem["content"];
}

/**
 * @typedef {{
 * Env:FetchListRes['Env'];
 * fetchResponse:FetchResponse;
 * fetchList:FetchesItem[];
 * fetchStatus:boolean;
 * fetchError:string;
 * }} NodeFetchResponse
 */
export interface NodeFetchResponse {
  Env: FetchListRes["Env"];
  fetchResponse: FetchResponse;
  fetchList: FetchesItem[];
  fetchStatus: boolean;
  fetchError: string;
}

export default function getSyncFetch(
  parameter: FetchListRes
): Promise<NodeFetchResponse> {
  const { fetchList, Env } = parameter;

  return new Promise((resolve) => {
    const Fetches: FetchesItem[] = [];

    /** @type {FetchResponse} - description */
    const FetchResponse = {};

    let TotalStatus = true;

    if (fetchList.length === 0) {
      resolve({
        Env,
        fetchResponse: FetchResponse,
        fetchList: Fetches,
        fetchStatus: TotalStatus,
        fetchError: "len=0",
      });
    }
    fetchList.forEach((data) => {
      // 整合资源
      const fetchItem: FetchesItem = {
        U: data.url,
        P: data.params,
        C: data.content,
      };
      if (!fetchItem.P.headers) {
        fetchItem.P.headers = {};
      }
      fetchItem.P.headers["Content-Type"] = "application/json";
      Fetches.push(fetchItem);
    });

    const TotalFetchLength = Fetches.length;

    const TotalFetch: string[] = [];

    function verifyFetch(FetchName: string) {
      TotalFetch.push(FetchName);
      // 判断数据是全部获取
      if (TotalFetchLength === TotalFetch.length) {
        const Errors = {};
        for (const i in TotalFetch) {
          // timeout
          if (FetchResponse[TotalFetch[i]].results === null) {
            TotalStatus = false;
            Errors[TotalFetch[i]] = FetchResponse[TotalFetch[i]].message;
          }
        }
        resolve({
          Env,
          fetchResponse: FetchResponse,
          fetchList: Fetches,
          fetchStatus: TotalStatus,
          fetchError: JSON.stringify(Errors),
        });
      }
    }

    Promise.all(
      Fetches.map((F) =>
        request(F.U, F.P)
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              return Promise.resolve(response);
            }
            return Promise.reject(new Error(response.statusText));
          })
          .then((json) => json.json())
          .then(function (data) {
            if (data.status > 0) {
              FetchResponse[F.C] = fetchConfigurationCatch(
                F.C,
                `errorCode ${data.status}`
              );
            } else if (data.errorCode) {
              FetchResponse[F.C] = fetchConfigurationCatch(
                F.C,
                `errorCode ${JSON.stringify(data)}`
              );
            } else {
              FetchResponse[F.C] = data;
            }

            verifyFetch(F.C);
          })
          .catch((error) => {
            logger.error(
              new Error(`${F.P.method || "GET"} - ${F.U} - ${error.message}`)
            );
            if (error === "SyntaxError: Unexpected token <") {
              // FORMAT ! JSON
              FetchResponse[F.C] = fetchConfigurationCatch(F.C, error);
            } else if (error.type) {
              switch (error.type) {
                // FETCH TIMEOUT
                case "request-timeout":
                  FetchResponse[F.C] = fetchConfigurationCatch(F.C, error.type);
                  break;
                // FETCH SYSTEM
                case "system":
                  FetchResponse[F.C] = fetchConfigurationCatch(F.C, error.type);
                  break;
              }
            } else {
              // SYSTEM ERROR
              FetchResponse[F.C] = fetchConfigurationCatch(F.C, error);
            }
            verifyFetch(F.C);
          })
      )
    );
  });
}

export function fetchConfigurationCatch(key: string, error: string | Error) {
  /**
   * @type "错误信息处理"
   * prototype: "初始化",
   * seo: "SEO初始化"
   */
  let rel;
  switch (key) {
    case "user":
      rel = {
        status: 0,
        message: `${key} ${error}`,
        results: { userType: "", email: "", logonId: "", cardType: "G" },
      };
      break;
    default:
      rel = {
        status: 0,
        message: `${key} ${error}`,
        results: null,
      };
      break;
  }
  return rel;
}
