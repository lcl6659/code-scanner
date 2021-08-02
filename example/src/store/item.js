// 转介绍9.9 Store
import { configInfoHandler, spuInfoHandler } from '@/storeCacher'
import API from '@/api/api'
import NP from 'number-precision'
import * as QUERY from '@/config/query'
import { abInfoHandler } from '@/storeCacher'
import { isWeChat } from '@/utils'

/* // 弹层形式订单确认
const popOrderCheck = () => {}

// 页面形式订单确认
const pageOrderCheck = () => {} */

export default {
  state: {
    // 页面配置
    configHome: {
      spuTag: '',
      spuId: '',
      // 页面标题
      title: '',
      fakeColor: '',
      fakeShow: '',
      // 假拼团头像昵称
      realAva: '',
      realNick: '',
      bannerBottomBG: '',
      // 头图
      bannerPic: '',
      // 详情图列表
      detail: [],
      sguList: [],
      subjectList: [],
      ageSpec: [], //可选年龄
    },
    //售卖课程
    items: [],
    //已购买的科目数量
    ownedSub: 0,
    //默认科目数量
    defaultSubjectCount: 1,
    //默认课程
    defaultIndex: { ageId: '', sp2xuId: '' },
    //首页默认显示的价格
    defaultPrice: {
      originPrice: '',
      price: '',
      discountPrice: '',
    },
    // 选中科目的买点属性
    trackSelectedSguOpts: {
      Ages: '',
      Course: '',
    },
    //默认支付方式 weixin / zhifubao
    payType: isWeChat() ? 'weixin' : 'zhifubao',
    // ping++支付channel
    pingppChannel: '',
    pingppChannelMap: {
      WxChat: {
        weixin: 'wx_pub',
      },
      GGR: {
        weixin: 'wx',
        zhifubao: 'alipay',
      },
      Web: {
        weixin: 'wx_wap',
        zhifubao: 'alipay_wap',
      },
      ALIPAYMINI: {
        zhifubao: 'alipay',
      },
      DOUYIN: {
        weixin: 'wx_wap',
        zhifubao: 'alipay_wap',
      },
    },
    //私域弹窗
    outSideFollowConfig: {
      agreeShow: false, //是否满足私域弹窗显示条件
      popupUrl: '', //私域挽留弹窗配置信息
      wechatAccount: '',
    },
    // 弹层形式/页面形式订单确认页 abtest： A弹层 B页面
    testPlanPurchase: 'A',
    /**
     * A: 引导下载App 触发：低质A
     * B: 引导关注公众号 触发：低质B
     * C: 正常流程-填地址 触发：非低质，低质C
     */
    pageWillGo: 'C',
  },
  mutations: {
    SET_CONFIG(state, payload) {
      state.configHome = { ...state.configHome, ...payload }
      spuInfoHandler.setInfo(
        JSON.stringify({
          subjectList: payload.subjectList || [],
          sguList: payload.sguList || [],
        })
      )
      state.defaultSubjectCount = payload.subjectCount
    },
    SET_ITEMS(state, payload) {
      state.items = payload
    },
    SET_OWNEDSUB(state, payload) {
      state.ownedSub = payload
    },
    SET_DEFAULTSGU(state, payload) {
      state.defaultIndex = payload // 默认选中的ageId和sguId
      let trackOpts = {}
      for (let item of state.items) {
        if (item.ageId === payload.ageId) {
          trackOpts.Ages = item.age.split('岁')[0]
          for (let sgu of item.sguList) {
            if (sgu.sp2xuId === payload.sp2xuId && sgu.price) {
              trackOpts.Course = sgu.subjectTypes.join('+')
              // 默认价格
              state.defaultPrice = {
                originPrice: NP.divide(sgu.price.originPrice || 0, 100),
                price: NP.divide(sgu.price.price || 0, 100),
                discountPrice: NP.divide(sgu.price.discountPrice || 0, 100),
              }
              state.defaultSubjectCount = sgu.subjectCount || 0 //默认科目数量
              state.trackSelectedSguOpts = trackOpts // 年龄、科目
              return
            }
          }
        }
      }
    },
    // 支付方式
    SET_PAYTYPE(state, payload) {
      state.payType = payload.payType
      state.pingppChannel = payload.pingppChannel
    },
    //选中sgu的埋点
    SET_TRACKSELECTEDSGUOPTS(state, payload) {
      state.trackSelectedSguOpts = payload
    },
    // 默认显示的价格
    SET_DEFAULTPRICE(state, payload) {
      state.defaultPrice = {
        originPrice: NP.divide(payload.originPrice || 0, 100),
        price: NP.divide(payload.price || 0, 100),
        discountPrice: NP.divide(payload.discountPrice || 0, 100),
      }
    },
    //私域挽留弹窗
    SET_OUTSIDEFOLLOWCONFIG(state, payload) {
      state.outSideFollowConfig = { ...state.outSideFollowConfig, ...payload }
    },
    // 弹层形式/页面形式订单确认页 abtest： A弹层 B页面
    SET_TESTPLANPURCHASE(state, payload) {
      state.testPlanPurchase = payload || state.testPlanPurchase
    },
    SET_PAGEWILLGO(state, payload) {
      state.pageWillGo = payload || 'C'
    },
  },
  actions: {
    // configv3
    async getConfigHome({ commit, rootState }) {
      const environment = rootState.channel_environment
      const [err, config] = await API.getConfigHome({
        spuId: rootState.spuId || '',
        spuTag: rootState.spuTag || '',
        channel_environment:
          environment === 'ALIPAYMINI' || environment === 'DOUYIN'
            ? 'Web'
            : rootState.channel_environment,
        visitId: configInfoHandler.getInfo(),
      })
      window.PerfMonitor.custom('getConfigEnd')
      if (!err && config) {
        if (config.visitId) configInfoHandler.setInfo(config.visitId)
        commit('setSpuId', config.spuId, { root: true })
        commit('setSpuTag', config.spuTag, { root: true })
        // detail格式转换
        if (config.detail.length > 0) {
          config.detail = configDetailFormat(config.detail)
        }
        commit('SET_CONFIG', config)
        commit('SET_OWNEDSUB', config.ownedSub)
        commit('SET_DEFAULTPRICE', {
          originPrice: config.defaultOriginPrice,
          price: config.defaultPrice,
          discountPrice: config.defaultDiscountPrice,
        })
      }
      window.PerfMonitor.custom('setConfigEnd')
      return Promise.resolve([err, config])
    },
    // stockv2
    async getSguList({ commit, rootState }) {
      const [err, data] = await API.getSguList({
        spuId: rootState.spuId,
        reSub: QUERY.RMD,
        visitId: abInfoHandler.getInfo(), // 同时开课，后端ABTest
        source: rootState.source,
      })
      window.PerfMonitor.custom('getSguListEnd')
      if (!err && data) {
        commit('SET_ITEMS', data.items)
        commit('SET_OWNEDSUB', data.ownedSub)
        if (data.defaultIndex) commit('SET_DEFAULTSGU', data.defaultIndex)
      }
      window.PerfMonitor.custom('setSguListEnd')
      return Promise.resolve([err, data])
    },
    // stockv3
    async getSguListV3({ commit }, params) {
      let [err, data] = await API.getSguListV3(params)
      if (!err && data) {
        data = formatOriginPrice(data)
        const trackSelectedSguOpts = getTrackSelectedSguOpts(data)
        commit('SET_TRACKSELECTEDSGUOPTS', trackSelectedSguOpts)
      }
      function getTrackSelectedSguOpts({ defaultIndex, sguList, age }) {
        const sp2xuId = defaultIndex?.sp2xuId
        const Ages = age.split('岁')[0]
        const Course = sguList.find((sgu) => sgu.sp2xuId === sp2xuId)?.subjectTypes.join('+')
        return {
          Ages,
          Course,
        }
      }
      function formatOriginPrice(data) {
        let { sguList } = data
        sguList = sguList.map((sgu) => {
          if (sgu.price) {
            const { discountPrice, originPrice, price } = sgu.price
            sgu = {
              ...sgu,
              price: {
                discountPrice: NP.divide(discountPrice, 100),
                originPrice: NP.divide(originPrice, 100),
                price: NP.divide(price, 100),
              },
            }
          }
          return sgu
        })
        return {
          ...data,
          sguList,
        }
      }
      return Promise.resolve([err, data])
    },
    // 支付方式
    setPingppChannel({ state, commit, rootState }, payload) {
      payload.pingppChannel = state.pingppChannelMap[rootState.channel_environment][payload.payType]
      commit('SET_PAYTYPE', payload)
    },
  },
}

// config接口中detail格式转换
function configDetailFormat(configDetail) {
  // 总分总分……结构
  let detail = []
  configDetail.reduce((prev, cur, index) => {
    if (cur.tabTitle && cur.tabTitle.includes('COM')) {
      if (prev) detail.push(prev)
      // 判断是否是最后一位
      if (index === configDetail.length - 1) detail.push(cur)
      return cur
    } else {
      if (Array.isArray(prev)) {
        prev.push(cur)
        // 判断是否是最后一位
        if (index === configDetail.length - 1) detail.push(prev)
        return prev
      } else {
        if (prev) detail.push(prev)
        // 判断是否是最后一位
        if (index === configDetail.length - 1) detail.push([cur])
        return [cur]
      }
    }
  }, null)
  return detail
}
