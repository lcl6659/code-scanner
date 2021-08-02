import API from '@/api/api'
import { storage } from './basic'
import {
  assembleToken,
  parseToken,
  userInfoSideEffect,
  isGGR,
  initTrack,
} from '@/utils'
import { BRIDGE } from '@/bridge'

class UserInfoHandler {
  key = 'store_user'
  pre_id = ''
  constructor(storage) {
    this.storage = storage
  }

  async init() {
    await this._initInGGR()
    const userInfo = this._getUserInfo()
    initTrack(userInfo && userInfo._id)
    if (userInfo) {
      this._checkIfExeSideEffect(userInfo._id)
    }
  }

  clear() {
    this.storage.set(this.key, null)
  }

  getUserInfo() {
    let userInfo = this._getUserInfo()
    if (userInfo) {
      // eslint-disable-next-line no-unused-vars
      const { mobile, ...formatUserInfo } = userInfo
      userInfo = formatUserInfo
    }
    return userInfo
  }

  setUserInfo(info) {
    let { Auth } = info
    if (Auth) {
      info = this._formatInfoByAuth(Auth)
    }
    const { _id, mobile, tok, uid } = info
    const user_id = _id || uid
    this.storage.set(this.key, { _id: user_id, mobile, tok })
    this._checkIfExeSideEffect(user_id)
  }

  get ifLogin() {
    return !!this.Auth
  }

  get _id() {
    const { _id } = this._getUserInfo() || {}
    return _id || ''
  }

  async getMobile() {
    let { mobile } = this._getUserInfo() || {}
    if (!mobile) {
      if (this.Auth) {
        const [err, res] = await API.getSecurityInfo(
          {},
          {
            headers: {
              Authorization: this.Auth,
            },
          },
        )
        if (!err && res.mobile) {
          mobile = res.mobile
        }
      }
      this._setMobile(mobile)
    }
    return mobile
  }

  get Auth() {
    const { _id, tok } = this._getUserInfo() || {}
    let auth = ''
    if (_id && tok) {
      auth = assembleToken(_id, tok)
    }
    return auth
  }

  // you should not use the functions below outside this class

  _formatInfoByAuth(auth) {
    const [_id, tok] = parseToken(auth)
    return { _id, tok }
  }

  _setMobile(mobile) {
    if (mobile) {
      const userInfo = { ...this._getUserInfo(), mobile }
      this.setUserInfo(userInfo)
    }
  }

  _checkIfExeSideEffect(_id) {
    if (_id && this.pre_id !== _id) {
      this.pre_id = _id
      userInfoSideEffect(_id)
    }
  }

  async _initInGGR() {
    if (isGGR()) {
      this.clear()
      const { code, data } = await BRIDGE.getUserInfo()
      if (code === 0 && data && data.typ !== 'guest') {
        this.setUserInfo(data)
      }
    }
  }

  _getUserInfo() {
    return this.storage.get(this.key)
  }
}

export const userInfoHandler = new UserInfoHandler(storage)
