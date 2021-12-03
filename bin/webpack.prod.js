const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, '../src/index.js'),
  },
  output: {
    library: 'datepicker', // The name of the global variable the library is set to.
    libraryExport: 'default',
    libraryTarget: 'umd', // "Universal" export - Node, browser, amd, etc.
    filename: 'datepicker.min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 5,
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
});
