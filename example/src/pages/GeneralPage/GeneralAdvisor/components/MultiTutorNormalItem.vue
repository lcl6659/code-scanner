/* 联报添加好友卡片 */
<template>
  <div class="multi-tutor-item" :class="isWx ? tag : ''">
    <header class="header">{{ tutorInfo.subjectName }}体验营</header>
    <section
      class="content"
      :class="tutorInfo.subjectType"
      @touchstart="handlePress"
      @touchend="handleRelease"
    >
      <!-- 透明图片：微信中长按整块区域可以唤起自带的图片识别等功能 -->
      <img
        class="transparentmask"
        src="https://gaeacdn.jiliguala.com/jlgl/store/v4.5/8f9a24205bbcb7d4b040819293aadc81.png"
      />
      <div class="subContent left">
        <img :src="AVATAR_MAP[tutorInfo.avatarJoinStr]" alt="" />
        <p class="tutor">{{ tutorInfo.tutorName || '学习顾问' }}</p>
        <p class="classtime">{{ tutorInfo.lessonStartTime }}开营</p>
      </div>
      <div class="subContent right">
        <div class="tutorqrcode">
          <img :src="tutorInfo.qrcodeUrl" alt="" @error="imgLoadError" />
        </div>
        <p v-if="isWx" class="desc">长按扫码 添加学习顾问</p>
        <p v-else class="desc">截图保存到相册</p>
      </div>
    </section>
  </div>
</template>

<script>
import { isWeChat, sentryTrack } from '@/utils'
import { AVATAR_MAP } from '../assets'

export default {
  name: 'MultiTutorNormalItem',
  props: {
    tag: {
      type: String,
      default: '',
    },
    tutorInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      timer: null,
      isWx: isWeChat(),
      AVATAR_MAP: AVATAR_MAP,
    }
  },
  methods: {
    handlePress() {
      if (!this.isWx) {
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('recordScanAction', this.tutorInfo)
      }, 500)
    },
    handleRelease() {
      clearTimeout(this.timer)
    },
    imgLoadError() {
      sentryTrack({ name: 'Error', message: '学习顾问二维码加载失败' })
    },
  },
}
</script>
<style lang="scss" scoped>
.multi-tutor-item:nth-child(1) {
  margin-top: 0;
}
.multi-tutor-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 223px;
  background: #f8f2ff #ffffff;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.07);
  border-radius: 16px;
  margin-top: 20px;

  .header {
    height: 42px;
    line-height: 42px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #2e2e2e;
  }

  .content {
    position: relative;
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
    border-radius: 0px 0px 16px 16px;
  }
  .transparentmask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .content.ENG {
    background: linear-gradient(144deg, #f8f1ff 0%, #ffffff 100%);
  }
  .content.LOGIC {
    background: linear-gradient(145deg, #fdf4e4 0%, #ffffff 100%, #ffffff 100%);
  }
  .subContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
  }
}
// 未添加|已扫码 标签公共样式
.multi-tutor-item.waiting,
.multi-tutor-item.hasScan {
  .header {
    position: relative;
  }
  .header::after {
    position: absolute;
    top: 12px;
    left: 220px;
    width: 42px;
    height: 18px;
    border-radius: 6px 6px 6px 0px;
    opacity: 0.8;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
  }
}
// 已扫码标签
.multi-tutor-item.hasScan {
  .header {
    color: #999;
  }
  .header::after {
    content: '已扫码';
    background: #e8e8e8;
    color: #b3b3b3;
  }
  .content {
    background: linear-gradient(197deg, #f0f0f0 0%, #ffffff 100%);
  }
  .tutor,
  .classtime,
  .desc {
    color: #999;
  }
  .tutorqrcode {
    border: 3px solid #94dfbd;
  }
}
// 未添加标签
.multi-tutor-item.waiting {
  .header::after {
    content: '未添加';
    background: #ff5158;
    color: #fff;
  }
}
.left {
  img {
    margin: 30px auto 0;
    width: 70px;
    height: 70px;
  }
  .tutor {
    margin-top: 14px;
    width: 126px;
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    color: #2e2e2e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: 'Jiliguala-Bold';
  }
  .classtime {
    margin-top: 4px;
    height: 20px;
    font-size: 13px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    font-family: 'Jiliguala-Regular';
  }
}
.right {
  .tutorqrcode {
    display: flex;
    width: 114px;
    height: 114px;
    border-radius: 10px;
    border: 3px solid #29c07b;
    margin: 23px auto 0;
    justify-content: center;
    align-items: center;
    img {
      display: inline-block;
      width: 95px;
      height: 95px;
    }
  }
  .desc {
    margin-top: 4px;
    line-height: 18px;
    font-size: 12px;
    font-weight: 700;
    color: #2e2e2e;
  }
}
</style>
