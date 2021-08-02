<script>
import { mapState } from 'vuex'
import { pingppCharge } from '@/services/ChargeService/index'
import throttle from 'lodash/throttle'
import { abInfoHandler, wxAuthInfoHandler } from '@/storeCacher'
import { isDouyin } from '@/utils'
import { config } from '@/config'

export default {
  data() {
    return {
      order: {},
    }
  },
  computed: {
    ...mapState(['channel_environment', 'itemid', 'source', 'initiator', 'promoterID', 'did']),
    ...mapState({
      trackSelectedSguOpts: (state) => state.item.trackSelectedSguOpts,
      configHome: (state) => state.item.configHome,
      items: (state) => state.item.items,
      defaultIndex: (state) => state.item.defaultIndex,
      payType: (state) => state.item.payType,
      pingppChannel: (state) => state.item.pingppChannel,
      /**
       * A: 引导下载App 触发：低质A
       * B: 引导关注公众号 触发：低质B
       * C: 正常流程-填地址 触发：非低质，低质C
       */
      pageWillGo: (state) => state.item.pageWillGo,
    }),
  },
  methods: {
    // 点击支付按钮创建订单
    createOrder: throttle(async function (obj) {
      if (!obj.sp2xuId) {
        this.$toast('必须选择体验科目哦')
        return
      }
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      })
      const { ageId, sp2xuId, payType } = obj
      this.$store.commit('SET_DEFAULTSGU', { ageId, sp2xuId })
      this.$store.dispatch('setPingppChannel', { payType })
      this.$track('Item Pay Click', this.trackSelectedSguOpts)
      let params = {
        itemid: this.itemid,
        nonce: new Date().toISOString(),
        source: this.source,
        xshareInitiator: this.initiator === 'NA' ? undefined : this.initiator,
        sharer: this.promoterID === 'NA' ? undefined : this.promoterID,
        sp2xuIds: [obj.sp2xuId],
        adtrack_key: isDouyin()
          ? wxAuthInfoHandler.getInfo({ appid: config.dyClientKey, authType: 'silent' })?.token //抖音传token
          : location.href, //广告投放
        visitId: abInfoHandler.getInfo(), // 同时开课，后端ABTest
        did: this.did, //地推邀请人信息
      }
      let [err, orderInfo] = await this.$API.createExtdOrder(params)
      this.$toast.clear()
      if (!err && orderInfo) {
        this.order = orderInfo
        //支付
        this.toCharge(orderInfo)
      } else {
        this.disabledBuyHandle(err)
      }
    }, 1000),
    /**
     * @params orderInfo: { orderNo, price }
     */
    async toCharge(orderInfo) {
      // 低质量引流ab获取
      this.getLowQualityABTestType(orderInfo.orderNo)
      let payParams = this.initPayParams(orderInfo)
      let payResult = await pingppCharge(payParams)
      if (payResult) {
        let [err, result] = payResult
        this.chargeResultHandler(err, result)
      }
    },
    // 初始化支付参数
    initPayParams(orderInfo) {
      if (this.channel_environment === 'WxChat') {
        orderInfo = {
          ...orderInfo,
          itemid: this.itemid,
          pingppChannel: this.pingppChannel,
        }
        return orderInfo
      }
      if (this.channel_environment === 'GGR') {
        orderInfo = { ...orderInfo, pingppChannel: this.pingppChannel }
        return orderInfo
      }
      // web
      orderInfo = {
        ...orderInfo,
        pingppChannel: this.pingppChannel,
        trackSelectedSguOpts: this.trackSelectedSguOpts,
        subjectList: this.configHome.subjectList,
      }
      return orderInfo
    },
    // 支付结果回调
    chargeResultHandler(err, result) {
      if (result === 'success') {
        this.$track('Item Pay Success', {
          ...this.trackSelectedSguOpts,
          Price: this.order.price,
          PaymentMode: this.payType === 'weixin' ? 'WeChat' : 'Alipay',
        })
      } else if (result === 'fail') {
        const Msg = /network/gi.test(err.msg) ? 'NetworkConnectionFailed' : 'Unknown'
        this.$track('Item Pay Fail', {
          ...this.trackSelectedSguOpts,
          Price: this.order.price,
          PaymentMode: this.payType === 'weixin' ? 'WeChat' : 'Alipay',
          Msg,
        })
        this.$dialog.alert({
          title: '支付失败',
          message: `${err.msg}${err.extra}`,
        })
      } else if (result === 'cancel') {
        const Msg = 'Cancelled'
        this.$track('Item Pay Fail', {
          ...this.trackSelectedSguOpts,
          Price: this.order.price,
          PaymentMode: this.payType === 'weixin' ? 'WeChat' : 'Alipay',
          Msg,
        })
      } else {
        this.$toast(err.msg)
      }
      this.chargeResult({ payStatus: result, ...this.order })
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
    // 支付结果回调
    chargeResult(opt) {
      if (opt.payStatus === 'success') {
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
    },
    // 低质量引流ab获取
    async getLowQualityABTestType(orderNo) {
      let [err, abRes] = await this.$API.getLowQualityABTestType({
        oid: orderNo || '',
      })
      if (!err && abRes && abRes.orderType == 2) {
        this.$store.commit('SET_PAGEWILLGO', abRes.testType)
      } else {
        this.$store.commit('SET_PAGEWILLGO', 'C')
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
        //埋点用错误信息和错误码
        const trackErrMsg = {
          45101: 'NotonSale',
          45102: 'Stockout',
          49000: 'NoGoods',
          44201: 'NoAddress',
          44202: 'Noteacher',
          44203: 'HasPaid',
        }
        this.$track('Item Purchase Toast', {
          Msg: trackErrMsg[err.code] || 'Other',
        })
        this.updateStock()
      }
    },
  },
}
</script>
