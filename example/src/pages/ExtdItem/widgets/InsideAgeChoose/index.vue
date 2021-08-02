<template>
  <div class="insideAgeChoose">
    <p class="title">
      请选择宝贝年龄
    </p>
    <div
      class="moduleWrap"
      :class="{
        threeGroup: configHome.ageSpec.length >= 3 && configHome.ageSpec.length % 2 !== 0,
        dobuleGroup: configHome.ageSpec.length % 2 === 0,
      }"
    >
      <div
        class="ageModule"
        v-for="item in configHome.ageSpec"
        :key="item.ageId"
        @click="goItemConfirm(item)"
      >
        <p class="age">
          <span>{{
            item.age && item.age.includes('岁')
              ? item.age.slice(0, item.age.indexOf('岁'))
              : item.age.slice(0)
          }}</span
          >{{ item.age && item.age.includes('岁') ? item.age.slice(item.age.indexOf('岁')) : '岁' }}
        </p>
        <p class="ageDesc">{{ item.ageDesc }}</p>
        <button>去看看</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'InsideAgeChoose',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      configHome: (state) => state.item.configHome,
    }),
  },
  methods: {
    // 跳转订单确认页
    goItemConfirm(item) {
      this.$track('Purchase_AgeChoose_Click', {
        Ages: item.age,
      })
      this.$emit('goItemConfirm', item.ageId)
    },
  },
  created() {
    this.$track('Purchase_AgeChoose_view')
  },
}
</script>
<style lang="scss" scoped>
.insideAgeChoose {
  padding: 16px;
  padding-bottom: 30px;
  background: linear-gradient(180deg, #f7f7f7 0%, #ffffff 100%);
  .title {
    font-size: 20px;
    font-weight: 500;
    color: #2e2e2e;
    line-height: 28px;
    margin-bottom: 12px;
  }
  .moduleWrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .ageModule {
      text-align: center;
      background: #ffffff;
      box-shadow: 0px 2px 22px 0px rgba(0, 0, 0, 0.04);
      border-radius: 15px;
      position: relative;
      .age {
        font-size: 16px;
        font-weight: 600;
        color: #2e2e2e;
        line-height: 22px;
        margin: 10px 0 4px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        &::before {
          content: '';
          width: 4px;
          height: 20px;
          background: #ffcd16;
          border-radius: 2px;
          display: inline-block;
          position: absolute;
          left: 0;
        }
        span {
          font-size: 20px;
          font-family: Jiliguala-Bold;
          font-weight: bold;
          color: #2e2e2e;
          line-height: 28px;
        }
      }
      .ageDesc {
        font-size: 11px;
        font-weight: 400;
        color: #b2b2b2;
        line-height: 14px;
        margin: 0 7px;
      }
      button {
        background: #fff8f2;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 500;
        color: #ff7000;
        line-height: 17px;
        padding: 4px 16px;
        border: none;
        margin: 14px 0 12px 0;
      }
      &:first-child {
        .age::before {
          background: #ffcd16;
        }
      }
      &:nth-child(2) {
        .age::before {
          background: #fc9026;
        }
      }
      &:nth-child(3) {
        .age::before {
          background: #ff5158;
        }
      }
    }
  }
  .dobuleGroup {
    .ageModule {
      width: 166px;
      .ageDesc {
        margin: 0 25px;
      }
    }
  }
  .threeGroup {
    .ageModule {
      width: 110px;
      .ageDesc {
        margin: 0 8px;
      }
    }
  }
}
</style>
