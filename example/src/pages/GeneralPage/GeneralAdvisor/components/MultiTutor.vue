/* 多个未添加班主任 */
<template>
  <div class="multi-tutor">
    <div class="wrapper" v-for="(tItem, index) in tutorList" :key="index">
      <MultiTutorDummyItem
        v-if="tItem.assignType === 'dummy'"
        :tutor-info="tItem"
        @manualActiveTutor="manualActiveTutor"
      />
      <MultiTutorNormalItem
        v-else
        :tag="tag(tItem)"
        :tutor-info="tItem"
        @recordScanAction="recordScanAction"
      />
    </div>
  </div>
</template>
<script>
import countBy from 'lodash/countBy'
import * as QUERY from '@/config/query'
import { tutorScanRecord } from '@/storeCacher'
import TRACKMIXINS from '@/mixins/track/trackAdvisorMixins'
import MultiTutorNormalItem from './MultiTutorNormalItem'
import MultiTutorDummyItem from './MultiTutorDummyItem'

export default {
  name: 'ExchangeTips',
  mixins: [TRACKMIXINS],
  components: {
    MultiTutorNormalItem,
    MultiTutorDummyItem,
  },
  props: {
    tutorList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  methods: {
    tag(tutorItem) {
      const len = this.tutorList.length
      const key = `${tutorItem.subjectType}_${tutorItem.oid}`
      const tagInfo = countBy(this.tutorList, (item) => {
        return tutorScanRecord.getInfo(`${item.subjectType}_${item.oid}`)
          ? 'hasScan'
          : 'noScan'
      })
      // 全部“已扫码”
      if (tagInfo.hasScan === len) {
        return 'hasScan'
      }
      // 全部“未扫码”，不显示标签
      if (tagInfo.noScan === len) {
        return ''
      }
      // 当前班主任信息是否被扫码
      if (tutorScanRecord.getInfo(key)) {
        return 'hasScan'
      }
      return 'waiting'
    },
    async manualActiveTutor(tutorInfo) {
      const [err, data] = await this.$API.manualActiveTutor({
        uid: QUERY.UID || '',
        source: QUERY.SOURCE || '',
        subjectType: tutorInfo.subjectType,
      })
      if (!err && data) {
        this.$store.commit('set_manualActiveTutor', data)
      } else {
        this.$toast(err.msg)
      }
      this.track('Class Teacher Add View_GetWechat')
    },
    recordScanAction(tutorInfo) {
      const { subjectType, tutorBindSet, oid } = tutorInfo
      this.track('Class Teacher Add Message Scan', {
        SubjectClick: subjectType,
        SubjectStatus:
          tutorBindSet === true
            ? 'HasBind'
            : tutorBindSet === false
            ? 'NotBind'
            : 'NoInfo',
      })
      tutorScanRecord.setInfo(`${subjectType}_${oid}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin-bottom: 20px;
}
.wrapper:last-child {
  margin-bottom: 0;
}
</style>
