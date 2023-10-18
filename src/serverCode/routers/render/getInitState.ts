import type { Request } from "express";
import getRouterIndex, { RouterIndexParams } from "./utils/getRouterIndex";
import getSyncFetch from "./utils/getSyncFetch";
import getSyncList from "./utils/getSyncList";
import { getPreloadedState } from "./utils/ssr-results-to-redux";
import isDevice from "./utils/isDevice";
import getConfigs from "isomorphisms/getConfigs";

export interface IgetInitStateParams {
  req: Request;
}

const getInitState = ({
  req,
}: IgetInitStateParams): Promise<{
  preLoadedState: any;
  response: any;
}> => {
  const { UID, Token } = req.cookies || {};
  return new Promise((resolve) => {
    getRouterIndex({
      UID: UID,
      Token: Token,
      Env: getConfigs(),
      timeout: 3000,
      pathname: req.path,
      routeParams: req.params,
      query: req.query,
      channel: isDevice(req.headers["user-agent"]),
    })
      .then((index) => getSyncList(index as RouterIndexParams))
      .then((list) => getSyncFetch(list))
      .then((response) => {
        const preLoadedState = getPreloadedState(response);
        resolve({ preLoadedState, response });
      });
  });
};

export default getInitState;
