/**
 * 输出打包之后文件大小
 */
 const createLog = require('../lib/createLog')

class ChunkSizePlugin{

  constructor({filename, basePath}){
      // 传入的参数挂载在这个类的实例上.
      this.filename = filename
      this.basePath = basePath
  }

  apply(compiler){
      compiler.hooks.emit.tap('chunkSizePlugin', (compilation)=>{
        // compilation 是webpack 工作流中抛出来的内容，很多东西在这里，要修改工作流就修改这个即可
        let assets = compilation.assets;
        let content = []
        // 遍历打包之后的文件列表
        Object.entries(assets).forEach(([filename,  stateObj])=>{
          content.push({
            filename: filename,
            size: stateObj.size()
          })
        })

        createLog.objWriteToJsFile(content, this.basePath, this.filename)

        // 每个文件都有 source (该文件内容) 和 size 该文件大小
        // assets[this.filename] = {
        //     source(){
        //       return `var chunksSize = ${JSON.stringify(content)}`
        //     },
        //     size(){
        //       return content.length
        //     }
        // }
      })
  }
}

module.exports = ChunkSizePlugin