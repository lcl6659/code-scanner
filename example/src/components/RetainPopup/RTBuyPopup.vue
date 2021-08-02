<!-- 已注册未购买挽留弹窗 -->
<template>
  <van-popup
    :close-on-click-overlay="true"
    v-model="show"
    class="rt-popup"
    style="top: 55%;"
    round
  >
    <div class="rt-popup-cont rtBuy-cont">
      <!-- <slot name="topImg" /> -->
      <img
        class="top-img"
        src="https://gaeacdn.jiliguala.com/jlgl/store/v1.9_images/1f0a165ad8a550cb7835ff760cd042dc.png"
      />
      <div class="tip">
        <!-- <slot name="tip" /> -->
        <p>您真的要放弃购买吗?</p>
      </div>
      <div class="popup-content rtBuy-content">
        <!-- <slot :RTBuyList="RTBuyList" /> -->
        <p>继续放弃将失去<span>专属福利:</span></p>
        <div class="rtBuy-lists">
          <div
            class="rtBuy-item"
            v-for="(item, index) in RTBuyList"
            :key="index"
          >
            <img :src="item.icon" />
            <span>{{ item.desc }}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <!-- <slot name="footer" /> -->
        <van-button class="pay-btn" @click="pay">继续购买</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Button } from 'vant'
export default {
  components: {
    'van-button': Button,
  },
  props: {
    RTBuyVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      qr:
        process.env.VUE_APP_ENV === 'production'
          ? 'https://qiniucdn.jiliguala.com/devbanners/ed7c6465a73f4315843a24aabd1cd700.png'
          : 'https://qiniucdn.jiliguala.com/devbanners/1584b59341cf48e885642d782aa8093f.png',
      //注册未购买
      RTBuyList: [
        {
          icon:
            'https://gaeacdn.jiliguala.com/jlgl/store/v1.9_images/e1568c53b8ba5e448a9d23781d92f394.png',
          desc: '学完全额返现',
        },
        {
          icon:
            'https://gaeacdn.jiliguala.com/jlgl/store/v1.9_images/bc01c72cbd103676adc82fb23f1ec49f.png',
          desc: '学习材料包邮赠送',
        },
        {
          icon:
            'https://gaeacdn.jiliguala.com/jlgl/store/v1.9_images/ed31ffa3eff6fc68794d6046d7cb00b5.png',
          desc: '专属学习顾问全程辅导',
        },
      ],
    }
  },
  computed: {
    show: {
      get() {
        return this.RTBuyVisible
      },
      set(newVal) {
        this.$emit('closeRTBuyPopup', newVal)
      },
    },
  },
  mounted() {},
  watch: {
    show(val) {
      if (!val) this.$emit('input', false)
    },
  },
  methods: {
    pay() {
      this.$emit('pay')
    },
  },
}
</script>

<style lang="scss" scoped>
.rt-popup-cont {
  padding: 30px 20px 20px;
  background-color: #fff;
  font-family: PingFangSC-Semibold, PingFang SC;
  .top-img {
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, -75%);
    width: 150px;
    height: 130px;
  }
  .tip {
    width: 100%;
    font-size: 12px;
    text-align: center;
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
  .cont {
    width: 239px;
    height: 239px;
    padding: 12px;
    margin: 8px auto 0;
    background: #fff;
    border-radius: 13px;
  }
}
//未注册返回
.rtBuy-cont {
  font-family: PingFangSC-Regular, PingFang SC;
  .tip {
    height: 28px;
    font-size: 20px;
    font-weight: 700;
    color: rgba(64, 64, 64, 1);
    line-height: 28px;
  }
  .rtBuy-content {
    margin: 20px 0;
    text-align: center;
    p,
    .rtBuy-item span {
      height: 22px;
      font-size: 16px;
      font-weight: 700;
      color: rgba(64, 64, 64, 1);
      line-height: 22px;
      span {
        color: #ff5159;
      }
    }
    .rtBuy-lists {
      .rtBuy-item {
        height: 48px;
        line-height: 48px;
        margin-top: 10px;
        img {
          display: inline-block;
          width: 40px;
          height: 40px;
          vertical-align: top;
          margin: 0 20px;
        }
        span {
          font-weight: 400;
          display: inline-block;
          width: 170px;
          text-align: left;
        }
      }
    }
  }
  .footer {
    p {
      width: 100%;
      text-align: center;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(64, 64, 64, 1);
      line-height: 20px;
    }
    .count-down-text {
      font-size: 15px;
      font-weight: 600;
      color: rgba(252, 145, 38, 1);
    }
    .pay-btn {
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: #fff;
      font-weight: bold;
      font-size: 18px;
      background: #fc9126;
      border-radius: 20px;
      border: none;
      margin-top: 10px;
    }
  }
}
</style>
