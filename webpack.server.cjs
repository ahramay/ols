const path = require("path");
const webpackNodeExternals = require("webpack-node-externals");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.cjs");

const config = {
  target: "node",
  mode: "development",
  entry: "./app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  externals: [webpackNodeExternals()],
  module: {
    rules: [{ test: /\.(scss|css)$/, loader: "ignore-loader" }],
  },
};

let mergedConfigs = merge(baseConfig, config);

module.exports = mergedConfigs;
