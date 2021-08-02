<!-- 9.9 表演模板 -->
<template>
  <div class="store-page">
    <img
      width="100%"
      v-if="loading"
      src="../../../assets/images/item-skeleton.svg"
      alt="骨架屏预览"
    />
    <section v-else class="item-page" ref="itemPage">
      <div class="b-test">
        <Carousel :fakeColor="configHome.fakeColor || '#FFFFFF'" v-if="configHome.fakeShow" />
        <!-- 头部海报 -->
        <div class="top-banner">
          <img class="banner-img" :src="configHome.bannerPic" alt="" />
        </div>
        <InsideAgeChoose
          v-if="insideAgeChooseABTset === 'B' && configHome.ageSpec.length > 1"
          @goItemConfirm="goItemConfirm"
        ></InsideAgeChoose>
        <!-- 头图底部图列表 -->
        <div class="bottom-wrap">
          <div class="banner-list" v-if="configHome.detail.length > 0">
            <div v-for="(pics, idx) in configHome.detail" :key="idx">
              <div v-if="pics.tabTitle && pics.tabTitle.includes('COM')">
                <img v-for="(img, index) in pics.detailPics" :key="index" :src="img" alt="" />
              </div>
              <div v-else>
                <!-- 遍历生成tab -->
                <HomeTab :tabDetails="pics"></HomeTab>
              </div>
            </div>
          </div>
          <!-- 快手--个人信息授权与保护声明 -->
          <AuthStatement v-if="isKs"></AuthStatement>
          <ItemButton
            v-if="defaultPrice.price !== ''"
            theme="fill"
            :hasTopShadow="true"
            @click="handleItemButtonClick('Bottom')"
          />
        </div>
      </div>

      <!-- 支付确认信息窗口 -->
      <ItemCheckout
        :value="showCheckout"
        @close="closeCheckoutPopup"
        @chargeResult="chargeResult"
        @disabledBuyHandle="disabledBuyHandle"
      ></ItemCheckout>

      <!-- 老用户不能购课弹窗 -->
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
        @closePopup="closeDiscountPopup"
        @confirm="closeDiscountPopup"
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
//引入组件
// import ImgFissionPopup from '@/components/ImgFissionPopup/ImgFissionPopup'
import rtBuyPopup from '@/components/RetainPopup/RTBuyPopup' //注册未购买弹框
import ItemButton from '@/pages/ExtdItem/widgets/ItemButton'
import ItemCheckout from '../widgets/ItemCheckout'
import HomeTab from '../widgets/HomeTab'
import Carousel from '../widgets/Carousel/Carousel'
import InvitedRedPopup from '../widgets/InvitedRedPopup/InvitedRedPopup'
import AuthStatement from '../widgets/AuthStatement/AuthStatement'
import AgeChoose from '../widgets/AgeChoose'
import InsideAgeChoose from '../widgets/InsideAgeChoose'

import HOMEMIXIN from '@/mixins/HomeMixins'
import { PlainPopup } from 'components'

export default {
  mixins: [HOMEMIXIN],
  components: {
    ItemButton,
    // ImgFissionPopup,
    ItemCheckout,
    rtBuyPopup,
    Carousel,
    InvitedRedPopup,
    HomeTab,
    AuthStatement,
    AgeChoose,
    InsideAgeChoose,
    PlainPopup,
  },
  data() {
    return {}
  },
}
</script>

<style scoped lang="scss" src="./Item.scss"></style>
