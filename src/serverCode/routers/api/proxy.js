import "isomorphic-fetch";
import express from "express";
import DtoController from "../../controllers/DtoController";
import StaticController from "../../controllers/StaticController";
import CcController from "../../controllers/CcController";

const router = express.Router();

// Ajax -- es6-promise
require("es6-promise").polyfill();

router.get("/:ui", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");

  const { params, query } = req;

  const { quality = 20, videoid, url } = query;

  const ui = params.ui;

  const staticController = new StaticController({ req, res });
  const dtoController = new DtoController({ req, res });
  const ccController = new CcController({ quality, req, res });

  switch (ui) {
    case "getVideo":
      ccController
        .getCCVideoInfoSimplePromise(videoid, req)
        //   .then((results) => dtoController.getSuccess(results))
        .then((results) => dtoController.getSuccess(results))
        .catch((error) => dtoController.getError({ error }));
      break;
    case "getProductJson":
      staticController
        .getProductJson(url)
        .then((json) => {
          return ccController
            .getCCVideoInfoPromise(json)
            .then((results) => dtoController.getSuccess(results))
            .catch((error) => dtoController.getError({ error }));
        })
        .catch((error) => dtoController.getError({ error }));
      break;
    case "getProductJson2":
      staticController
        .getProductJson(url)
        .then((json) => {
          if (json.version != "v1") {
            return dtoController.getErrorCDN({ e: "version is no match." });
          }
          return ccController
            .getCCVideoInfoPromiseAll(json.data)
            .then((results) => dtoController.getSuccess(results))
            .catch((error) => dtoController.getErrorCDN({ error }));
        })
        .catch((error) => dtoController.getErrorCDN({ error }));
      // return dtoController.getSuccess({ a: 1 })
      break;
    default:
      const defaultError = {
        status: 1,
        message: "API",
      };
      return dtoController.getError({ defaultError });
  }
});


export default router;
