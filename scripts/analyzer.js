const { spawn } = require("cross-spawn");
const fs = require("fs-extra");
const path = require("path");

/** @type {import('child_process').ChildProcess} - description */
let ChildProcess2 = null;

const tmpConfig = path.resolve("dist/.webpack.config.js");

const getConfigFile = () => {
  fs.copyFileSync(
    "webpack/before.start.js",
    path.resolve("dist/before.start.js")
  );
  let config = fs.readFileSync(
    path.resolve("webpack/webpack.development.config.js"),
    "utf-8"
  );
  config = config.replace("export default configs", "module.exports = configs");
  fs.writeFileSync(tmpConfig, config);
};

const analyzer = () => {
  ChildProcess2 = spawn("yarn", ["webpack", "--progress", "-c", tmpConfig], {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });
  const handleError = () => {
    process.exit(1);
  };
  ChildProcess2.on("error", handleError);
};

const analyzerStats = () => {
  ChildProcess2 = spawn(
    "yarn",
    ["webpack", "--progress", "--stats=detailed", "--json", "-c", tmpConfig],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
      },
    }
  );
  const handleError = () => {
    process.exit(1);
  };
  ChildProcess2.on("error", handleError);
};

(async () => {
  getConfigFile();
if (process.env.WEBPACK_STATS) {
  analyzerStats();
}else{
  analyzer();
}
})();
