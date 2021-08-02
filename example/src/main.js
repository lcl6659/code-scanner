import 'core-js/features/object/assign'
import Vue from 'vue'
import {
  Dialog,
  Notify,
  Toast,
  Skeleton,
  Popup,
  Swipe,
  SwipeItem,
  Lazyload,
  Button,
  Loading,
} from 'vant'
import App from './App.vue'
import API from '@/api/api'
import router from '@/router/router'
import { config } from '@/config'
import './styles/reset.css'
import './styles/common.css'
import store from '@/store'
import { track } from '@/utils'
import PluginTitle from '@/plugin/tittle-plugin'
import { userInfoHandler } from '@/storeCacher'

window.PerfMonitor.custom('main')

userInfoHandler.init()

Vue.prototype.$track = track
Vue.prototype.$conf = Object.freeze(config)
Vue.prototype.$API = API
Vue.prototype.$env = process.env.VUE_APP_ENV
Vue.prototype.$store = store
Vue.config.productionTip = false

Vue.use(Skeleton)
Vue.use(Dialog)
Vue.use(Notify)
Vue.use(Toast)
Vue.use(Popup)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload)
Vue.use(Button)
Vue.use(Loading)
Vue.use(PluginTitle)

export default new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#root')
