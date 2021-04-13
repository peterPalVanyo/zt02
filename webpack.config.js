const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
      contentBase: path.join(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  }
};