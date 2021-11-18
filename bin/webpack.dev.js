const path = require('path');

const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, '../src/demo.js'),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Date picker',
      template: path.resolve(__dirname, '../src/index.html'),
      filename: 'index.html',
    }),
  ],
});
