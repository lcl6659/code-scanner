import { getAllQuery, obj2param } from '@/utils'
import { userInfoHandler } from '@/storeCacher/userInfo'
import API from '@/api/api'
import { toCharge } from './index'

let callbackurl = null
export async function WebCharge(order) {
  const ChargeObj = await getChargeParams(order)
  if (ChargeObj) {
    const pingppParams = await toCharge(ChargeObj)
    if (pingppParams) {
      return await payment(pingppParams)
    }
  }
}

// 生成charge接口的参数
async function getChargeParams(order) {
  const ChargeObj = {
    oid: order.orderNo,
    channel: order.pingppChannel,
  }
  if (order.pingppChannel === 'alipay') {
    return ChargeObj
  }
  //支付回调url
  callbackurl = await getPayCallbackUrl(order)
  if (callbackurl) {
    if (order.pingppChannel === 'wx_wap') {
      ChargeObj.extra = {
        result_url: callbackurl, // 微信支付成功的回调地址
      }
      return ChargeObj
    } else if (order.pingppChannel === 'alipay_wap') {
      ChargeObj.extra = {
        success_url: callbackurl, // 支付宝支付成功的回调地址
      }
      return ChargeObj
    } else {
      return false
    }
  } else {
    return false
  }
}

//ping++支付
async function payment(obj) {
  if (
    // mock支付
    process.env.VUE_APP_ENV === 'local' ||
    process.env.VUE_APP_ENV === 'development'
  ) {
    window.location.href = callbackurl
  } else {
    const [pingpp] = await Promise.all([import('pingpp-js')]) // TODO: @h5/pingpp-js-wx-wap
    return new Promise((resolve) => {
      pingpp.createPayment(obj, (res, err) => {
        resolve([err, res])
      })
    })
  }
}

// Web环境支付的回调url
async function getPayCallbackUrl(order) {
  const user = userInfoHandler.getUserInfo()
  const mobile = await userInfoHandler.getMobile()
  let queryObj = {
    ...getAllQuery(),
    oid: order.orderNo,
    price: order.price,
    user_id: user._id,
    user_tok: user.tok,
    mobile: btoa(mobile),
    pingppChannel: order.pingppChannel,
    //回调页面埋点用
    ...order.trackSelectedSguOpts,
    Subject: encodeURIComponent(order.subjectList.join('+')),
  }
  // 支付后回调页
  let basePath = process.env.VUE_APP_ENV !== 'local' ? '/store/share/' : '/'
  let url = `https://${location.host}${basePath}index.html#/charge-status?${obj2param(queryObj)}`
  /* let url = `https://devspa.jiliguala.com/store/share/index.html#/charge-status?${obj2param(
    queryObj
  )}` */
  // 生成短链
  let [errinfo, resurl] = await API.shortUrl({ url })
  if (!errinfo && resurl) {
    return resurl
  }
}
