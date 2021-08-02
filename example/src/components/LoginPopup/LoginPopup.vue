<template>
  <van-popup
    v-model="show"
    :close-on-click-overlay="false"
    round
    position="bottom"
    closeable
    @open="popupOpen"
    @close="popupClose"
  >
    <div class="login-popup">
      <div class="title">{{ title }}</div>
      <!-- <p v-html="subtitle" class="subtitle"></p> -->
      <van-field
        v-model="mobile"
        ref="mobile"
        :border="false"
        class="phone"
        left-icon="https://qiniucdn.jiliguala.com/devbanners/bc288b54d04742948d251e3b47d4fc30.png"
        placeholder="请输入手机号"
        type="tel"
        pattern="[0-9]*"
        maxlength="11"
        clearable
        @focus="mobileFocus"
      />
      <van-field
        id="code"
        ref="code"
        type="tel"
        pattern="[0-9]*"
        v-model="code"
        :border="false"
        left-icon="https://qiniucdn.jiliguala.com/devbanners/deffd425c7a142419256ad73f81109ac.png"
        class="code"
        center
        maxlength="4"
        placeholder="验证码"
        @input="login"
        @focus="codeFocus"
      >
        <van-button
          slot="button"
          size="small"
          @click="getCode"
          class="code-btn"
          :class="{ disable: senCodeDisable }"
        >
          <span v-if="count <= 0" ref="btn">获取验证码</span>
          <span v-else>{{ count }}s</span>
        </van-button>
      </van-field>
    </div>
  </van-popup>
</template>

<script>
import { Popup, Field, Button } from 'vant'
import { getCrmSource } from '@/utils'
import { userInfoHandler } from '@/storeCacher'
import { mapState } from 'vuex'

export default {
  components: {
    'van-field': Field,
    'van-button': Button,
    'van-popup': Popup,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    btnText: {
      type: String,
    },
  },
  data() {
    return {
      show: this.value,
      mobile: '',
      code: '',
      getCodeCount: 0,
      timer: null,
      count: 0,
      TIME_COUNT: 60,
    }
  },
  computed: {
    ...mapState(['itemid']),
    senCodeDisable() {
      return !(this.mobile.length === 11 && !isNaN(this.mobile)) || this.count > 0
    },
  },
  watch: {
    value(val) {
      this.show = val
      if (val) {
        this.$track('Mobile Sign Up View')
        this.$nextTick(() => {
          this.$refs.mobile.focus()
        })
      }
    },
  },
  mounted() {},
  methods: {
    popupOpen() {
      //在注册后点击更换手机号 清空状态
      if (userInfoHandler.ifLogin) {
        this.code = ''
        this.count = 0
        clearInterval(this.timer)
      }
    },
    mobileFocus() {
      this.$track('Mobile Sign Up Enter')
    },
    //验证码聚焦,兼容部分手机软键盘遮挡输入框的问题
    codeFocus() {
      if (!/^1\d{10}/.test(this.mobile)) {
        this.$toast('请正确填写手机号')
        return
      }
      setTimeout(() => {
        try {
          document.getElementById('code').scrollIntoViewIfNeeded()
        } catch {
          document.getElementById('code').scrollIntoView()
        }
      }, 500)
    },
    getCode() {
      if (/^1[0-9]{10}$/.test(this.mobile)) {
        if (this.getCodeCount === 0) {
          this.$track('Get Verification Code Click')
        } else {
          this.$track('Renew Verification Code Click')
        }
        this.count = this.TIME_COUNT
        this.getSmsCode(this.mobile)
        const start = new Date()
        this.timer = setInterval(() => {
          this.count = Math.max(60 - Math.round((new Date() - start) / 1000), 0)
          if (this.count <= 0) {
            clearInterval(this.timer)
          }
        }, 1000)
      } else {
        this.$toast('请正确填写手机号')
      }
    },
    async getSmsCode() {
      await this.$API.getSmsCode({
        mobile: this.mobile,
        source: 'NA',
        crm_source: getCrmSource(this.itemid),
      })
      this.getCodeCount++
    },
    login(val) {
      if (val.length === 4) {
        this.$refs.code.blur()
        this.$emit('login', {
          mobile: this.mobile,
          code: this.code,
        })
      }
    },
    popupClose() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.login-popup {
  padding: 24px 40px 30px;
  border-radius: 15px 15px 0px 0px;
  .title {
    text-align: center;
    height: 30px;
    font-size: 22px;
    font-weight: 600;
    color: #404040;
    line-height: 30px;
    margin-bottom: 30px;
  }
  .subtitle {
    padding: 3px 0 20px;
    min-height: 20px;
    color: #ff7000;
    font-size: 12px;
    line-height: 17px;
    text-align: center;
  }
  .van-cell {
    padding: 10px 16px;
    background: rgba(247, 247, 247, 1);
    border-radius: 22px;
  }
  ::v-deep .van-field__body {
    padding-left: 20px;
  }
  .phone {
    margin-bottom: 16px;
  }
  .code {
    ::v-deep .van-field__control {
      border-right: 1px solid #d8d8d8;
      border-radius: 0;
    }
  }
  .code-btn {
    width: 86px;
    padding: 0;
    font-size: 14px;
    font-weight: bold;
    color: #29c07b;
    border: none;
    background: none;
    &.disable {
      opacity: 1;
      color: #999;
    }
  }
  .login-btn {
    width: 295px;
    height: 50px;
    margin: 40px auto 0;
    color: #fff;
    font-weight: bold;
    font-size: 18px;
    background: #fc9126;
    border: none;
    &.van-button--disabled {
      opacity: 1;
      color: #b3b3b3;
      background: rgba(239, 239, 239, 1);
    }
  }
}
</style>
