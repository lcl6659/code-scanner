<template>
  <div class="item-select">
    <div class="title-wrap" v-if="currentSgu">
      <div class="title">{{ currentTitle }}</div>
      <div class="start-time">{{ currentSgu.lessonStartTime }}</div>
    </div>
    <div class="items-wrap">
      <div class="items">
        <div
          v-for="(sgu, index) in stock.sguList"
          :key="sgu.title"
          :class="{
            item: true,
            selected: currentIndex === index,
            unselectable: !checkifSelectAble(sgu),
          }"
          @click="selectSgu(index)"
        >
          <div class="icon" :style="{ backgroundImage: `url('${sgu.sguImg}')` }"></div>
          <div class="name">{{ sgu.fullName }}</div>
          <div class="hint-tag">{{ getHintTag(sgu) }}</div>
        </div>
      </div>
      <div class="gifts" v-if="currentSgu">
        <div
          class="gift free-shipping"
          :key="giftBox"
          v-for="giftBox in currentSgu.gifts.giftBoxes"
        >
          {{ giftBox }}
        </div>
        <div class="gift extra" :key="bonusGift" v-for="bonusGift in currentSgu.gifts.bonusGifts">
          {{ bonusGift }}
        </div>
      </div>
    </div>
    <div class="pay-wrap" v-if="isShowPaymentChannel">
      <div class="title">选择支付方式</div>
      <div class="pay-item-wrap">
        <div
          class="pay-item"
          v-for="payItem in payTypeConfig"
          :key="payItem.payType"
          @click="changePayType(payItem)"
        >
          <div class="left">
            <div class="icon" :style="{ backgroundImage: 'url(' + payItem.icon + ')' }"></div>
            <div class="name">{{ payItem.text }}</div>
          </div>
          <div
            class="right check-box"
            :class="{ selected: selectedPayType === payItem.payType }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isWeChat, isAlipayMini } from '@/utils'
export default {
  props: {
    stock: Object,
    sp2xuId: String,
  },
  data() {
    return {
      currentIndex: -1,
      abNormalStatusMap: {
        paid: '已购买',
        soldout: '已售罄',
        notonsale: '待上线',
      },
      subjectMap: {
        ENG: '英语',
        LOGIC: '思维',
      },
      selectedPayType: 'zhifubao',
      payTypeConfig: [
        {
          payType: 'zhifubao',
          text: '支付宝支付',
          icon:
            'https://gaeacdn.jiliguala.com/jlgl/store/v4.7/c19651af91c2d3e36d206cf3fb2cf46d.png',
        },
        {
          payType: 'weixin',
          text: '微信支付',
          icon:
            'https://gaeacdn.jiliguala.com/jlgl/store/v4.7/8421b2089f30542f0b01c508c833ab19.png',
        },
      ],
    }
  },
  computed: {
    currentTitle() {
      const { age } = this.stock
      const fullName = this.currentSgu?.fullName
      return `${fullName}（${age}）`
    },
    currentSgu() {
      return this.stock.sguList[this.currentIndex]
    },
    isOldUser() {
      return this.stock.hasSubjectTypes?.length > 0
    },
    isShowPaymentChannel() {
      return !(isWeChat() || isAlipayMini())
    },
  },
  created() {
    this.updateCurrentIndex()
  },
  updated() {
    this.updateCurrentIndex()
  },
  methods: {
    updateCurrentIndex() {
      let defaultIndex = -1
      this.stock.sguList.find((sgu, index) => {
        const ifMatch = sgu.sp2xuId === this.sp2xuId
        if (ifMatch) defaultIndex = index
        return ifMatch
      })
      this.currentIndex = defaultIndex
    },
    checkifSelectAble(sgu) {
      return sgu.status === 'onsale'
    },
    selectSgu(index) {
      const sgu = this.stock.sguList[index]
      if (this.checkifSelectAble(sgu)) {
        this.currentIndex = index
        this.$emit('changeSgu', sgu)
      }
    },
    getHintTag(sgu) {
      let tag = ''
      const ifSelectAble = this.checkifSelectAble(sgu)
      if (ifSelectAble) {
        const { price } = sgu || {}
        if (price && price.discountPrice > 0) {
          const oldUserPreText = this.isOldUser ? '老用户' : ''
          const unionPreText = ''
          tag = `${oldUserPreText}${unionPreText}立减 ¥${price.discountPrice}`
        }
      } else {
        const { hasSubjectTypes, subjectTypes } = sgu
        const ifShowUnionTag =
          subjectTypes.length > 1 && hasSubjectTypes && hasSubjectTypes.length > 0
        if (ifShowUnionTag) {
          const hasSubjectTags = hasSubjectTypes.map((subjectType) => this.subjectMap[subjectType])
          tag = `已拥有${hasSubjectTags.join('、')}`
        } else {
          tag = this.abNormalStatusMap[sgu.status]
        }
      }
      return tag
    },
    changePayType(payItem) {
      this.selectedPayType = payItem.payType
      this.$emit('changePayType', this.selectedPayType)
    },
  },
}
</script>

<style lang="scss" scoped>
.item-select {
  /* padding: 0 15px; */
  .title-wrap {
    font-family: PingFangSC-Regular, PingFang SC;
    .title {
      margin-bottom: 4px;
      font-size: 20px;
      font-weight: 600;
      color: #2e2e2e;
      line-height: 28px;
    }
    .start-time {
      display: inline-block;
      margin-bottom: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #ff7000;
      line-height: 15px;
    }
  }
  .items-wrap {
    margin-top: 8px;
    .items {
      .item {
        position: relative;
        display: flex;
        background: #ffffff;
        margin-top: 12px;
        border-radius: 10px;
        padding: 6px;
        align-items: center;
        overflow: hidden;
        box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.03);
        box-sizing: border-box;
        color: #2e2e2e;
        &.selected {
          background: #fff8f1;
          color: #ff7400;
          border: 1px solid #fc9127;
          .hint-tag {
            right: -1px;
            top: -1px;
          }
        }
        &.unselectable {
          color: #ccc;
          .hint-tag {
            background: #f2f2f2;
            color: #b8b8b8;
          }
        }
        .icon {
          width: 107px;
          height: 68px;
          border-radius: 6px;
          /* background: url(./icon.png) 100% 100% / auto 100% no-repeat; */
          background: 100% 100% / auto 100% no-repeat;
        }
        .name {
          font-size: 16px;
          font-weight: bold;
          margin-left: 19px;
          line-height: 1.2;
        }
        .hint-tag {
          right: 0;
          top: 0;
          position: absolute;
          font-size: 10px;
          line-height: 1.8em;
          color: #fff;
          font-weight: bold;
          padding: 0 0.7em;
          background: linear-gradient(to right, #ff7d43, #ff362b);
          border-bottom-left-radius: 10px;
        }
      }
    }
    .gifts {
      margin-top: 20px;
      .gift {
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #404040;
        line-height: 28px;
        &::before {
          content: '送';
          font-size: 12px;
          font-family: Jiliguala-Bold, Jiliguala;
          font-weight: bold;
          color: #ff4d19;
          background: #ffe1d9;
          display: inline-block;
          padding: 2px 5px;
          line-height: 17px;
          margin-right: 0.6em;
          border-radius: 5px;
        }
        &.extra {
          &::before {
            content: '额外送';
          }
        }
        &.free-shipping {
          &::after {
            content: '包邮';
            font-size: 12px;
            font-family: Jiliguala-Regular, Jiliguala;
            margin-left: 0.6em;
            /* font-weight: 400; */
            color: #ff7607;
            line-height: 18px;
            padding: 0 4px;
            border: 1px solid #f9d2b3;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .pay-wrap {
    margin-top: 26px;
    .title {
      font-size: 13px;
      font-weight: 400;
      color: #888888;
      line-height: 14px;
    }
    .pay-item-wrap {
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.03);
      border-radius: 10px;
      margin-top: 10px;
      padding: 0 12px;
      .pay-item {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          .icon {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            background-size: 100% 100%;
          }
        }
        .right {
          width: 22px;
          height: 22px;
          background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.7/478dbd81bab9b297f4ebb4bfd9ff2303.png')
            no-repeat;
          background-size: 100% 100%;
          &.selected {
            background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.7/54de03fcaf9556541974a1bada1d31e5.png')
              no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
}
</style>
