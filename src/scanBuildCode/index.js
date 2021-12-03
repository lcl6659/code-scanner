const parser = require('@babel/parser')
const traverse = require('@babel/traverse') // 因为 @babel/parser 等包都是通过 es module 导出的，所以通过 commonjs 的方式引入有的时候要取 default 属性
const types = require('@babel/types')
const fs = require('fs')
const util = require('../lib/util')


class BabelSanner {
  constructor (data) {
    this.buildOutPath = data.buildOutPath
  }

  // 运行扫描
  run () {

    console.log("-------开始执行扫描打包后的js-------")

    const fileObj = util.findJsAndMap(this.buildOutPath, {
      jsObj: {},
      mapObj: {}
    })

    const jsNames = Object.keys(fileObj.jsObj)

    jsNames.forEach(jsName => {
      const jsPath = fileObj.jsObj[jsName]
      const jsMapPath = fileObj.mapObj[jsName + '.map']
      this.parseAndTraverseJsFile(jsPath, jsMapPath)
    })
    // console.log(JSON.stringify(fileObj))
  }

  // 解析js文件
  parseAndTraverseJsFile (jsPath, jsMapPath) {
    console.log('----解析js文件---')
    const sourceCode = fs.readFileSync(jsPath, {
      encoding: 'utf-8'
    })

    const sourceMapCode = fs.readFileSync(jsMapPath, {
      encoding: 'utf-8'
    })

    // 第一步：生成AST
    const ast = parser.parse(sourceCode, {
      sourceType: 'unambiguous' // 根据内容是否有 import 和 export 来确定是否解析 es module 语法
    })

    // console.log(ast.program.body)

    // 第二步：遍历 AST
    traverse(ast, {
      CallExpression(path, state) {
        const obj = path.node.callee.object
        const prop = path.node.callee.property
        // const arguments = path.node.arguments
        if (types.isIdentifier(obj) && types.isIdentifier(prop) && obj.name === 'console' && prop.name === 'log') {
          // arguments.push(t.stringLiteral(location))
          util.getBuildCodeLocationInSourceCode(sourceMapCode, path.node.loc.start.line, path.node.loc.start.column, (originCodeInfo) => {
            const location = `---out: line ${path.node.loc.start.line}, column ${path.node.loc.start.column}, ${jsPath}---`;
            console.log(location)
            console.log('---originCodeInfo---:', JSON.stringify(originCodeInfo))
            console.log('**************************************')
          })
        }
      }
    })

    
  }

}

module.exports = BabelSanner
