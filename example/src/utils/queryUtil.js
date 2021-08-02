class CacheQueryKeys {
  _keys = []
  _getIndex(key) {
    return this._keys.indexOf(key)
  }
  add(key) {
    if (this._getIndex(key) === -1) {
      this._keys.push(key)
    }
  }
  remove(key) {
    const index = this._getIndex(key)
    if (index !== -1) {
      this._keys.splice(index, 1)
    }
  }
  get keys() {
    return this._keys
  }
}
export const cacheQueryKeys = new CacheQueryKeys()
