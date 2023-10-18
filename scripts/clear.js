const { sync } = require("cross-spawn");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const clear = async () => {
  fs.ensureDirSync(path.resolve("dist"));
  const isOnline = process.env.NODE_ENV === "production";

  const react = fs.readFileSync(
    path.resolve(
      __dirname,
      `../node_modules/react/umd/${
        isOnline ? "react.production.min.js" : "react.development.js"
      }`
    ),
    "utf-8"
  );
  const reactDom = fs.readFileSync(
    path.resolve(
      __dirname,
      `../node_modules/react-dom/umd/${
        isOnline ? "react-dom.production.min.js" : "react-dom.development.js"
      }`
    ),
    "utf-8"
  );
  const jquery = fs.readFileSync(
    path.resolve(
      __dirname,
      `../src/public/CDN/jquery/3.4.1/${
        isOnline ? "jquery-3.4.1.min.js" : "jquery-3.4.1.js"
      }`
    ),
    "utf-8"
  );
  fs.copySync(path.resolve("src/public/CDN"), path.resolve("dist/dist/CDN"));
  fs.writeFileSync(
    path.resolve(
      `dist/dist/CDN/dll.${isOnline ? "production.min" : "development"}.js`
    ),
    `${react}; \n ${reactDom}; \n ${jquery}`
  );
};

module.exports = clear;
