import Request from './request'
import axios from 'axios'
import { isGGR } from '@/utils'
// 0元课兼容
import { FROM } from '@/config/query'

// 跟随后端微服务接口整合，订单查询接口：NEW
export default {
  login(code, appId, typ = 'silent') {
    return Request.post(`/api/wechat/login?account=${appId}`, {
      code,
      typ,
    })
  },
  // 抖音获取token
  getDyToken(code) {
    return Request.get(`/api/aphrodite/dy/login?code=${code}`)
  },

  // 抖音表单上报
  douyinTransform(params) {
    return Request.post('/api/aphrodite/reservation/dou_yin', params)
  },

  getOpenidByCode(code) {
    return Request.post('/api/wechat/user', {
      code,
    })
  },

  getSmsCode(params) {
    return Request.post('/api/web/sms', params)
  },

  loginViaSmsCode(mobile, code) {
    return Request.get(`/api/users/tokens?u=${mobile}&p=${code}&typ=mobilecode`)
  },
  /**
   * 查询绑定状态
   */
  bindStatus() {
    return Request.get('/api/xshare/wechat/bindStatus')
  },
  // 短信召回获取学习顾问信息
  getUserInfoBySmsuid(...params) {
    return Request.get('/api/mars/smsuid/userinfo', ...params)
  },

  getChargeObject(params) {
    return Request.post('/api/pingpp/wechat/charge', params)
  },

  createOrder(params) {
    return Request.put('/api/pingpp/physical/order', params)
  },

  updateAddress(params) {
    return Request.post('/api/pingpp/physical/order', params)
  },
  //自动绑定流程
  bindAuthSelf(params) {
    return Request.post('/api/xshare/wechat/bind', params).then(([err, data]) => {
      if (err) err.preventDefault()
      return [err, data]
    })
  },
  // 获取邀请人员微信信息
  getInviterWxInfo(params) {
    return Request.get('/api/xshare/hmall/inviter/info', params)
  },

  getPingppChargeObj(params) {
    let data = {
      channel: 'wx_pub',
      ...params,
    }
    const chargeApi = isGGR() ? '/api/mars/order/charge/v3' : '/api/mars/order/charge/v2'
    return Request.post(chargeApi, data)
  },
  //获取短链
  shortUrl(params) {
    const shortApi =
      process.env.VUE_APP_ENV === 'production'
        ? 'https://t.jiliguala.com'
        : 'https://devt.jiliguala.com'
    return axios
      .post(`${shortApi}/shorturl/api/v2/do/shorten`, params)
      .then((res) => {
        return [null, res.data.data]
      })
      .catch((err) => {
        return [err.response.data, null]
      })
  },
  // 获取私域挽留弹窗是配置数据
  getOutSideFollowData() {
    return Request.get('/api/xshare/config/common')
  },

  getRTStockInfo(params) {
    return Request.get('/api/openapp/h599/stock', params)
  },

  checkRTInitiator(params) {
    return Request.get('/api/xshare/check', params)
  },

  getAdvisiorInfo(params) {
    return Request.get('/api/xshare/headmaster/info', params)
  },

  getAdvisiorInfoInWxMenu(params) {
    return Request.post('/api/xshare/headmaster/classinfo', params)
  },
  //新 获取学习顾问信息
  newGetAdvisiorInfo(params) {
    return Request.get('/api/xshare/tutor/info', params)
  },
  //绑定学习顾问
  bindAdvisior(params) {
    return Request.get('/api/openapp/sp99/tutorbind', params)
  },
  //用key来换取用户uid
  getUidByKey(params) {
    return Request.get('/api/openapp/sp99/keytouid', params)
  },
  getFirstPromoter(params) {
    return Request.get('/api/xshare/firstpromoter', params)
  },

  //- 用户购买9.9在二维码页面退出时 判断是否已关注公众号
  checkIfFollow(params) {
    return Request.post('/api/xshare/ggshare/subscheck', params)
  },

  // 获取带uid的关注呱呱爱分享二维码
  getAccountQRWithUid(data) {
    return Request.post('/api/xshare/wechat/qrcode', data)
  },
  /**
   * AuthByWeChatCode
   * @param {*} mobile
   * @param {*} code
   */
  async getItemDetal(ItemId) {
    return Request.get(`/api/eshop/commodity/${ItemId}`)
  },
  /** v2.9 lv课程开关 **/
  async getLvMode(params) {
    return Request.get('/api/xshare/switches/mode', params)
  },
  /** 推广人 **/
  async getPromoterRole(params) {
    return Request.get('/api/promoter/role', params)
  },
  /** v3.9 服务架构优化 配置项获取 config */
  async getConfigHome(params) {
    return Request.get('/api/mars/purchasepage/config/v3', params)
    // return Promise.resolve([null, configMock.data])
  },

  // 根据Auth获取用户其他信息， 如mobile
  getSecurityInfo(...params) {
    return Request.get('/api/users/security/info', ...params)
  },

  // 获取联报科目库存
  getSguList(...params) {
    return Request.get('/api/mars/purchasepage/stock/v2', ...params)
  },

  // 获取联报科目库存(V3)
  getSguListV3(...params) {
    return Request.get('/api/mars/purchasepage/stock/v3', ...params)
  },

  // 获取科目购买状态
  async checkSubject(params) {
    return Request.post('/api/mars/order/lesson', params)
  },
  // 获取最终价格
  async getPriceTobePaid(params) {
    return Request.post('/api/mars/purchasepage/price', params)
  },

  async createExtdOrder(params) {
    return Request.put('/api/mars/order/create/v2', params)
  },

  // 查询用户全部订单
  async getUserOrderStatus(params) {
    return Request.get('/api/mars/order/userall', params)
  },

  // 多订单填写地址接口，支持扩科
  async updateOrdersAddress(params, smstoken) {
    return Request.post(`/api/mars/order/address?smstoken=${smstoken}`, params)
  },

  /** 假拼团获取假头像昵称 */
  getItemGroupMember() {
    return Request.get('/api/xshare/extra-mall/stock')
  },

  /** 获取库存信息 */
  getExtStockInfo(params) {
    return Request.get('/api/xshare/extra-mall/stock', params)
  },

  //当前购买9.9的用户有邀请人信息，且邀请人身份为有效推广人
  isValid() {
    return Request.get('/api/mars/tutor/addTutorConfig')
  },
  //获取学习顾问信息
  getTutorInfo(params) {
    const api = FROM === 'storeFree' ? '/api/mars/fc/tutor/info' : '/api/mars/tutor/info/v2'
    return Request.get(api, params)
  },
  // 手动激活学习顾问
  manualActiveTutor(params) {
    return Request.post('/api/mars/tutor/manualActive', params)
  },
  // 统一填地址--提交地址
  postSaveAddress(params) {
    return Request.post('/api/mars/order/address/v2', params)
  },
  // 获取订单列表
  getOrderList(params) {
    const api =
      FROM === 'storeFree' ? '/api/mars/fc/order/list' : '/api/mars/purchasepage/order/list/v2'
    return Request.get(api, params)
  },
  // 是否引导扩科
  getNeedGuide(params) {
    return Request.get('/api/mars/purchasepage/guide', params)
  },

  // 快手投放 生成表单预约时间
  ksReport(params) {
    return Request.post('/api/xshare/reservation/event', params)
  },
  // 广告上报
  adReport(params) {
    return Request.post('/api/adtrack/report', params)
  },
  /** 判断用户是否看过某个弹窗,促销弹窗 */
  checkPopShowed(params) {
    return Request.get('/api/xshare/popup/showed', params)
  },
  // 购买完成中间页
  // 新获取订单
  getOrderV2(params) {
    return Request.get('/api/mars/order', params)
  },
  // 低质量abcTest获取 根据订单号获取流量分配类型
  getLowQualityABTestType(params) {
    return Request.get('/api/mars/order/getABTestType', params).then(([err, data]) => {
      if (err) err.preventDefault()
      return [err, data]
    })
  },
  // 是否下沉用户
  isSaturnUser(params) {
    return Request.get('/api/xshare/user/saturn/type', params)
  },
}
