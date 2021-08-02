<template>
  <div class="age_choose">
    <van-popup
      v-model="ageChooseShow"
      round
      position="bottom"
      @close="closePop"
    >
      <div class="main">
        <div class="title">
          <h2>宝贝年龄</h2>
          <span>将根据宝贝年龄匹配不同学习级别</span>
        </div>
        <div class="age_list">
          <div
            class="item_wrap"
            v-for="item in configHome.ageSpec"
            :key="item.ageId"
            @click="goItemConfirm(item)"
          >
            <h2>{{ item.age }}</h2>
            <span>{{ item.ageDesc }}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AgeChoose',
  props: {
    ageChooseShow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      configHome: (state) => state.item.configHome,
    }),
  },
  data() {
    return {}
  },
  methods: {
    // 关闭弹窗
    closePop() {
      this.$emit('closeAgeChoosePop')
    },
    // 跳转订单确认页
    goItemConfirm(item) {
      this.$track('AgeChoose_Dialog_Click', {
        Ages: item.age,
      })
      this.$emit('goItemConfirm', item.ageId)
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  background: #f7f7f7;
  overflow: hidden;
  .title {
    display: flex;
    align-items: center;
    padding: 21px 0 20px 24px;
    h2 {
      font-size: 18px;
      font-weight: bold;
      color: #2e2e2e;
      line-height: 25px;
      margin-right: 10px;
    }
    span {
      font-size: 12px;
      font-weight: 400;
      color: #939393;
      line-height: 17px;
    }
  }
  .age_list {
    padding: 0 20px;
    .item_wrap {
      padding: 15px 0 17px 19px;
      margin-bottom: 20px;
      position: relative;
      background: #ffffff;
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.01);
      border-radius: 15px;
      &:before {
        position: absolute;
        content: '';
        width: 4px;
        height: 38px;
        left: -1px;
        top: 50%;
        transform: translateY(-50%);
        background: #ffcd16;
        border-radius: 4px;
      }
      &:nth-child(3n-1):before {
        background: #fc9026;
      }
      &:nth-child(3n):before {
        background: #ff5158;
      }
      h2 {
        font-size: 20px;
        font-weight: bold;
        color: #2e2e2e;
        line-height: 28px;
        font-family: Jiliguala-Bold;
      }
      & > span {
        font-size: 13px;
        font-weight: 400;
        color: #939393;
        line-height: 18px;
      }
    }
  }
}
</style>
