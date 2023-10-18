const { sync } = require("cross-spawn");
const path = require("path");
const fs = require("fs");

const checkHusky = () => {
  const isExists2 = fs.existsSync(path.resolve(".husky/_"));
  const isExists3 = fs.existsSync(path.resolve(".husky/_/husky.sh"));
  const isExists = isExists2 && isExists3;
  if (!isExists) {
    sync("yarn", ["husky", "install"], {
      stdio: "inherit",
    });
  }
};
checkHusky();
