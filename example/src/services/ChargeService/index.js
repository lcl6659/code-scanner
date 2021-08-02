import API from '@/api/api'
import { Toast } from 'vcomp'
import { isWeChat, isGGR, isJLGL } from '@/utils'
import { WxChatCharge } from './WxChatCharge'
import { WebCharge } from './WebCharge'
import { GGRCharge } from './GGRCharge'
import { checkGGRApi } from '@/bridge'
import { sentryTrack } from '@/utils'

/**
 * 微信支付参数:
 * orderNo、pingppChannel、itemid
 * Web支付参数:
 * orderNo、price、pingppChannel、trackSelectedSguOpts、subjectList（spu下科目列表）
 * GGR支付参数:
 * orderNo、pingppChannel
 */
// 对外暴露的支付接口
export async function pingppCharge(order) {
  let result = null
  if (order.orderNo) {
    Toast.loading({
      message: '支付中...',
      forbidClick: true,
      duration: 0,
    })
    if (isWeChat()) {
      //微信环境
      result = await WxChatCharge(order)
    }
    if (isGGR()) {
      //呱呱阅读
      let checkResult = await checkGGRApi(['pay'])
      if (checkResult && checkResult.pay) {
        result = await GGRCharge(order)
      } else {
        result = [{ msg: '该版本暂不支持，请更新到最新版本' }, false]
      }
    }
    if (!isWeChat() && !isGGR() && !isJLGL()) {
      //浏览器环境
      result = await WebCharge(order)
    }
    Toast.clear()
    return result
  } else {
    Toast('订单不存在！')
    sentryTrack({ name: 'Error', message: '订单不存在！' })
  }
}

// 调charge接口获取支付参数
export async function toCharge(obj) {
  const [err, pingppParams] = await API.getPingppChargeObj(obj)
  if (!err && pingppParams) {
    return pingppParams
  } else {
    sentryTrack({ name: 'Error', message: err.msg })
  }
}
