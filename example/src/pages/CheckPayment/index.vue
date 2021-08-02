<template>
  <section class="check-payment">
    <ChargeStatus :show="true" @change="checkOrderStatus" />
  </section>
</template>

<script>
import ChargeStatus from './widgets/ChargeStatus'
import { userInfoHandler } from '@/storeCacher'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      oid: null,
      MAX_TIMER_COUNT: 20,
      timerCount: 0,
      params: {},
    }
  },
  components: {
    ChargeStatus,
  },
  computed: {
    ...mapState({
      /**
       * A: 引导下载App 触发：低质A
       * B: 引导关注公众号 触发：低质B
       * C: 正常流程-填地址 触发：非低质，低质C
       */
      pageWillGo: (state) => state.item.pageWillGo,
    }),
    trackProps() {
      const { Subject, Ages, Course, pingppChannel, price } = this.$route.query
      let PaymentMode = ''
      if (pingppChannel) {
        PaymentMode = pingppChannel.includes('wx') ? 'WeChat' : 'Alipay'
      }
      return {
        PaymentMode,
        Price: price,
        Subject: decodeURIComponent(Subject), // 解决带加号+的问题
        Ages,
        Course,
      }
    },
  },
  methods: {
    goAddressPage() {
      this.$toast('您已成功购买，请填写收货地址')
      let queryObj = this.params
      this.$router.replace({
        path: '/general/address',
        query: queryObj,
      })
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
    /**
     * 查询订单状态后的下一步跳转
     * flag-true 正常流程是填地址
     * flag-false 正常流程是加好友
     */
    goNext(flag) {
      // 非微信环境的在支付反馈页处理(微信环境支付时低质量引流跳转处理)
      switch (this.pageWillGo) {
        // 引导下载App 触发：低质A
        case 'A':
          this.$track('DownloadAPP_View')
          this.goRoutePage('/guide-to-app', 'push', { oid: this.oid })
          break
        // B: 引导关注公众号 触发：低质B
        case 'B':
          this.$track('FollowWOA_View')
          this.goRoutePage('/guide-to-wx', 'push', { oid: this.oid })
          break
        // 正常流程-填地址 触发：非低质，低质C
        default:
          if (flag) {
            this.goAddressPage()
          } else {
            this.$router.replace({
              path: '/general/advisor',
              query: this.params,
            })
          }
          break
      }
    },

    async checkOrderStatus(isPageLoad) {
      let [err, order] = await this.$API.getOrderV2({ oid: this.oid })
      if (!err && order) {
        clearInterval(this._timer)
        if (order.status === 'needaddress') {
          this.$track('Item Pay Success', this.trackProps)
          this.goNext(true)
        } else if (order.status === 'notpaid' && !isPageLoad) {
          this.$toast('支付失败\n 请重新支付')
          this.$track('Item Pay Fail', this.trackProps)
          this.$router.replace({
            name: 'home',
            query: this.params,
          })
        } else if (order.status === 'paid') {
          this.goNext()
        }
      }
    },

    chargeStatusChecker() {
      if (this._timer) clearInterval(this._timer)
      this._timer = setInterval(() => {
        if (this.timerCount < this.MAX_TIMER_COUNT) {
          this.checkOrderStatus(true)
          this.timerCount++
        }
      }, 3000)
    },
  },
  async created() {
    let params = this.$route.query
    this.params = params
    if (params) {
      userInfoHandler.setUserInfo({
        _id: params.user_id,
        tok: params.user_tok,
        mobile: window.atob(params.mobile),
      })
    }
    this.oid = params.oid
    await this.getLowQualityABTestType(this.oid)
    await this.checkOrderStatus(true)
    this.chargeStatusChecker()
  },
  mounted() {
    this.$track('Item Pay Result View', {
      Channel: this.pingppChannel,
      Price: this.rice,
    })
  },
}
</script>

<style scoped lang="scss">
.check-payment {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
