import { isWeChat, isDouyin } from './util'

const WECHAT_HOST = 'https://open.weixin.qq.com'
const DOUYIN_HOST = 'https://aweme.snssdk.com'
const GUA_GATEWAY_HOST = 'https://wechatgateway.jiliguala.com'

export const wechatOAuth = {
  /**
   * @returns {undefined} window.location.href action
   * @param {string} next
   * @param {string} appid
   * @param {string} scope
   */
  // review 此处为何不使用util库中的方法
  auth(next, appid, scope = 'snsapi_base') {
    // 'snsapi_base' 'snsapi_userinfo'
    const nextUrl = encodeURIComponent(next || window.location.href)
    const redirectUrl = encodeURIComponent(
      `${GUA_GATEWAY_HOST}/gate/wechatcallback/v4?next=${nextUrl}&type=hash`
    )
    const state = Math.ceil(Math.random() * 1000)
    const url = `${WECHAT_HOST}/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
    const qrCodeUrl = `${WECHAT_HOST}/connect/qrconnect?appid=${appid}&client_id=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_login,snsapi_userinfo&state=${state}#wechat_redirect`
    window.location.href = isWeChat() ? url : qrCodeUrl
  },
}
export const douyinOAuth = {
  /**
   * @returns {undefined} window.location.href action
   * @param {string} next
   * @param {string} appid
   * @param {string} scope
   */
  // 抖音静默授权scope写死login_id
  auth(next, appid, scope = 'login_id') {
    // const nextUrl = encodeURIComponent(next || window.location.href)
    const nextUrl = next || window.location.href
    const redirectUrl = encodeURIComponent(
      `${GUA_GATEWAY_HOST}/gate/wechatcallback/v4?next=${nextUrl}&type=normal`
    )
    const state = Math.ceil(Math.random() * 1000)
    const url = `${DOUYIN_HOST}/oauth/authorize/v2/?client_key=${appid}&response_type=code&scope=${scope}&redirect_uri=${nextUrl}&state=${state}`
    window.location.href = isDouyin() ? url : ''
  },
}
