<template>
  <div class="guide_to_wx_wrap">
    <div class="top_tip">
      <span>支付成功</span>
    </div>
    <main class="main">
      <div class="main_icon">
        <img
          v-if="qrcodeImg"
          :src="qrcodeImg"
          alt="叽里呱啦"
          @touchstart="handlePress"
          @touchend="handleRelease"
          @error="imgLoadError"
        />
      </div>
      <div class="tip_txt">
        <p>
          <span>{{ guideTip }}</span
          ><i class="txt_bg"></i>
        </p>
        <p>并获取学习顾问专属服务</p>
      </div>
    </main>
  </div>
</template>

<script>
import { config } from '@/config'
import { userInfoHandler } from '@/storeCacher'
import { isWeChat, sentryTrack } from '@/utils'
// import * as QUERY from '@/config/query'
// import { http } from '@/api/request'

export default {
  components: {},
  computed: {},
  data() {
    return {
      guideTip: '',
      qrcodeImg: '',
      uid: '',
      // 长按二维码定时器使用
      timer: null,
    }
  },
  methods: {
    // 取消长按
    handleRelease() {
      clearTimeout(this.timer)
    },
    // 长按二维码
    handlePress() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$track('FollowWOA_View_Press')
      }, 500)
    },
    imgLoadError() {
      sentryTrack({ name: 'Error', message: '引导关注公众号二维码加载失败' })
    },
  },
  async created() {
    this.guideTip = '截屏保存二维码，在公众号填写收货地址'
    if (isWeChat()) {
      this.guideTip = '长按识别二维码，在公众号填写收货地址'
    }
    this.uid = userInfoHandler?._id || ''

    const [err, qrInfo] = await this.$API.getAccountQRWithUid({
      sceneId: 28,
      type: 'TEMP',
      uid: this.uid,
      appId: config.vipAppid,
    })
    if (!err && qrInfo) {
      this.qrcodeImg = qrInfo.qrcode
      // https://gaeacdn.jiliguala.com/jlgl/store/v4.4/0ad2f41b97197fb6fe6bc4e5ef04aa8e.png
    }
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
.guide_to_wx_wrap {
  height: 100vh;
  background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.4/f3245cd0c13bdf495c6f338f2119aa69.png')
    no-repeat top center/100% 170px;
}
.top_tip {
  text-align: center;
  padding-top: 38px;
  span {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    line-height: 28px;
    padding-left: 28px;
    text-align: center;
    background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.4/46bc564bdbf506d6aa19f01359b7d960.png')
      no-repeat left center/23px 23px;
  }
}
.main {
  width: 343px;
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.07);
  border-radius: 20px;
  margin: 32px auto;
  padding: 60px 0 50px;
  text-align: center;
  .main_icon {
    height: 170px;
    width: 170px;
    background: #ffffff;
    border-radius: 15px;
    border: 3px solid #54d89c;
    padding: 4px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .tip_txt {
    margin-top: 20px;
    p {
      line-height: 28px;
      &:nth-child(1) {
        font-size: 17px;
        font-weight: bold;
        color: #2e2e2e;
        position: relative;
        width: fit-content;
        margin: 0 auto;
        span {
          position: relative;
          z-index: 1;
        }
        .txt_bg {
          position: absolute;
          bottom: 0;
          width: 130px;
          height: 12px;
          right: 0;
          background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.4/cefcc70ead548f5619bbfdc2ca0d0111.png')
            no-repeat center/cover;
          border-radius: 24px;
        }
      }
      &:nth-child(2) {
        font-size: 15px;
        color: #999;
      }
    }
  }
}
</style>
