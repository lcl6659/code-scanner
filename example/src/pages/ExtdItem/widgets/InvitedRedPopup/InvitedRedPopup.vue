<template>
  <van-popup
    v-model="show"
    @click="receiveRedPacket"
    @click-overlay="receiveRedPacket"
  >
    <div class="contentB">
      <div class="head">
        <p class="initiatorInfo">
          <img :src="inviter ? inviter.ava : ''" alt="" />
          <span class="nick">{{ inviter ? inviter.nick : '' }}</span>
        </p>
        <img
          src="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/67f4a68346bfe73048edb90c44cfe161.png"
          alt="送你一份"
          class="headImg"
        />
      </div>
      <img
        src="https://gaeacdn.jiliguala.com/jlgl/store/v4.4/dc0c5d8c97c2ea0028cb93fd4bd8062c.png"
        alt="main"
        class="mainImg"
      />
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    inviter: {
      type: Object,
    },
    show: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    receiveRedPacket() {
      this.$emit('receiveRedPacket')
    },
  },
}
</script>

<style lang="scss" scoped>
.van-popup {
  background-color: transparent;
  width: 100%;
}
.contentB {
  width: 100%;
  position: relative;
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    .initiatorInfo {
      max-width: 88px;
      height: 24px;
      background: #333;
      opacity: 0.9;
      border-radius: 12px;
      padding: 0px 8px 0px 4px;
      display: flex;
      align-items: center;
      margin-right: 4px;
      img {
        width: 18px;
        height: 18px;
        border: 1px solid #fff;
        border-radius: 50%;
        opacity: 1;
      }
      span {
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        display: inline-block;
        max-width: 55px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        margin-left: 2px;
        opacity: 1;
      }
    }
    .headImg {
      width: 88px;
      height: 34px;
    }
  }
  .mainImg {
    width: 100%;
    height: 346px;
  }
}
</style>
