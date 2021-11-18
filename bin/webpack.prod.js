const path = require('path');

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, '../src/index.js'),
  },
  optimization: {
    minimize: true,
  },
});
