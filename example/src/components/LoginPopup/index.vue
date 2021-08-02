<template>
  <div>
    <!-- 手机登录弹窗 -->
    <PlainLoginPopup
      :env="env"
      :show="show"
      title="绑定开营手机号"
      submitBtnText="立即领取"
      source="NA"
      :crm_source="crmSource"
      @openPopup="openPopup"
      @mobileFocus="mobileFocus"
      @codeClick="codeClick"
      @loginSucccess="loginSuccess"
      @loginFail="loginFail"
      @closePopup="closeLogin"
    ></PlainLoginPopup>
  </div>
</template>

<script>
import { EE, loginController } from '@/utils'
import { userInfoHandler } from '@/storeCacher'
import { PlainLoginPopup } from 'components'
import { getCrmSource } from '@/utils'
import { mapState } from 'vuex'

export default {
  components: { PlainLoginPopup },
  data() {
    return {
      getCodeCount: 0,
    }
  },
  computed: {
    show() {
      return this.$store.state.globalConfig.ifShowLogin
    },
    env() {
      return process.env.VUE_APP_ENV
    },
    ...mapState(['itemid']),
    crmSource() {
      return getCrmSource(this.itemid)
    },
  },
  methods: {
    openPopup() {
      this.$track('Mobile Sign Up View')
    },
    mobileFocus() {
      this.$track('Mobile Sign Up Enter')
    },
    codeClick() {
      if (this.getCodeCount === 0) {
        this.getCodeCount++
        this.$track('Get Verification Code Click')
      } else {
        this.$track('Renew Verification Code Click')
      }
    },
    // 登录成功
    loginSuccess(data) {
      const { _id, mobile, tok } = data
      userInfoHandler.setUserInfo({ _id, mobile, tok })
      this.$track('Mobile Sign Up Success', { Mobile: mobile })
      EE.emit('login', 'success')
    },
    // 登录失败
    loginFail(data) {
      const option = data.msg?.includes('验证码错误') ? { Msg: 'CodeError' } : {}
      this.$track('Mobile Sign Up Fail', option)
    },
    closeLogin() {
      loginController.close()
      this.$track('Mobile Sign Up Close') //登录浮层关闭
    },
  },
}
</script>
