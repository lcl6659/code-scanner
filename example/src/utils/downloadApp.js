import getApk from 'utils/lib/getApk'
import { isProduction } from '@/config'
import { CHANNEL } from '@/config/query'

// 下载app,兼容微信和非微信
function downloadApp() {
  const channel = CHANNEL
  const env = isProduction ? 'prod' : 'dev'
  getApk({
    ...(channel && {
      channel,
    }),
    env,
  })
}

// 启动app，没有的话，跳转下载
export function lanuchApp() {
  // 这里也许后面会加一些逻辑，例如打开app功能，或者微信环境打开中间页
  downloadApp()
}
