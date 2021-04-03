const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devServer: {
      contentBase: './dist'
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};