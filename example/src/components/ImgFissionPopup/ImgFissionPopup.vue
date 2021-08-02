<template>
  <img-popup
    v-model="showPopup"
    :close-on-click-overlay="closeOnClickOverlay"
    class="img-popup"
    style="background-color: transparent;"
    @touchmove.native.stop.prevent
  >
    <img
      v-if="showCloseBtn"
      class="close-btn"
      src="https://gaeacdn.jiliguala.com/jlgl/store-ext/v3.7/950ee4657a5932377b7aad0f78dec750.png"
      alt="X"
      @click="$emit('closePopup')"
    />
    <img
      class="mainImg"
      style="width: 81.333vw;"
      :src="imgUrl"
      alt=""
      @click="$emit('confirm', null)"
    />
    <div class="pop-title">{{ msg }}</div>
    <!-- 图片中的按钮点击跳转页面，非按钮点击无响应 -->
    <slot name="bottomButton"></slot>
  </img-popup>
</template>

<script>
import { Popup as ImgPopup } from 'vant'
export default {
  name: 'ImgFissionPopup',
  props: {
    closeOnClickOverlay: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
    showCloseBtn: {
      type: Boolean,
      default: false,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    msg: {
      type: String,
      default: '',
    },
  },
  components: {
    'img-popup': ImgPopup,
  },
  data() {
    return {}
  },
  computed: {
    showPopup: {
      get() {
        return this.show
      },
      set(newValue) {
        this.$emit('closePopup', newValue)
      },
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.img-popup {
  overflow-y: inherit;
  .close-btn {
    width: 36px;
    height: 36px;
    position: absolute;
    top: -36px;
    right: -20px;
  }
  .pop-title {
    position: absolute;
    top: 155px;
    width: 100%;
    height: 20px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    line-height: 20px;
  }
  .touch-area {
    position: absolute;
    bottom: 50px;
    height: 80px;
    width: 100%;
  }
}
</style>
