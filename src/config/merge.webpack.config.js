const customPlugin = require('../babelPlugins/customPlugin')
const variousPlugin = require('../babelPlugins/various.customPlg')

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
            plugins: [customPlugin, variousPlugin],
            cacheDirectory: false,
            cacheCompression: false
          }
        }
      }
    ]
  }
 }