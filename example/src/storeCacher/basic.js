/**
 * 本地存储包装
 */
export const storage = {
  set: (key, val, store = window.localStorage) => {
    store.setItem(key, JSON.stringify(val))
  },
  get: (key, store = window.localStorage) => {
    try {
      return JSON.parse(store.getItem(key))
    } catch (e) {
      return store.getItem(key)
    }
  },
  remove: (key, store = window.localStorage) => {
    store.removeItem(key)
  },
  clear: (store = window.localStorage) => {
    store.clear()
  },
}
