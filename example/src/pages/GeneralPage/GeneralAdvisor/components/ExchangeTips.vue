/* 兑换码兑换成功提示 */
<template>
  <van-popup v-model="showExchangeTips" round :close-on-click-overlay="false">
    <img
      class="close"
      src="https://gaeacdn.jiliguala.com/jlgl/store/v4.5/13e6295d63108cd51485174d36ec5e70.png"
      alt="close"
      @click="close"
    />
    <header class="header">
      <img
        class="header-bg"
        src="https://gaeacdn.jiliguala.com/jlgl/store/v4.5/509a5dd6a39f1d72a23ad1c8059d985e.png"
      />
      <img
        class="header-gua"
        src="https://gaeacdn.jiliguala.com/jlgl/store/v4.5/80eceae827e25868928772e2520f64e7.png"
      />
    </header>
    <h2 class="title">兑换成功</h2>
    <p class="content">快去添加你的专属学习顾问，开始学习吧</p>
    <button class="button" @click="close">立即添加</button>
  </van-popup>
</template>
<script>
import { Popup } from 'vcomp'
export default {
  name: 'ExchangeTips',
  components: {
    'van-popup': Popup,
  },
  props: {
    showExchangeTips: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.van-popup {
  overflow: visible;
  width: 320px;
  height: 236px;
  border-radius: 32px;
  background: #ffffff;
  text-align: center;
}
.header {
  position: relative;
  width: 100%;
  height: 72px;
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 72px;
  }
  .header-gua {
    position: absolute;
    top: -38px;
    left: 50%;
    width: 170px;
    height: 130px;
    transform: translateX(-50%);
  }
}
.title {
  margin-top: 24px;
  height: 22px;
  color: #2e2e2e;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
}
.content {
  margin-top: 12px;
  height: 22px;
  color: #2e2e2e;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.button {
  margin: 24px auto;
  width: 240px;
  height: 48px;
  border: 0;
  border-radius: 24px;
  background: #25d780;
  box-shadow: 0px 8px 0px -4px rgba(37, 215, 128, 0.1);
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  line-height: 48px;
}
.close {
  position: fixed;
  top: -194px;
  right: -17px;
  width: 40px;
  height: 40px;
}
</style>
