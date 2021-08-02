import { storage } from './basic'

class TutorScanRecord {
  key = 'store_tutor_longpress_act'
  constructor(storage) {
    this.storage = storage
  }

  getInfo(val) {
    let storageInfo = this.storage.get(this.key) || []
    return storageInfo.indexOf(val) > -1
  }

  setInfo(info) {
    let storageInfo = this.storage.get(this.key) || []
    storageInfo.push(info)
    this.storage.set(this.key, Array.from(new Set(storageInfo)))
  }
}

export const tutorScanRecord = new TutorScanRecord(storage)
