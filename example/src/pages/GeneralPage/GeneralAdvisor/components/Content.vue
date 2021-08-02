<template>
  <div class="content-page">
    <ContHeader
      v-show="show"
      :hadBindAll="hadBindAll"
      :tutorList="tutorList"
      :noBindTutorList="noBindTutorList"
      :hasBindNum="hasBindTutorList.length"
    />
    <div class="tabContent">
      <!-- 联报：待添加班主任数量为 2 -->
      <MultiTutor v-if="noBindTutorList.length > 1" :tutorList="noBindTutorList"></MultiTutor>
      <!-- 单科：待添加班主任数量为 1 -->
      <div
        class="content"
        :class="noBindTutorList[0].subjectType"
        v-else-if="noBindTutorList.length === 1"
      >
        <DummyTutor
          v-if="noBindTutorList[0].assignType === 'dummy'"
          :tutorInfo="noBindTutorList[0]"
        ></DummyTutor>
        <NotBindTutor
          v-else-if="!noBindTutorList[0].tutorBindSet"
          :tutorInfo="noBindTutorList[0]"
        ></NotBindTutor>
      </div>
      <!-- 全部添加 -->
      <div class="content" v-else-if="hadBindAll">
        <HasBindTutor :tutorList="hasBindTutorList"></HasBindTutor>
      </div>
      <!-- 无班主任信息 || 接口异常 -->
      <div class="content" v-if="show === 'error' || (show && !tutorList.length)">
        <EmptyTutor />
      </div>
    </div>
    <Footer v-show="show" :tutorInfo="tutorList"></Footer>
    <ExchangeTips :showExchangeTips="showExchangeTips" @close="closeExchangeTips"></ExchangeTips>
  </div>
</template>

<script>
import ContHeader from './ContHeader'
import MultiTutor from './MultiTutor'
import HasBindTutor from './HasBindTutor'
import NotBindTutor from './NotBindTutor'
import EmptyTutor from './EmptyTutor'
import DummyTutor from './DummyTutor'
import Footer from './Footer'
import ExchangeTips from './ExchangeTips'
import * as QUERY from '@/config/query'
import TRACKMIXINS from '@/mixins/track/trackAdvisorMixins'
import { mapState } from 'vuex'
import { groupBy, sortBy } from 'lodash'
import { tutorScanRecord } from '@/storeCacher'
import { isWeChat } from '@/utils'

// 兑换码调接口重试次数
let reTryTimes = 3

export default {
  mixins: [TRACKMIXINS],
  name: 'Content',
  components: {
    MultiTutor,
    HasBindTutor,
    NotBindTutor,
    EmptyTutor,
    DummyTutor,
    Footer,
    ContHeader,
    ExchangeTips,
  },
  data() {
    return {
      show: false,
      isWx: isWeChat(),
      showExchangeTips: false,
    }
  },
  computed: {
    ...mapState({
      tutorList: (state) => state.generalStore.tutorList,
    }),
    hadBindAll() {
      return this.tutorList.length && this.tutorList.length === this.hasBindTutorList.length
    },
    all() {
      let tutorList = JSON.parse(JSON.stringify(this.tutorList))
      let newTutorList = tutorList.map((item) => {
        // 拼接后的头像标识字段
        item.avatarJoinStr = item.subjectType
        // 非低质流量假人且性别存在的情况需要对avatarJoinStr进行修改
        if (item.assignType !== 'dummy' && item.gender) {
          item.avatarJoinStr = `${item.subjectType}_${item.gender}`
        }
        return item
      })
      return groupBy(newTutorList, (item) => {
        return item.tutorBindSet ? 'hasBind' : 'notBind'
      })
    },
    // 未添加，微信内排序：联报页面“已扫码”排后，“未添加”排前，非微信内正常顺序
    noBindTutorList() {
      if (this.isWx) {
        return (
          sortBy(this.all.notBind, (item) => {
            return tutorScanRecord.getInfo(`${item.subjectType}_${item.oid}`)
          }) || []
        )
      } else {
        return this.all.notBind || []
      }
    },
    // 已添加
    hasBindTutorList() {
      return this.all.hasBind || []
    },
  },
  methods: {
    loopCallback(list) {
      if (!list.length && reTryTimes > 1) {
        reTryTimes--
        setTimeout(() => {
          this.getTutorInfo(this.loopCallback)
        }, 1000)
        return
      }
      this.$toast.clear()
      this.pageViewTrack()
    },
    async getTutorInfo(callback) {
      const [err, data] = await this.$API.getTutorInfo({
        oid: QUERY.getQueryString('oid') || '',
        uid: QUERY.UID || '',
        source: QUERY.SOURCE || '',
      })
      if (!err && data) {
        this.show = true
        this.$store.commit('set_tutorList', data.tutorList)
        callback && callback(data.tutorList)
      } else {
        this.show = 'error'
        reTryTimes = 0
        this.$toast(err.msg)
        this.pageViewTrack()
      }
    },
    pageViewTrack() {
      this.track('Class Teacher Add View')
    },
    closeExchangeTips() {
      this.showExchangeTips = false
      // 当前没有班主任信息 & 轮询未结束
      if (!this.tutorList.length && reTryTimes > 1) {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        })
      }
    },
  },
  created() {
    // 是否来自兑换码
    if (QUERY.FROM === 'exchange') {
      this.showExchangeTips = true
      this.track('Class Teacher Add View_Dialog')
    }
    // 获取学习顾问信息
    this.getTutorInfo(this.loopCallback)
  },
}
</script>
<style lang="scss" scoped>
.content-page {
  .tabContent {
    margin: 0 auto;
    width: 343px;
    border-radius: 16px;
    background: #ffffff;
    .content {
      overflow: hidden;
      padding: 0 0 10px 0px;
      background: linear-gradient(204deg, #e1f6ee 0%, #ffffff 100%);
      background-size: 100% 332px;
      background-repeat: no-repeat;
      border-radius: inherit;
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.07);
    }
    .content.ENG {
      background: linear-gradient(204deg, #f3e8fc 0%, #ffffff 100%);
    }
    .content.LOGIC {
      background: linear-gradient(204deg, #fdf4e4 0%, #ffffff 100%);
    }
  }
}
</style>
