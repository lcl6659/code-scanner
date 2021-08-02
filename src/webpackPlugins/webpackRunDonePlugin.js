const BabelSanner = require('../scanBuildCode/index')

const pluginName = 'webpackRunDonePlugin'
class WebpackRunDonePlugin {
  constructor({basePath, buildOutPath}){
    // 传入的参数挂载在这个类的实例上.
    this.basePath = basePath
    this.buildOutPath = buildOutPath
  }
  apply(compiler) {

    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('********************myTestWebpackPlugins 构建过程开始！********************');
    })

    compiler.hooks.done.tap(pluginName, (stats) => {
      console.log('********************myTestWebpackPlugins 构建结束！********************')
      setTimeout(() => {
        const bs = new BabelSanner({
          buildOutPath: this.buildOutPath
        })
        bs.run()
      }, 3000)
    })
  }
}

module.exports = WebpackRunDonePlugin;
