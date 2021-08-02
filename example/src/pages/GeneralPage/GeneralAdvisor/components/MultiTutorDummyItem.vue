/* 联报添加好友卡片 */
<template>
  <div class="multi-tutor-item">
    <header class="header">{{ tutorInfo.subjectName }}体验营</header>
    <section class="content" :class="tutorInfo.subjectType">
      <div class="subContent left">
        <img :src="AVATAR_MAP[tutorInfo.avatarJoinStr]" alt="" />
        <p class="tutor">{{ tutorInfo.tutorName || '学习顾问' }}</p>
        <p class="classtime">{{ tutorInfo.lessonStartTime }}开营</p>
      </div>
      <div class="subContent right" @click="manualActiveTutor">
        <div class="tutorqrcode">
          <img
            src="https://gaeacdn.jiliguala.com/jlgl/store/v4.5/b47afe7a2700f77263fc04e2064298a1.png"
          />
        </div>
        <p class="desc">点击显示二维码</p>
      </div>
    </section>
  </div>
</template>

<script>
import { AVATAR_MAP } from '../assets'

export default {
  name: 'MultiTutorDummyItem',
  props: {
    tutorInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      AVATAR_MAP: AVATAR_MAP,
    }
  },
  methods: {
    manualActiveTutor() {
      this.$emit('manualActiveTutor', this.tutorInfo)
    },
  },
}
</script>
<style lang="scss" scoped>
.multi-tutor-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 223px;
  background: #f8f2ff #ffffff;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.07);
  border-radius: 16px;

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
  }
  .classtime {
    margin-top: 4px;
    height: 20px;
    font-size: 13px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}
.right {
  .tutorqrcode {
    display: flex;
    width: 114px;
    height: 114px;
    border-radius: 10px;
    border: 3px solid #e6e9eb;
    margin: 23px auto 0;
    justify-content: center;
    align-items: center;
    img {
      display: inline-block;
      width: 70px;
      height: 86px;
    }
  }
  .desc {
    margin-top: 4px;
    line-height: 18px;
    font-size: 14px;
    font-weight: 600;
    color: #29c07b;
  }
}
</style>
