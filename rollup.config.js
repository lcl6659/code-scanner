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
      format: "umd",
      sourcemap: true,
      name: exportSdknName, // 全局变量名称
      globals: { // 这跟external 是配套使用的，确定外部引入的全局变量名称
        'webpack': 'webpack',
        'fs': 'fs',
        'path': 'path',
        'source-map': 'sourceMap',
        '@vue/cli-service/webpack.config': 'baseWebpackConfig',
        '@babel/parser': 'babelParser',
        '@babel/traverse': 'babelTraverse',
        '@babel/types': 'babelTypes'
      }
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
      format: "umd",
      sourcemap: true,
      name: exportSdknName, // 全局变量名称
      globals: {
        'webpack': 'webpack',
        'fs': 'fs',
        'path': 'path',
        'source-map': 'sourceMap',
        '@vue/cli-service/webpack.config': 'baseWebpackConfig',
        '@babel/parser': 'babelParser',
        '@babel/traverse': 'babelTraverse',
        '@babel/types': 'babelTypes'
      }
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