<template>
  <div class="tutor-info-head-page" v-if="tutorInfo">
    <span class="title">{{ tutorInfo.subjectName }}体验营</span>
    <div class="head-content">
      <div class="left">
        <p>开营时间</p>
        <!-- 假人不显示学习顾问 -->
        <p v-if="tutorInfo.assignType !== 'dummy'">学习顾问</p>
      </div>
      <div class="middle">
        <p v-if="tutorInfo.lessonStartTime">
          {{ tutorInfo.lessonStartTime }}
        </p>
        <p v-else class="disable">暂无</p>
        <!-- 假人不显示学习顾问 -->
        <p v-if="tutorInfo.assignType !== 'dummy' && tutorInfo.tutorName">
          {{ tutorInfo.tutorName }}
        </p>
        <p v-else-if="tutorInfo.assignType !== 'dummy'" class="disable">
          暂无
        </p>
      </div>
      <div class="right">
        <img
          :src="headerImg[tutorInfo.avatarJoinStr]"
          alt="headImg"
          class="headImg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { AVATAR_MAP } from '../assets'
export default {
  name: 'TutorInfoHead',
  props: {
    tutorInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      headerImg: AVATAR_MAP,
    }
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.tutor-info-head-page {
  overflow: hidden;
  .title {
    display: inline-block;
    width: 100%;
    height: 42px;
    background: #fff;
    color: #2e2e2e;
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    line-height: 42px;
  }
}
.head-content {
  display: flex;
  margin: 15px 26px;
  .headImg {
    display: inline-block;
    width: 60px;
    height: 60px;
  }
  p {
    color: #b3b3b3;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
  }
  .left,
  .right {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-shrink: 0;
    justify-content: center;
  }
  .middle {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    padding-left: 18px;
    p {
      overflow: hidden;
      color: #2e2e2e;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
      font-weight: 600;
      font-family: 'Jiliguala-Bold';
      &.disable {
        color: #999999;
      }
    }
  }
}
</style>
