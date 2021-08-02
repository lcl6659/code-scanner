/* 页面标题和副标题 */
<template>
  <div class="header-wrapper">
    <img
      :src="headerImg"
      class="headImg"
      :class="hadBindAll ? 'hasBind' : ''"
    />
    <img :src="subImg" v-if="subImg" class="subheadImg" />
  </div>
</template>

<script>
import { HEADER_MAP, SUBTITLE_MAP } from '../assets'
export default {
  props: {
    tutorList: {
      type: Array,
      default: () => [],
    },
    noBindTutorList: {
      type: Array,
      default: () => [],
    },
    hasBindNum: {
      type: Number,
      default: 0,
    },
    hadBindAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    headerImg() {
      if (!this.tutorList.length) {
        return HEADER_MAP.default
      }
      // 已添加所有班主任
      if (this.hasBindNum === this.tutorList.length) {
        return HEADER_MAP.hasBindAll
      }
      // 待添加一科
      if (this.noBindTutorList.length === 1) {
        return HEADER_MAP[this.noBindTutorList[0].subjectType]
      }
      // 待添加两科
      if (this.noBindTutorList.length > 1) {
        return HEADER_MAP.notBindAnyone
      }
      return HEADER_MAP.default
    },
    subImg() {
      // 单科
      if (this.tutorList.length <= 1) {
        return ''
      }
      // 联报 & 待添加1
      if (this.noBindTutorList.length === 1) {
        return SUBTITLE_MAP[this.noBindTutorList[0].subjectType]
      }
      // 联报 & 待添加 2
      if (this.noBindTutorList.length === 2) {
        return SUBTITLE_MAP.all
      }
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
.header-wrapper {
  padding-top: 25px;
  padding-bottom: 20px;
  text-align: center;
  .headImg {
    display: inline-block;
    width: 90vw;
  }
  .headImg.hasBind {
    width: 35.7vw;
  }
  .subheadImg {
    display: inline-block;
    margin-top: 11px;
    width: 88.7%;
  }
}
</style>
