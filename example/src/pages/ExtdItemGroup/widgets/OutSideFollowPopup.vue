<template>
  <div class="outSideFollowPopup">
    <PlainPopup
      :show="showOutSideFollowPopup"
      :imgUrl="outSideFollowConfig.popupUrl"
      :closeOnClickOverlay="true"
      :showCloseBtn="true"
      @closePopup="$emit('closePopup')"
    >
      <div class="outSideFollowPopupButton" @click="copy">
        <img
          src="https://gaeacdn.jiliguala.com/jlgl/store-ext/v3.7/19238b8529b4358a9d400897254865e9.png"
          alt="WX"
        />
        <span>复制名称去微信公众号</span>
      </div>
    </PlainPopup>
    <!-- <ImgFissionPopup
      :show="showOutSideFollowPopup"
      :imgUrl="outSideFollowConfig.popupUrl"
      :closeOnClickOverlay="true"
      :showCloseBtn="true"
      @closePopup="$emit('closePopup')"
    >
      <div slot="bottomButton" class="outSideFollowPopupButton" @click="copy">
        <img
          src="https://gaeacdn.jiliguala.com/jlgl/store-ext/v3.7/19238b8529b4358a9d400897254865e9.png"
          alt="WX"
        />
        <span>复制名称去微信公众号</span>
      </div>
    </ImgFissionPopup> -->
  </div>
</template>

<script>
// import ImgFissionPopup from '@/components/ImgFissionPopup/ImgFissionPopup'
import { getAdhocFlag, copyToClipboard } from '@/utils'
import { mapState } from 'vuex'
import { PlainPopup } from 'components'
export default {
  name: 'OutSideFollowPopup',
  components: {
    // ImgFissionPopup,
    PlainPopup,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showOutSideFollowPopup: false,
      outSideFollowPopup: null,
      sourceMap: [
        'h5windowtest_01',
        'h5windowtest_02',
        'h5windowtest_03',
        'h5windowtest_04',
        'h5windowtest_05',
        'JLYQ_JM_DY_0301',
        'JLYQ_JM_DY_0302',
        'JLYQ_JM_DY_0303',
        'JLYQ_JM_DY_0304',
        'JLYQ_JM_DY_0305',
      ],
    }
  },
  watch: {
    show(val) {
      this.showOutSideFollowPopup = val
    },
  },
  computed: {
    ...mapState(['channel_environment', 'itemid', 'source']),
    ...mapState({
      outSideFollowConfig: (state) => state.item.outSideFollowConfig,
    }),
  },
  methods: {
    // 判断是否需要展示初始化私域挽留弹窗
    async needOutSideFollowPopup() {
      if (this.$route.name === 'itemGroup') {
        // 假拼团接入挽留弹窗abtest
        this.outSideFollowPopup = (await getAdhocFlag('Window_Type')) || 'A'
        this.$store.commit('setUserTrackProps', {
          stayPopABTest: this.outSideFollowPopup,
        })
        if (this.outSideFollowPopup === 'B') {
          await this.initialOutSideFollowPopup()
        }
      }
    },
    // 初始化私域挽留弹窗
    async initialOutSideFollowPopup() {
      const [err, data] = await this.$API.getOutSideFollowData()
      if (!err && data.notWechatConfig) {
        // 判断是否满足显示条件
        if (
          this.itemid === 'H5_Sample_OutsideH5' &&
          this.outSideFollowPopup === 'B' &&
          this.sourceMap.includes(this.source)
        ) {
          let obj = {
            agreeShow: true, //是否满足私域弹窗显示条件
            ...data.notWechatConfig,
          }
          this.$store.commit('SET_OUTSIDEFOLLOWCONFIG', obj)
        }
      }
    },
    copy() {
      this.$track('Window Click')
      copyToClipboard(this.outSideFollowConfig.wechatAccount)
      this.$toast(`已复制「${this.outSideFollowConfig.wechatAccount}」\n将跳转到微信粘贴`)
      setTimeout(() => {
        location.href = 'weixin://'
        this.$emit('closePopup')
      }, 1000)
    },
  },
  created() {
    if (this.channel_environment === 'Web') {
      //判断是否需要展示初始化私域挽留弹窗
      this.needOutSideFollowPopup()
    }
  },
}
</script>
<style lang="scss" scoped>
.outSideFollowPopup {
  ::v-deep .mainImg {
    width: 320px !important;
  }
}
.outSideFollowPopupButton {
  position: absolute;
  bottom: 17px;
  padding: 0 15px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #11c262;
  border-radius: 25px;
  border: unset;
  width: 260px;
  margin-left: 30px;
  img {
    width: 32px;
    margin-right: 5px;
  }
  span {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
