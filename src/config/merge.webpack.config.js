const customPlugin = require('../babelPlugins/customPlugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [customPlugin],
            cacheDirectory: false,
            cacheCompression: false
          }
        }
      }
    ]
  }
 }