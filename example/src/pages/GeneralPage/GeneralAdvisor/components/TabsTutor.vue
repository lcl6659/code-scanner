<template>
  <div class="tabsTutor-page">
    <Tabs
      v-model="active"
      color="#29C07B"
      title-active-color="#29C07B"
      title-inactive-color="#B3B3B3"
      @change="switchTab"
    >
      <Tab
        v-for="(item, index) in this.tutorList"
        :name="index"
        :key="index"
        :badge="!item.tutorBindSet ? '需要添加' : ''"
      >
        <template #title>{{ item.subjectName }}</template>
        <DummyTutor
          v-if="item.assignType === 'dummy'"
          :tutorInfo="item"
        ></DummyTutor>
        <HasBindTutor
          v-else-if="item.tutorBindSet"
          :tutorInfo="item"
        ></HasBindTutor>
        <NotBindTutor
          v-else-if="!item.tutorBindSet"
          :tutorInfo="item"
        ></NotBindTutor>
        <EmptyTutor v-else :tutorInfo="item"></EmptyTutor>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vcomp'
import HasBindTutor from './HasBindTutor'
import NotBindTutor from './NotBindTutor'
import EmptyTutor from './EmptyTutor'
import DummyTutor from './DummyTutor'
import TRACKMIXINS from '@/mixins/track/trackAdvisorMixins'
export default {
  mixins: [TRACKMIXINS],
  components: {
    Tab,
    Tabs,
    HasBindTutor,
    NotBindTutor,
    EmptyTutor,
    DummyTutor,
  },
  name: 'TabsTutor',
  props: {
    tutorList: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {}
  },
  methods: {
    switchTab(index) {
      const { subjectType, tutorBindSet } = this.tutorList[index]
      this.track('Class Teacher Course Switch Click', {
        SubjectClick: subjectType,
        SubjectStatus:
          tutorBindSet === true
            ? 'HasBind'
            : tutorBindSet === false
            ? 'NotBind'
            : 'NoInfo',
      })
    },
  },
  created() {
    const { subjectType, tutorBindSet } = this.tutorList[0]
    this.track('Class Teacher Course Switch View', {
      SubjectClick: subjectType,
      SubjectStatus:
        tutorBindSet === true
          ? 'HasBind'
          : tutorBindSet === false
          ? 'NotBind'
          : 'NoInfo',
    })
  },
}
</script>
<style lang="scss" scoped>
.tabsTutor-page {
  ::v-deep .van-tabs {
    .van-hairline--top-bottom:after,
    .van-hairline-unset--top-bottom:after {
      border: none;
    }
    .van-tabs__wrap {
      height: 40px;
      border-radius: 16px;
      .van-tabs__line {
        width: 30px !important;
        height: 3px;
      }
      .van-tab__text {
        font-size: 16px;
        margin-right: 2px;
      }
      .van-info {
        height: 17px;
        background: #ff5158;
        border-radius: 6px 6px 6px 0px;
        font-size: 11px;
        font-weight: normal;
        color: #ffffff;
        line-height: 17px;
        right: -25px;
      }
    }
    .van-tabs__content {
      background: linear-gradient(204deg, #e1f6ee 0%, #ffffff 100%);
      padding: 1px 0 10px 0px;
      border-radius: 0 0 16px 16px;
    }
  }
}
</style>
