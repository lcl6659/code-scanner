/* 2.6拼团支付中转页面 */
<template>
  <div class="order-transfer-page"></div>
</template>

<script>
import { userInfoSideEffect } from '@/utils'
import { pingppCharge } from '@/services/ChargeService'
import { http } from '@/api/request'
import { setUserProps } from 'jlgldb-track'
import * as QUERY from '@/config/query'

export default {
  name: 'orderTransfer',
  data() {
    return {
      // 解决回调链接字段会被拼接两次的问题（埋点会有amp和数仓两次埋点回调）
      callbackUrlHasStatus: false,
    }
  },
  computed: {
    priceTobePaid() {
      return this.p ? this.p / 100 : '9.9'
    },
  },
  mounted() {
    this.$toast.loading({
      message: '支付中...',
      forbidClick: true,
      duration: 0,
    })
    this.init()
  },
  methods: {
    // 初始化路由
    init() {
      // 接口参数
      this.auth = QUERY.AUTH
      this.uid = atob(this.auth.substr(6)).split(':')[0]
      this.itemid = QUERY.ITEM_ID
      this.oid = QUERY.OID
      this.p = QUERY.P
      // 埋点 用户属性
      this.userProps =
        !QUERY.getQueryString('userProps') ||
        JSON.parse(atob(QUERY.getQueryString('userProps')))
      // 埋点 用户属性
      this.trackProps =
        !QUERY.getQueryString('trackProps') ||
        JSON.parse(atob(QUERY.getQueryString('trackProps')))
      // 回调 页面
      this.callbackUrl = decodeURIComponent(QUERY.getQueryString('callbackUrl'))
      if (this.auth) {
        http.defaults.headers.common['Authorization'] = unescape(this.auth)
      }
      if (this.userProps) {
        setUserProps(this.userProps)
      }
      userInfoSideEffect(this.uid)
      if (this.oid) {
        const trackProps = {
          Channel: 'Wechat',
          ParticipantPrice: this.priceTobePaid,
          ...this.trackProps,
        }
        this.$track(
          'Item Pay ToCharge',
          trackProps,
          this.userProps,
          false,
          null,
        )
        this.toCharge()
      }
    },
    // 支付
    async toCharge() {
      // 微信内支付参数
      let payResult = await pingppCharge({
        orderNo: this.oid,
        itemid: this.itemid,
        pingppChannel: 'wx_pub',
      })
      if (payResult) {
        let [err, result] = payResult
        this.$track('Item Pay CallBack', { result: result }, null, false, null)
        this.chargeResultHandler(err, result)
      }
    },
    chargeResultHandler(err, result) {
      let _that = this
      const trackProps = {
        Channel: 'Wechat',
        ParticipantPrice: this.priceTobePaid,
        ...this.trackProps,
      }
      if (result === 'success') {
        this.$track(
          'Item Pay Success',
          trackProps,
          this.userProps,
          false,
          function () {
            _that.goClassAdvisiorPage('success')
          },
        )
      } else if (result === 'fail') {
        const ErrorMessage = /network/gi.test(err.msg)
          ? 'NetworkConnectionFailed'
          : 'Unknown'
        this.$track(
          'Item Pay Fail',
          {
            ...trackProps,
            ErrorMessage,
          },
          this.userProps,
          false,
          function () {
            _that.$dialog.alert({
              title: '支付失败',
              message: `${err.msg}${err.extra}`,
            })
            _that.goClassAdvisiorPage('fail')
          },
        )
      } else if (result === 'cancel') {
        this.$track(
          'Item Pay Fail',
          {
            ...trackProps,
            ErrorMessage: 'Cancelled',
          },
          this.userProps,
          false,
          function () {
            _that.goClassAdvisiorPage('cancel')
          },
        )
      }
    },
    // 解决回调链接字段会被拼接两次的问题（埋点会有amp和数仓两次埋点回调）
    goClassAdvisiorPage(status) {
      let _that = this
      if (!_that.callbackUrlHasStatus) {
        _that.callbackUrlHasStatus = true
        setTimeout(() => {
          _that.callbackUrl += `?status=${status}&oid=${_that.oid}`
          window.location.href = _that.callbackUrl
        }, 300)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.order-transfer-page {
  height: 100vh;
  width: 100vw;
  background-color: transparent;
}
</style>
