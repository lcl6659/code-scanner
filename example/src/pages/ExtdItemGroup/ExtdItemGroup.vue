<!-- v3.1.5 add 假拼团页面 -->
<template>
  <div class="store-page">
    <img
      v-if="loading"
      width="100%"
      src="../../assets/images/itemGroup-skeleton.svg"
      alt="骨架屏预览"
    />
    <section v-else class="item-page" ref="itemPage">
      <div class="top-banner">
        <van-image class="banner-img" :src="configHome.bannerPic"></van-image>
        <Carousel :fakeColor="configHome.fakeColor || '#FFFFFF'" v-if="configHome.fakeShow" />
        <InsideAgeChoose
          v-if="insideAgeChooseABTset === 'B' && configHome.ageSpec.length > 1"
          @goItemConfirm="goItemConfirm"
        ></InsideAgeChoose>
        <div class="group" v-if="configHome.realNick !== ''">
          <p class="group-num" v-show="!groupContentVisible">
            正在拼团中，可直接参团
          </p>
          <group-content
            :realAva="configHome.realAva"
            :realNick="configHome.realNick"
            @toCharge="handleItemButtonClick('Join')"
          >
          </group-content>
        </div>
      </div>
      <div class="group-doc" v-show="groupContentVisible">
        <group-content
          :realAva="configHome.realAva"
          :realNick="configHome.realNick"
          @toCharge="handleItemButtonClick('Join')"
        >
        </group-content>
      </div>
      <div class="bottom-wrap">
        <div class="banner-list" v-if="configHome.detail.length > 0">
          <div v-for="(pics, idx) in configHome.detail" :key="idx">
            <div v-if="pics.tabTitle && pics.tabTitle.includes('COM')">
              <img v-for="(img, index) in pics.detailPics" :key="index" :src="img" alt="" />
            </div>
            <div v-else>
              <HomeTab :tabDetails="pics"></HomeTab>
            </div>
          </div>
        </div>
        <!-- 快手--个人信息授权与保护声明 -->
        <AuthStatement v-if="isKs"></AuthStatement>
        <div class="bottom-bar" v-if="defaultPrice.price !== ''">
          <template v-if="promoterRole === 'PROMOTER'">
            <div class="promoter" @click="itemButtonClick">
              <button>立即分享</button>
            </div>
          </template>
          <div v-else class="btnGroup">
            <div class="price" @click="handleItemButtonClick('LumpSum')">
              <div class="cur-price">
                <span class="cny-character">￥</span>
                <span>{{ defaultPrice.originPrice }}</span>
                <span class="cny-character" v-if="defaultSubjectCount > 1"
                  >/{{ defaultSubjectCount }}科</span
                >
              </div>
              <div class="desc">单独购买</div>
            </div>
            <div class="price-ingroup" @click="handleItemButtonClick('Instalment')">
              <div class="cur-price">
                <span class="cny-character">￥</span>
                <span>{{ defaultPrice.price }}</span>
                <span class="cny-character" v-if="defaultSubjectCount > 1"
                  >/{{ defaultSubjectCount }}科</span
                >
              </div>
              <div class="desc">一键参团</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 支付确认信息窗口 -->
      <ItemCheckout
        :value="showCheckout"
        @close="closeCheckoutPopup"
        @chargeResult="chargeResult"
        @disabledBuyHandle="disabledBuyHandle"
      ></ItemCheckout>

      <!-- 老用户弹窗 -->
      <PlainPopup
        :show="showRtToast"
        imgUrl="https://gaeacdn.jiliguala.com/jlgl/store/v4.1/522b68e02967e8844278175cd84974f4.png"
        :closeOnClickOverlay="true"
        @closePopup="closePopup('showRtToast')"
      >
        <div class="inviteButton" @click="goDiamondPage">
          立即邀请
        </div>
      </PlainPopup>
      <!-- <ImgFissionPopup
        :show="showRtToast"
        imgUrl="https://gaeacdn.jiliguala.com/jlgl/store/v4.1/522b68e02967e8844278175cd84974f4.png"
        :closeOnClickOverlay="true"
        @closePopup="closePopup('showRtToast')"
      >
        <div slot="bottomButton" class="inviteButton" @click="goDiamondPage">
          立即邀请
        </div>
      </ImgFissionPopup> -->

      <!-- 红包优惠弹窗 -->
      <PlainPopup
        :show="showDiscount"
        :imgUrl="discountUrl"
        :closeOnClickOverlay="true"
        popupWidth="100vw"
        @closePopup="closeDiscountPopup"
        @click-content="closeDiscountPopup"
      ></PlainPopup>
      <!-- <ImgFissionPopup
        class="discountImg"
        :show="showDiscount"
        :imgUrl="discountUrl"
        :closeOnClickOverlay="true"
        @confirm="closeDiscountPopup"
        @closePopup="closeDiscountPopup"
      >
      </ImgFissionPopup> -->

      <!-- 注册未购买挽留弹框 -->
      <rt-buy-popup
        :RTBuyVisible="RTBuyVisible"
        @pay="continuePay"
        @closeRTBuyPopup="closePopup('RTBuyVisible')"
      ></rt-buy-popup>

      <!-- 被邀请用户领红包弹层 -->
      <invited-red-popup
        :inviter="inviter"
        :show="showInvitedRedPopup"
        @receiveRedPacket="closePopup('showInvitedRedPopup')"
      >
      </invited-red-popup>

      <!-- 私域挽留弹窗 -->
      <OutSideFollowPopup
        :show="showOutSideFollowPopup"
        @closePopup="closePopup('showOutSideFollowPopup')"
      ></OutSideFollowPopup>

      <!-- 购买页看思维答案 -->
      <!-- https://gaeacdn.jiliguala.com/jlgl/store/v4.4/df5d363b773415f18d9df5775685d0ee.png   这个是称重的图片 -->
      <PlainPopup
        :show="showAnswer"
        imgUrl="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/5a421125f8c35b7c6085fdbeaffd93b9.png"
      >
        <div class="answerButton" @click="closePopup('showAnswer')">
          <img
            src="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/efcea7f53ae2a637d0d98e1855a819e6.png"
          />
        </div>
      </PlainPopup>
      <!-- <ImgFissionPopup
        :show="showAnswer"
        imgUrl="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/5a421125f8c35b7c6085fdbeaffd93b9.png"
        :closeOnClickOverlay="false"
      >
        <div slot="bottomButton" class="answerButton" @click="closePopup('showAnswer')">
          <img
            src="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/efcea7f53ae2a637d0d98e1855a819e6.png"
          />
        </div>
      </ImgFissionPopup> -->

      <!-- 投放营销弹窗 -->
      <PlainPopup
        :show="salePopupVisable"
        :imgUrl="salePopupImg"
        :closeOnClickOverlay="true"
        @closePopup="closePopup('salePopupVisable')"
        @click-content="closePopup('salePopupVisable')"
      ></PlainPopup>
      <!-- <ImgFissionPopup
        :show="salePopupVisable"
        :imgUrl="salePopupImg"
        :closeOnClickOverlay="true"
        @closePopup="closePopup('salePopupVisable')"
        @confirm="closePopup('salePopupVisable')"
      >
      </ImgFissionPopup> -->
    </section>
    <!-- 选择年龄 -->
    <AgeChoose
      @closeAgeChoosePop="closeAgeChoosePop"
      @goItemConfirm="goItemConfirm"
      :ageChooseShow="ageChooseShow"
      v-if="configHome.ageSpec && configHome.ageSpec.length > 0"
    />
  </div>
</template>

<script>
// import throttle from 'lodash/throttle'
import { Image } from 'vant'
// import ImgFissionPopup from '@/components/ImgFissionPopup/ImgFissionPopup'
import rtBuyPopup from '@/components/RetainPopup/RTBuyPopup' //注册未购买弹框
import ItemCheckout from '../ExtdItem/widgets/ItemCheckout'
import HomeTab from '../ExtdItem/widgets/HomeTab'
import Carousel from '../ExtdItem/widgets/Carousel/Carousel'
import GroupContent from './widgets/GroupContent'
import OutSideFollowPopup from './widgets/OutSideFollowPopup'
import InvitedRedPopup from '../ExtdItem/widgets/InvitedRedPopup/InvitedRedPopup'
import AuthStatement from '../ExtdItem/widgets/AuthStatement/AuthStatement'
import AgeChoose from '../ExtdItem/widgets/AgeChoose'
import InsideAgeChoose from '../ExtdItem/widgets/InsideAgeChoose'
import { PlainPopup } from 'components'

// js逻辑代码 在此修改！！！
import HOMEMIXIN from '@/mixins/HomeMixins'
// import padStart from 'lodash/padStart'
export default {
  name: 'ItemGroup',
  mixins: [HOMEMIXIN],
  components: {
    'van-image': Image,
    // ImgFissionPopup,
    ItemCheckout,
    rtBuyPopup,
    Carousel,
    GroupContent,
    OutSideFollowPopup,
    InvitedRedPopup,
    HomeTab,
    AuthStatement,
    AgeChoose,
    InsideAgeChoose,
    PlainPopup,
  },
  data() {
    return {
      groupContentVisible: false,
      // countdownRandom: 0,
      // countdown: {
      //   hours: '00',
      //   minutes: '00',
      //   seconds: '00',
      //   millisec: '00',
      // },
    }
  },
  created() {
    // this.resetRandom()
    // this.initCountDown()
  },
  mounted() {
    window.addEventListener('scroll', this.pageScrolling, false)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.pageScrolling, false)
  },
  methods: {
    pageScrolling() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const bannerHeight = document.querySelector('.top-banner')
        ? document.querySelector('.top-banner').scrollHeight
        : 0
      this.groupContentVisible = bannerHeight < scrollTop
    },
    //随机数生成Fn
    createRandoms(min, max) {
      let cha = max - min
      let randomNum = min + Math.floor(Math.random() * cha)
      return randomNum
    },
    //随机数刷新Fn
    // resetRandom() {
    //   this.countdownRandom = this.createRandoms(3, 10)
    // },
    //倒计时Fn
    // initCountDown() {
    //   if (this.timer) clearInterval(this.timer)
    //   const end = new Date().getTime() + this.countdownRandom * 60 * 1000
    //   let timer = 0
    //   let fakeMillisec = 9
    //   const countdown = () => {
    //     const remain = Math.floor((end - new Date().getTime()) / 1000)
    //     fakeMillisec = fakeMillisec > 0 ? fakeMillisec - 1 : 9
    //     if (remain < 0) {
    //       this.countdown = {
    //         hours: '00',
    //         minutes: '00',
    //         seconds: '00',
    //         millisec: '00',
    //       }
    //       clearTimeout(timer)
    //       this.resetRandom()
    //       this.initCountDown()
    //     } else {
    //       this.countdown = {
    //         hours: '00',
    //         minutes: padStart(Math.floor(remain / 60), 2, '0'),
    //         seconds: padStart(Math.floor(remain % 60), 2, '0'),
    //         millisec: padStart(fakeMillisec, 2, '0'),
    //       }
    //       timer = setTimeout(countdown, 100)
    //     }
    //   }
    //   countdown()
    // },
  },
}
</script>
<style scoped lang="scss" src="../ExtdItem/ReferralItem/Item.scss"></style>
<style scoped lang="scss">
.bottom-wrap {
  padding-bottom: 134px;
}
.group {
  width: 100vw;
  height: 100px;
  padding: 18px 20px 11px;
  display: flex;
  flex-direction: column;
  .group-num {
    height: 18px;
    font-size: 13px;
    font-weight: 700;
    color: #404040;
    line-height: 18px;
  }
}
.group-doc {
  position: fixed;
  left: 0;
  bottom: 74px;
  height: 60px;
  width: 100vw;
  z-index: 2;
  background-color: #fff;
  padding: 0 20px 14px;
}

.bottom-bar {
  height: 74px;
  width: 100vw;
  display: flex;
  position: fixed;
  color: #fff;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  text-align: center;
  box-shadow: 0 -2px 5px -2px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  .btnGroup {
    height: 74px;
    width: 100vw;
    display: flex;
    padding: 12px 16px;
    box-sizing: border-box;
  }
  .price,
  .price-ingroup {
    flex: 1;
    height: 100%;
  }
  .price {
    background-color: rgba(255, 192, 58, 1);
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    text-align: center;
  }
  .price-ingroup {
    background: rgba(255, 135, 15, 1);
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }

  .cur-price {
    font-size: 24px;
    font-weight: 600;
    height: 33px;
    line-height: 33px;
  }
  .desc {
    flex: 1;
    font-size: 13px;
    font-weight: 400;
  }
  .cur-price .cny-character {
    width: 9px;
    height: 20px;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
  }
  .promoter {
    width: 100%;
    height: 100%;
    button {
      width: 100%;
      height: 50px;
      background: #fc9126;
      border-radius: 25px;
      font-size: 18px;
      color: #fff;
      font-weight: 700;
      border: none;
    }
  }
}
</style>
