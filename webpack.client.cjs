const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.cjs");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  mode: "development",
  entry: ["./client/index.js"],

  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/bootup.html",
      filename: "bootup.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contentHash].css",
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
  ],
  optimization: {
    minimize: process.env.NODE_ENV === "production" ? true : false,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },

      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          // Creates `style` nodes from JS strings
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              // url: false,
            },
          },

          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },

  output: {
    filename: "[name].[contentHash].js",
    path: path.resolve(__dirname, "dist"),
  },
};

mergedConfigs = merge(baseConfig, config);

module.exports = mergedConfigs;
