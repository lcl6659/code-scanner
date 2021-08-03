const createLog = require('../lib/createLog')

module.exports = function (babel) {
  console.log('@@@@@@@@@: babel 插件开始执行, 测试 xxx.xxx.xxx @@@@@@@@')
  var logs = '['
  const t = babel.types
  return {
    name: 'various-custom-plugin',
    visitor: {
      MemberExpression(path, state) {

        let num = 0
        function checkIsMemberExpression (obj, prop) {
          if (t.isMemberExpression(obj)) {
            num++
            checkIsMemberExpression(obj.object)
          }
        }

        if (t.isMemberExpression(path.node)) {
          checkIsMemberExpression(path.node.object, path.node.property)
        }


        if (num > 1) {
          let line = path.node.loc ? path.node.loc.start.line : ''
          let column = path.node.loc ? path.node.loc.start.column : ''
          if (!line || !column) {
            return
          }
          /* const location = `---trace: line ${line}, column ${column}, ${state.filename}---`;
          console.log(location)
          console.log('********************写入日志文件*******************') */
          logs = logs + '\n' + JSON.stringify({
            line: line,
            column: column,
            state: state.filename
          }) + ','
          createLog.stringWriteToJsFile(logs + '\n]', global.basePath)
        }
      }
    }
  }
}
