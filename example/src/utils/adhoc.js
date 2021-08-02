import { abInfoHandler } from '@/storeCacher'
import { T } from '@/config'
import { isProd, isDebug, getAllQuery } from '@/utils'

const createUuid = (len) => {
  if (!len) len = 32
  let dictionary = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let nonce = ''
  for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random() * dictionary.length)
    nonce += dictionary[index || 0]
  }
  return nonce
}
// 获取ABTest时传入默认值
const defaultFlags = {
  TestPlan_OrderConfirmType: 'A',
}

const adhoc =
  window.adhoc ||
  function (method, data) {
    switch (method) {
      case 'getFlags':
        data({
          all() {
            return defaultFlags
          },
        })
        return
    }
  }

let uuid = abInfoHandler.getInfo()
if (!uuid) {
  uuid = createUuid()
  abInfoHandler.setInfo(uuid)
}

/* 简化测试时url带的adhoc_force_client_id参数, 避免微信授权state过长问题 */
if (['production'].indexOf(process.env.VUE_APP_ENV) < 0) {
  const adhocForceClientId = {
    A: '3951e2f1-a0a3-b714-0965-8be99f71c9eb',
    B: '198c85c0-4d34-cf0c-4d2b-a2fba23c6a6f',
  }[T]
  uuid = adhocForceClientId || uuid
}
/* end */

adhoc('setOverlay', false)
adhoc('init', {
  appKey: 'ADHOC_a092503f-789f-4d83-8e9b-b6f1b67c5c54',
  clientId: uuid,
  defaultFlags,
})

let flags = null
export const getAllFlags = () => {
  return new Promise((resolve) => {
    if (flags) {
      resolve(flags)
    } else {
      adhoc('getFlags', function (flags) {
        flags = flags.all()
        if (isDebug() && !isProd()) {
          flags = { ...flags, ...getAllQuery() }
        }
        resolve(flags)
      })
    }
  })
}

const getMockFlag = (name, flags) => {
  let flag = flags[name]
  const ifUseUrlMock = isDebug() && !isProd()
  if (ifUseUrlMock) {
    const allQuery = getAllQuery()
    flag = allQuery[name] || flag
  }
  return flag
}

// export const getFlag = (name) => getAllFlags().then((flags) => flags[name])
export const getFlag = (name) => getAllFlags().then((flags) => getMockFlag(name, flags))

// export default adhoc
