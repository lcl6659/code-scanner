import { getSkuType, getPreciseUrl, isWeChat } from '@/utils'
import store from '@/store'
// import { BRIDGE } from '@/bridge'
// import * as QUERY from '@/config/query'

const GUA_LOGO =
  'https://qiniucdn.jiliguala.com/dev/promo/f8e7e86d77474726958e0716b51efca3.png'

const getShareDesc = (type) => {
  if (type === 'CRM') {
    return '海量英语原版资源，尽在叽里呱啦'
  }
  if (type === 'RT') {
    return '5天学习顾问专属辅导，帮助养成学习好习惯'
  }
  return '叽里呱啦商城'
}

const getShareTitle = (type, skuInfo) => {
  if (type === 'CRM') {
    return `叽里呱啦邀您一起体验${skuInfo.sxuList[0].ttl}~`
  }
  if (type === 'RT') {
    return '9.9元7节北美外教互动课，配套学习材料包邮到家！'
  }
  return (skuInfo && skuInfo.ttl) || '叽里呱啦商城'
}

export default function configWxShare(skuInfo) {
  const type = getSkuType(store.state.itemid)
  const imgUrl = (skuInfo && skuInfo.shareThumb) || GUA_LOGO
  const desc = (skuInfo && skuInfo.shareDescribes) || getShareDesc(type)
  const title = (skuInfo && skuInfo.shareTitle) || getShareTitle(title, skuInfo)
  const link = getPreciseUrl(location.href)
  // if (isGGR()) {
  //   const shareData = {
  //     panelTitle: '分享至',
  //     title,
  //     desc,
  //     link,
  //     imgUrl,
  //     source: QUERY.SOURCE,
  //   }
  //   BRIDGE.setShareData(shareData)
  // } else
  if (isWeChat()) {
    import('niuwa-util').then(({ wxConfig }) => {
      const shareConfig = {
        imgUrl,
        link,
        desc,
        title,
      }
      return wxConfig(shareConfig)
    })
  }
}
