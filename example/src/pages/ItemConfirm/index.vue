<template>
  <div class="confirm">
    <div class="hint" v-if="isShowOldUserBuyDiscounts">
      您已经是老用户啦，可享专属低价！
    </div>
    <div class="login-wrap">
      <LoginWrap :mobile="mobile" @emitEvent="loginEvent" />
    </div>
    <div class="confirm-page">
      <ItemSelect
        v-if="stock"
        :stock="stock"
        :sp2xuId="sp2xuId"
        @changeSgu="changeSgu"
        @changePayType="changePayType"
      />
      <div class="btn-wrap" v-if="ifShowBottomBtn">
        <BtnWrap
          :ifPurchasable="ifPurchasable"
          :ifShowUnPurchasable="ifShowUnPurchasable"
          :priceObj="price"
          @showPopUp="showPopUp"
          @buy="purchase"
        ></BtnWrap>
      </div>
    </div>
    <!-- 老用户不能购课弹窗 -->
    <OldUserPopUp :ifShow="isShowOldUserPopUp" @hide="hidePopUp" />
  </div>
</template>

<script>
import { userInfoHandler } from '@/storeCacher'
import LoginWrap from './components/LoginWrap'
import ItemSelect from './components/ItemSelect'
import BtnWrap from './components/BtnWrap'
import OldUserPopUp from './components/OldUserPopUp'
import { isWeChat } from '@/utils'
import PAY_MIXINS from './mixins/pay'
import { RMD, DY_UID } from '@/config/query'
import { DEFAULT_ERR_MSG, config } from '@/config'
import { abInfoHandler, wxAuthInfoHandler } from '@/storeCacher'

export default {
  mixins: [PAY_MIXINS],
  data() {
    return {
      isShowOldUserPopUp: false,
      stock: null,
      mobile: '',
      ageId: '',
      sp2xuId: '',
      payType: isWeChat() ? 'weixin' : 'zhifubao',
      ifShowBottomBtn: false,
    }
  },
  watch: {
    // isShowOldUserBuyDiscounts(val) {
    //   if (val) {
    //     this.$track('PurchasedBar_View')
    //   }
    // },
    mobile(val) {
      if (!val) {
        this.$track('SignUp_View')
      }
    },
    isShowOldUserPopUp(val) {
      if (val) {
        this.$track('GoDiamond_Dialog_View')
      }
    },
  },
  computed: {
    ifPurchasable() {
      return !!this.stock?.sguList.find((sgu) => sgu.status === 'onsale')
    },
    age() {
      const { age } = this.stock || {}
      return age || ''
    },
    ifPurchasableSguDiscount() {
      return !!this.stock?.sguList.find(
        (sgu) => sgu.status === 'onsale' && sgu.price.discountPrice > 0
      )
    },
    isShowOldUserBuyDiscounts() {
      const isOldUser = this.stock?.hasSubjectTypes?.length > 0
      const _isShowOldUserBuyDiscounts = isOldUser && this.ifPurchasableSguDiscount
      if (_isShowOldUserBuyDiscounts) this.$track('PurchasedBar_View')
      return _isShowOldUserBuyDiscounts
    },
    ifShowUnPurchasable() {
      return !this.ifPurchasable && isWeChat()
    },
    currentSgu() {
      return this.stock?.sguList.find((sgu) => sgu.sp2xuId === this.sp2xuId)
    },
    price() {
      return this.currentSgu?.price
    },
  },
  components: {
    ItemSelect,
    BtnWrap,
    OldUserPopUp,
    LoginWrap,
  },
  async created() {
    await this.updateStock()
    this.$track('New_Item_Pay_View', {
      Ages: this.age,
    })
    this.ifShowBottomBtn = true
    this.mobile = await userInfoHandler.getMobile()
  },
  methods: {
    async updateStock() {
      const { ageId, spuId } = this.$route.query
      this.ageId = ageId
      const [err, stock] = await this.$store.dispatch('getSguListV3', {
        reSub: RMD,
        ageId,
        spuId,
        visitId: abInfoHandler.getInfo(), // 同时开课，后端ABTest
        source: this.source, // mixin中获取source
      })

      let errHandleObj = err
      if (!err) {
        this.stock = stock
        this.sp2xuId = this.stock.defaultIndex?.sp2xuId || ''
        if (!this.ifPurchasable && !this.ifShowUnPurchasable) {
          this.$track('PurchasedToast_View')
        }
        errHandleObj = { code: stock.code, msg: stock.toast }
      }
      this._stockErrHandler(errHandleObj)
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
    _stockErrHandler(err) {
      if (err && err.code !== 0) {
        const msg = err.msg || DEFAULT_ERR_MSG
        const that = this
        const ifShowPopUp = err.code === 44203 && isWeChat()
        if (ifShowPopUp) {
          that.showPopUp()
        } else {
          this.$toast({
            message: msg,
            onClose: function () {
              const code = err.code
              const codeRouteMap = {
                '44201': '/general/address',
                '44202': '/general/advisor',
              }
              const next = codeRouteMap[code]
              next && that.goRoutePage(next, 'replace')
            },
          })
        }
      }
    },
    changeSgu(sgu) {
      this.sp2xuId = sgu.sp2xuId
    },
    changePayType(payType) {
      this.payType = payType
    },
    showPopUp() {
      this.isShowOldUserPopUp = true
    },
    purchase() {
      this.$track('Item_Pay_Click', {
        Course: this.currentSgu.subjectTypes.join('+'),
      })
      if (userInfoHandler.ifLogin) {
        this.createOrder({
          ageId: this.ageId,
          sp2xuId: this.sp2xuId,
          payType: this.payType,
        })
      } else {
        this._loginOnFocus()
      }
    },
    _loginOnFocus() {
      window.scrollTo(0, 0)
      const DOM_INPUT = document.querySelector('input')
      DOM_INPUT.focus()
    },
    hidePopUp() {
      this.isShowOldUserPopUp = false
    },
    loginEvent({ eventName, eventInfo }) {
      switch (eventName) {
        case 'loginSucccess':
          this.mobile = eventInfo.mobile
          userInfoHandler.setUserInfo(eventInfo)
          this.updateStock()
          // 抖音上报
          this.dyReport()
          this.$track('SignUpSucess_Click')
          break
        case 'mobileFocus':
          this.$track('SignUp_Click')
          break
        case 'codeFocus':
          this.$track('EnterCode_Click')
          break
        case 'codeClick':
          this.$track('GetCode_Click')
          break
        default:
          break
      }
    },
    // 抖音广告上报
    dyReport() {
      const dyUid = DY_UID
      if (dyUid) {
        let { token } = wxAuthInfoHandler.getInfo({ appid: config.dyClientKey, authType: 'silent' })
        this.$API.douyinTransform({ queryParams: { token, dy_uid: dyUid } })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.confirm {
  min-height: 100vh;
  background: #f5f5f5;
  .hint {
    background: #fff3bd;
    font-size: 14px;
    text-align: center;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #945500;
    line-height: 30px;
  }
  .login-wrap {
    padding: 16px 15px;
  }
  .confirm-page {
    margin-top: 8px;
    padding: 0 15px 135px;
    .btn-wrap {
      position: fixed;
      width: 100%;
      left: 0;
      bottom: 0;
    }
  }
}
</style>
