import { storage } from './basic'

class AbInfoHandler {
  key = 'store_ab_uuid'
  constructor(storage) {
    this.storage = storage
  }

  getInfo() {
    return this.storage.get(this.key) || ''
  }

  setInfo(info) {
    this.storage.set(this.key, info)
  }
}

export const abInfoHandler = new AbInfoHandler(storage)
