/**
 * Business logic configure
 */
import PACKAGE from '../../package.json'
const MAP = {
  local: {
    api: 'https://dev.jiliguala.com',
    appid: 'wx6c71f742d227450e', // 「推广人」  服务号 后端个人测试号
    guaAppid: 'wxf78b28c6562d3c56', // 「叽里呱啦」 服务号 后端个人测试号
    shareAppid: 'wx0657a7ec538357ac', // 呱呱爱分享
    vipAppid: 'wx2dc64fe9107b1a39', // 叽里呱啦VIP
    amplitudeid: '2c75a19efe342690f381a32a65d7e017',
    payAppid: 'wxd388f6f520772446',
    dyClientKey: 'awbjrl7m472s0pmo',
  },
  development: {
    api: 'https://dev.jiliguala.com',
    appid: 'wx6c71f742d227450e', // 「推广人」服务号 后端个人测试号
    guaAppid: 'wxf78b28c6562d3c56', // 「叽里呱啦」服务号 后端个人测试号
    shareAppid: 'wx0657a7ec538357ac', // 呱呱爱分享
    vipAppid: 'wx2dc64fe9107b1a39', // 叽里呱啦VIP
    amplitudeid: '2c75a19efe342690f381a32a65d7e017',
    payAppid: 'wxd388f6f520772446',
    dyClientKey: 'awbjrl7m472s0pmo',
  },
  fat: {
    api: 'https://fat.jiliguala.com',
    appid: 'wx6c71f742d227450e', // 「推广人」服务号 后端个人测试号
    guaAppid: 'wxf78b28c6562d3c56', // 「叽里呱啦」服务号 后端个人测试号
    shareAppid: 'wx0657a7ec538357ac', // 呱呱爱分享
    vipAppid: 'wx2dc64fe9107b1a39', // 叽里呱啦VIP
    amplitudeid: '2c75a19efe342690f381a32a65d7e017',
    payAppid: 'wxd388f6f520772446',
    dyClientKey: 'awbjrl7m472s0pmo',
  },
  prerelease: {
    api: 'https://rc.jiliguala.com',
    appid: 'wxb8e36d86dc978db5', // 「推广人」服务号 appId
    guaAppid: 'wxd388f6f520772446', // 「叽里呱啦」服务号 appId
    shareAppid: 'wxce838a8667312c20', // 呱呱爱分享
    vipAppid: 'wx985fa68220e79b07', // 叽里呱啦VIP
    amplitudeid: '3d9e4b23a1ebef22aa336f5e3fd50199',
    payAppid: 'wxd388f6f520772446',
    dyClientKey: 'awbjrl7m472s0pmo',
  },
  production: {
    api: 'https://jiliguala.com',
    appid: 'wxb8e36d86dc978db5', // 「推广人」服务号 appId
    guaAppid: 'wxd388f6f520772446', // 「叽里呱啦」服务号 appId
    shareAppid: 'wxce838a8667312c20', // 呱呱爱分享
    vipAppid: 'wx985fa68220e79b07', // 叽里呱啦VIP
    amplitudeid: '3d9e4b23a1ebef22aa336f5e3fd50199',
    payAppid: 'wxd388f6f520772446',
    dyClientKey: 'awbjrl7m472s0pmo',
  },
}
export const isProduction = process.env.VUE_APP_ENV === 'production'
export const PATH = PACKAGE.path
export const config = MAP[process.env.VUE_APP_ENV || 'development']
export const DEFAULT_TITLE = '叽里呱啦'
export const MP_SOURCE = 'XCXReply' // 小程序
export const RETAIL_AGENT_SOURCE = 'retail-agent' // 下沉
export const PINTUAN_SOURCE = 'pintuan' // 拼团
export const DEFAULT_ERR_MSG = '网络异常，请稍后重试'
