<template>
  <div class="item-select">
    <div class="purchasable" v-if="ifPurchasable">
      <CountDown />
      <div class="btn-wrap">
        <div class="left">
          <!-- <div class="price"> -->
          <div class="line0">
            <div class="info">合计</div>
            <div class="num">{{ price }}</div>
          </div>
          <div class="discounts" v-if="discountPrice > 0">已优惠¥{{ discountPrice }}</div>
          <!-- </div> -->
        </div>
        <div class="btn" @click="triggerAction('buy')">立即支付</div>
      </div>
    </div>
    <div class="unpurchasable" v-if="ifShowUnPurchasable">
      <div class="btn-wrap">
        <div class="invite-buy btn" @click="triggerAction('showPopUp')">
          推荐好友赢好礼
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountDown from '@/components/CountDown'

export default {
  props: ['ifPurchasable', 'ifShowUnPurchasable', 'priceObj'],
  computed: {
    price() {
      return this.priceObj?.price
    },
    discountPrice() {
      return this.priceObj?.discountPrice
    },
  },
  components: {
    CountDown,
  },
  methods: {
    triggerAction(actName) {
      this.$emit(actName)
    },
  },
}
</script>

<style lang="scss" scoped>
.item-select {
  .btn-wrap {
    display: flex;
    height: 74px;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    background: #fff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    .left {
      position: relative;
      /* top: -3px; */
      display: flex;
      flex-direction: column;
      .line0 {
        display: flex;
        align-items: flex-end;
        .info {
          height: 100%;
          font-size: 13px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2e2e2e;
          line-height: 18px;
          /* vertical-align: baseline; */
          align-self: flex-end;
        }
        .num {
          margin-left: 4px;
          font-size: 34px;
          font-family: Jiliguala-Bold, Jiliguala;
          font-weight: bold;
          color: #ff7000;
          align-self: flex-end;
          &::before {
            content: '¥';
            font-family: PingFangSC-Semibold, PingFang SC;
            font-size: 16px;
          }
          /* line-height: 48px; */
        }
      }
      .discounts {
        /* position: absolute;
        left: 0;
        bottom: -15px; */
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ff7000;
        line-height: 1.5;
        white-space: nowrap;
        /* display: none; */
      }
    }
    .btn {
      width: 202px;
      height: 50px;
      text-align: center;
      background: linear-gradient(180deg, #ff820b 0%, #ff6702 100%);
      border-radius: 27px;
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 50px;
    }
    .invite-buy {
      width: 343px;
    }
  }
}
</style>
