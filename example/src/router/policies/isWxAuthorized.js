/**
 * isWxAuthorized
 *
 * @module      :: router
 * @description :: Middleware for router policies control
 */

import {
  wechatOAuth,
  douyinOAuth,
  needAuthUserInfo,
  getAppID,
  getSkuType,
  getTokenInfoByItemId,
  isWeChat,
  isDouyin,
  getAllQuery,
} from '@/utils'
import { tryCountHandler } from '@/storeCacher'
import { wxAuthInfoHandler } from '@/storeCacher'
import { AuthByWeChatCode, AuthByDouyinCode } from './../../services/CommonService'
import { PATH, config } from '@/config'
const MAX_LOGIN_TIMES = 5

/**
 * 判断基础信息授权是否可用
 * @param {String} itemid
 */
let isWxAuthenticated = (itemid) => {
  const EXPIRED_TIME = 1000 * 60 * 60 * 1.9
  let authInfo = getTokenInfoByItemId(itemid)
  if (!authInfo) return false
  let authExpired = +new Date() - authInfo.createdAt > EXPIRED_TIME
  return !authExpired
}

let dyAuthenable = () => {
  const EXPIRED_TIME = 1000 * 60 * 60 * 23
  let authInfo = wxAuthInfoHandler.getInfo({ appid: config.dyClientKey, authType: 'silent' })
  if (!authInfo) return false
  let authExpired = +new Date() - authInfo.createdAt > EXPIRED_TIME
  return !authExpired
}
// 微信授权
let goWxAuth = (itemid, to) => {
  let basePath = process.env.VUE_APP_ENV !== 'local' ? `${PATH}index.html` : '/'
  let appid = getAppID(getSkuType(itemid))
  let authType = needAuthUserInfo(itemid) ? 'snsapi_userinfo' : 'snsapi_base'
  let url = `${location.protocol}//${location.host}${basePath}#${to.fullPath}`
  wechatOAuth.auth(url, appid, authType)
}
// 抖音授权
let goDyAuth = (to) => {
  let basePath = process.env.VUE_APP_ENV !== 'local' ? `${PATH}index.html` : '/'
  let appid = config.dyClientKey
  let url = `${location.protocol}//${location.host}${basePath}#${to.fullPath}`
  douyinOAuth.auth(url, appid)
}

export default async function isWxAuthorized({ to, next }) {
  if (isWeChat()) {
    let { itemid } = to.query
    if (isWxAuthenticated(itemid)) {
      next()
    } else {
      let { code } = to.query
      if (!code) {
        goWxAuth(itemid, to)
      } else {
        let appid = getAppID(getSkuType(itemid))
        let authType = needAuthUserInfo(itemid) ? 'unsilent' : 'silent'
        let [err, authInfo] = await AuthByWeChatCode(code, appid, authType)
        if (!err && authInfo) {
          delete to.query.code
          next({ path: to.path, query: to.query })
        } else {
          let tryCnt = tryCountHandler.getCount(appid)
          if (tryCnt > MAX_LOGIN_TIMES) return
          tryCountHandler.setCount(appid, tryCnt + 1)
          goWxAuth(itemid, to)
        }
      }
    }
  } else if (isDouyin()) {
    if (dyAuthenable()) {
      next()
    } else {
      let { code } = getAllQuery()
      if (!code) {
        goDyAuth(to)
      } else {
        let appid = config.dyClientKey
        let authType = 'silent'
        let [err, data] = await AuthByDouyinCode(code, appid, authType)
        if (!err && data) {
          next({ path: to.path, query: to.query })
          history.replaceState(`${location.origin}${location.pathname}${location.hash}`)
        } else {
          let tryCnt = tryCountHandler.getCount(appid)
          if (tryCnt > MAX_LOGIN_TIMES) return
          tryCountHandler.setCount(appid, tryCnt + 1)
          goDyAuth(to)
        }
      }
    }
  } else {
    next()
  }
}
