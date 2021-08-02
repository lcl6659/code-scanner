<template>
  <div class="advisor-page">
    <GuideExtdItem
      v-if="needGuidExtdItem"
      :nextSpuid="nextSpuid"
      :guideBanner="guideBanner"
      :showGuidePopup="showGuidePopup"
      @close="closeGuidePopup"
      @extdItem="extdItem"
    ></GuideExtdItem>
    <Content></Content>
    <NotBindPopup
      :showBindFollowPopup="showBindFollowPopup"
      @close="closeBindFollowPopup"
      @back="backBindFollowPopup"
    ></NotBindPopup>
  </div>
</template>

<script>
import Content from './components/Content'
import GuideExtdItem from './components/GuideExtdItem'
import NotBindPopup from './components/NotBindPopup'
import { mapState } from 'vuex'
import TRACKMIXINS from '@/mixins/track/trackAdvisorMixins'
import * as QUERY from '@/config/query'
import { isJLGL } from '@/utils'

export default {
  mixins: [TRACKMIXINS],
  data() {
    return {
      // 是否需要展示引导扩科的挽留弹层
      needGuidExtdItem: false,
      // 未购买体验课的引导banner
      guideBanner: '',
      // 引导扩科的下一个spuid
      nextSpuid: '',
      showGuidePopup: false,
      showBindFollowPopup: false,
    }
  },
  components: {
    GuideExtdItem,
    NotBindPopup,
    Content,
  },
  computed: {
    ...mapState({
      needBindFollow: (state) => state.generalStore.needBindFollow,
    }),
  },
  methods: {
    async getNeedGuide() {
      let params = {
        // smsuid: QUERY.SMS_UID,
        uid: QUERY.UID,
        source: QUERY.SOURCE,
      }
      let [err, data] = await this.$API.getNeedGuide(params)
      if (!err && data) {
        if (data.needGuidExtdItem) {
          this.needGuidExtdItem = data.needGuidExtdItem
          this.guideBanner = data.guideBanner
          this.nextSpuid = data.nextSpuid
        }
      } else {
        this.$toast(err.msg)
      }
    },
    // 关闭扩科
    closeGuidePopup() {
      this.showGuidePopup = false
      this.back()
    },
    // 扩科
    extdItem() {
      this.showGuidePopup = false
      // 只限微信商城引导扩科，用户数据不会混乱
      this.$store.commit('setSpuId', this.nextSpuid)
      this.$router.push({
        path: '/item',
        query: {
          ...this.$route.query,
          spuId: this.nextSpuid,
        },
      })
    },
    closeBindFollowPopup() {
      this.showBindFollowPopup = false
      if (this.needGuidExtdItem) {
        this.showGuidePopup = true
      }
    },
    backBindFollowPopup() {
      this.showBindFollowPopup = false
      if (this.needGuidExtdItem) {
        this.showGuidePopup = true
      } else {
        this.back()
      }
    },
    // 页面返回
    back() {
      sessionStorage.removeItem('advisorHasPushState')
      window.history.back()
    },
    holdUp() {
      if (this.needBindFollow) {
        this.showBindFollowPopup = true
        this.track('Add Teacher Detainment Popup Show')
      } else if (this.needGuidExtdItem) {
        this.showGuidePopup = true
      }
    },
  },

  mounted() {
    //非叽里呱啦app判断，是否需要引导扩科，
    //是否需要引导扩科
    if (!isJLGL() && QUERY.FROM !== 'storeFree') {
      //0元课不需要
      this.getNeedGuide()
    }
    if (window.history && window.history.pushState) {
      if (sessionStorage.getItem('advisorHasPushState') !== 'true') {
        // 防止每次刷新往history里加一条空记录
        history.pushState(null, null, window.location.href)
        sessionStorage.setItem('advisorHasPushState', true)
      }
      window.addEventListener('popstate', this.holdUp, false)
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('advisorHasPushState')
    window.removeEventListener('popstate', this.holdUp, false)
  },
}
</script>

<style lang="scss" scoped>
.advisor-page {
  padding: 1px 16px;
  background: #fff;
  min-height: 100vh;
}
</style>
