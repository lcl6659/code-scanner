<template>
  <div class="count-box" v-if="countsDefault > -1" :style="{ color: conColor }">
    <div>{{ countTitle || '剩余支付时间' }}</div>
    <ul class="countdown">
      <li :style="{ background: liBg }">{{ countHour }}</li>
      <li :style="{ background: liBg }">{{ countMin }}</li>
      <li :style="{ background: liBg }">{{ countSec }}</li>
    </ul>
  </div>
</template>

<script>
const DEFAULT_INTERVAL = 600
export default {
  props: ['countNum', 'countTitle', 'contentColor', 'liBackground'],
  data() {
    return {
      countHour: '00',
      countMin: '00',
      countSec: '00',
      countsDefault: this.countNum ? this.countNum : DEFAULT_INTERVAL,
      conColor: this.contentColor ? this.contentColor : '#ff7000',
      liBg: this.liBackground ? this.liBackground : 'rgba(255,112,0,0.1)',
    }
  },
  methods: {
    count() {
      let min = parseInt(this.countsDefault / 60)
      let sec = parseInt(this.countsDefault % 60)
      this.countMin = min < 10 ? `0${min}` : min
      this.countSec = sec < 10 ? `0${sec}` : sec
      this.countsDefault--
    },
  },
  created() {
    this.count()
    let time = setInterval(() => {
      if (this.countsDefault == 0) {
        clearInterval(time)
      }
      this.count()
    }, 1000)
  },
}
</script>

<style lang="scss" scoped>
.count-box {
  height: 36px;
  font-size: 13px;
  background: #ffeddf;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Jiliguala-Bold, Jiliguala;
  font-weight: 500;
  .countdown {
    display: flex;
    margin-left: 10px;
    font-weight: bold;
    > li {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      line-height: 20px;
      text-align: center;
      position: relative;
      border-radius: 2px;
      &:not(:last-child) {
        &::after {
          content: ':';
          position: absolute;
          right: -10px;
          display: inline-block;
          text-align: center;
          width: 10px;
          height: 20px;
        }
      }
    }
  }
}
</style>
