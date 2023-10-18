require("./before.start");
const path = require("path");
const webpack = require("webpack");
const pxtorem = require("postcss-pxtorem");
const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const LoadablePlugin = require("@loadable/webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const Webpackbar = require("webpackbar");
const ESLintPlugin = require("eslint-webpack-plugin");
// const babelrc = require("../.babelrc");

if (!process.env.WEBPACK_STATS) {
  console.log(`node versions :${process.version}`);
}
console.log(
  process.env.ANALYZER,
  process.env.NODE_ENV,
  process.env.WEBPACK_STATS,
  11111
);
const babel = require.resolve("babel-loader");
const isDevelopment = process.env.NODE_ENV !== "production";

/**
 *
 * @param {'web' | 'node'} target
 * @returns
 */
const getConfig = (target) => {
  const isWeb = target === "web";

  const styleLoader = {
    test: /\.scss$/,
    use: isWeb
      ? [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  pxtorem({
                    propList: ["*"],
                    rootValue: 100,
                    minPixelValue: 1,
                    unitPrecision: 2,
                  }),
                ],
              },
            },
          },
          { loader: "sass-loader" },
        ]
      : "null-loader",
  };

  const babelLoader = {
    loader: babel,
    options: {
      cacheDirectory: true,
      caller: { target },
    },
  };

  /** @type {import('webpack').Configuration} - description */
  const configs = {
    target,
    name: target,
    entry:
      target === "node"
        ? path.resolve(`src/common/main-${target}.tsx`)
        : [
            isDevelopment &&
              "webpack-hot-middleware/client?name=web&autoConnect=true&reload=true",
            path.resolve(`src/common/main-${target}.tsx`),
          ].filter((item) => Boolean(item)),
    devtool: process.env.RUN_ENV !== "production" ? "source-map" : "none",
    cache: isDevelopment,
    mode: isDevelopment ? "development" : "production",
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
    output: {
      path: path.resolve(`dist/dist/${target}`),
      filename: isDevelopment ? "[name].js" : "[name].[contenthash].js",
      chunkFilename: isDevelopment
        ? "chunk.[name].js"
        : "chunk.[name].[contenthash].[id].js",
      publicPath: `/dist/${target}/`,
      libraryTarget: target === "node" ? "commonjs2" : undefined,
    },
    profile: Boolean(process.env.WEBPACK_STATS),
    optimization: {
      runtimeChunk: target !== "node",
      splitChunks: {
        chunks: "all",
      },
      minimizer: isDevelopment
        ? undefined
        : [
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                },
              },
            }),
          ],
    },
    stats: "none",
    plugins: [
      process.env.ANALYZER && new BundleAnalyzerPlugin(),
      new Webpackbar({
        name: isWeb ? "Client" : "Server",
        color: target === "node" ? "blue" : "green",
      }),
      isDevelopment &&
        target === "web" &&
        new ESLintPlugin({
          exclude: "node_modules",
          extensions: [".js", ".ts", ".tsx"],
          threads: true,
          outputReport: true,
          failOnError: false,
          emitWarning: false,
        }),
      isDevelopment &&
        isWeb &&
        new ReactRefreshWebpackPlugin({
          overlay: {
            sockIntegration: "whm",
          },
        }),
      isDevelopment && isWeb && new webpack.HotModuleReplacementPlugin(),
      new LoadablePlugin(),
      new MiniCssExtractPlugin(
        isDevelopment
          ? {}
          : {
              filename: "[name].[contenthash].css",
              chunkFilename: "chunk.[name].[contenthash].[id].css",
            }
      ),
      new webpack.DefinePlugin({
        __DEV__: true,
      }),
    ].filter((item) => Boolean(item)),
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: babelLoader,
            },
            {
              test: /\.tsx?$/,
              exclude: /node_modules/,
              use: babelLoader,
            },

            {
              test: /\.(png|jpg|gif)$/,
              use: "file-loader?name=images/[name].[ext]",
            },
            {
              test: /\.(eot|svg|ttf|woff)\??.*$/,
              use: "file-loader?name=fonts/[name].[ext]",
            },
            styleLoader,
          ],
        },
      ],
    },
  };

  configs.externals =
    target === "web" ? undefined : ["@loadable/component", nodeExternals()];

  return configs;
};

module.exports = [getConfig("node"), getConfig("web")];
