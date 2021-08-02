<template>
  <section
    class="item-button"
    :class="{
      'has-top-shadow': hasTopShadow,
      removeOriginPrice: ifRemoveOriginPrice,
    }"
    @click="onTapButton"
  >
    <template>
      <div
        v-if="theme === 'normal'"
        class="normal-btn"
        :class="disabled ? 'normal-btn_disabled' : ''"
      >
        {{ buttonText }}
      </div>
      <div class="meta-info" v-if="theme === 'fill'">
        <div class="cur-price">
          <div class="cny">￥</div>
          <div class="val">{{ defaultPrice.price }}</div>
          <!-- 科目数 -->
          <div class="cny course" v-if="defaultSubjectCount > 1">/{{ defaultSubjectCount }}科</div>
          <!-- 优惠模块 -->
          <div
            v-if="defaultSubjectCount === 1 && defaultPrice.discountPrice > 0 && ownedSub > 0"
            class="discount-Info"
          >
            <img
              src="https://gaeacdn.jiliguala.com/jlgl/store/v4.7/2e59162c573b7f68452661cd4ca6f0e8.png"
              alt="discountImage"
            />
            <div>
              已优惠<span>{{ defaultPrice.discountPrice }}</span
              >元
            </div>
          </div>
        </div>
        <!-- 199原价模块 -->
        <!-- <div v-if="!ifRemoveOriginPrice" class="urge-info">
          <div class="desc">立减{{ defaultPrice.discountPrice }}元</div>
          <div class="origin-price">官方价{{ defaultPrice.originPrice }}元</div>
        </div> -->
      </div>
      <button
        v-if="theme === 'fill' || theme === 'time'"
        class="btn"
        :class="{
          btn_disabled: disabled,
          activePriceBtn: activePriceBtn,
          removeOriginPrice: ifRemoveOriginPrice,
        }"
      >
        {{ buttonText }}
      </button>
    </template>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import throttle from 'lodash/throttle'
const throttleTime = 1000

export default {
  name: 'item-button',
  computed: {
    ...mapState(['ifRemoveOriginPrice']),
    ...mapState({
      defaultPrice: (state) => state.item.defaultPrice,
      defaultSubjectCount: (state) => state.item.defaultSubjectCount,
      ownedSub: (state) => state.item.ownedSub,
    }),
  },
  data() {
    return {}
  },
  props: {
    theme: {
      type: String,
      default: 'normal', // normal
    },
    buttonText: {
      type: String,
      default: '立即抢购',
    },
    // 按钮动画类名
    activePriceBtn: {
      type: Boolean,
      default: false,
    },
    hasTopShadow: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    countdown: {
      type: Object,
    },
  },
  methods: {
    onTapButton: throttle(function () {
      this.$emit('click', !this.disabled)
    }, throttleTime),
  },
}
</script>

<style scoped lang="scss">
.item-button {
  display: flex;
  position: fixed;
  width: 100%;
  z-index: 100;
  bottom: 0;
  left: 0;
  right: 0;
  height: 74px;
  box-sizing: border-box;
  padding: 12px;
  background-color: #fff;
  &.removeOriginPrice {
    padding: 12px 16px;
  }

  &.has-top-shadow {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  }

  .normal-btn {
    display: block;
    width: 100%;
    height: 50px;
    margin-left: 20px;
    margin-right: 20px;
    text-align: center;
    line-height: 50px;
    background: rgba(252, 145, 38, 1);
    border-radius: 27px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    &_disabled {
      background: rgba(204, 204, 204, 1);
    }
  }

  .meta-info {
    flex: 1;
    display: flex;
    position: relative;
    .cur-price {
      // flex: 1;
      color: #ff7000;
      font-weight: bold;
      display: flex;

      .cny {
        font-size: 16px;
        line-height: 22px;
        display: flex;
        justify-content: center;
        justify-content: flex-end;
        align-items: center;
        flex-direction: column;
        height: 42px;
        font-family: Jiliguala-Bold;
        font-weight: 900;
      }
      .val {
        // margin-left: -5px;
        // margin-right: -2px;
        font-size: 39px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: Jiliguala-Bold;
        font-weight: bold;
      }
      .course {
        width: auto;
      }
      .discount-Info {
        margin-left: 3px;
        display: flex;
        flex-direction: column;
        text-align: left;
        justify-content: center;
        img {
          display: inline-block;
          width: 67px;
          height: 17px;
          margin-bottom: 2px;
        }
        div {
          font-size: 12px;
          font-weight: 600;
          color: #ff7000;
          line-height: 17px;
          span {
            font-size: 14px;
            font-family: Jiliguala-Bold;
            font-weight: bold;
            color: #ff7000;
            line-height: 20px;
          }
        }
      }
    }
    .urge-info {
      font-size: 14px;
      line-height: 1.3;
      padding-left: 10px;
      padding-top: 5px;

      .desc {
        width: 69px;
        text-align: center;
        height: 17px;
        background: linear-gradient(145deg, #ffae10 0%, #ff8502 100%);
        border-radius: 8px 9px 9px 1px;
        font-size: 11px;
        line-height: 17px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 5px;
        display: inline-block;
      }
      .origin-price {
        font-size: 12px;
        line-height: 18px;
        color: rgba(64, 64, 64, 1);
        text-decoration: line-through;
        // 双十一fix
        transform-origin: 0 0;
        transform: scale(0.8);
        opacity: 0.5;
      }
    }
  }

  .btn {
    display: block;
    border: none;
    outline: none;
    height: 50px;
    line-height: 45px;
    font-weight: bold;
    width: 202px;
    padding: 0;
    background: linear-gradient(180deg, #ff820b 0%, #ff6702 100%);
    box-shadow: 0px 5px 8px 0px rgba(252, 145, 39, 0.55);
    border-radius: 27px;
    box-sizing: content-box;
    color: rgba(255, 255, 255, 1);
    font-size: 18px;

    // &.removeOriginPrice {
    //   width: 202px;
    // }

    &:active {
      outline: none;
      border-bottom: 5px solid rgba(255, 135, 15, 1);
    }
    &_disabled {
      background: rgba(204, 204, 204, 1);
      border-bottom: 5px solid rgba(164, 164, 164, 1);
      color: #fff;
      &:active {
        outline: none;
        border-bottom: 5px solid rgba(204, 204, 204, 1);
      }
    }

    // 双十一fix
    border-bottom: none;
    background-color: #fc9126;
    // background-image: linear-gradient(#ffb814, #ff7f00);
    // box-shadow: 0 3px 11px 0px #ff870fb8;
  }
}

@keyframes activeBtn {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.12);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

//2.0 BTest
.countdown-cont {
  color: #ff5d00;
  .countdown {
    text-align: center;
    line-height: 26px;
    font-weight: 600;
    font-size: 21px;
    span {
      display: inline-block;
      width: 29px;
      font-size: 21px;
      font-weight: bold;
    }
  }
  .font {
    font-size: 12px;
    line-height: 17px;
    text-align: center;
  }
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
</style>
