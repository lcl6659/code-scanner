import store from '@/store'
import { AuthBySmsCode } from '@/services/CommonService'
import { track, EE, isGGR } from '@/utils'
import { BRIDGE, checkGGRApi } from '@/bridge'
import { userInfoHandler } from '@/storeCacher'
import { SOURCE } from '@/config/query'
import { Toast } from 'vant'
class GGR {
  async show(resolve) {
    //检查jsbridge
    let checkResult = await checkGGRApi(['callLogin'])
    if (checkResult && checkResult.callLogin) {
      // 调登录的jsbridge
      const params = {
        type: 'Login',
        source: SOURCE,
      }
      let { code, data } = await BRIDGE.callLogin(params)
      if (code === 0) {
        userInfoHandler.setUserInfo(data)
        resolve([null])
      }
    } else {
      Toast('该版本暂不支持，请更新到最新版本')
    }
  }
  close() {}
}

class NORML_BROWSWER {
  show(resolve) {
    store.commit('updateGlobalConfig', { ifShowLogin: true })
    EE.on('login', (params) => {
      if (params == 'success') {
        resolve(params)
      }
    })
  }

  close() {
    store.commit('updateGlobalConfig', { ifShowLogin: false })
  }

  async _login({ mobile, code }) {
    let [err, user] = await AuthBySmsCode(mobile, code)
    if (!err && user) {
      loginController.close()
      track('Mobile Sign Up Success') // 登录成功
      track('Mobile Sign Up Close') //登录浮层关闭
    } else {
      let option = err.code === '269' || err.msg?.includes('验证码错误') ? { Msg: 'CodeError' } : {}
      track('Mobile Sign Up Fail', option)
    }
    return [err]
  }
}

class LoginController {
  controller = isGGR() ? new GGR() : new NORML_BROWSWER()

  async show(config) {
    this._loginToast(config)
    return new Promise((resolve) => {
      this.controller.show(resolve)
      // EE.once('login-success', (result) => resolve(result))
    })
  }

  _loginToast({ ifShowToast, msg = '认证失败，请重新登录' } = {}) {
    ifShowToast && Toast(msg)
  }

  close() {
    return this.controller.close()
  }
}

export const loginController = new LoginController()
