<template>
  <div class="charge-status" v-if="show">
    <img
      class="logo"
      src="https://qiniucdn.jiliguala.com/dev/promo/9338b9a77c514d369b8b2d0b40b73113.png"
    />
    <van-button class="success-btn" data-val="success" @click="checkOrderStatus"
      >支付成功</van-button
    >
    <van-button class="fail-btn" data-val="fail" @click="checkOrderStatus"
      >支付失败</van-button
    >
  </div>
</template>

<script>
import { Button } from 'vant'

export default {
  props: {
    show: Boolean,
  },
  components: {
    'van-button': Button,
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    checkOrderStatus(evt) {
      if (evt.target.dataset.val === 'success') {
        this.$track('Item Pay Success Click')
      } else if (evt.target.dataset.val === 'fail') {
        this.$track('Item Pay Fail Click')
      }
      this.$emit('change', null)
    },
  },
}
</script>

<style lang="scss" scoped>
.charge-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .logo {
    width: 140px;
    height: 140px;
    margin-bottom: 20px;
    margin-top: -80px;
  }

  .success-btn {
    width: 248px;
    height: 50px;
    background-color: rgba(255, 135, 15, 1);
    border-radius: 25px;
    color: #ffffff;
    border: none;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 22px;
  }
  .fail-btn {
    width: 248px;
    height: 50px;
    border-radius: 25px;
    color: rgba(255, 135, 15, 1);
    border: 1px solid rgba(255, 135, 15, 1);
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
