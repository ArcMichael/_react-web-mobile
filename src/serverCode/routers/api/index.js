import "isomorphic-fetch";
import express from "express";
import getConfigs from "isomorphisms/getConfigs";
import { GetFetch } from "../../../common/lib/Tools";
import change from "./change";
import proxy from "./proxy";

const router = express.Router();

const configs = getConfigs();

require("es6-promise").polyfill();

let key = "1";

router.post("/healthCheckControl", function (req, res) {
  const { body } = req;
  if (!body.disable) return res.send("Missing parameter");
  if (body.disable === "0" || body.disable === "1") {
    key = body.disable;
    return res.send("Disable Health Check = " + key);
  } else {
    return res.send("Failed parameter");
  }
});

router.get("/healthCheck", function (req, res) {
  if (key === "1") {
    return res.status(200).send("Health");
  } else if (key === "0") {
    return res.status(404).send("Offline");
  }
});

router.get("/", function (req, res) {
  res.send("obligate api");
});

router.post("/", function (req, res) {
  res.send("obligate api");
});

router.use("/SOA/change", change);
router.use("/v2/SOA/proxy", proxy);

router.post("/SOA/:ui/", function (req, res) {
  const { params, body } = req;

  const ui = params.ui;

  switch (ui) {
    case "socialLogin":
      GetFetch(
        req,
        res,
        `${configs.nodeServer}/v1/myaccount/user/socialLogin`,
        {
          method: "POST",
          headers: {
            channel: "WEB",
          },
          body: JSON.stringify(body),
          timeout: 20000,
        },
        function (data) {
          if (data.status === 1) {
            res.status(404).send(data.results);
          } else {
            if (data && data.status === 0 && !data.results.results.error) {
              res.cookie("Token", data.results.results.token, {
                domain: ".sephora.cn",
              });
              res.cookie("UID", data.results.results.id);
              res.cookie("retention_info_count", "1");
            }
            res.status(200).send(data.results);
          }
        }
      );
      break;
    default:

      break;
  }
});



export default router;
