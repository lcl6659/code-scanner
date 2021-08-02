const path = require('./package.json').path
const ip = require('ip').address()
const port = process.env.PORT || '8080'
let DEVCONFIG = {}
if (process.env.HTTPS) {
  DEVCONFIG = {
    sockHost: `${ip}:${port}`,
    port,
    https: true,
  }
}
const sentryPlugin = require('./sentryPlugin')
const plugins = sentryPlugin({
  env: process.env.VUE_APP_ENV, // 本地情况启动时，有些项目是 local，该值不支持
  repo: 'h5 / leads / store', // 需要在 sentry 做设置，见附录2
  urlPrefix: '~/store/share/js', // 打包后js文件的访问目录前缀
})
// const performance = {
//   hints: 'warning', // 枚举    maxAssetSize: 200000, // 整数类型（以字节为单位）
//   //入口起点的最大体积 整数类型（以字节为单位）
//   maxEntrypointSize: 50000000,
//   //生成文件的最大体积 整数类型（以字节为单位 300k）
//   maxAssetSize: 30000000,
//   assetFilter: function (assetFilename) {
//     // 提供资源文件名的断言函数
//     return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
//   },
// }
module.exports = {
  publicPath: process.env.VUE_APP_ENV !== 'local' ? path : '/',
  outputDir: 'build/share',
  lintOnSave: true,
  devServer: {
    ...DEVCONFIG,
    disableHostCheck: true,
  },
  configureWebpack: (config) => {
    if (['production'].includes(process.env.VUE_APP_ENV)) {
      config.devtool = 'hidden-source-map'
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
    // config.performance = performance
    config.externals = {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      axios: 'axios',
    }
    config.plugins.push(...plugins)
  },
}
