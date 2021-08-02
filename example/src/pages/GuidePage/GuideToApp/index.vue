<template>
  <div class="guide_to_app_wrap">
    <div class="top_tip">
      <span>支付成功</span>
    </div>
    <main class="main">
      <div class="main_icon">
        <img
          src="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/0ad2f41b97197fb6fe6bc4e5ef04aa8e.png"
          alt="叽里呱啦"
        />
      </div>
      <div class="tip_txt">
        <p>前往<span>「叽里呱啦<span>APP</span>」</span>，</p>
        <p>
          填写<span><span>礼盒收货地址</span><i class="txt_bg"></i></span>，开始学习吧！
        </p>
      </div>
      <div class="bottom_btn" @click="downloadApp">
        <span>下载叽里呱啦<span>APP</span></span>
      </div>
    </main>
  </div>
</template>

<script>
import { lanuchApp } from '@/utils/downloadApp'
export default {
  components: {},
  computed: {},
  data() {
    return {}
  },
  methods: {
    downloadApp() {
      this.$track('DownloadAPP_View_Click')
      lanuchApp('open')
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="scss" scoped>
.guide_to_app_wrap {
  height: 100vh;
  background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.4/f3245cd0c13bdf495c6f338f2119aa69.png')
    no-repeat top center/100% 170px;
}
.top_tip {
  text-align: center;
  padding-top: 38px;
  span {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    line-height: 28px;
    padding-left: 28px;
    text-align: center;
    background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.4/46bc564bdbf506d6aa19f01359b7d960.png')
      no-repeat left center/23px 23px;
  }
}
.main {
  width: 343px;
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.07);
  border-radius: 20px;
  margin: 32px auto;
  padding: 40px 0 50px;
  text-align: center;
  .main_icon {
    img {
      width: 115px;
      height: 118px;
    }
  }
  .tip_txt {
    margin-top: 27px;
    font-size: 17px;
    font-weight: 400;
    color: #2e2e2e;
    line-height: 28px;
    font-size: 17px;
    color: #2e2e2e;
    line-height: 28px;
    p {
      span {
        font-weight: bold;
      }
      &:nth-child(1) {
        > span > span {
          font-family: Jiliguala-Bold;
        }
      }
      &:nth-child(2) {
        > span {
          position: relative;
          span {
            position: relative;
            z-index: 1;
          }
          .txt_bg {
            position: absolute;
            bottom: -4px;
            left: 0;
            right: 0;
            height: 12px;
            background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.4/cefcc70ead548f5619bbfdc2ca0d0111.png')
              no-repeat center/cover;
            border-radius: 24px;
          }
        }
      }
    }
  }
  .bottom_btn {
    width: 280px;
    background: #25d780;
    box-shadow: 0px 8px 0px -4px #dff8ed;
    border-radius: 25px;
    margin: 50px auto 0;
    font-size: 17px;
    font-weight: bold;
    color: #fff;
    padding: 18px 0 18px 20px;
    line-height: 14px;
    > span {
      position: relative;
      &:before {
        content: '';
        height: 21px;
        width: 21px;
        position: absolute;
        left: -24px;
        top: 1px;
        background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.4/d97b55926da2d222a15f50b7077958b6.png')
          no-repeat center/cover;
      }
      span {
        font-family: Jiliguala-Bold;
      }
    }
  }
}
</style>
