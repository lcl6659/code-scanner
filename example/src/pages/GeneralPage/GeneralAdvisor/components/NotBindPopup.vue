// 未添加学习顾问挽留弹窗
<template>
  <van-popup v-model="show" round :close-on-click-overlay="false">
    <img
      class="logo"
      src="https://gaeacdn.jiliguala.com/jlgl/vcomp/addfriend/7318a1ad7ff76ddeb6ec60015b122ab0.png"
      alt=""
    />
    <div class="title">确定要退出吗？</div>
    <div class="content">
      已超过
      <span>
        <img
          src="https://gaeacdn.jiliguala.com/jlgl/vcomp/addfriend/4feed1951684468ee49ee2544225ae65.png"
          alt=""
        /> </span
      >同期开营的宝宝添加了学习顾问,你添加了吗？
    </div>
    <div class="btn">
      <div class="btn-confirm" @click="back">我已添加</div>
      <div class="btn-cancel" @click="continueAdd">继续添加</div>
    </div>
  </van-popup>
</template>

<script>
import { Popup } from 'vcomp'
import TRACKMIXINS from '@/mixins/track/trackAdvisorMixins'
export default {
  name: 'NotBindPopup',
  mixins: [TRACKMIXINS],
  components: {
    'van-popup': Popup,
  },
  props: {
    showBindFollowPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    show() {
      return this.showBindFollowPopup
    },
  },
  methods: {
    continueAdd() {
      this.track('Add Teacher Detainment Popup Confirm Click')
      this.$emit('close')
    },
    back() {
      this.track('Add Teacher Detainment Popup Cancel Click')
      this.$emit('back')
    },
  },
}
</script>
<style lang="scss" scoped>
.van-popup {
  // position: relative;
  width: 320px;
  height: 205px;
  background: #ffffff;
  border-radius: 20px;
  overflow: visible;
  padding-top: 30px;
  text-align: center;
  .logo {
    width: 86px;
    position: absolute;
    left: 50%;
    margin-left: -43px;
    top: -102px;
  }
  .title {
    font-size: 22px;
    line-height: 30px;
    font-weight: bold;
    color: #404040;
  }
}
.content {
  width: 100%;
  box-sizing: border-box;
  margin: auto;
  font-size: 15px;
  line-height: 24px;
  padding: 8px 34px 19px;
  color: #2e2e2e;
  span {
    img {
      width: 41px;
      height: 17px;
    }
  }
}
.btn {
  display: flex;
  justify-content: space-evenly;
  div {
    border: 1px solid #2abf7b;
    border-radius: 50px;
    padding: 14px 30px;
    color: #2abf7b;
    font-size: 18px;
    line-height: 22px;
  }
  .btn-cancel {
    background: #2abf7b;
    color: #fff;
  }
}
::v-deep .van-dialog__content {
  padding: 21px 0;
}
::v-deep .van-dialog {
  overflow: visible;
}
</style>
