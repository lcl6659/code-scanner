import { config } from '@/config'
import * as QUERY from '@/config/query'
import { createQueryString, queryString } from 'lamp'
import { wxAuthInfoHandler } from '@/storeCacher'
import { sentryTrack } from './sentryTrack'
import { BRIDGE } from '@/bridge'

export const isProd = () => {
  return process.env.VUE_APP_ENV === 'production'
}

export const isDebug = () => {
  return /mode=debug/.test(window.location)
}

export const isWeChat = () => {
  let ua = navigator.userAgent.toLowerCase()
  return /micromessenger/.test(ua) ? true : false
}

export const isJLGL = () => {
  return /niuwa/.test(navigator.userAgent.toLowerCase()) || window.JLGL
}

// bridge.isApp 因ios 有ua修改失败的风险
export const isGGR = () => typeof window._GGRBridge === 'object'

// 判断支付宝小程序环境
export const isAlipayMini = () => {
  return /AliApp/.test(navigator.userAgent) ? true : false
}

// 判断抖音环境
export const isDouyin = () => {
  return /aweme/.test(navigator.userAgent) ? true : false
  // return true
}

/**
 * 构建 authToken
 * @param {*} id
 * @param {*} tok
 */
export const assembleToken = (id, tok) => {
  if (id && tok) {
    return `Basic ${btoa(`${id}:${tok}`)}`
  }
  return ''
}

export const parseToken = (auth) => {
  let arr = []
  try {
    arr = atob(auth).split(':')
  } catch (e) {
    sentryTrack({
      name: '解析auth失败',
      message: JSON.stringify({
        auth,
        err: e,
      }),
    })
  }
  return arr
}

/**
 * 获取商品的类别
 */
const SKUMAP = new Map([
  //转介绍
  [
    /^H5_XX_Sample|H5_Cashback|H5_Sample_Pintuan|H5_Sample_promoter|H5_Sample_DiamondActivity/,
    'RT',
  ],
  // 城市合伙人
  [/^CP_/, 'CP'],
  // 推广人
  [/^CRM_/, 'CRM'],
  // 呱美课
  [/^H5_/, 'GUA'],
])
export const getSkuType = (skuid) => {
  const type = [...SKUMAP].filter(([key]) => {
    return key.test(skuid)
  })
  const [, value = 'RT'] = !type[0] ? [] : type[0]
  return value
}

export const getCrmSource = (itemid) =>
  ({
    CRM: 'promoter',
    CP: 'partner',
    RT: 'sampleH5',
    NA: undefined,
  }[getSkuType(itemid)])

/**
 * 在商品详情页需要微信非静默授权
 */
export const needAuthUserInfo = (itemid) => {
  return getSkuType(itemid) === 'CP' || getSkuType(itemid) === 'CRM' || getSkuType(itemid) === 'RT'
}

// url中的search参数和hash值后面的query参数
export const getAllQuery = () => {
  let search = window.location.search.substr(1)
  let hashSearch = window.location.hash.split('?')[1]
  let queryData = {}
  if (search) {
    search.split('&').forEach((item) => {
      const key = item.split('=')[0]
      const value = decodeURIComponent(item.split('=')[1])
      queryData[key] = value
    })
  }
  if (hashSearch) {
    hashSearch.split('&').forEach((item) => {
      const key = item.split('=')[0]
      const value = decodeURIComponent(item.split('=')[1])
      queryData[key] = value
    })
  }
  return queryData
}
/**
 * 对象转url参数字符串
 * @param {*} obj
 * @returns
 */
export const obj2param = (obj) => {
  let str = []
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(`${p}=${obj[p]}`)
    }
  return str.join('&')
}

/**
 * 获取appid
 * type 两个微信公共账号（一个叽里呱啦公共账号，一个推广人）
 */
export const getAppID = (type) => {
  switch (type) {
    case 'CRM':
      return config.appid
    case 'RT':
      return config.guaAppid
    case 'CP':
      return config.appid
    default:
      return config.guaAppid
  }
}

export const objtoparams = (obj) => {
  let str = ''
  for (let key in obj) {
    if (str !== '') {
      str += '&'
    }
    str += `${key}=${encodeURIComponent(obj[key])}`
  }
  return str
}

/**
 * 获取转介绍跳转链接
 */
export const getIntroduceUrl = (itemid) => {
  const path =
    {
      H5_XX_Sample: '/amway/cashback/index.html', // /activity/retell/index.html 邀请有礼页面 暂时已下架
      H5_Cashback: '/amway/cashback/index.html', // 邀请返现页面
      H5_Sample_Pintuan: '/amway/groupbuy/#/join', //参团首页
      H5_Store_Dia: '/store-dia/index.html', // 钻石商城
      Poster: '/amway/poster/index.html', // 海报页
    }[itemid] || '/amway/cashback/index.html'
  const introduceUrlMap = {
    production: '//actspaj.jiliguala.com',
    prerelease: '//rcactspa.jiliguala.com',
    development: '//devactspa.jiliguala.com',
    fat: '//fatactspa.jiliguala.com',
    local: '//devactspa.jiliguala.com',
  }
  const introduceUrl = introduceUrlMap[process.env.VUE_APP_ENV || 'production']
  return `${introduceUrl}${path}`
}

/**
 * 精简url（用户分享和微信授权）
 * @param {*} url
 * @param {*} hash
 */
export const getPreciseUrl = (url = location.href) => {
  return url
    .replace(/&code=.{32}/g, '')
    .replace(/&from_wxoauth=true/gi, '')
    .replace(/#wechat_redirect/gi, '')
    .replace(/&from=groupmessage/gi, '')
    .replace(/&from=timeline/gi, '')
    .replace(/&from=singlemessage/gi, '')
    .replace(/&isappinstalled=0/gi, '')
    .replace(/&isappinstalled=1/gi, '')

  //.replace (/detailsource\=\w{1,}/gi, 'detailsource=CRMSKUShareView')
}

/**
 * @returns {Object}
 * @param {String} itemid
 */
export const getTokenInfoByItemId = (itemid) => {
  let appid = getAppID(getSkuType(itemid))
  let authType = needAuthUserInfo(itemid) ? 'unsilent' : 'silent'
  return wxAuthInfoHandler.getInfo({ appid, authType })
}

/**
 * 删除storage内包含wechat_token用户信息
 * @param {String} itemid
 */
export const removeTokenInfoByItemId = (itemid) => {
  let appid = getAppID(getSkuType(itemid))
  let authType = needAuthUserInfo(itemid) ? 'unsilent' : 'silent'
  wxAuthInfoHandler.removeInfo({ appid, authType })
}

/**
 * @returns {Object}
 */
export const getReferralTokenInfo = () => {
  let appid = getAppID('RT')
  let authType = 'unsilent'
  return wxAuthInfoHandler.getInfo({ appid, authType })
}

/**
 * @returns {Object}
 * @param {String} itemid
 */
export const getPaymentTokenInfo = (itemid) => {
  const EXPIRED_TIME = 1000 * 60 * 60 * 1.9
  let appid = config.payAppid
  let authInfo = getTokenInfoByItemId(itemid)
  // 优先检查之前授权过的 appId 是否一致
  if (authInfo && authInfo.appid === appid) {
    let authExpired = +new Date() - authInfo.createdAt > EXPIRED_TIME
    if (!authExpired) {
      return authInfo
    }
  }

  let authType = 'silent'
  return wxAuthInfoHandler.getInfo({ appid, authType })
}

/**
 * 添加长按事件
 * @param {*} dom
 * @param {*} fn
 */
export const longPress = (dom, fn, opt) => {
  let timer = null
  let touchstartHander = function () {
    // event.preventDefault();
    timer = setTimeout(fn, 500, opt)
  }
  let touchmoveHander = function (event) {
    event.preventDefault()
    clearTimeout(timer)
    timer = null
  }
  let touchendHander = function (event) {
    event.preventDefault()
    clearTimeout(timer)
    return false
  }
  dom.addEventListener('touchstart', touchstartHander, false)
  dom.addEventListener('touchmove', touchmoveHander, false)
  dom.addEventListener('touchend', touchendHander, false)
}

/**
 * 禁止分享
 */
export const hideShare = () => {
  if (isWeChat()) {
    import('niuwa-util').then(({ wxConfig }) => {
      return new Promise((resolve, reject) => {
        wxConfig({
          apiList: ['hideOptionMenu'], // hideAllNonBaseMenuItem / hideMenuItems / hideOptionMenu 前两者IOS路由跳转进入二次页面无效，重新刷新后有效；hideOptionMenu兼容
          resolve(wx) {
            wx.hideOptionMenu()
          },
          reject,
        })
      })
    })
  } else if (isGGR()) {
    BRIDGE.setNavBar({
      share: false,
    })
  }
}

/**
 * 设置分享
 */
export const showShare = () => {
  // if (isGGR()) {
  //   BRIDGE.setNavBar({
  //     share: true,
  //   })
  // }
}

// /**
//  * v3.2 H5_Cashback 重定向itemid 和 source
//  */
export const filterByPID = (pid) => {
  let itemid = QUERY.ITEM_ID
  let source = QUERY.SOURCE
  if (itemid === 'H5_Cashback') {
    source = 'cashbackoffline'
    // 判断为openid itemid重定向到 H5_XX_Sample
    itemid = pid.length !== 32 ? 'H5_XX_Sample' : 'H5_Sample_DiamondActivity'
  }
  return { itemid, source }
}

/**
 * replaceState重置url
 */
export const setBrowserUrl = (url) => {
  window.history.replaceState && window.history.replaceState({ url }, '', url)
}

// 去除url的search中特殊字段
export const getFormatUrlByDeleteKeys = (deleteKeys = []) => {
  if (!Array.isArray(deleteKeys)) {
    throw Error('入参应该为数组')
  }
  let { origin, pathname, search, hash } = window.location
  window.entryUrl = window.location.href
  const queryObj = queryString(search)
  const hashPath = hash.split('?')[0]
  const hashQueryObj = queryString(hash.split('?')[1] || '')
  const getFormatString = (deleteKeys, queryObj) => {
    deleteKeys.forEach((deleteKey) => {
      if (queryObj[deleteKey]) {
        delete queryObj[deleteKey]
      }
    })
    let formatString = createQueryString(queryObj)
    return formatString ? `?${formatString}` : ''
  }
  const searchString = getFormatString(deleteKeys, queryObj)
  const hashSearchString = getFormatString(deleteKeys, hashQueryObj)
  const url = `${origin}${pathname}${searchString}${hashPath}${hashSearchString}`
  return url
}

/**
 * @param {string} str 要复制到剪切版的字符串
 */
export const copyToClipboard = (str) => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  el.setSelectionRange(0, el.value.length)
  document.execCommand('copy')
  document.body.removeChild(el)
}

// 根据url判断是否携带邀请人信息
export const judgeInvite = () => {
  return !!(QUERY.INITIATOR != 'NA' || QUERY.PROMOTER_ID != 'NA')
}
