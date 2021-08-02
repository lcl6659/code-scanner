import { storage } from './basic'

class ConfigInfoHandler {
  key = 'configHome_uuid'
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

export const configInfoHandler = new ConfigInfoHandler(storage)
