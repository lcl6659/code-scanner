import { storage } from './basic'

class TryCountHandler {
  constructor(storage) {
    this.storage = storage
  }

  _getKey(appid) {
    return `${appid}tryCnt`
  }

  getCount(appid) {
    const key = this._getKey(appid)
    return this.storage.get(key) || 0
  }

  setCount(appid, value) {
    const key = this._getKey(appid)
    this.storage.set(key, value)
  }
}

export const tryCountHandler = new TryCountHandler(storage)
