<template>
  <van-popup v-model="show" class="rt-qrcode-popup">
    <div class="rt-qrcode-popup-cont">
      <div class="top-img"><img :src="topImg" /></div>
      <div class="tip">{{ tip }}</div>
      <h3 class="title">长按二维码，关注公众号</h3>
      <p class="subtitle">第一时间收到活动通知</p>
      <div class="qrcode-cont">
        <img :src="qr" />
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      show: this.value,
      qr:
        process.env.VUE_APP_ENV === 'production'
          ? 'https://qiniucdn.jiliguala.com/devbanners/ed7c6465a73f4315843a24aabd1cd700.png'
          : 'https://qiniucdn.jiliguala.com/devbanners/1584b59341cf48e885642d782aa8093f.png',
    }
  },
  computed: {
    topImg() {
      return this.type === 'Stockout'
        ? 'https://qiniucdn.jiliguala.com/devbanners/50da6431fbc44ac7a9dfff367f09e02e.png'
        : 'https://qiniucdn.jiliguala.com/devbanners/c6f0756dfb8747a18d8405b64ab53fc1.png'
    },
    tip() {
      return this.type === 'Stockout' ? '今日活动已结束' : '今日活动未开始'
    },
  },

  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      if (!val) this.$emit('input', false)
    },
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
  },
}
</script>

<style lang="scss" scoped>
img {
  display: 100%;
  width: 100%;
}
.rt-qrcode-popup {
  background: none;
  overflow: visible;
}
.rt-qrcode-popup-cont {
  position: relative;
  width: 281px;
  padding: 51px 21px 21px;
  background: #ff8546;
  border-radius: 20px;
  .top-img {
    position: absolute;
    top: -74px;
    left: 50%;
    margin-left: -98px;
    width: 196px;
    height: 126px;
  }
  .tip {
    font-size: 12px;
    color: #fff;
    text-align: center;
    opacity: 0.5;
  }
  .title {
    margin: 8px auto 2px;
    font-size: 19px;
    color: #fff;
    text-align: center;
    line-height: 1.37;
    font-weight: bold;
  }
  .subtitle {
    font-size: 14px;
    color: #fff;
    text-align: center;
    font-weight: bold;
  }
  .qrcode-cont {
    width: 239px;
    height: 239px;
    padding: 12px;
    margin: 8px auto 0;
    background: #fff;
    border-radius: 13px;
  }
}
</style>
