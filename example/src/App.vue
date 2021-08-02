<template>
  <div id="app" class="app">
    <router-view />
    <!-- 手机登录弹窗 -->
    <login-popup />
  </div>
</template>

<script>
import LoginPopup from '@/components/LoginPopup'
import { mapState } from 'vuex'

export default {
  provide() {
    return {
      reload: this.reload,
    }
  },
  components: { LoginPopup },
  data() {
    return {
      loading: true,
      isRouterAlive: true,
    }
  },
  computed: {
    ...mapState(['initiator', 'promoterID']),
  },
  created() {
    this.saturnUserJump()
  },
  methods: {
    loaded() {
      this.loading = false
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    // 下沉业务判断，如果邀请人是下沉用户，就跳到下沉9.9
    saturnUserJump() {
      let uid = ''
      if (this.initiator !== 'NA') {
        uid = this.initiator
      } else if (this.promoterID !== 'NA') {
        uid = this.promoterID
      }
      if (uid) {
        this.$API
          .isSaturnUser({
            uid: uid,
          })
          .then(([err, res]) => {
            if (!err) {
              if (res.isSaturnUser) {
                location.replace(
                  `${location.origin}/invite-agent-h5/index.html?initiator=${uid}&spuNo=XC_K1GETC_K1MATC_16_SPU#/store/detail/singlecourse`
                )
              }
            }
          })
      }
    },
  },
}
</script>

<style lang="scss">
body {
  font-size: 14px;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100%;
  position: relative;
}

@font-face {
  font-family: 'Jiliguala-Bold';
  src: url(https://h5.jiliguala.com/thome_fonts/Jiliguala-Bold.ttf) format('truetype'),
    url(https://h5.jiliguala.com/thome_fonts/jiliguala-bold-webfont.svg) format('svg'),
    url(https://h5.jiliguala.com/thome_fonts/jiliguala-bold-webfont.woff) format('woff'),
    url(https://h5.jiliguala.com/thome_fonts/jiliguala-bold-webfont.woff2) format('woff2'),
    url(https://h5.jiliguala.com/thome_fonts/jiliguala-bold-webfont.eot) format('eot');
  font-weight: 500 900;
}

@font-face {
  font-family: 'Jiliguala-Regular';
  src: url(https://gaeacdn.jiliguala.com/jlgl/thome_fonts/jiliguala-font-letter-number/Jiliguala-Regular.ttf)
      format('truetype'),
    url(https://gaeacdn.jiliguala.com/jlgl/thome_fonts/jiliguala-font-letter-number/29f257aada6e24e3727dc3bbaf40f411.svg)
      format('svg'),
    url(https://gaeacdn.jiliguala.com/jlgl/thome_fonts/jiliguala-font-letter-number/Jiliguala-Regular.woff)
      format('woff'),
    url(https://gaeacdn.jiliguala.com/jlgl/thome_fonts/jiliguala-font-letter-number/Jiliguala-Regular.woff2)
      format('woff2'),
    url(https://gaeacdn.jiliguala.com/jlgl/thome_fonts/jiliguala-font-letter-number/Jiliguala-Regular.eot)
      format('eot');
}

.sp_font {
  font-family: Jiliguala-Bold;
}

/* prettier-ignore */
@media only screen and (min-width: 1025px) {
  body {
    background-color: #f0f0f0;
  }

  // .app {
  //   width: 750PX;
  //   z-index: 1;
  //   margin: 0 auto;
  // }
}

/* prettier-ignore */
html {
  font-size: 10vw;
  @media (max-width: 320px) {
    font-size: 32PX;
  }
  @media (min-width: 750px) {
    font-size: 75PX;
  }
}

// skeleton
#app .van-skeleton__title {
  height: 50vh;
}
body .van-toast {
  z-index: 3000 !important;
}
</style>
