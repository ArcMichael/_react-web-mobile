const fs = require("fs-extra");
const path = require("path");

fs.ensureDirSync(path.resolve("dist"));
fs.ensureDirSync(path.resolve("dist/dist"));

fs.copySync(
  path.resolve("src/public/images"),
  path.resolve("dist/dist/images")
);
