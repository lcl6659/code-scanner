/* 头图顶部 随机用户滚动条 */
<template>
  <div class="carousel">
    <van-swipe
      class="my-swipe"
      :style="`color: ${fakeColor}`"
      vertical
      :autoplay="2000"
      :show-indicators="false"
    >
      <van-swipe-item v-for="(item, index) in list" :key="index">
        {{ item.phone }} 购买成功
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
export default {
  name: 'Carousel',
  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
  },
  props: {
    fakeColor: {
      type: String,
      default: '#FFFFFF',
    },
  },
  data() {
    return {
      list: [],
    }
  },
  methods: {
    carousel() {
      const arr = [
        '139',
        '138',
        '137',
        '136',
        '135',
        '134',
        '159',
        '158',
        '132',
        '156',
        '131',
        '157',
        '150',
        '151',
        '152',
        '188',
        '187',
        '182',
        '183',
        '184',
        '178',
        '130',
        '155',
        '186',
        '185',
        '176',
        '133',
        '153',
        '189',
        '180',
        '181',
        '177',
      ]
      const length = arr.length
      const random = () => {
        // 生成[0, length - 1]之间的整数
        const randomIdx = Math.floor(Math.random() * length)
        const head = arr[randomIdx]
        const tail = Math.random().toString().replace('0.', '').slice(0, 4)
        return `${head}****${tail}`
      }
      const randomTime = () => {
        //生成 1-5 的随机数
        return Math.floor(Math.random() * 4 + 1)
      }
      this.phone = random()
      this.time = randomTime()
      const list = []
      for (let i = 0; i < 20; i++) {
        list.push({
          phone: random(),
          time: randomTime(),
        })
      }
      this.list = [...list]
    },
  },
  mounted() {
    this.carousel()
  },
}
</script>

<style lang="scss" scoped>
.carousel {
  padding-left: 11px;
  padding-right: 17px;
  white-space: nowrap;
  position: absolute;
  // top: 11px;
  top: 0px;
  left: 0;
  background: rgba(255, 245, 217, 0.2);
  border-radius: 0px 13px 13px 0px;
  z-index: 2;
  .my-swipe {
    height: 20px;
    line-height: 20px;
    color: #fff;
    font-size: 11px;
    font-weight: 400;
  }
}
</style>
