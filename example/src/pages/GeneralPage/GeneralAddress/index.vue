<template>
  <div class="address-page">
    <h4 class="top_tip">请完善收货地址信息，以确保顺利收到学习材料</h4>
    <!-- 顶部步骤条 -->
    <div
      v-if="this.source !== RETAIL_AGENT_SOURCE"
      :class="{ step_bar: true, margin_bottom: isWechat }"
    >
      <div v-for="(item, idx) in stepBar" :key="idx" :class="item.status">
        <span class="icon">
          <span class="content">{{ item.content }}</span>
          <span class="tip">{{ item.tip }}</span>
        </span>
        <i v-if="idx != 2"></i>
      </div>
    </div>
    <div v-if="isWechat" class="use-wechat-address" @click.stop="onWeChatAddressChange">
      <span class="txt">获取微信地址</span>
      <span class="arrow-icon">
        <i class="van-icon van-icon-arrow"></i>
      </span>
    </div>
    <!-- 使用微信地址 -->
    <GuaAddressEdit
      :area-list="areaList"
      :name-maxlength="10"
      :address-info="addressInfo"
      :tel-maxlength="11"
      :detail-maxlength="100"
      :tel-validator="telValidator"
      :emty-vaild="true"
      save-button-text="提交"
      :detail-rows="4"
      @save="handleSave"
    />
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import { GuaAddressEdit } from 'vcomp'
import areaList from './area'
import { isWeChat } from '@/utils'
import { mapState, mapGetters } from 'vuex'
import { RETAIL_AGENT_SOURCE } from '@/config'

export default {
  components: {
    GuaAddressEdit,
  },
  computed: {
    ...mapState(['source', 'sourceurl']),
    ...mapState({
      oid: (state) => state.generalStore.oid,
    }),
    ...mapGetters(['addressBaseTrackOpts']),
  },
  data() {
    return {
      // 是否微信环境
      isWechat: isWeChat(),
      // 地址信息,回填地址信息用的
      addressInfo: {},
      areaList: areaList,
      // 步骤条列表
      stepBar: [
        {
          content: '',
          tip: '支付成功',
          status: 'done',
        },
        {
          content: '2',
          tip: '填写收货地址',
          status: 'current',
        },
        {
          content: '3',
          tip: '添加学习顾问',
          status: 'ready',
        },
      ],
      RETAIL_AGENT_SOURCE: RETAIL_AGENT_SOURCE,
    }
  },
  methods: {
    // 点击提交地址
    async handleSave(address) {
      this.track('Add Address Confirm Click')
      let [err, res] = await this.$API.postSaveAddress({
        oid: this.oid, //订单编号；可以不传或者为空字符串，则填写所有科目体验营订单发货地址
        name: address.name, //收件人名称
        tel: address.tel, //收件人手机号
        region: `${address.province} ${address.city} ${address.county}`, //收件人地址区域，省份 城市 区，一定要包含3个部分，例：上海 上海市 浦东新区
        addr: address.addressDetail, //收件人详细地址
      })
      if (!err) {
        this.$toast('地址提交成功')
        this.track('Add Address Success')
        this.goAdvisor()
      } else {
        // Msg（NotPaid未支付/HasSubmit已提交过/Refund已退款）
        const msgMap = {
          44104: 'NotPaid',
          44106: 'HasSubmit',
          44105: 'Refund',
        }
        this.track(
          'Add Address Fail',
          {
            Msg: msgMap[err.code] || '',
          },
          'address'
        )
        this.$toast(err.msg || '保存失败')
        if (err.code == 44106) {
          this.goAdvisor()
        }
      }
    },
    // 下沉不进入加学习顾问页面
    goAdvisor() {
      if (this.source !== RETAIL_AGENT_SOURCE) {
        //已填写，已购买跳转加好友页
        this.$router.push({
          path: '/general/advisor',
          query: {
            ...this.$route.query,
          },
        })
      } else {
        if (this.sourceurl) {
          setTimeout(() => {
            window.location.href = this.sourceurl // 跳转来源页面
          }, 1000)
        }
      }
    },
    onWeChatAddressChange: throttle(async function () {
      this.track('Add Address Wechat Click')
      let [err, address] = await this.getWeChatAddress()
      if (!err) {
        address.county = address.countryName
        let areaCode = this._getAreaCode(address)
        this.addressInfo = {
          name: address.userName,
          tel: address.telNumber,
          province: address.provinceName,
          city: address.cityName,
          county: address.countryName,
          addressDetail: address.detailInfo,
          areaCode: areaCode,
        }
      } else {
        console.log(err.errMsg)
      }
    }, 1500),
    getWeChatAddress() {
      const envMap = {
        local: 'dev',
        development: 'dev',
        fat: 'fat',
        prerelease: 'prod',
        production: 'prod',
      }
      const AppIdTypeMap = {
        local: 'wxf78b28c6562d3c56',
        development: 'wxf78b28c6562d3c56',
        fat: 'wxf78b28c6562d3c56',
        prerelease: 'wxd388f6f520772446',
        production: 'wxd388f6f520772446',
      }
      return import('niuwa-util').then(({ wxConfig }) => {
        return new Promise((resolve, reject) => {
          wxConfig({
            appId: AppIdTypeMap[process.env.VUE_APP_ENV] || 'wxf78b28c6562d3c56',
            apiList: ['openAddress'],
            ENV: envMap[process.env.VUE_APP_ENV] || 'fat',
            resolve(wx) {
              wx.openAddress({
                success(res) {
                  resolve([null, res])
                },
                fail(err) {
                  resolve([err, null])
                },
              })
            },
            reject,
          })
        })
      })
    },
    _getAreaCode(address) {
      let areaName = address.county
      let areaCode = null
      let areaList = JSON.parse(JSON.stringify(this.areaList))
      let areaKeys = Object.keys(areaList)

      if (!areaKeys.length) return areaCode

      areaKeys.forEach((item) => {
        let codeAreaMaps = areaList[item]
        for (let i = 0; i < Object.keys(codeAreaMaps).length; i++) {
          let code = Object.keys(codeAreaMaps)[i]
          if (codeAreaMaps[code] === areaName) {
            areaCode = code
            break
          }
        }
      })
      return areaCode
    },
    track(evtName, opts = {}, userproperty = {}, useBaseProps = true, callback) {
      opts = { ...this.addressBaseTrackOpts, ...opts }
      this.$track(evtName, opts, userproperty, useBaseProps, callback)
    },
  },
  created() {},
  mounted() {
    this.track('Add Address View')
    if (this.isWechat) {
      this.track('Add Address Wechat View')
    }
  },
}
</script>
<style lang="scss" scoped>
.address-page {
  min-height: 100vh;
  background: #f8f8f8;
  position: relative;
  .use-wechat-address {
    display: flex;
    margin-top: 14px;
    // height: 60px;
    // line-height: 60px;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    padding-left: 48px;
    background: transparent
      url(https://qiniucdn.jiliguala.com/dev/promo/feb2b54024bb4467a21919fda2ca3181.png) no-repeat
      15px center;
    background-size: 24px;
    color: #29c07b;
    background-color: #fff;
    border-radius: 8px;
    height: 41px;
    margin-left: 14px;
    margin-right: 14px;
    // margin-bottom: 12px;
    line-height: 41px;

    .arrow-icon {
      width: 41px;
      height: 41px;
      text-align: center;
      color: #969799;
      line-height: 44px;
      text-align: center;
    }
    &:active {
      background-color: #f5f5f5;
    }

    .txt {
      flex: 1;
    }
  }
  ::v-deep .van-address-edit {
    padding: 20px 14px 0;
    .use-wechat-address {
      .arrow-icon {
        color: #e0e0e0;
      }
    }
    .van-cell {
      .van-cell__title {
        width: 68px !important;
        margin-right: 10px;
      }
      &:after {
        left: 0;
        right: 0;
      }
      .van-field__right-icon {
        color: #e0e0e0;
      }
    }
  }
  ::v-deep .van-button {
    margin-top: 0;
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
  }
  .statusLayer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('https://qiniucdn.jiliguala.com/dev/promo/1b85cecb975a4158a734d89c66fc96ba.png');
    img {
      position: absolute;
      top: 100px;
      left: 38px;
      width: 300px;
      margin: 0 auto;
    }
  }
  .top_tip {
    font-size: 14px;
    padding: 7px 0px;
    padding-left: 27px;
    color: #fc9026;
    background-color: #fff5cd;
    font-weight: 400;
  }
  .step_bar {
    display: flex;
    justify-content: center;
    margin: 24px 0 20px;
    &.margin_bottom {
      margin-bottom: 40px;
    }
    div {
      display: flex;
      align-items: center;
      .icon {
        position: relative;
        margin: 0 4px;
        .content {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 22px;
          height: 22px;
          font-size: 14px;
          font-family: 'Jiliguala-Bold';
          border-radius: 11px;
        }
        .tip {
          position: absolute;
          display: inline-block;
          width: max-content;
          font-size: 12px;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
          transform: translateX(-50%);
          margin-left: 12px;
          margin-top: 7px;
        }
      }
      &.done {
        .content {
          background: url('https://gaeacdn.jiliguala.com/jlgl/store/v4.6/fc1f4acd43e1609b04163a3b04fac49e.png')
            no-repeat center/cover;
        }
        i {
          width: 101px;
          height: 2px;
          background: #25d780;
        }
      }
      &.current {
        .content {
          background: #25d780;
          color: #ffffff;
        }
        i {
          width: 100px;
          height: 2px;
          background: linear-gradient(340deg, #eaeaea 40%, #25d780 100%);
        }
      }
      &.ready {
        .content {
          background: #f8f8f8;
          border: 1px solid #25d780;
          color: #25d780;
        }
        i {
          width: 100px;
          height: 2px;
          background: #eaeaea;
        }
      }
    }
  }
}
</style>
