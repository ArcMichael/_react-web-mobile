const { spawn } = require("cross-spawn");
const path = require("path");

let buildProcess = null;

class DevelopmentPlugin {
  // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
  apply(compiler) {
    compiler.hooks.done.tap("DevelopmentPlugin", () => {
      if (!buildProcess) {
        buildProcess = spawn("node", [path.resolve("dist/server/server.bundle.js")], {
          stdio: "inherit",
          env: {
            ...process.env,
          },
        });
      }
    });
  }
}

process.on("SIGINT", () => {
  if (buildProcess) buildProcess.kill("SIGHUP");
  process.abort();
});

module.exports = DevelopmentPlugin;
