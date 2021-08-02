import { toCharge } from './index'
import { BRIDGE } from '@/bridge'

export async function GGRCharge(order) {
  const ChargeObj = getChargeParams(order)
  if (ChargeObj) {
    const pingppParams = await toCharge(ChargeObj)
    if (pingppParams) {
      return await payment(pingppParams)
    }
  }
}

// 生成charge接口的参数
// 支付服务提供方 主要用于区分多个商户账号。
// PINGXX_JLGL表示叽里呱啦账户，
// PINGXX_GGR表示呱呱阅读账户，
// APPLE表示苹果支付账户，
// PINGXX_OMO表示投放小程序
// 传错误的账户，默认选择PINGXX_JLGL
function getChargeParams(order) {
  return {
    oid: order.orderNo,
    channel: order.pingppChannel,
    charge_provider: 'PINGXX_GGR',
  }
}

//jsbridge支付
async function payment(obj) {
  // 支付成功，返回code 0,支付取消，返回code 1,支付异常，返回 code -1
  try {
    let payResult = await BRIDGE.pay({ charge: JSON.stringify(obj) })
    if (payResult.code === 0) return [{}, 'success']
    if (payResult.code === 1) return [{ msg: '支付取消' }, 'cancel']
  } catch (err) {
    return [{ msg: `支付异常，${err.message}` }, 'fail']
  }
}
