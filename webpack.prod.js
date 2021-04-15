const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    assetModuleFilename: 'images/[name][hash][ext][query]',
    clean: true
  },
  plugins: [new MiniCssExtractPlugin({filename: '[name].[contenthash].css'}), new HtmlWebpackPlugin({template: './src/template.html', minify: {removeAttributeQuotes: true, collapseWhitespace: true, removeComments: true}})],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ]
      }
    ]
  }
});