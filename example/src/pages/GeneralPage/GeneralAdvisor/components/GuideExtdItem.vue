<template>
  <div class="guideExtdItem-page">
    <div class="bannerImg" @click="extdItem" v-if="guideBanner">
      <img :src="guideBanner" alt="bannerImg" />
    </div>
    <van-popup v-model="show" round @click-overlay="close">
      <div class="redbox">
        <img
          src="https://gaeacdn.jiliguala.com/jlgl/store/v4.5/a761f6f7d7f35a201813637c66ccef10.png"
          alt=""
        />
        <div class="nouse" @click="close">暂不使用</div>
        <div class="useright" @click="use">我要使用</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup } from 'vcomp'
import TRACKMIXINS from '@/mixins/track/trackAdvisorMixins'
export default {
  name: 'GuideExtdItem',
  mixins: [TRACKMIXINS],
  components: {
    'van-popup': Popup,
  },
  props: {
    showGuidePopup: {
      type: Boolean,
      default: false,
    },
    guideBanner: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  computed: {
    show() {
      return this.showGuidePopup
    },
  },
  methods: {
    extdItem() {
      this.track('Extension Click')
      this.$emit('extdItem')
    },
    use() {
      this.track('Extension Detainment Popup Confirm Click')
      this.$emit('extdItem')
    },
    close() {
      this.track('Extension Detainment Popup Cancel Click')
      this.$emit('close')
    },
  },
  created() {
    this.track('Extension View')
  },
}
</script>
<style lang="scss" scoped>
.guideExtdItem-page {
  .bannerImg {
    width: 100%;
    height: 80px;
    margin: 15px 0;
    margin-bottom: 0;
    img {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  .van-popup {
    background-color: transparent;
  }
  .redbox {
    width: 100%;
    position: relative;
    font-size: 18px;
    line-height: normal;
    overflow: hidden;
    img {
      width: 334px;
      height: auto;
    }
    .nouse {
      width: 100px;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      position: absolute;
      bottom: 90px;
      margin-left: -50px;
      left: 50%;
      font-size: 16px;
    }
    .useright {
      width: 174px;
      text-align: center;
      color: #a1491e;
      position: absolute;
      bottom: 30px;
      margin-left: -87px;
      left: 50%;
      padding: 11px 0;
      /* background: #ffe752; */
      background: linear-gradient(#fff48d, #ffdc20);
      border-radius: 50px;
      font-weight: bold;
    }
  }
}
</style>
