import { Request } from "express";
import configRouter from "../../../../etc/configRouter";
import isDevice from "./isDevice";

export interface RouterIndexParams {
  UID: string;
  Token: string;
  Env: SephoraConfig;
  timeout: number;
  pathname: string;
  query: Request["query"];
  deviceid?: string;
  routeParams: { [K: string]: string };
  index?: string;
  channel: ReturnType<typeof isDevice>;
}

/**
 *
 * @param {RouterIndexParams} params
 * @return {Promise<RouterIndexParams>} - description
 */
function getRouterIndex(params: RouterIndexParams) {
  return new Promise((resolve) => {
    const MatchExpr = configRouter();
    for (const i in MatchExpr) {
      if (params.pathname.match(MatchExpr[i].regex)) {
        params.index = MatchExpr[i].index;
      }
    }
    resolve(params);
  });
}

export default getRouterIndex;
