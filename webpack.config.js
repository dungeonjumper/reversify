const path = require('path');

module.exports = {
  entry: './src/site.js',
  output: {
    filename: 'site.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
