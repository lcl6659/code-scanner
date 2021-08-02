export const getQueryString = (name) => {
  let search = window.location.search
  let result = null
  if (search.indexOf(name) !== -1) {
    search = search.substr(1)
    if (typeof name === 'undefined') return search
    let searchArr = search.split('&')
    for (let i = 0; i < searchArr.length; i++) {
      let searchStr = searchArr[i]
      searchArr[i] = searchStr.split('=')

      if (searchArr[i][0] == name) {
        result = searchStr.replace(`${name}=`, '')
        return searchStr.replace(`${name}=`, '')
      }
    }
    return result
  } else {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    if (window.location.hash.indexOf('?') < 0) {
      return null
    }
    let r = window.location.hash.split('?')[1].match(reg)
    if (r != null) return decodeURIComponent(r[2])
  }
  return null
}

export const SOURCE = getQueryString('source') || getQueryString('S') // 来源
export const INITIATOR = getQueryString('initiator') || 'NA' // 邀请人uid
export const FROM = getQueryString('f') // 拼团项目传递的参数f=ptToast
export const CHANNEL = getQueryString('channel') // 渠道

export const RMD = getQueryString('rmd') // 推荐购买标识

export const AUTH = getQueryString('Auth') || getQueryString('auth')
export const UID = getQueryString('uid')
export const SMS_UID = getQueryString('smsuid') // 短信召回或微信召回传递的参数，带有用户身份信息的id
// 推广人的uid，可能和initiator参数相等
export const PROMOTER_ID =
  getQueryString('promoter_id') || getQueryString('pid') || getQueryString('partnerid') || 'NA'
// 地推人员id
export const DID = getQueryString('did')

export const ITEM_ID = getQueryString('itemid')
export const SPU_ID = getQueryString('spuId') || getQueryString('spu')
export const SPU_TAG = getQueryString('spuTag')

export const OID = getQueryString('oid') // 订单id

export const P = getQueryString('p') // 拼团支付传参，价格
export const TARGETPAGE = getQueryString('targetPage') // 表示假拼团itemPage、普通购买item
// 广告投放的参数
export const AID = getQueryString('adid')
export const CID = getQueryString('creativeid')
export const CLICK_ID =
  getQueryString('click_id') || getQueryString('qz_gdt') || getQueryString('gdt_vid')
export const DY_UID = getQueryString('dy_uid')

export const T = getQueryString('T') // ABTest调试
// 海报页跳转时携带的参数
export const P_TYPE = getQueryString('pType')
export const P_PLACE = getQueryString('pPlace')
export const P_CLASS = getQueryString('pClass')
export const P_DATE = getQueryString('pDate')
export const P_SUB = getQueryString('pSub')
