const createLog = require('../lib/createLog')

module.exports = function (babel) {
  console.log('********************：babel插件开始执行*******************')
  var logs = '['
  const t = babel.types
  return {
    name: 'custom-babel-plugin',
    visitor: {
      CallExpression(path, state) {
        const obj = path.node.callee.object
        const prop = path.node.callee.property
        // const arguments = path.node.arguments
        if (t.isIdentifier(obj) && t.isIdentifier(prop) && obj.name === 'console' && prop.name === 'log') {
          const location = `---trace: line ${path.node.loc.start.line}, column ${path.node.loc.start.column}, ${state.filename}---`;
          // arguments.push(t.stringLiteral(location))
          console.log(location)
          console.log('********************写入日志文件*******************')

          logs = logs + '\n' + JSON.stringify({
            line: path.node.loc.start.line,
            column:path.node.loc.start.column, 
            state: state.filename
          }) + ','
          createLog.stringWriteToJsFile(logs + '\n]', global.basePath)
        }
      }
    }
  }
}
