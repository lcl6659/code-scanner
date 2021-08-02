<template>
  <div>
    <LoginBase
      :configInfo="configInfo"
      @login="handleLogin"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import LoginBase from './components/LoginBase'
// import { setGeneralUserInfo } from '../utils'
import { userInfoHandler } from '@/storeCacher'
import TRACKMIXINS from '@/mixins/track/trackLoginMixins'

export default {
  name: 'Login',
  mixins: [TRACKMIXINS],
  components: {
    LoginBase,
  },
  data() {
    return {
      // user info
      configInfo: {
        iconUrl:
          'https://h5.jiliguala.com/activity/985ea4c910e349e3892981bfce3266d8.png',
        msg: '购买后请在【叽里呱啦】App中使用',
        desc: '手机号码未注册，会自动创建叽里呱啦账号',
        picon:
          'https://h5.jiliguala.com/activity/2056b046b29ddc02ea01548da246d35b.png',
        cicon:
          'https://h5.jiliguala.com/activity/04e5975d7a118d5581468187e36b472c.png',
      },
      actionType: null,
    }
  },
  methods: {
    // 点击登录按钮操作
    handleLogin() {
      this.track('Mobile Sign Up Click')
    },
    // // 登录成功后操作
    handleSuccess(user) {
      // setGeneralUserInfo(user)
      userInfoHandler.setUserInfo(user)
      //跳转页面
      if (this.$route.query.backurl) {
        location.href = decodeURIComponent(this.$route.query.backurl)
      } else {
        this.$router.push({
          path: '/general/order-list',
        })
      }
    },
  },
  created() {
    this.track('Mobile Sign Up Page View')
  },
}
</script>
