function isWebTarget(caller) {
  return Boolean(caller && caller.target === "web");
}

function isWebpack(caller) {
  return Boolean(caller && caller.name === "babel-loader");
}

module.exports = (api) => {
  const web = api.caller(isWebTarget);
  const webpack = api.caller(isWebpack);
  const isDevelopment = process.env.NODE_ENV !== "production";

  return {
    presets: [
      "@babel/preset-typescript",
      [
        "@babel/preset-env",
        {
          useBuiltIns: web ? "entry" : undefined,
          corejs: web ? "core-js@3" : false,
          targets: !web ? { node: "current" } : "cover 99.8%",
          modules: webpack ? false : "commonjs",
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [
      isDevelopment && web && require.resolve("react-refresh/babel"),
      "@babel/plugin-syntax-dynamic-import",
      "@loadable/babel-plugin",
      "@babel/plugin-proposal-class-properties",
    ].filter(Boolean),
  };
};
