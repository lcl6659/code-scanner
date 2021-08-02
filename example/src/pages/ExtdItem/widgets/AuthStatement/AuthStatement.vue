<template>
  <div class="AuthStatement">
    <img
      class="agreementImg"
      src="https://gaeacdn.jiliguala.com/jlgl/store/v4.3/650b382d3ffa78f181a992183c16a2f2.png"
      alt="声明"
      @click="showStatement = true"
    />
    <!-- <div class="agreement">
      提交即视为您已同意
      <span @click="showStatement = true">《个人信息授权与保护声明》</span>
    </div> -->
    <van-popup
      round
      v-model="showStatement"
      @click-overlay="showStatement = false"
    >
      <div class="agreeBox">
        <div class="header">个人信息授权与保护声明</div>
        <iframe
          src="https://spa.jiliguala.com/app/app-private.html"
          frameborder="0"
        >
        </iframe>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'AuthStatement',
  data() {
    return {
      showStatement: false,
    }
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.AuthStatement {
  text-align: center;
  margin-top: -32px;
  padding-bottom: 16px;
  .agreementImg {
    display: inline-block;
    width: 248px;
    height: 16px;
  }
  .agreement {
    text-align: center;
    padding: 10px 0;
    font-size: 12px;
    color: #2e2e2e;
    span {
      color: #3e7cf7;
    }
  }
  .agreeBox {
    width: 320px;
    height: 390px;
    text-align: center;
    overflow: hidden;
    .header {
      padding: 15px 0;
      border-bottom: 1px solid #000;
      font-weight: bold;
      font-size: 19px;
    }
    iframe {
      width: 100%;
      height: 340px;
      font-size: 12px;
      border-radius: 0 0 15px 15px;
    }
  }
}
</style>
