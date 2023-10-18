import "isomorphic-fetch";
import express from "express";
import qr_image from "qr-image";

const router = express.Router();

// Ajax -- es6-promise
require("es6-promise").polyfill();

router.get("/:ui", function (req, res) {
  const { params, query } = req;

  const ui = params.ui;

  switch (ui) {
    case "getQRCode":
      res.type("png");
      qr_image.image(query.url).pipe(res);
      break;

    default:

      break;
  }
});



export default router;
