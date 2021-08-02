<template>
  <div class="tutorInfo-page" @touchstart="handlePress" @touchend="handleRelease">
    <!-- 透明图片：微信中长按整块区域可以唤起自带的图片识别等功能 -->
    <img
      v-if="isWechat"
      class="transparentmask"
      src="https://gaeacdn.jiliguala.com/jlgl/store/v4.5/8f9a24205bbcb7d4b040819293aadc81.png"
    />
    <TutorInfoHead :tutorInfo="tutorInfo"></TutorInfoHead>
    <div class="qrcode">
      <img
        :src="tutorInfo.qrcodeUrl"
        alt="qrcodeImg"
        @error="imgLoadError"
      />
    </div>
    <div class="prompt">
      <p v-if="isWechat">
        长按识别二维码 添加{{ tutorInfo.subjectName }}学习顾问
      </p>
      <div v-else-if="tutorInfo.tutorWechat">
        <p class="explain"><span>微信号</span>{{ tutorInfo.tutorWechat }}</p>
        <p class="btn" @click="copy(tutorInfo.tutorWechat)">
          点击复制微信号，添加学习顾问
        </p>
      </div>
      <p class="prompt" v-else-if="!tutorInfo.tutorWechat">
        截屏保存二维码 添加{{ tutorInfo.subjectName }}学习顾问
      </p>
    </div>
  </div>
</template>

<script>
import TutorInfoHead from './TutorInfoHead'
import { isWeChat, copyToClipboard, sentryTrack } from '@/utils'
import TRACKMIXINS from '@/mixins/track/trackAdvisorMixins'
import { mapState } from 'vuex'
export default {
  components: { TutorInfoHead },
  mixins: [TRACKMIXINS],
  name: 'TutorInfo',
  props: {
    tutorInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isWechat: isWeChat(),
    }
  },
  computed: {
    ...mapState(['channel_environment']),
  },
  methods: {
    copy(account) {
      copyToClipboard(account)
      if (this.channel_environment === 'ALIPAYMINI') {
        this.$toast('复制成功')
      } else if (this.channel_environment === 'Web') {
        this.$toast('复制成功\n正在为您跳转到微信')
      } else {
        this.$toast('复制成功\n请前往微信添加')
      }
      this.$store.commit('set_needBindFollow', true)
      const { subjectType, tutorBindSet } = this.tutorInfo
      this.track('Class Teacher Add Click', {
        SubjectClick: subjectType,
        SubjectStatus:
          tutorBindSet === true
            ? 'HasBind'
            : tutorBindSet === false
            ? 'NotBind'
            : 'NoInfo',
      })
      if (this.channel_environment === 'Web') {
        setTimeout(() => {
          location.href = 'weixin://'
        }, 1000)
      }
    },
    // 取消长按
    handleRelease() {
      clearTimeout(this.timer)
    },
    // 长按二维码
    handlePress() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$store.commit('set_needBindFollow', true)
        const { subjectType, tutorBindSet } = this.tutorInfo
        this.track('Class Teacher Add Message Scan', {
          SubjectClick: subjectType,
          SubjectStatus:
            tutorBindSet === true
              ? 'HasBind'
              : tutorBindSet === false
              ? 'NotBind'
              : 'NoInfo',
        })
      }, 500)
    },
    imgLoadError() {
      sentryTrack({ name: 'Error', message: '学习顾问二维码加载失败' })
    },
  },
}
</script>
<style lang="scss" scoped>
.tutorInfo-page {
  position: relative;
  .transparentmask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .qrcode {
    width: 161px;
    height: 161px;
    border-radius: 14px;
    border: 3px solid #54d89c;
    margin: 15px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      display: inline-block;
      width: 135px;
      height: 135px;
    }
  }
  .prompt {
    margin: 20px 0;
    p {
      font-size: 16px;
      line-height: 22px;
      font-weight: 700;
      color: #2e2e2e;
      margin: 5px 0;
      text-align: center;
    }
    .explain {
      font-size: 14px;
      font-weight: 400;
      color: #404040;
      line-height: 19px;
      margin-bottom: 10px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #919398;
        line-height: 19px;
        margin-right: 14px;
      }
    }
    .btn {
      width: 261px;
      height: 50px;
      background: #26c07b;
      border-radius: 25px;
      line-height: 50px;
      margin: 0 auto;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
    }
  }
}
</style>
