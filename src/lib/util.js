const fs = require('fs')
const { SourceMapConsumer } = require('source-map')

// 删除目录
function removeDir (path) {
  try {
    fs.accessSync(path)
    var files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path +"/" + file;
      if (fs.statSync(curPath).isDirectory()) {// recurse
        removeDir(curPath)
      }else {// delete file
        fs.unlinkSync(curPath,function (err) {
          if (err)throw err
        })
      }
    })
    fs.rmdirSync(path)
  } catch (error) {
    console.log(error)
  }
}

// 找出js文件及其对应的map文件
function findJsAndMap (path, fileObj = {}) {
  try {
    fs.accessSync(path)
    var files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path +"/" + file;
      if (fs.statSync(curPath).isDirectory()) { // 文件夹
        fileObj = findJsAndMap(curPath, fileObj)
      } else { // 文件
        if (file.endsWith('.js')) {
          fileObj.jsObj[file] = curPath
        }
        if (file.endsWith('.map')) {
          fileObj.mapObj[file] = curPath
        }
      }
    })
    return fileObj
  } catch (error) {
    console.log(error)
  }
}

// 找到打包后的代码在源码中的位置
function getBuildCodeLocationInSourceCode (sourceMapCode, line, column, cb) {
  SourceMapConsumer.with(sourceMapCode, null, consumer => {
    // 目标代码位置查询源码位置
    const p = consumer.originalPositionFor({
     line: line,
     column: column
    })
    // p的格式:  {"source":"webpack:///node_modules/components/lib/InsideLogin/index.js","line":8462,"column":0,"name":null}
    //          {"source":"webpack:///src/pages/GeneralPage/GeneralAddress/index.vue","line":155,"column":0,"name":null}
    cb && cb(p)
  })
}

module.exports = {
  removeDir: removeDir,
  findJsAndMap: findJsAndMap,
  getBuildCodeLocationInSourceCode: getBuildCodeLocationInSourceCode
}

