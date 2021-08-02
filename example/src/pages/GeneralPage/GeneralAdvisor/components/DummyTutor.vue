<template>
  <div class="dummyTutor-page">
    <TutorInfoHead :tutorInfo="tutorInfo"></TutorInfoHead>
    <div class="content">
      <div
        class="text"
        :style="{
          backgroundImage: 'url(' + DUMMY_BG[tutorInfo.subjectType] + ')',
        }"
      >
        <img :src="QUOTATION_MARK[tutorInfo.subjectType]" alt="" />
        <p>
          Hi，我是你的<span>专属{{ tutorInfo.subjectName }}学习顾问</span>
        </p>
        <p>将为您提供全方位服务，</p>
        <p>包括<span>学习规划、反馈</span>和<span>科学的学习建议！</span></p>
      </div>
      <div class="btn" @click="manualActiveTutor">
        <img
          src="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/997f04abfaf9b34e6dd02982624f189a.png"
          alt=""
        />点我获取{{ tutorInfo.subjectName }}学习顾问服务
      </div>
    </div>
  </div>
</template>

<script>
import TutorInfoHead from './TutorInfoHead'
import TRACKMIXINS from '@/mixins/track/trackAdvisorMixins'
import * as QUERY from '@/config/query'
import { DUMMY_BG, QUOTATION_MARK } from '../assets'
export default {
  name: 'DummyTutor',
  mixins: [TRACKMIXINS],
  props: {
    tutorInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    TutorInfoHead,
  },
  data() {
    return {
      DUMMY_BG,
      QUOTATION_MARK,
    }
  },
  methods: {
    async manualActiveTutor() {
      const [err, data] = await this.$API.manualActiveTutor({
        uid: QUERY.UID || '',
        source: QUERY.SOURCE || '',
        subjectType: this.tutorInfo.subjectType,
      })
      if (!err && data) {
        this.$store.commit('set_manualActiveTutor', data)
      } else {
        this.$toast(err.msg)
      }
      this.track('Class Teacher Add View_GetWechat')
    },
  },
}
</script>
<style lang="scss" scoped>
.dummyTutor-page {
  .text {
    background-repeat: no-repeat;
    width: 297px;
    height: 144px;
    background-size: 100% 100%;
    margin: 0 auto;
    position: relative;
    margin-top: 9px;
    margin-bottom: 16px;
    padding: 25px 18px 0 18px;
    img {
      position: absolute;
      display: inline-block;
      width: 42px;
      height: 32px;
      top: -10px;
      left: 15px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #2e2e2e;
      line-height: 24px;
      span {
        font-weight: 900;
      }
    }
  }
  .btn {
    width: 306px;
    height: 50px;
    background: #25d780;
    box-shadow: 0px 8px 0px -4px #dff8ed;
    border-radius: 25px;
    color: #fff;
    margin: 0 auto;
    line-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    font-weight: 700;
    img {
      display: inline-block;
      width: 26px;
      height: 22px;
      margin-right: 3px;
    }
  }
}
</style>
