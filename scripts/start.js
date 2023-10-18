const { spawn } = require("cross-spawn");
const path = require("path");
const clear = require("./clear");

/** @type {import('child_process').ChildProcess | null} - description */
let ChildProcess1 = null;

const checkNodeVersion = () => {
  const nodeVersion = process.version;
  const matchVersion = nodeVersion.match(/v(\d+)\.\d+\.\d/);
  if (Number(matchVersion[1]) >= 12) {
    return true;
  }
  throw new Error("Please use node >= 12.0.0");
};

const start = () => {
  ChildProcess1 = spawn(
    "yarn",
    [
      "webpack",
      "--progress",
      "-c",
      path.resolve("webpack/webpack.server.config.js"),
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
      },
    }
  );
};

process.on("SIGINT", () => {
  if (ChildProcess1) ChildProcess1.kill("SIGHUP");
  process.abort();
});

(async () => {
  if (checkNodeVersion()) {
    await clear();
    start();
  }
})();
