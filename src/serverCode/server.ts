import express, { Express } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import * as mime from "mime";
import type serveStatic from "serve-static";
import { loggers } from "@sephora/log";
import path from "path";
// const  portfinder = require("portfinder");
// import portfinder from "portfinder";
import api from "./routers/api";
import render from "./routers/render";
import "./tingyun";
import configCache from "../etc/configCache.json";

const app = express();

const setup = (app: Express) => {
  loggers.app.info(`CWD: ${process.cwd()}`);

  app.set("port", process.env.NODE_PORT || 60018); //
  app.set(
    "run_env",
    process.env.RUN_ENV || process.env.LOCAL_RUN_ENV || "stage"
  );
  console.log(process.env.RUN_ENV, process.env.LOCAL_RUN_ENV, 11111111111111);

  const publicDir = path.resolve("dist");

  const getStaticOptions = () => {
    const options: serveStatic.ServeStaticOptions<
      express.Response<any, Record<string, any>>
    > = {
      index: false,
      maxAge: "1d",
      extensions: [".js", ".css"],
      setHeaders(res, p) {
        Object.keys(configCache).forEach((i: any) => {
          if (configCache[i].lookup === mime.getType(p)) {
            res.setHeader("Cache-Control", `max-age=${configCache[i].maxAge}`);
          }
        });
      },
    };
    return process.env.NODE_ENV === "production" ? options : {};
  };

  app.use((err: Error, _: any, res: any, next: any) => {
    if (err) {
      loggers.app.error(err);
      res.status(500).send("Something Errors broke!");
    } else {
      next();
    }
  });
  app.disable("x-powered-by");
  app.use(cookieParser()); // cookie-parser
  app.use(compression()); // gzip
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(express.static(path.join(publicDir), getStaticOptions()));

  if (process.env.LOCAL_RUN_ENV) {
    let prefix = "stagem";
    if (process.env.LOCAL_RUN_ENV === "qa2") {
      prefix = "testm";
    }
    if (process.env.LOCAL_RUN_ENV === "production") {
      prefix = "m";
    }

    const host = `${prefix}.sephora.cn`;
    // const host = `localhost:60011`;

    try {
      app.use(
        "/api/SOA",
        proxy(host, {
          https: false,
          proxyReqPathResolver: (req) => {
            return `/api/SOA${req.url}`;
          },
          proxyReqOptDecorator: function (proxyReqOpts) {
            if (proxyReqOpts.headers) {
              proxyReqOpts.headers["content-type"] =
                "application/json; charset=utf-8";
            }

            return proxyReqOpts;
          },

          userResDecorator: function (
            proxyRes,
            proxyResData
            // userReq
            // userRes
          ) {
            const data = proxyResData.toString("utf8");
            return data;
          },
          proxyErrorHandler: function (err, res, next) {
            console.log(err, 12222);

            next(err);
          },
        })
      );
    } catch (error) {
      console.log(error, "error");
    }
  } else {
    app.use(/^\/api/, api);
  }

  render(app);
};

setup(app);
if (process.env.LOCAL_RUN_ENV) {
  let port=Number(process.env.NODE_PORT) || 60018
  // portfinder.basePort = Number(process.env.NODE_PORT) || 60018;
  // console.log(33234);
  // portfinder.getPort((err: any, port: number) => {
  //   if (err) {
  //     console.error(err);
  //   }
    app.listen(port, () => {
      console.info(
        `==> �  Listening on port ${port} . Open up http://localhost:${port}/ in your browser.`
      );
    });
  // });
} else {
  app.listen(app.get("port"), () => {
    console.info(
      `==> �  Listening on port ${app.get(
        "port"
      )} . Open up http://localhost:${app.get("port")}/ in your browser.`
    );
  });
}
