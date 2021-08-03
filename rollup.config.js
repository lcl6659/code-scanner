import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'

const exportSdknName = 'codeScanner' // 全局变量名称

module.exports = [
  {
    input: 'src/index.js',
    output: {
      file: `lib/index.js`,
      format: "cjs",
      name: exportSdknName // 全局变量名称
    },
    plugins: [
      resolve(), 
      commonjs(),
      json(),
      babel({ babelHelpers: 'bundled' })
    ],
    external: ['webpack', '@vue/cli-service/webpack.config', 'fs', 'path', '@babel/core', '@babel/parser', '@babel/traverse', '@babel/types', 'source-map']
  },
  {
    input: 'src/index.js',
    output: {
      file: `example/codeScanner/index.js`,
      format: "cjs",
      name: exportSdknName // 全局变量名称
    },
    plugins: [
      resolve(), 
      commonjs(),
      json(),
      babel({ babelHelpers: 'bundled' })
    ],
    external: ['webpack', '@vue/cli-service/webpack.config', 'fs', 'path', '@babel/core', '@babel/parser', '@babel/traverse', '@babel/types', 'source-map']
  }
]