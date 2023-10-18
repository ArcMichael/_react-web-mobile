const { spawn } = require("cross-spawn");
const path = require("path");
const clear = require("./clear");
// const getConfigFile = require("./getConfigFile");

/** @type {import('child_process').ChildProcess} - description */
let ChildProcess1 = null;
/** @type {import('child_process').ChildProcess} - description */
let ChildProcess2 = null;

const tmpConfig = path.resolve("dist/.webpack.config.js");

const build = () => {
  ChildProcess1 = spawn(
    "yarn",
    ["webpack", "-c", path.resolve("webpack/webpack.server.config.js")],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
      },
    }
  );
  ChildProcess2 = spawn("yarn", ["webpack", "-c", tmpConfig], {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });

  const handleError = (code) => {
    if (code !== 0) {
      process.exit(code);
    }
  };

  ChildProcess1.on("exit", handleError);
  ChildProcess2.on("exit", handleError);
};

(async () => {
  await clear();
  build();
})();
