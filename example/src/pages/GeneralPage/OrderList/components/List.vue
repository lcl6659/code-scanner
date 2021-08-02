<template>
  <div class="list">
    <div class="item" v-for="item in orderList" :key="item.oid">
      <div class="head">
        <div class="left">订单编号：{{ item.oid }}</div>
        <div class="right" v-if="getStatus(item).payStatus">
          {{ getStatus(item).payStatus }}
        </div>
      </div>
      <div class="content">
        <div class="info-item" v-for="(infoItem, index) in item.skuList" :key="index">
          <div class="commodity-info">
            <div class="title ellipsis">{{ infoItem.ttl }}</div>
            <div class="tags">
              <div class="tag" v-if="infoItem.subjectName">
                {{ infoItem.subjectName }}
              </div>
              <div class="tag" v-if="infoItem.level">{{ infoItem.level }}</div>
            </div>
          </div>
          <div class="price-info">
            <div class="price sp_font">¥{{ infoItem.price }}</div>
            <div class="number">x{{ infoItem.count }}</div>
          </div>
        </div>
      </div>
      <div class="order-price">
        <div class="left">
          <div class="title">实付金额</div>
          <div class="order-time ellipsis"><span>支付时间：</span>{{ item.payTime }}</div>
        </div>
        <div class="right sp_font">¥{{ item.payPrice }}</div>
      </div>
      <div class="foot" v-if="getStatus(item).direct">
        <div class="button" @click="direct(item)">
          {{ getStatus(item).direct.button }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    orderList: Array,
  },
  data() {
    return {
      payStatusMap: {
        needaddress: '已支付',
        paid: '已支付',
        refunded: '已退款',
      },
    }
  },
  methods: {
    getDirect(status, tutorBindSet) {
      let direct = null
      if (status === 'needaddress') {
        direct = {
          button: '填写地址',
          pathName: 'general-address',
        }
      } else if (status === 'paid') {
        if (tutorBindSet === false) {
          direct = {
            button: '添加学习顾问',
            pathName: 'general-advisor',
          }
        }
      }
      return direct
    },
    getStatus({ status, tutorBindSet }) {
      return {
        payStatus: this.payStatusMap[status],
        direct: this.getDirect(status, tutorBindSet),
      }
    },
    direct(item) {
      const pathName = this.getStatus(item)?.direct?.pathName
      const { oid } = item
      this.$emit('direct', { pathName, oid })
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  background: #ffffff;
  border-radius: 16px;
  padding: 0 16px 16px;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.03);
  margin-bottom: 20px;
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .head {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    /* font-weight: bold; */
    border-radius: 16px;
    line-height: 44px;
    background: #fbfbfb;
    color: #999;
    margin: 0 -16px;
    padding: 0 16px;
  }
  .content {
    .info-item {
      display: flex;
      justify-content: space-between;
      margin: 10px 0 14px;
      .commodity-info {
        /* flex: 1; */
        width: calc(100% - 4em);
        .title {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.6;
        }
        .tags {
          display: flex;
          font-size: 0;
          color: #999;
          line-height: 1.4;
          font-weight: 400;
          .tag {
            font-size: 14px;
            margin-right: 0.2em;
          }
        }
      }
      .price-info {
        width: 5em;
        text-align: right;
        .number {
          color: #b3b3b3;
          font-size: 12px;
          line-height: 1.5;
        }
      }
    }
  }
  .order-price {
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 2px;
      transform: scaleY(0.5);
      background: #f5f5f5;
    }
    position: relative;
    display: flex;
    padding-top: 14px;
    justify-content: space-between;
    .left {
      .title {
        font-size: 14px;
        color: #2e2e2e;
        line-height: 16px;
      }
      .order-time {
        color: #b3b3b3;
        font-size: 12px;
        line-height: 1.8;
      }
    }
    .right {
      width: 5em;
      text-align: right;
      font-size: 16px;
      color: #fc9026;
      font-weight: bold;
    }
  }
  .foot {
    text-align: right;
    .button {
      font-size: 12px;
      line-height: 25px;
      margin-top: 8px;
      background: #fc9026;
      color: #fff;
      display: inline-block;
      padding: 0 1em;
      border-radius: 15px;
    }
  }
}
</style>
