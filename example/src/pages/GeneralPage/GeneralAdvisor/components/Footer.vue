<template>
  <div class="footer-page">
    <div class="footerBox">
      <img
        src="https://gaeacdn.jiliguala.com/jlgl/store/v4.1/b654223635ef94ae6578fff57035c7f1.png"
        alt="footImg"
        class="footImg"
      />
      <div class="text">
        <template v-if="tutorInfo.length">
          请用<span class="mobile">手机号{{ tutorInfo[0].mobile }}登录</span
          >叽里呱啦APP，使用手机、平板入营体验
        </template>
        <template v-else>
          <p>可用手机、平板体验，进入应用商店</p>
          <p>下载<span>叽里呱啦APP</span></p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    tutorInfo: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.footer-page {
  margin-top: 24px;
  margin-bottom: 30px;
}
.footerBox {
  width: 343px;
  background: #f8f8f8;
  border-radius: 16px;
  position: relative;
  padding-left: 86px;
  padding-top: 14px;
  padding-bottom: 14px;
  margin: 0 auto;
  margin-bottom: 13px;
  .footImg {
    position: absolute;
    width: 49px;
    height: 54px;
    top: 14px;
    bottom: 0;
    left: 18px;
  }
  .text {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    font-weight: 400;
    font-family: 'Jiliguala-Regular';
    span {
      color: #fc9026;
    }
    span.mobile {
      color: #2e2e2e;
    }
  }
}
</style>
