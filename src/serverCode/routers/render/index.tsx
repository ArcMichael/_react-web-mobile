/*
 * @Author: zone Tian
 * @Date: 2021-08-24 10:56:04
 * @LastEditors: zone Tian
 * @LastEditTime: 2021-11-10 16:19:43
 * @Description: file content
 */
import type { Express } from "express";
import type { Url } from "url";
import CacheRender from "./utils/cacheRender";
import { loggers } from "../../utils/log";

const logger = loggers.app;

declare module "express-serve-static-core" {
  export interface Request {
    _parsedOriginalUrl: Url;
  }
}

export default function render(app: Express) {
  const cache = new CacheRender();

  if (!process.env.RUN_ENV) {
    const WebpackDevMiddleware = require("webpack-dev-middleware");
    const WebpackHotMiddleware = require("webpack-hot-middleware");
    const webpackConfig = require("../../../../webpack/webpack.development.config");

    const webpack = require("webpack");
    const compiler = webpack(webpackConfig);
    const webCompiler = webpackConfig.find((item: any) => item.name === "web");
    app.use(
      WebpackDevMiddleware(compiler, {
        noInfo: true,
        stats: false,
        publicPath: webCompiler.output.publicPath,
        writeToDisk(filePath: string) {
          return (
            /dist\/node/.test(filePath) ||
            /loadable-stats/.test(filePath) ||
            /dist\\node/.test(filePath)
          );
        },
        serverSideRender: true,
      })
    );
    app.use(WebpackHotMiddleware(compiler, {}));
  }

  app.get("*", async (req, res) => {
    const t1 = +new Date();
    const { html, context } = await cache.render(req);
    const t2 = +new Date();
    console.log(` ${t2} ${req.url} render time: ${t2 - t1}`);
    logger.info(`${req.url} render time: ${t2 - t1}`);
    if (context.url) {
      res.writeHead(301, {
        Location: context.url,
      });
      res.end();
      return;
    }

    if (html) {
      res.send(html);
    } else {
      logger.error(new Error(`Render Error: ${req.url}`));
      res.status(404).send("error");
    }
  });
}
