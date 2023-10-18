const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DevelopmentPlugin = require("./development-plugin");

const getCurrentDate = () => {
  const CurrentDate = new Date();
  return `${CurrentDate.getFullYear()}-${
    CurrentDate.getMonth() + 1
  }-${CurrentDate.getDate()} ${CurrentDate.getHours()}:${CurrentDate.getMinutes()}:${CurrentDate.getSeconds()}`;
};

const __BUILD_TIME__ = getCurrentDate();

console.log(`Build Time: ${__BUILD_TIME__}`);

const isDevelopment = process.env.NODE_ENV !== "production";

/** @type {import('webpack').Configuration} - description */
module.exports = {
  entry: path.resolve("src/serverCode/server.ts"),
  mode: !isDevelopment ? "production" : "development",
  output: {
    path: path.resolve("dist/server"),
    filename: "server.bundle.js",
    publicPath: "/",
  },
  stats: "minimal",
  target: "node",
  resolve: {
    alias: {
      /**
       * 跟jsconfig.json中的path解析保持一直
       */
      "@": path.resolve("src/common"),
      isomorphisms: path.resolve("src/isomorphisms"),
      serverCode: path.resolve("src/serverCode"),
    },
    extensions: [".jsx", ".js", ".json", ".ts", ".tsx", ".sass", ".scss"],
  },
  // keep node_module paths out of the bundle
  externals: [nodeExternals(), "@loadable/component"],

  node: {
    __filename: false,
    __dirname: false,
  },

  plugins: [
    isDevelopment && new DevelopmentPlugin(),
    // new LoadablePlugin(),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      __BUILD_TIME__: JSON.stringify(__BUILD_TIME__),
    }),
  ].filter((item) => Boolean(item)),
  module: {
    rules: [
      // styleLoader,
      {
        test: /\.scss$/,
        loader: "null-loader",
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            caller: { target: "node" },
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            caller: { target: "node" },
          },
        },
      },
    ],
  },
};
