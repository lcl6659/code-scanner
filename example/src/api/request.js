import axios from 'axios'
import { Toast } from 'vant'
import { config } from '@/config'
import {
  objtoparams,
  getReferralTokenInfo,
  removeTokenInfoByItemId,
  loginController,
} from '@/utils'
import { userInfoHandler } from '@/storeCacher'
import MAIN from '@/main'

const debug = false

export const http = axios.create({
  baseURL: config.api,
  timeout: 5000,
  responseType: 'json',
  withCredentials: false,
  headers: {
    version: 1,
  },
})

http.interceptors.request.use(
  (config) => {
    if (!config.headers.common.Authorization) {
      let { Auth } = userInfoHandler || {}
      const localHeaders = Auth ? { Authorization: Auth } : {}
      config.headers = { ...localHeaders, ...config.headers }
    }
    let wechatAuthInfo = getReferralTokenInfo()
    if (wechatAuthInfo && wechatAuthInfo.token) {
      config.headers.wechattoken = wechatAuthInfo.token
    }
    if (debug) console.log(config)
    return config
  },
  (err) => {
    return err
  },
)

http.interceptors.response.use(
  (response) => {
    if (debug) console.log(response)
    const res = response.data
    if (res.code !== 0) {
      return Promise.resolve([res.data || res, null])
    } else {
      return Promise.resolve([null, res.data])
    }
  },
  (error) => {
    if (debug) console.error(error)
    const data = error.response?.data || {}
    const status = error.response?.status || ''
    const errInfo = { ...data, status }
    let errMsg = errInfo.msg ? errInfo.msg : '服务异常'
    errInfo._preventDefault = false
    //对error信息进行扩展，执行preventDefault() 可拦截toast
    errInfo.preventDefault = () => {
      errInfo._preventDefault = true
    }
    setTimeout(() => {
      const { status, code } = errInfo
      if (status === 500 || errMsg === 'Network Error') {
        errMsg = '网络异常，请刷新后重试'
      } else if (status === 401) {
        if ([502, 503].includes(code)) {
          // 微信授权过期
          removeTokenInfoByItemId(MAIN.$store.state.itemid)
        } else if ([103, 915].includes(code)) {
          // 手机登录过期
          userInfoHandler.clear()
          loginController.show({ ifShowToast: true })
        }
      }

      if (errInfo._preventDefault) return
      Toast({
        message: errMsg,
        duration: 1500,
        forbidClick: true,
      })
    }, 1)

    return Promise.resolve([errInfo, null])
  },
)

class Request {
  static request(url, data = null, method = 'GET', config) {
    let canParseData = method === 'GET' && data
    if (canParseData) {
      url = url.includes('?')
        ? `${url}${objtoparams(data)}`
        : `${url}?${objtoparams(data)}`
    }
    let body = {
      ...config,
      method,
      url,
      data,
    }
    return http(body)
  }

  static get(path, data = null, config = {}) {
    return this.request(path, data, 'GET', config)
  }

  static post(path, data = {}, config = {}) {
    return this.request(path, data, 'POST', config)
  }

  static put(path, data = {}, config = {}) {
    return this.request(path, data, 'PUT', config)
  }

  static delete(path, data = {}, config = {}) {
    return this.request(path, data, 'DELETE', config)
  }
}
export default Request
