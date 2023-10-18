const fs = require("fs-extra");
const path = require("path");

const tmpConfig = path.resolve("dist/.webpack.config.js");

const getConfigFile = () => {
  fs.ensureDirSync(path.resolve("dist"));
  fs.copyFileSync(
    path.resolve("webpack/before.start.js"),
    path.resolve("dist/before.start.js")
  );
  let config = fs.readFileSync(
    path.resolve("webpack/webpack.development.config.js"),
    "utf-8"
  );
  // config = config.replace(/export\s+default.*/, "module.exports = configs");
  fs.writeFileSync(tmpConfig, config);
};

getConfigFile();
