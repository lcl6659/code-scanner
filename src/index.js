const fs = require('fs')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const util = require('./lib/util')
const baseWebpackConfig = require('@vue/cli-service/webpack.config')
const mergeWebpackConfig = require('./config/merge.webpack.config')
const WebpackRunDonePlugin = require('./webpackPlugins/webpackRunDonePlugin')
const ChunkSizePlugin = require('./webpackPlugins/chunkSizePlugin')
const createLog = require('./lib/createLog')

const webpackConfig = merge(baseWebpackConfig, mergeWebpackConfig)

class CodeScanner {
  run (basePath) {

    global.basePath = basePath

    // 删除babel缓存
    const babelLoaderCachePath = `${basePath}/node_modules/.cache/babel-loader`
    if (fs.existsSync(babelLoaderCachePath)) {
      util.removeDir(babelLoaderCachePath)
    }

    // 创建扫描日志目录
    createLog.createDir(basePath)

    const compiler = webpack(webpackConfig)
    
    new WebpackRunDonePlugin({
      basePath: basePath,
      buildOutPath: webpackConfig.output.path // 打包后的输出文件夹 /Users/jlgl/Documents/workSpace/code-scanner/example/build/share
    }).apply(compiler)

    new ChunkSizePlugin({
      filename: `chunkSize.js`,
      basePath: basePath
    }).apply(compiler)

    compiler.run((err, stats) => { // [Stats Object](#stats-object)
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      console.log(stats.toString({
        chunks: false,  // 使构建过程更静默无输出
        colors: true    // 在控制台展示颜色
      }))
    })
  }
}

module.exports = new CodeScanner()