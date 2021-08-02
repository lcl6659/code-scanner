import { storage } from './basic'

class SpuInfoHandler {
  key = 'spuInfo'
  constructor(storage, store = sessionStorage) {
    this.storage = storage
    this.store = store
  }

  getInfo() {
    return this.storage.get(this.key, this.store) || ''
  }

  setInfo(types) {
    this.storage.set(this.key, types, this.store)
  }
}

export const spuInfoHandler = new SpuInfoHandler(storage, sessionStorage)
