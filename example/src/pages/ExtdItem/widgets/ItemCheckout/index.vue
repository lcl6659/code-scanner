<template>
  <div class="checkout-page">
    <Popup
      v-model="show"
      :close-on-click-overlay="false"
      round
      position="bottom"
      :safe-area-inset-bottom="true"
      @click-overlay="closePopup"
    >
      <div class="wrap">
        <div class="headClose">
          <img
            v-if="showCloseBtn"
            class="close-btn"
            src="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/2d04e2fe903c0ddfb09eeeee684dd435.png"
            alt="X"
            @click="closePopup"
          />
        </div>
        <Checkout
          class="checkout"
          v-if="showCheckout"
          :transData="transData"
          :ifRemoveOriginPrice="ifRemoveOriginPrice"
          @change="change"
          @submit="createOrder"
        ></Checkout>
      </div>
    </Popup>
  </div>
</template>

<script>
import { Checkout } from 'components'
import { Popup } from 'vant'
import { mapState } from 'vuex'
import { getAdhocFlag, isDouyin } from '@/utils'
import { pingppCharge } from '@/services/ChargeService/index'
import throttle from 'lodash/throttle'
import { abInfoHandler, wxAuthInfoHandler } from '@/storeCacher'
import { config } from '@/config'

export default {
  components: {
    Popup,
    Checkout,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    showCloseBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      show: this.value,
      showCheckout: false,
      OrderConfirmTypeABTest: '',
      order: {},
    }
  },
  computed: {
    ...mapState([
      'ifRemoveOriginPrice',
      'channel_environment',
      'itemid',
      'source',
      'initiator',
      'promoterID',
      'did',
    ]),
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
    transData() {
      return {
        testType: this.OrderConfirmTypeABTest,
        customPayTypes: this.customPayTypes(),
        payTypeId: this.payType,
        spuName: this.configHome.spuName,
        lessonStartTime: this.configHome.lessonStartTime,
        items: this.items,
        defaultIndex: this.defaultIndex,
      }
    },
  },
  watch: {
    value(val) {
      this.show = val
      if (val) {
        this.showCheckout = true
        this.$track('Item Pay Specs Select', this.trackSelectedSguOpts) // 默认选中的埋点
        this.$nextTick(() => {
          document.getElementsByClassName('van-popup')[0].style.maxHeight = `${
            window.innerHeight - 30
          }px`
          document.getElementsByClassName('wrap')[0].style.maxHeight = `${
            window.innerHeight - 30
          }px`
        })
      }
    },
  },
  methods: {
    //自定义支付方式
    customPayTypes() {
      if (this.channel_environment === 'WxChat') return []
      if (this.source.includes('TXGG')) return ['weixin']
      return ['zhifubao', 'weixin']
    },
    change(obj) {
      if (!obj.abnormal) {
        const { ageId, sp2xuId, payType } = obj
        this.$store.commit('SET_DEFAULTSGU', { ageId, sp2xuId }) // 当前选中的年龄科目，再打开弹层默认选中
        this.$store.dispatch('SET_PAYTYPE', { payType }) // 当前选中的支付方式，再打开弹层默认选中
      }
      this.$track('Item Pay Specs Select', this.trackSelectedSguOpts)
    },
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
        this.$emit('disabledBuyHandle', err)
      }
    }, 1000),
    //支付
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
      this.$emit('chargeResult', { payStatus: result, ...this.order })
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
    closePopup() {
      this.$emit('close')
    },
  },
  async created() {
    this.OrderConfirmTypeABTest = (await getAdhocFlag('TestPlan_OrderConfirmType')) || 'A'
    this.$store.commit('setUserTrackProps', {
      TestPlan_OrderConfirmType: this.OrderConfirmTypeABTest,
    })
  },
}
</script>

<style lang="scss" scoped>
.checkout-page {
  .headClose {
    position: fixed;
    width: 100%;
    background: #fff;
    border-radius: 20px;
    z-index: 5;
  }
  .close-btn {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 10px;
    top: 10px;
    z-index: 99;
  }
  .van-popup {
    overflow: hidden;
    .wrap {
      overflow: auto;
    }
  }
}
</style>
