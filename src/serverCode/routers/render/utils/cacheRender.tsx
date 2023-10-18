import React from "react";
import { ChunkExtractor } from "@loadable/server";
import { matchPath, StaticRouter } from "react-router";
import { Provider } from "react-redux";
import path from "path";
import { renderToString } from "react-dom/server";
import type { Request } from "express";
import getConfigs from "isomorphisms/getConfigs";
// import App from "../../../../common/App";
import routes from "../../../../common/routes";
import getInitState from "../getInitState";
import InitState from "../initStates";
import SensorData from "../sensorPageMap";
import isDevice from "./isDevice";
import InjectScript from "./InjectScript";
import configureStore from "../../../../common/store/configureStore";

export interface RenderCache {
  prevState: any;
  html: string;
  context: { url?: string };
}

const configs = getConfigs();

export default class CacheRender {
  cache: {
    [K: string]: RenderCache;
  };

  webStats: any;
  nodeStats: any;

  constructor() {
    this.cache = {};
    this.webStats = path.resolve("dist/dist/web/loadable-stats.json");
    this.nodeStats = path.resolve("dist/dist/node/loadable-stats.json");
  }
  getRoutesMatch = (url: string) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const match = matchPath(url, {
        path: route.path,
        exact: true,
      });
      if (match) {
        return route.path as string;
      }
    }
    return false;
  };

  getSeo = async (req: Request) => {
    const $initState = new InitState({
      req: req,
    });
    const $state = await $initState.init();
    return $state.seo;
  };

  getInitState = async (req: Request) => {
    try {
      const t1 = +new Date();
      const { preLoadedState } = await getInitState({
        req: req,
      });
      const t2 = +new Date();
      const $initState = new InitState({
        req: req,
      });
      const t3 = +new Date();

      const $state = await $initState.init();
      const t4 = +new Date();
      console.log(`${t2 - t1} : ${t3 - t2} : ${t4 - t3} :time 123`);
      return {
        state: { ...preLoadedState, ...$state },
        preloadImages: [],
      };
    } catch (error) {
      return {
        state: { seo: InitState.defaultSeo },
        preloadImages: [],
      };
    }
  };

  getHtml = (req: Request, store: any, preloadImages: string[]) => {
    const t1 = +new Date();
    const { UID, Token } = req.cookies || {};
    const Env = {
      UID: UID,
      Token: Token,
      Env: getConfigs(),
      timeout: 3000,
      pathname: req.path,
      routeParams: req.params,
      query: req.query,
      channel: isDevice(req.headers["user-agent"]),
    };

    const nodeExtractor = new ChunkExtractor({ statsFile: this.nodeStats });
    const { default: App } = nodeExtractor.requireEntrypoint();

    const webExtractor = new ChunkExtractor({ statsFile: this.webStats });
    const t2 = +new Date();
    const state = store.getState();
    const description = state.seo.results.description;
    const keywords = state.seo.results.keywords;
    const title = state.seo.results.title;
    const context: { url?: string } = {};
    const cdnHost = configs.static;
    const url = req._parsedOriginalUrl;
    const t3 = +new Date();
    const result = this.getRoutesMatch(req.path);
    const jsx = webExtractor.collectChunks(
      <Provider store={store as any}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    );
    const t4 = +new Date();

    const appHtml = renderToString(jsx);
    const t5 = +new Date();
    let html = "";
    if (result !== false) {
      html = `
      <!DOCTYPE html>
              <html>
                <head>
                <meta charset="UTF-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge"/>
                <link type="image/x-icon" href="https://ssl1.sephorastatic.cn/wcsfrontend/members/common/favicon.ico" rel="shortcut icon">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <meta name="description" content="${description}">
                <meta name="keywords" content="${keywords}">
                <title>${title}</title>
                ${InjectScript.DominPreconnect(url)}
                ${preloadImages.length > 0 ? preloadImages.join("\n") : ""}
                ${webExtractor.getLinkTags()}
                ${webExtractor.getStyleTags()}
                ${InjectScript.PerformanceEvent()}
                ${InjectScript.PxtoRem()}
                ${InjectScript.Boomr()}
                ${InjectScript.ShumeiScript(url)}
                ${InjectScript.BridgeScript(url)}
                ${InjectScript.ADHOC(url)}
                ${InjectScript.ShumeiSMCPScript(url)}
                </head>
                <body>
                  <div id="root" >${appHtml}</div>
                  <script>
                    window.__INITIAL_STATE__ = ${JSON.stringify(
                      store.getState()
                    )};
                    window.__INITIAL_ENV__ = ${JSON.stringify(Env)};
                    window.__BUILD_TIME__ = "${__BUILD_TIME__}";
                    window.pageType = ${JSON.stringify(SensorData(url))};
                    window.mpulse = ${JSON.stringify(
                      SensorData(url).page_type_detail
                    )};
                  </script>
                  <script src="${cdnHost}/soa/public/js/jsinvoke/jsinvoke_1.08.js"></script>      
                  ${InjectScript.tingyun()}
                  ${InjectScript.Emarsys()}
                  ${webExtractor.getScriptTags({})}
                </body>
              </html>
      `;
    }
    const t6 = +new Date();
    console.log(
      `${t2 - t1} : ${t3 - t2} : ${t4 - t3} :${t5 - t4}:${
        t6 - t5
      } :time  render`
    );
    return {
      html,
      context,
    };
  };

  render = async (req: Request) => {
    const t1 = +new Date();
    const { state, preloadImages } = await this.getInitState(req);
    const t2 = +new Date();
    const { store } = configureStore(state);
    const t3 = +new Date();
    const { html, context } = this.getHtml(req, store, preloadImages);
    const t4 = +new Date();

    console.log(`${t2 - t1} : ${t3 - t2} : ${t4 - t3} :time `);

    return {
      html,
      context,
    };
  };
}
