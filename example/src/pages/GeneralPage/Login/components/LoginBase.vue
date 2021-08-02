<template>
  <div class="login-page">
    <div class="login-icon">
      <img :src="configInfo.iconUrl" alt="" />
      <p>{{ configInfo.msg }}</p>
    </div>
    <div class="login-info">
      <div
        class="phone-group"
        :class="{ active: phoneFocus, remove: phoneBlur }"
      >
        <img :src="configInfo.picon" alt="" />
        <input
          id="phone"
          ref="phone"
          type="tel"
          placeholder="手机号"
          v-model="phone"
          maxlength="11"
          @focus="focusPhone"
          @blur="blurPhone"
        />
        <img
          src="https://h5.jiliguala.com/activity/24b8bf4f4c02b324c249ac578ff312ab.png"
          class="clear"
          v-if="phone"
          @click="clearPhone"
        />
      </div>
      <div class="code-group">
        <div
          class="code-input"
          :class="{ active: codeFocus, remove: codeBlur }"
        >
          <img :src="configInfo.cicon" alt="" />
          <input
            id="code"
            ref="code"
            type="number"
            placeholder="验证码"
            maxlength="4"
            :disabled="!rightPhone"
            v-model="code"
            @focus="focusCode"
            @blur="blurCode"
          />
        </div>
        <div class="get-code" v-if="countdown > 0" @click="tipCode">
          {{ countdown + 's' }}
        </div>
        <div
          class="get-code"
          v-else
          :class="{ active: rightPhone }"
          @click="getCode"
        >
          <span v-if="countdown === 0">获取验证码</span>
          <span v-else>{{ countdown }}</span>
        </div>
      </div>
      <div class="submit-group">
        <div class="submit" :class="{ active: correctVerify }" @click="toLogin">
          <span>登录</span>
        </div>
      </div>
      <p class="tip">{{ configInfo.desc }}</p>
    </div>
  </div>
</template>
<script>
import throttle from 'lodash/throttle'
import TRACKMIXINS from '@/mixins/track/trackLoginMixins'

export default {
  name: 'Login',
  mixins: [TRACKMIXINS],
  props: {
    configInfo: Object,
  },
  data() {
    return {
      phone: '',
      code: '',
      // 倒计时
      countdown: 0,
      phoneFocus: false,
      phoneBlur: false,
      codeFocus: false,
      codeBlur: false,
      telTimer: null,
      codeTimer: null,
      getCodeCount: 0,
    }
  },
  computed: {
    // 手机号是否正确
    rightPhone() {
      return /^1\d{10}$/.test(this.phone)
    },
    // 登录按钮是否激活
    correctVerify() {
      return this.rightPhone && this.code.length === 4
    },
  },
  methods: {
    // 手机号输入框获取焦点
    focusPhone() {
      this.track('Mobile Sign Up Page Enter')
      this.phoneFocus = true
      this.phoneBlur = false
      // 处理键盘收起页面不恢复bug
      this.telTimer = setTimeout(() => {
        document.getElementById('phone').scrollIntoView()
      }, 1000)
    },
    // 手机号输入框失去焦点
    blurPhone() {
      this.phoneFocus = false
      this.phoneBlur = true
      this.handleBlur()
    },
    // 验证码输入框获取焦点
    focusCode() {
      this.codeFocus = true
      this.codeBlur = false
      // 处理键盘收起页面不恢复bug
      this.codeTimer = setTimeout(() => {
        document.getElementById('code').scrollIntoView()
      }, 1000)
    },
    // 验证码输入框失去焦点
    blurCode() {
      this.codeFocus = false
      this.codeBlur = true
      this.handleBlur()
    },
    // 输入框失去焦点，页面位置恢复
    handleBlur() {
      if (this.telTimer) {
        clearTimeout(this.telTimer)
      }
      if (this.codeTimer) {
        clearTimeout(this.codeTimer)
      }
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 10)
    },
    // 清空手机号输入框
    clearPhone() {
      this.phone = ''
    },
    // 倒计时状态点击获取验证码提示
    tipCode() {
      this.$toast('倒计时结束后可以再次获取验证码')
    },
    // 获取验证码事件
    async getCode() {
      if (this.rightPhone) {
        if (this.getCodeCount === 0) {
          this.track('Get Verification Code Click') //首次
        } else {
          this.track('Renew Verification Code Click') //再次
        }
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
        })
        // 手机号填写正确，获取验证码
        let timer
        let params = {
          mobile: this.phone,
          crm_source: 'group_purchase',
          source: 'NA',
        }
        // 获取验证码
        let [err] = await this.$API.getSmsCode(params)
        this.$toast.clear()
        if (!err) {
          this.getCodeCount++
          this.$toast('验证码发送成功')
          // 启动倒计时
          this.countdown = 60
          let beginTime = new Date().getTime() // 计算倒计时当前时间
          timer = setInterval(() => {
            let newTime = new Date().getTime() // 获取当前时间，假设退出应用
            this.countdown =
              this.countdown - ((newTime - beginTime) / 1000).toFixed(0)
            if (this.countdown <= 0) {
              clearInterval(timer)
              this.countdown = 0
            }
            beginTime = new Date().getTime()
          }, 1000)
        } else {
          this.$toast(
            err.msg ||
              (err.code === 'ECONNABORTED'
                ? '请求超时'
                : err.message
                ? err.message
                : '服务异常'),
          )
        }
      } else {
        this.$toast('请输入正确的11位手机号')
      }
    },
    // 登录
    toLogin: throttle(async function () {
      if (this.rightPhone) {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
        })
        this.$emit('login')
        // 登录请求
        let [err, user] = await this.$API.loginViaSmsCode(this.phone, this.code)
        if (!err && user) {
          this.$toast.clear()
          this.track('Mobile Sign Up Success')
          // 登录成功后的具体操作
          this.$emit('success', user)
        } else {
          let option =
            err.code === '269' || err.msg.includes('验证码错误')
              ? { Msg: 'CodeError' }
              : {}
          this.track('Mobile Sign Up Fail', option)
          this.$toast(
            err.msg ||
              (err.code === 'ECONNABORTED'
                ? '请求超时'
                : err.message
                ? err.message
                : '服务异常'),
          )
        }
      }
    }, 1000),
  },
}
</script>
<style lang="scss" scoped>
@mixin border() {
  border-bottom: 1px solid #e8e8e8;
}
@mixin flex($justifyContent, $alignItems) {
  display: flex;
  justify-content: $justifyContent;
  align-items: $alignItems;
}
$whiteColor: #ffffff;
$fontColor: #b3b3b3;
$borderColor: #e8e8e8;
$bgColor: #999999;

.login-page {
  width: 100%;
  height: 100%;
  height: 100vh;
  background: $whiteColor;
  .login-icon {
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: $fontColor;
    padding-top: 15px;
    img {
      width: 86px;
      height: 86px;
    }
  }
  .login-info {
    width: 100%;
    margin-top: 38px;
    .phone-group,
    .code-group {
      width: 258px;
      margin: 0 auto;
      padding-bottom: 6px;
      img {
        width: 20px;
        margin-left: 5px;
      }
      input {
        color: #404040;
        font-size: 14px;
        margin-left: 20px;
        border: none;
        outline: none;
        &::placeholder {
          color: $fontColor;
          opacity: 1;
        }
      }
    }
    .phone-group {
      @include flex(flex-start, center);
      margin-bottom: 30px;
      position: relative;
      border-bottom: 1px solid $borderColor;
      input {
        width: 200px;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        box-shadow: 0 0 0 30px white inset;
        -webkit-box-shadow: 0 0 0 30px white inset;
        transition: background-color 5000s ease-in-out 0s;
      }
      .clear {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 0px;
        bottom: 6px;
      }
      &::after {
        content: ' ';
        position: absolute;
        z-index: 2;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        display: block;
        width: 100%;
        height: 1px;
      }
      &.remove::after {
        background: $bgColor;
        animation: rv_width 0.5s linear forwards;
      }
      &.active::after {
        animation: ad_width 0.5s linear forwards;
        background: $bgColor;
      }
    }
    .code-group {
      @include flex(space-between, center);
      .code-input {
        @include flex(space-between, center);
        @include border();
        padding-bottom: 6px;
        position: relative;
        input {
          width: 100px;
          background: $whiteColor;
          &:-webkit-autofill {
            box-shadow: inset 0 0 0 1000px #fff;
            -webkit-box-shadow: inset 0 0 0 1000px #fff;
          }
        }
        input:-webkit-autofill {
          box-shadow: inset 0 0 0 1000px #fff;
          -webkit-box-shadow: inset 0 0 0 1000px #fff;
        }

        &::after {
          content: ' ';
          position: absolute;
          z-index: 2;
          bottom: 0;
          left: 50%;
          transform: translate(-50%);
          display: block;
          width: 100%;
          height: 1px;
        }
        &.remove::after {
          background: $bgColor;
          animation: rc_width 0.5s linear forwards;
        }
        &.active::after {
          animation: ac_width 0.5s linear forwards;
          background: $bgColor;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          box-shadow: 0 0 0 30px white inset;
          -webkit-box-shadow: 0 0 0 30px white inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      }
      .get-code {
        position: relative;
        width: 100px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-radius: 18px;
        font-size: 14px;
        border: 1px solid $borderColor;
        color: $fontColor;
        &.active {
          color: #ff5159;
          border: 1px solid #ff5159;
        }
      }
    }
    .submit-group {
      width: 259px;
      margin: 0 auto;
      margin-top: 30px;
      text-align: center;
      .submit {
        position: relative;
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-radius: 25px;
        background: #e5e5e5;
        color: $whiteColor;
        font-weight: 600;
        font-size: 18px;
        &.active {
          background: #ff5159;
        }
      }
    }
    .tip {
      font-size: 12px;
      color: $fontColor;
      margin-top: 12px;
      text-align: center;
    }
  }
}

@keyframes ad_width {
  from {
    width: 0;
  }
  to {
    width: 100%；;
  }
}
@keyframes rv_width {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

@keyframes ac_width {
  from {
    width: 0;
  }
  to {
    width: 100%；;
  }
}
@keyframes rc_width {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}
</style>
