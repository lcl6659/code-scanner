<template>
  <div class="hasAddTutor-page">
    <div class="avatar">
      <div v-for="(item, index) in tutorList" :key="index" class="tutorImg">
        <img :src="tutorImg[item.avatarJoinStr]" alt="tutorImg" />
        <img
          class="icon"
          src="https://gaeacdn.jiliguala.com/jlgl/store/v4.5/c44369511e6cba7d77d20b4788fa8d69.png"
        />
      </div>
    </div>
    <p class="prompt">
      您已添加{{
        tutorList.length > 1 ? '所有' : tutorList[0].subjectName
      }}学习顾问
    </p>
    <p class="prompt">下载叽里呱啦APP开始体验吧！</p>
    <div class="classInfo" v-for="(item, index) in tutorList" :key="index">
      <p v-if="item.lessonStartTime" class="str-wrapper">
        <span class="str-time-label">{{ item.subjectName }}开营时间</span>
        <span class="str-time">{{ item.lessonStartTime }}</span>
      </p>
      <p v-else class="disable">暂无</p>
    </div>
  </div>
</template>

<script>
import { AVATAR_MAP } from '../assets'
export default {
  name: 'HasAddTutor',
  props: {
    tutorList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tutorImg: AVATAR_MAP,
    }
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.hasAddTutor-page {
  text-align: center;
  padding-bottom: 30px;
  padding-top: 26px;
  .avatar {
    margin-bottom: 34px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .tutorImg {
    position: relative;
    margin-right: 30px;
    img:first-child {
      width: 77px;
      height: 77px;
      display: inline-block;
    }
    img.icon {
      position: absolute;
      left: 45px;
      bottom: -9px;
      width: 18px;
      height: 18px;
    }
  }
  .tutorImg:last-child {
    margin-right: 0;
  }
  .prompt {
    font-size: 18px;
    font-weight: 700;
    color: #2e2e2e;
    line-height: 25px;
  }
  .classInfo {
    font-size: 15px;
    font-weight: 600;
    color: #2e2e2e;
    line-height: 24px;
    margin-bottom: 6px;
    font-family: 'Jiliguala-Bold';
    p {
      text-align: center;
      margin: 0 auto;
      &.disable {
        color: #999999;
      }
      &.str-wrapper {
        // padding-left: 70px;
        text-align: center;
      }
    }
    p span {
      display: inline-block;
      font-size: 15px;
      font-weight: 400;
      color: #999999;
      line-height: 24px;
      text-align: left;
      &.str-time-label {
        width: 104px;
      }
      &.str-time {
        color: #2e2e2e;
      }
    }
  }
  .classInfo:nth-of-type(2) {
    margin-top: 30px;
  }
  .classInfo:last-child {
    margin-bottom: 0;
  }
}
</style>
