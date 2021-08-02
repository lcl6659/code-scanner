<!-- 假拼团 主体内容信息 （首屏 & 吸底公用） -->
<template>
  <div class="group-content">
    <div class="group-content_left">
      <van-image
        class="group_left--ava"
        round
        width="38px"
        height="38px"
        :src="realAva"
      />
      <span class="group_left--nick">{{ nick }}</span>
    </div>
    <div class="group-content_right">
      <div class="group_right--cont">
        <span class="cont-top">
          只差<span style="color: #ff670f;">1人</span>成团
        </span>
        <!-- <span class="cont-time"
          >剩余00:{{ countdown.minutes }}:{{ countdown.seconds }}</span
        > -->
      </div>
      <div class="group_right--btn">
        <div class="buy-btn" @click="onBuy">
          去参团
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Image as VanImage } from 'vant'
export default {
  name: 'GroupContent',
  components: {
    VanImage,
  },
  props: {
    realAva: String,
    realNick: String,
    // countdown: Object,
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    nick() {
      return this.utf16toEntities(this.realNick)
    },
  },
  mounted() {},
  methods: {
    //把utf16的emoji表情字符进行转码成Unicode值
    utf16toEntities(str) {
      var patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
      return str.replace(patt, function (char) {
        var H, L
        if (char.length === 2) {
          H = char.charCodeAt(0) // 取出高位
          L = char.charCodeAt(1) // 取出低位
          return String.fromCharCode(H, L)
        } else {
          return char
        }
      })
    },
    onBuy() {
      this.$track('Item Join Click')
      this.$emit('toCharge')
    },
  },
}
</script>

<style lang="scss" scoped>
.group-content {
  display: flex;
  width: 100%;
  height: 60px;
}
.group-content_left {
  flex: 1;
  height: 100%;
  line-height: 60px;
  .group_left--ava {
    margin-right: 10px;
    vertical-align: middle;
  }
  .group_left--nick {
    height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(64, 64, 64, 1);
    line-height: 20px;
  }
}

.group-content_right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  .group_right--cont {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // flex: 1;
    height: 100%;
    .cont-top {
      height: 18px;
      font-size: 13px;
      font-weight: 400;
      color: rgba(64, 64, 64, 1);
      line-height: 18px;
      // margin-bottom: 3px;
    }
    .cont-time {
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(159, 159, 159, 1);
      line-height: 17px;
    }
  }
  .group_right--btn {
    // flex: 1;
    height: 100%;
    line-height: 60px;
    text-align: center;
    display: flex;
    align-items: center;
    .buy-btn {
      display: inline-block;
      width: 67px;
      height: 30px;
      background: rgba(255, 128, 0, 1);
      border-radius: 15px;
      font-size: 12px;
      text-align: center;
      line-height: 30px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
