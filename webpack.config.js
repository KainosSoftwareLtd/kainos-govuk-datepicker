const path = require('path');

module.exports = {
  entry: ['./src/index.js', './src/js/index.js'],
  output: {
    filename: 'bundle.js',
  },
};