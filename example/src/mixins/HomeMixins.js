//引入工具类
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import {
  isGGR,
  getIntroduceUrl,
  isWeChat,
  loginController,
  judgeInvite,
  isAlipayMini,
  getAllAdhocFlags,
} from '@/utils'
import { storage } from '../storeCacher/basic'
import { userInfoHandler, wxAuthInfoHandler } from '@/storeCacher'
//引入服务
import wxConfigShare from '@/pages/ExtdItem/ReferralItem/ItemWxShare'
import { mapState } from 'vuex'
import { PATH, config } from '@/config'
import * as QUERY from '@/config/query'

//简单的配置定义
const throttleTime = 1000
const debounceTime = 500

// 入口Toast提示枚举、
const toastEnum = {
  ptToast: '亲爱的老用户您好，为您提供专属优惠，不用拼团可直接购买！',
}

// sgu中的state EDIT编辑、ON_SALE启用、OFF_SALE下架、DISABLE禁用
// subjectType OTHER未分类、ENG英语、READ阅读、LOGIC思维、CHS语文、VIRTUAL_CARD虚拟卡

export default {
  inject: ['reload'], //注入app.vue中的方法，刷新页面
  data() {
    return {
      loading: true, // 骨架屏
      disabledBuy: false, // 商品已下架、售罄、不存在 或 没有购课资格（填地址、加好友、已购买）
      disabledBuyCode: null,
      disabledBuyMsg: '',
      showOutSideFollowPopup: false, //私域挽留弹窗
      showInvitedRedPopup: false, //被邀请人收到红包popup
      hasShowHomeOnlyPopup: false, // 进入购买页保证显示一个弹框的原则，首页弹窗已经弹过的标识，因为首页只能有一个弹窗，弹过就根据这个变量判断后续弹不弹
      showRtToast: false, //老用户引导跳转钻石商城
      showDiscount: false, //显示折扣popup
      showCheckout: false, //确认订单弹层
      RTBuyVisible: false, //注册未购买popup
      showAnswer: false, // 购买页看思维答案弹层
      hasShowedFollow: false, //再次返回不显示挽留
      // 控制弹层显示顺序
      showPopupList: [],
      //深度
      pageTop: 0,
      deepest: 0,
      sellTimeOut: false, //15分钟倒计时结束，暂拟定 不能购买，后根据产品具体逻辑修改
      //v2.4 邀请人信息
      inviter: {},
      // 快手
      isKs: false,
      //埋点用错误信息和错误码
      trackErrMsg: {
        45101: 'NotonSale',
        45102: 'Stockout',
        49000: 'NoGoods',
        44201: 'NoAddress',
        44202: 'Noteacher',
        44203: 'HasPaid',
      },
      // 年龄选择弹窗展示
      ageChooseShow: false,
      //TF_V1.7促销弹窗
      salePopupVisable: false,
      popupRuleABTest: '',
      // 内嵌年龄选择模块展示
      insideAgeChooseABTset: null,
    }
  },
  watch: {
    // 解决弹窗重叠的问题
    newShowPopupList: {
      deep: true,
      handler: function (newVal, oldVal) {
        //判断增加或删除，相当于判断数组中的第一位是否改变
        if (newVal[0] !== oldVal[0]) {
          this.popupControl(oldVal[0], newVal[0])
        }
      },
    },
  },
  computed: {
    ...mapState([
      'ifRemoveOriginPrice',
      'itemid',
      'source',
      'sourceurl',
      'initiator',
      'promoterID',
      'firstPromoterID',
      'spuId',
      'spuTag',
    ]),
    ...mapState({
      trackSelectedSguOpts: (state) => state.item.trackSelectedSguOpts,
      outSideFollowConfig: (state) => state.item.outSideFollowConfig,
      defaultIndex: (state) => state.item.defaultIndex,
      defaultPrice: (state) => state.item.defaultPrice,
      defaultSubjectCount: (state) => state.item.defaultSubjectCount,
      configHome: (state) => state.item.configHome,
      items: (state) => state.item.items,
      testPlanPurchase: (state) => state.item.testPlanPurchase,
      /**
       * A: 引导下载App 触发：低质A
       * B: 引导关注公众号 触发：低质B
       * C: 正常流程-填地址 触发：非低质，低质C
       */
      pageWillGo: (state) => state.item.pageWillGo,
    }),
    //hack解决watch监听引用类型时，取不到旧值的问题
    newShowPopupList() {
      return JSON.parse(JSON.stringify(this.showPopupList))
    },
    discountUrl() {
      if (this.defaultPrice.price === 6) {
        return 'https://gaeacdn.jiliguala.com/jlgl/store/v4.5/47b044ffe85fbde7b3171531078769c4.png'
      }
      if (this.defaultPrice.price === 1) {
        return 'https://gaeacdn.jiliguala.com/jlgl/store/v3.9/7c01cbf9f66bfffe53c10fecec5efd3f.png'
      }
    },
    //投放营销弹窗
    salePopupImg() {
      return this.configHome?.popUp?.url
    },
  },
  methods: {
    // 弹窗控制，关闭原弹窗显示挽留弹窗，如果要显示的是挽留弹窗则不关闭原弹窗
    popupControl(closePopup, showPopup) {
      if (closePopup && showPopup !== 'RTBuyVisible' && showPopup !== 'showOutSideFollowPopup') {
        this[closePopup] = false
      }
      if (showPopup) {
        this[showPopup] = true
      }
    },
    //操作弹层列表控制，显示弹层，（挽留弹窗显示在最上层可重叠，addFirst=true）
    showPopup(popup, addFirst = false) {
      if (addFirst) {
        this.showPopupList.unshift(popup)
      } else {
        this.showPopupList.push(popup)
      }
    },
    //操作弹层列表控制，关闭弹层
    closePopup(popup) {
      const index = this.showPopupList.indexOf(popup)
      if (index > -1) this.showPopupList.splice(index, 1)
    },
    // 进入购买页显示首个唯一弹窗
    showHomeOnlyPopup(popup) {
      if (!this.hasShowHomeOnlyPopup && !sessionStorage.getItem('homeHasPop')) {
        this.showPopup(popup)
        this.hasShowHomeOnlyPopup = true
      }
    },
    // 判断是否显示思维答案弹窗
    ifShowAnswerPopup() {
      if (this.configHome.spuId === 'K1MATC_SHICHANG_01') {
        this.showHomeOnlyPopup('showAnswer')
      }
    },
    // 是否邀请人红包弹窗显示
    async ifShowInviter() {
      if (!this.hasShowHomeOnlyPopup && isWeChat() && this.initiator !== 'NA') {
        let params = { inviterUid: this.initiator }
        let [err, inviterInfo] = await this.$API.getInviterWxInfo(params)
        if (!err && inviterInfo) {
          this.inviter = { ...inviterInfo }
          // 如果有邀请人头像昵称再执行ABTest，B流程显示邀请人显示红包,否则不仅如此试验，因为存在有initiator但是获取不到头像和昵称的情况
          if (inviterInfo.nick && inviterInfo.ava) {
            // 显示弹层，邀请人红包
            this.showHomeOnlyPopup('showInvitedRedPopup')
          }
        } else {
          this.inviter = null
        }
      }
    },
    // 判断折扣红包弹层是否显示
    ifShowDiscountPopup() {
      if (!this.hasShowHomeOnlyPopup && this.defaultPrice.price === 6) {
        this.showHomeOnlyPopup('showDiscount') // 优惠红包
        this.$track('Extension Popup View')
      }
    },
    // 关闭红包弹窗
    closeDiscountPopup() {
      this.$track('Extension Popup Close')
      this.closePopup('showDiscount')
    },
    // 显示确认弹层
    showCheckoutPopup() {
      this.showPopup('showCheckout')
      this.$track('Item Pay View')
    },
    // 关闭确认弹层
    closeCheckoutPopup() {
      this.closePopup('showCheckout')
      this.$track('Item Pay Close', this.trackSelectedSguOpts)
    },
    //跳钻石商城
    goDiamondPage() {
      let source = 'H5StoreAfterLogin_Paid'
      location.replace(`${getIntroduceUrl('H5_Store_Dia')}?source=${source}`)
    },
    //登录成功的操作
    async loginSuccessHandler() {
      //登录成功后广告上报
      await this.$API.adReport({
        key: location.href,
        action: 'RESERVATION',
      })
      // 如果是假拼团且快手投放上报
      this.ksReport()
      // 抖音上报
      this.dyReport()
      await this.getSguList()
      // 拉起确认订单弹层
      if (!this.disabledBuy) {
        this.showCheckoutPopup()
        if (this.defaultPrice.discountPrice > 0) {
          this.$toast('恭喜你获得老用户专享福利，赶紧购买吧~')
        }
      }
    },
    // 点击立即购买的回调,Bottom普通底部按钮/LumpSum假拼团底部单独购买/Instalment假拼团底部一键参团/Join去参团按钮
    handleItemButtonClick: throttle(function (str) {
      this.$track('Item Purchase Click', { Scene: str, Depth: this.deepest })
      if (!this.disabledBuy) {
        const currentRouterName = this.$route.name
        if (currentRouterName.includes('Group')) {
          const toastStr = str === 'LumpSum' ? '系统已为您自动成团！' : '恭喜您！参团成功！'
          this.$toast(toastStr)
        }
        this.handleCheckoutLayer()
        return
      } else {
        this.disabledBuyHandle()
      }
    }),
    // 点击购买时判断拉起登录还是创建订单
    async handleCheckoutLayer() {
      // 页面形式订单确认
      if (isAlipayMini() || this.testPlanPurchase === 'B') {
        await this.pageCheckOrder()
      } else {
        // 弹层形式确认订单
        await this.popCheckOrder()
      }
    },
    // 弹层形式确认订单
    async popCheckOrder() {
      if (!userInfoHandler.ifLogin) {
        const result = await loginController.show()
        if (result === 'success') {
          this.loginSuccessHandler()
        }
      } else if (this.items.length !== 0 && this.defaultIndex.sp2xuId !== '') {
        this.showCheckoutPopup()
      } else {
        this.$toast('网络开小差，请点击重试~')
      }
    },
    // 页面形式订单确认
    pageCheckOrder() {
      if (this.configHome.ageSpec && this.configHome.ageSpec.length > 1) {
        this.showPopup('ageChooseShow')
        this.$track('AgeChoose_Dialog_View')
      } else {
        this.goItemConfirm(this.configHome.ageSpec[0].ageId)
      }
    },
    // 跳转订单确认页
    goItemConfirm(ageId) {
      //标识一下首页已经弹过弹窗，在回退的时候就不弹了
      sessionStorage.setItem('homeHasPop', true)
      this.goRoutePage('/item-confirm', 'push', {
        spuId: this.spuId,
        spuTag: this.spuTag,
        ageId,
      })
    },
    // 获取页面配置信息
    async getConfig() {
      // 根据链接 spu 参数显示页面
      const [err, config] = await this.$store.dispatch('getConfigHome')
      if (!err && config) {
        document.title = config.title
        if (config.code && config.code !== 0) {
          this.disabledBuyHandle({ code: config.code, msg: config.toast })
        }
      } else {
        this.disabledBuyHandle(err)
      }
      this.loading = false
      wxConfigShare(this.configHome)
      this.$track('Item Purchase View')
    },
    // 获取售卖科目
    async getSguList(initStage = false) {
      let [err, data] = await this.$store.dispatch('getSguList')
      if (!err && data) {
        return
      } else {
        if (initStage === 'initStage') err.initStage = true
        this.disabledBuyHandle(err)
        this.$track('Mobile Sign Up Toast', {
          Msg: this.trackErrMsg[err.code] || 'Other',
        })
      }
    },

    //不可购买的操作
    // 50000，500，"服务异常"
    // 45101，200,"商品未上架"
    // 45102，200,"商品已售罄"
    // 49000, 200,"商品不存在"
    // 44201, 200,"您有未填地址的订单",
    // 44202, 200,"您有未添加学习顾问的订单",
    // 44203, 200,"特惠体验营仅限新用户专享"
    // 44301, 200,"您已购买过XX、XX科目的体验营，请重新选择"
    disabledBuyHandle(err) {
      if (err) {
        this.$track('Item Purchase Toast', {
          Msg: this.trackErrMsg[err.code] || 'Other',
        })
        if (err.code !== 44301) {
          this.disabledBuyCode = err.code
          this.disabledBuyMsg = err.msg || err.message
          this.disabledBuy = true
        }
      }
      if (this.disabledBuyCode === 44203) {
        if (isWeChat()) {
          if (err?.initStage) {
            //进入购买页如果显示了其他弹窗，就不显示老用户弹窗，如果登录后一定显示老用户弹窗
            this.showHomeOnlyPopup('showRtToast')
          } else {
            this.showPopup('showRtToast')
          }
        } else {
          this.$toast('特惠体验营仅限新用户专享')
        }
      } else {
        this.$toast(err?.msg || err?.message || this.disabledBuyMsg)
      }
      // toast提示以后自动跳转页面
      setTimeout(() => {
        if (this.disabledBuyCode === 44201) {
          //填地址
          this.goRoutePage('/general/address', 'replace')
        } else if (this.disabledBuyCode === 44202) {
          //加学习顾问
          this.goRoutePage('/general/advisor', 'replace')
        }
      }, 2000)
    },
    // 支付结果回调
    chargeResult(opt) {
      // 关闭挽留弹窗
      if (this.RTBuyVisible) {
        this.closePopup('RTBuyVisible')
      }
      if (opt.payStatus === 'success' && this.showCheckout) {
        this.closeCheckoutPopup()
        // 微信环境支付时低质量引流跳转处理（非微信环境的在支付反馈页处理）
        switch (this.pageWillGo) {
          // 引导下载App 触发：低质A
          case 'A':
            this.$track('DownloadAPP_View')
            this.goRoutePage('/guide-to-app', 'push', { oid: opt.orderNo })
            break
          // B: 引导关注公众号 触发：低质B
          case 'B':
            this.$track('FollowWOA_View')
            this.goRoutePage('/guide-to-wx', 'push', { oid: opt.orderNo })
            break
          // 正常流程-填地址 触发：非低质，低质C
          default:
            if (this.source.indexOf('nostandard_ground') > -1) {
              this.goRoutePage('/general/advisor', 'push', { oid: opt.orderNo })
            } else {
              this.goRoutePage('/general/address', 'push', { oid: opt.orderNo })
            }
            break
        }
      }
      //注册未购挽留弹框
      if (opt.payStatus === 'cancel' && !this.RTBuyVisible && !this.hasShowedFollow) {
        this.showPopup('RTBuyVisible', true)
        this.hasShowedFollow = true
      }
    },
    // 跳转路由
    goRoutePage(route, type = 'push', query = {}) {
      this.$router[type]({
        path: route,
        query: {
          ...this.$route.query,
          ...query,
        },
      })
    },
    // 初始化页面
    async initialPage() {
      let itemid = this.itemid
      if (!itemid)
        return this.$router.replace({
          path: '/404',
          query: {
            msg: '无正确itemid',
          },
        })
      // 针对没有initiator参数的旧二维码
      if (typeof this.initiator === 'undefined') {
        return this.$router.push({
          path: '/404',
          query: {
            msg: '活动海报已失效，请重新生成',
          },
        })
      }
      /**
       * 弹窗原则：保证进入页面只有一个弹窗
       * 1、先判断商品购买权限
       * 2、已登录：判断用户购课资格权限
       * 2.1、无购课资格弹窗
       * 2.2、有资格
       * 2.2.1、邀请人弹窗
       * 2.2.2、促销弹窗  v4.3.5思维看答案 下线
       * 2.2.3、优惠红包弹窗
       * 3、未登录：显示邀请人弹窗->拼团toast
       */
      await this.getConfig()
      // 思维看答案弹层
      this.ifShowAnswerPopup()
      // 判断商品购买权限
      if (!this.disabledBuy) {
        await this.ifShowInviter() // 判断是否显示邀请人假红包
        this.ifShowDiscountPopup() // 判断是否显示优惠红包
        // 判断是否有用户信息
        if (userInfoHandler.ifLogin) {
          this.ksReport() // 快手广告上报
          this.dyReport() //抖音上报
          if (this.testPlanPurchase === 'A') await this.getSguList('initStage') //确认订单弹窗流程，获取售卖科目
          //判断用户是否有购买资格
          // if (!this.disabledBuy) {
          //   // 判断是否显示邀请人假红包
          //   await this.ifShowInviter()
          //   // 判断是否显示优惠红包
          //   this.ifShowDiscountPopup()
          // }
        }
        // else if (isWeChat() && this.initiator !== 'NA') {
        //   // 判断是否显示邀请人假红包
        //   await this.ifShowInviter()
        // }
        // TF_V1.7 营销弹窗
        this.ifSalePopup()
        this.fromOtherToast() // 拼团入口Toast
      } else {
        this.ifSalePopup()
      }
      //获取源头邀请人
      if (this.promoterID !== 'NA') this.getFirstPromoter()
    },
    //其他项目跳转到9.9商城toast提示
    fromOtherToast() {
      if (QUERY.FROM && toastEnum[QUERY.FROM]) {
        this.$toast({
          message: toastEnum[QUERY.FROM],
          duration: 2000,
        })
      }
    },
    // 获取源头邀请人UID
    async getFirstPromoter() {
      let params = {
        initiator: this.promoterID,
        xid: this.itemid,
      }
      let [err, promoterInfo] = await this.$API.getFirstPromoter(params)
      if (!err && promoterInfo) {
        this.$store.commit('setFirstPromoterID', promoterInfo.firstPromoterId)
      }
    },

    //快手数据上报
    ksReport() {
      if (this.$route.name === 'itemGroup' && this.isKs) {
        this.$API.ksReport({ queryParams: { ...this.$route.query } }) // 上报
      }
    },
    // 抖音上报
    dyReport() {
      let dyUid = QUERY.DY_UID
      if (dyUid) {
        let { token } = wxAuthInfoHandler.getInfo({ appid: config.dyClientKey, authType: 'silent' })
        this.$API.douyinTransform({ queryParams: { token, dy_uid: dyUid } })
      }
    },

    _autoAdaptNavBar() {
      if (window.history.length <= 1) {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, _t: +new Date() },
        })
      }
    },

    //继续购买
    continuePay: throttle(
      async function () {
        if (this.RTBuyVisible) this.closePopup('RTBuyVisible')
      },
      throttleTime,
      {
        trailing: false,
      }
    ),
    // 监听深度
    updateViewDepth: debounce(function () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const pageHeight = this.$refs.itemPage ? this.$refs.itemPage.scrollHeight : 0
      this.pageTop = ((scrollTop / (pageHeight - window.innerHeight)) * 100).toFixed(2)
      if (Number(this.pageTop) > 100) {
        this.pageTop = 100
      }
      if (Number(this.pageTop) > Number(this.deepest)) {
        //获取最大深度deepest，pageTop当前深度
        this.deepest = this.pageTop
      }
    }, debounceTime),
    // 1、先判断是否显示私域挽留弹窗2、再判断显示注册未购买挽留弹窗
    holdUp() {
      this.$toast.clear() // 清除loading
      if (!this.disabledBuy && !this.hasShowedFollow) {
        if (this.outSideFollowConfig.agreeShow) {
          this.showPopup('showOutSideFollowPopup', true)
          this.hasShowedFollow = true
        } else if (userInfoHandler.ifLogin) {
          this.showPopup('RTBuyVisible', true)
          this.hasShowedFollow = true
        }
      }
    },
    eventOver() {
      let _source = this.source
      let now = new Date().getTime()
      if (_source === 'referral0720' && now > 1596556800000) {
        let t = +new Date()
        window.location.href = `https://${window.location.host}${PATH}index.html?t=${t}#/404?msg=活动已结束`
      }
    },
    // 关闭课程选择弹层
    closeAgeChoosePop() {
      this.closePopup('ageChooseShow')
    },
    // TF_V1.7 促销弹窗显示
    ifSalePopup() {
      if (!this.hasShowHomeOnlyPopup && !this.disabledBuy && !!this.salePopupImg) {
        const abflag = this.popupRuleABTest
        const popupStorage = storage.get('salePopup')
        let firstDate = '' //首次进入时间
        let popupStatus = false
        if (popupStorage) {
          if (abflag === popupStorage.abflag) {
            switch (abflag) {
              case 'A': // 首次进入时显示
                popupStatus = false
                break
              case 'B': // 每次进入时展示
                popupStatus = true
                break
              case 'C': // 当天首次进入
                firstDate = new Date(popupStorage.date) || new Date()
                var strTime = `${firstDate.toLocaleDateString()} 23:59:59`
                var curDayLastTime = new Date(strTime).getTime()
                // 计算首次进入时与当天24时的差值，当前时间与首次进入时间的差值 大于前者，即进入第二天
                popupStatus = curDayLastTime <= new Date().getTime()
                popupStatus && (firstDate = new Date())
                break
            }
          } else {
            firstDate = new Date()
            popupStatus = true
          }
        } else {
          //无存储记录时
          firstDate = new Date()
          popupStatus = true
        }
        storage.set('salePopup', {
          abflag: this.popupRuleABTest,
          date: firstDate,
        })
        if (popupStatus && this.configHome?.popUp?.url) {
          this.showHomeOnlyPopup('salePopupVisable')
        }
      }
    },
    async initAchoc() {
      let {
        TestPlan_XCX_PopupRule = 'A',
        TestPlan_Purchase = 'A',
        TestPlan_AgeSelect = 'A',
        Test_Purchase_H5 = 'A',
      } = await getAllAdhocFlags()
      // 弹窗
      this.popupRuleABTest = TestPlan_XCX_PopupRule
      // 有邀请人信息：确认订单弹层、确认订单页ABTest
      if (judgeInvite()) {
        this.$store.commit('SET_TESTPLANPURCHASE', TestPlan_Purchase)
      }
      // 有邀请人信息，确认订单页情况：选择年龄模块试验
      if (judgeInvite() && TestPlan_Purchase === 'B') {
        this.insideAgeChooseABTset = TestPlan_AgeSelect
      }
      // 无邀请人信息，非呱呱阅读：确认订单弹层、确认订单页ABTest
      if (!judgeInvite() && !isGGR()) {
        this.$store.commit('SET_TESTPLANPURCHASE', Test_Purchase_H5)
      }
      this.$store.commit('setUserTrackProps', {
        TestPlan_Purchase,
        TestPlan_XCX_PopupRule,
        TestPlan_AgeSelect,
        Test_Purchase_H5,
      })
    },
  },
  async created() {
    if (this.source) this.isKs = this.source.slice(0, 3) === 'KS_'
    await this.initAchoc()
    this.initialPage()
  },
  mounted() {
    window.PerfMonitor.custom('mounted')
    this.eventOver()
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, '')
      let that = this
      setTimeout(() => {
        window.addEventListener('popstate', that.holdUp, false)
      }, 500)
    } else {
      this._autoAdaptNavBar()
    }
    //监听滚动深度，为打点使用
    window.addEventListener('scroll', this.updateViewDepth, false)
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.holdUp, false)
    window.removeEventListener('scroll', this.updateViewDepth, false)
  },
  beforeRouteLeave(to, from, next) {
    // 当出现的首页弹窗无法关闭时禁止前进后退
    const blockNext = this.RTBuyVisible
    if (blockNext) {
      next(false)
    } else {
      next()
    }
  },
}
