const fs = require('fs')

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

module.exports = {
  removeDir: removeDir,
  findJsAndMap: findJsAndMap
}

