<template>
  <div class="emptyTutor-page">
    <div class="qrcode">
      <img
        src="https://gaeacdn.jiliguala.com/jlgl/store/v4.1/31a262e0c36e4e6472ee622307c0aa80.png"
        alt="emptyQrcode"
      />
    </div>
    <div class="prompt">
      <p>学习顾问信息暂无 请刷新页面重试</p>
      <p class="note">点击页面右上角刷新</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyTutor',
  data() {
    return {}
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.emptyTutor-page {
  .qrcode {
    width: 161px;
    height: 161px;
    border-radius: 14px;
    border: 3px solid #e6e9eb;
    margin: 15px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    img {
      display: inline-block;
      width: 100px;
      height: 100px;
    }
  }
  .prompt {
    margin: 20px 0;
    p {
      font-size: 16px;
      font-weight: 600;
      color: #2e2e2e;
      line-height: 22px;
      text-align: center;
      margin: 5px 0;
    }
    .note {
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
    }
  }
}
</style>
