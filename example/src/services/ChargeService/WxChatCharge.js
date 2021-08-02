import { getPaymentTokenInfo } from '@/utils'
import { toCharge } from './index'

export async function WxChatCharge(order) {
  const ChargeObj = getChargeParams(order)
  if (ChargeObj) {
    const pingppParams = await toCharge(ChargeObj)
    if (pingppParams) {
      return await payment(pingppParams)
    }
  }
}

// 生成charge接口的参数
function getChargeParams(order) {
  const ChargeObj = {
    oid: order.orderNo,
    channel: order.pingppChannel,
  }
  //微信环境支付
  let authInfo = getPaymentTokenInfo(order.itemid)
  if (authInfo) {
    ChargeObj.pay_wechat_token_typ = authInfo.typ
    ChargeObj.pay_wechat_token = authInfo.token
    return ChargeObj
  } else {
    return false
  }
}

//ping++支付
async function payment(obj) {
  // mock
  if (
    process.env.VUE_APP_ENV === 'development' ||
    process.env.VUE_APP_ENV === 'local'
  ) {
    return new Promise((resolve) => {
      resolve([{ msg: '错误信息' }, 'success'])
    })
  } else {
    const [pingpp] = await Promise.all([import('pingpp-js')]) // TODO: @h5/pingpp-js-wx-wap
    return new Promise((resolve) => {
      pingpp.createPayment(obj, (res, err) => {
        resolve([err, res])
      })
    })
  }
}
