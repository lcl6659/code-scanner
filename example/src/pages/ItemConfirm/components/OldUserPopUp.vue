<template>
  <div>
    <!-- 老用户不能购课弹窗 -->
    <PlainPopup
      :show="ifShow"
      imgUrl="https://gaeacdn.jiliguala.com/jlgl/store/v4.1/522b68e02967e8844278175cd84974f4.png"
      :closeOnClickOverlay="true"
      @closePopup="hide"
    >
      <div class="inviteButton" @click="goDiamondPage">
        立即邀请
      </div>
    </PlainPopup>
    <!-- <ImgFissionPopup
      :show="ifShow"
      imgUrl="https://gaeacdn.jiliguala.com/jlgl/store/v4.1/522b68e02967e8844278175cd84974f4.png"
      :closeOnClickOverlay="true"
      @closePopup="hide"
    >
      <div slot="bottomButton" class="inviteButton" @click="goDiamondPage">
        立即邀请
      </div>
    </ImgFissionPopup> -->
  </div>
</template>

<script>
import { getIntroduceUrl } from '@/utils'
import ImgFissionPopup from '@/components/ImgFissionPopup/ImgFissionPopup'
import { PlainPopup } from 'components'

export default {
  props: {
    ifShow: Boolean,
  },
  components: {
    // ImgFissionPopup,
    PlainPopup,
  },
  methods: {
    //跳钻石商城
    goDiamondPage() {
      this.$track('GoDiamond_Dialog_Click')
      location.replace(`${getIntroduceUrl('H5_Store_Dia')}?source=H5StoreAfterLogin_Paid`)
    },
    hide() {
      this.$emit('hide')
    },
  },
}
</script>

<style lang="scss" scoped>
.inviteButton {
  width: 180px;
  height: 50px;
  background: linear-gradient(180deg, #fff48d 0%, #ffdc20 100%);
  box-shadow: 0px 20px 20px 0px rgba(220, 71, 17, 0.23);
  border-radius: 43px;
  font-size: 18px;
  font-weight: 600;
  color: #a0471e;
  line-height: 50px;
  text-align: center;
  position: absolute;
  top: 280px;
  left: 70px;
}
</style>
