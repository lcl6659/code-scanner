import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import middlewareAdapter from './middlewareAdapter'
import { isWxAuthorized, isWxPayAuthorized, isUserAuthorized } from './policies'
import { PATH, DEFAULT_TITLE, RETAIL_AGENT_SOURCE, PINTUAN_SOURCE } from '@/config'
import {
  getFormatUrlByDeleteKeys,
  setBrowserUrl,
  getAllQuery,
  hideShare,
  showShare,
  isWeChat,
  cacheQueryKeys,
  isGGR,
  obj2param,
} from '@/utils'
import * as QUERY from '@/config/query'
import { BRIDGE } from '@/bridge'

Vue.use(VueRouter)
let basePath = process.env.VUE_APP_ENV !== 'local' ? PATH : '/'

const router = new VueRouter({
  mode: 'hash',
  base: basePath,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: 'home',
      path: '/',
      redirect: '/item',
    },
    // 商城主页面
    {
      name: 'item',
      path: '/item',
      component: () => import('@/pages/ExtdItem/ReferralItem'),
      meta: {
        policies: [isWxAuthorized, isWxPayAuthorized],
        sharable: true,
      },
      async beforeEnter(to, from, next) {
        let goItemGroup = () => {
          return (
            //兼容老链接，没有targetPage且source!=下沉、拼团的case进入假拼团
            (!QUERY.TARGETPAGE && ![RETAIL_AGENT_SOURCE, PINTUAN_SOURCE].includes(QUERY.SOURCE)) ||
            QUERY.TARGETPAGE === 'itemGroup'
          )
        }
        if (goItemGroup()) {
          next({ path: '/itemGroup', query: to.query })
        } else {
          next()
        }
      },
    },
    // 假拼团
    {
      name: 'itemGroup',
      path: '/itemGroup',
      component: () => import('@/pages/ExtdItemGroup/ExtdItemGroup'),
      meta: {
        policies: [isWxAuthorized, isWxPayAuthorized],
        sharable: true,
      },
    },
    // 科目确认页
    {
      name: 'item-confirm',
      path: '/item-confirm',
      component: () => import('@/pages/ItemConfirm'),
      meta: {
        policies: [isWxAuthorized, isWxPayAuthorized],
      },
    },
    // 支付中间页（浏览器环境下拉起第三方支付应用支付成功后跳转该页面）
    {
      name: 'charge-status',
      path: '/charge-status',
      component: () => import('@/pages/CheckPayment'),
      meta: {
        title: '叽里呱啦',
      },
    },
    // 登录页（不授权）
    {
      name: 'login',
      path: '/general/login',
      component: () => import('@/pages/GeneralPage/Login'),
      meta: {
        title: '账号登录',
      },
    },
    {
      name: 'order-list',
      path: '/general/order-list',
      alias: ['/sms-recall'], // 短信召回页
      component: () => import('@/pages/GeneralPage/OrderList'),
      meta: {
        policies: [isUserAuthorized],
        title: '我的订单',
      },
    },
    //填地址
    {
      name: 'general-address',
      path: '/general/address',
      alias: ['/address'], // 填地址页（原购买后填地址）
      component: () => import('@/pages/GeneralPage/GeneralAddress'),
      meta: {
        policies: [isUserAuthorized],
      },
    },
    //加学习顾问
    {
      name: 'general-advisor',
      path: '/general/advisor',
      alias: ['/wxqr-recall', '/class-advisior', '/class-advisior-h5', '/class-advisior-groupbuy'], // 微信消息推送召回页; 购买完成引导加学习顾问
      component: () => import('@/pages/GeneralPage/GeneralAdvisor'),
      meta: {
        policies: [isUserAuthorized],
        title: '添加学习顾问',
      },
    },
    {
      name: '404',
      path: '/404',
      component: () => import('@/pages/NotFound/NotFound'),
      meta: {
        title: '404',
      },
    },

    // 勿动！！！外部项目使用（amway / grouybuy中PayPopup；支付空白页，创建9.9订单；拉起微信支付页；）
    {
      name: 'order-transfer',
      path: '/order-transfer',
      component: () => import('@/pages/A_EXTERNAL/OrderTransfer/OrderTransfer'),
      meta: {
        policies: [isWxPayAuthorized, isWxAuthorized],
        title: '叽里呱啦',
      },
    },
    // v4.4 低质流量引导下载App
    {
      name: 'guide-to-app',
      path: '/guide-to-app',
      component: () => import('@/pages/GuidePage/GuideToApp'),
      meta: {
        policies: [isUserAuthorized],
      },
    },
    // v4.4 低质流量引导关注公众号
    {
      name: 'guide-to-wx',
      path: '/guide-to-wx',
      component: () => import('@/pages/GuidePage/GuideToWX'),
      meta: {
        policies: [isUserAuthorized],
      },
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!to.meta.policies) return next()
  const confluxContext = { router, to, from, next }
  const policies = Array.isArray(to.meta.policies) ? to.meta.policies : [to.meta.policies]

  return policies[0]({
    ...confluxContext,
    next: middlewareAdapter(confluxContext, policies, 1),
  })
})

router.afterEach((to) => {
  routeChangeEffect(to)
})

const routeChangeEffect = (to) => {
  const configShare = (to) => {
    if (!(to.meta && to.meta.sharable)) {
      hideShare()
    } else {
      showShare()
    }
  }
  const checkIfResetUrl = () => {
    // 填地址也获取微信地址 因为地址auth被去掉了 ios对比的地址不同，所以获取微信地址失效
    // 微信环境的填地址不去参数  其他情况都去掉
    // 使用replaceState不增加历史路径，回退可正常
    return !(window.location.href.indexOf('/general/address') > -1 && isWeChat())
  }
  // 删除路由敏感字段
  const deleteSensitiveKeys = (sensitiveKeys, ifResetUrl) => {
    if (ifResetUrl) {
      const sensitiveInfos = []
      let queryObj = getAllQuery()
      sensitiveKeys.forEach((key) => {
        const val = queryObj[key]
        val && sensitiveInfos.push(val)
      })
      if (sensitiveInfos.length > 0) {
        const formatUrl = getFormatUrlByDeleteKeys(sensitiveKeys)
        setTimeout(() => {
          setBrowserUrl(formatUrl)
        })
      }
    }
  }

  const changeTitle = (to, title = DEFAULT_TITLE) => {
    title = to.meta?.title || title
    if (isGGR()) {
      BRIDGE.setNavBar({
        title: title,
      })
    } else {
      document.title = title
    }
  }

  const cacheQuery = (to, keys = []) => store.commit('cacheQuery', { query: to.query, keys })

  changeTitle(to)
  cacheQuery(to, ['oid'])
  // 删除url中的敏感字段，如Auth, smsuid等
  deleteSensitiveKeys(cacheQueryKeys.keys, checkIfResetUrl())
  configShare(to)
}

export default router
