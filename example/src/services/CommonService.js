import API from '@/api/api'
import { wxAuthInfoHandler, userInfoHandler } from '@/storeCacher'
import { Toast } from 'vant'
import { track } from '@/utils/track'

/**
 * 支付事务 service 方法名大写
 * @param {Object} data
 */
export async function ChargeTransaction(data) {
  const loadingToast = Toast.loading({
    message: '支付中...',
    forbidClick: true,
  })

  const [chargeObjects, pingpp] = await Promise.all([
    API.getPingppChargeObj(data),
    import('pingpp-js'),
  ])

  if (chargeObjects[0] && chargeObjects[0].code !== 0) {
    Toast(chargeObjects[0].msg)
    return
  } else {
    loadingToast.clear()
  }

  let chargeObject = chargeObjects[1]
  if (process.env.VUE_APP_ENV === 'development' || process.env.VUE_APP_ENV === 'local') {
    return new Promise((resolve) => {
      resolve([{ msg: '错误信息' }, 'success'])
    })
  } else {
    return new Promise((resolve) => {
      pingpp.createPayment(chargeObject, (res, err) => {
        resolve([err, res])
      })
    })
  }
}

/**
 * 通过手机号授权
 * @param {*} mobile
 * @param {*} code
 */
export async function AuthBySmsCode(mobile, code) {
  let [err, user] = await API.loginViaSmsCode(mobile, code)
  if (!err && user) {
    const { _id, mobile, tok } = user
    userInfoHandler.setUserInfo({ _id, mobile, tok })
    track('Mobile Sign Up Success', { Mobile: mobile })
  }
  return Promise.resolve([err, user])
}

/**
 * AuthByWeChatCode
 * @param {*} mobile
 * @param {*} code
 */
export async function AuthByWeChatCode(code, appid, authType) {
  let [err, authInfo] = await API.login(code, appid, authType)
  if (!err && authInfo) {
    wxAuthInfoHandler.setInfo(
      { appid, authType },
      {
        appid: authInfo.account,
        typ: authInfo.typ,
        token: authInfo.wechat_token,
        createdAt: +new Date(),
      }
    )
  }
  return Promise.resolve([err, authInfo])
}

/**
 * AuthByDouyinCode
 * @param {*} mobile
 * @param {*} code
 */
export async function AuthByDouyinCode(code, appid, authType) {
  let [err, data] = await API.getDyToken(code)
  if (!err && data) {
    wxAuthInfoHandler.setInfo(
      { appid, authType },
      {
        appid,
        typ: authType,
        token: data.token,
        createdAt: +new Date(),
      }
    )
  }
  return Promise.resolve([err, data])
}
