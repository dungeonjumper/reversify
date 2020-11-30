const path = require('path');

module.exports = {
  entry: [
    './src/site.js',
    './src/style.scss'
  ],
  output: {
    filename: 'js/site.bundle.js',
    path: path.resolve(__dirname, './docs'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'css/', name: '[name].min.css'}
          },
          'sass-loader'
        ],
      }
    ]
  }
};
