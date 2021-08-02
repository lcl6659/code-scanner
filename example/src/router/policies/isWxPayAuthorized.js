/**
 * isWxPayAuthorized
 *
 * @module      :: router
 * @description :: Middleware for router policies control
 */
import { config, PATH } from '@/config'
import { wechatOAuth, getPaymentTokenInfo, isWeChat } from '@/utils'
import { tryCountHandler } from '@/storeCacher'
import { AuthByWeChatCode } from '@/services/CommonService'
const MAX_LOGIN_TIMES = 5

/**
 * 判断是否授权过叽里呱啦主服务号
 */
let isWxPayAuthenticated = (itemid) => {
  const EXPIRED_TIME = 1000 * 60 * 60 * 1.9
  let authInfo = getPaymentTokenInfo(itemid)

  if (!authInfo) return false

  let authExpired = +new Date() - authInfo.createdAt > EXPIRED_TIME
  return !authExpired
}
let goWxAuth = (appid, to) => {
  let basePath = process.env.VUE_APP_ENV !== 'local' ? `${PATH}index.html` : '/'
  let authType = 'snsapi_base'
  let url = `${location.protocol}//${location.host}${basePath}#${to.fullPath}`
  wechatOAuth.auth(url, appid, authType)
}

export default async function isWxPayAuthorized({ to, next }) {
  if (isWeChat()) {
    let appid = config.payAppid
    let { itemid } = to.query
    if (isWxPayAuthenticated(itemid)) {
      next()
    } else {
      let { code } = to.query
      if (!code) {
        goWxAuth(appid, to)
      } else {
        let authType = 'silent'
        let [err, authInfo] = await AuthByWeChatCode(code, appid, authType)
        if (!err && authInfo) {
          delete to.query.code
          next({ path: to.path, query: to.query })
        } else {
          let tryCnt = tryCountHandler.getCount(appid)
          if (tryCnt > MAX_LOGIN_TIMES) return
          tryCountHandler.setCount(appid, tryCnt + 1)
          goWxAuth(appid, to)
        }
      }
    }
  } else {
    next()
  }
}
