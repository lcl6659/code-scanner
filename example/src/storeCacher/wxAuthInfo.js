import { storage } from './basic'

class WxAuthInfoHandler {
  constructor(storage) {
    this.storage = storage
  }
  _getKey({ appid, authType }) {
    return `store::${appid}::${authType}`
  }
  setInfo(config, info) {
    const key = this._getKey(config)
    this.storage.set(key, info)
  }

  getInfo(config) {
    const key = this._getKey(config)
    return this.storage.get(key)
  }

  removeInfo(config) {
    const key = this._getKey(config)
    this.storage.remove(key)
  }
}

export const wxAuthInfoHandler = new WxAuthInfoHandler(storage)
