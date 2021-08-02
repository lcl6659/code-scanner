import Vue from 'vue'
import Vuex from 'vuex'
import {
  getAppID,
  getSkuType,
  filterByPID,
  isWeChat,
  isGGR,
  isJLGL,
  isAlipayMini,
  isDouyin,
} from '@/utils'
import item from './item' // 扩科-服务架构整改专用
import generalStore from './generalStore'
import * as QUERY from '@/config/query'
import { spuInfoHandler } from '@/storeCacher'

const environment = (() => {
  if (isWeChat()) return 'WxChat'
  if (isGGR()) return 'GGR'
  if (isJLGL()) return 'JLGL'
  if (isAlipayMini()) return 'ALIPAYMINI'
  if (isDouyin()) return 'DOUYIN'
  return 'Web'
})()
// 不同环境默认source
const defaultSource = () => {
  let source = {
    WxChat: 'NA',
    GGR: 'ORGANIC_USER',
    Web: 'ORGANIC_USER',
    ALIPAYMINI: 'ORGANIC_USER',
    DOUYIN: 'nostandard_livestream_daibo_douyin_xxx',
  }
  return source[environment]
}
// 不同环境默认itemid
const defaultItemid = () => {
  let itemid = {
    WxChat: 'H5_XX_Sample',
    GGR: 'H5_Sample_OutsideH5',
    Web: 'H5_Sample_OutsideH5',
    ALIPAYMINI: 'H5_Sample_OutsideH5',
    DOUYIN: 'H5_XX_Sample',
  }
  return itemid[environment]
}
// 删除原价政策
const ifRemoveOriginPrice = () => {
  return true
}

Vue.use(Vuex)
const filterByPIDParms = filterByPID(QUERY.PROMOTER_ID)
const store = new Vuex.Store({
  state: {
    channel_environment: environment, //"WxChat/Web/XCX"//各渠道环境对应兜底spuid
    ifRemoveOriginPrice: ifRemoveOriginPrice(),
    spuId: QUERY.SPU_ID,
    spuTag: QUERY.SPU_TAG,
    source: filterByPIDParms.source || defaultSource(),
    sourceurl: '', // 来源页地址（下沉）
    // 进入页面的sku的itemid
    itemid: filterByPIDParms.itemid || defaultItemid(),
    initiator: QUERY.INITIATOR || 'NA',
    // 第三方的id()
    promoterID: QUERY.PROMOTER_ID,
    //地推推广人
    did: QUERY.DID,
    // 广告投放的参数
    aid: QUERY.AID,
    cid: QUERY.CID,
    click_id: QUERY.CLICK_ID,
    userTrackProps: {
      TestPlan_OrderConfirmType: null, // 确认订单弹层科目显示AB实验
      stayPopABTest: null, // 假拼团私域挽留弹窗ABTest
      TestPlan_XCX_PopupRule: null, //TF_V1.7 促销弹窗ABCTest
      TestPlan_Purchase: null, //确认订单页、确认订单弹层ABTest
      TestPlan_AgeSelect: null, //购买页内选择年龄模块是否显示试验
      Test_Purchase_H5: null, // 投放、思域等渠道确认订单页/确认订单弹层ABTest
    },
    // 源头邀请人的uid
    firstPromoterID: undefined,
    ENV: process.env.VUE_APP_ENV,
    globalConfig: {
      ifShowLogin: false,
    },
  },
  getters: {
    baseTrackProps(state) {
      // 缓存的spu信息
      let originSpuInfo = spuInfoHandler.getInfo() ? JSON.parse(spuInfoHandler.getInfo()) : null
      return {
        OriginURL: window.location.href,
        Spu: state.item.configHome.spuId,
        SpuTag: state.item.configHome.spuTag,
        Subject: (state.item.configHome.subjectList || originSpuInfo?.subjectList || []).join('+'),
        SguList: (state.item.configHome.sguList || originSpuInfo?.sguList || []).join('+'),
        ItemID: state.itemid,
        Source: state.source || 'customer service',
        PromoterID: state.promoterID,
        // v2.8 针对个性化海报新增
        PosterType: QUERY.P_TYPE, // 海报类型
        PosterPlace: QUERY.P_PLACE, // 海报在海报生成页的位置
        PosterClass: QUERY.P_CLASS, // common普通海报，custom个性化海报
        PosterSub: QUERY.P_SUB, // 海报指定的spuId
        // v3.6 新增,为了追踪用户海报分享周期
        PosterDate: QUERY.P_DATE,
        // 源头邀请人的uid
        FirstPromoterID: state.firstPromoterID,
        //广告投放
        AID: state.aid,
        CID: state.cid,
        ClickId: state.click_id,
        // 地推推广人
        Did: state.did,
      }
    },
    appid(state) {
      return getAppID(getSkuType(state.itemid))
    },
    skuType(state) {
      return getSkuType(state.itemid)
    },
    userTrackProps(state) {
      return state.userTrackProps
    },
  },
  mutations: {
    setSpuId(state, payload) {
      state.spuId = payload
    },
    setSpuTag(state, payload) {
      state.spuTag = payload
    },
    setFirstPromoterID(state, payload) {
      state.firstPromoterID = payload || null
    },
    setSource(state, payload = {}) {
      state.source = payload.source
    },
    setInitiator(state, payload = {}) {
      state.itemid = payload.initiator
    },
    setUserTrackProps(state, payload) {
      state.userTrackProps = { ...state.userTrackProps, ...payload }
    },
    updateGlobalConfig(state, payload) {
      state.globalConfig = { ...state.globalConfig, ...payload }
    },
  },
  actions: {},
  modules: {
    item,
    generalStore,
  },
})

export default store
