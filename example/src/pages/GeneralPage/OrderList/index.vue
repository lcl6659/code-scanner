<template>
  <div class="order-list">
    <Account :account="account" @switch="switchAccount" />
    <List :orderList="orderList" v-if="orderList.length" @direct="direct" />
    <Empty v-if="ifShowEmpty" />
  </div>
</template>

<script>
import List from './components/List'
import Empty from './components/Empty'
import Account from './components/Account'
import { userInfoHandler } from '@/storeCacher'
// 0元课兼容
import { FROM } from '@/config/query'

export default {
  name: 'OrderList',
  components: {
    List,
    Empty,
    Account,
  },
  data() {
    return {
      listDone: false,
      account: '',
      orderList: [],
    }
  },
  computed: {
    ifShowEmpty() {
      return this.orderList.length === 0 && this.listDone
    },
  },
  methods: {
    toLogin() {
      this.$router.push({
        name: 'login',
      })
    },
    switchAccount() {
      this.track('My Order Switch Click')
      this.toLogin()
    },
    direct(item) {
      const { pathName, oid } = item
      this.$router.push({
        name: pathName,
        query: {
          oid,
          f: FROM,
        },
      })
      const trackNameMap = {
        'general-address': 'My Order',
        'general-advisor': 'MyOrder_AddTeacher_Click',
      }
      this.track(trackNameMap[pathName], { OID: oid })
    },
    async init() {
      const ifLogin = !!userInfoHandler.ifLogin
      if (ifLogin) {
        let mobile = await userInfoHandler.getMobile()
        if (mobile) {
          this.account = mobile
        }
        const [err, data] = await this.$API.getOrderList()
        this.listDone = true
        if (!err) {
          this.orderList = data
          const Status = data.length === 0 ? 'Empty' : data.length
          this.track('My Order View', { Status })
        }
      } else {
        this.toLogin()
      }
    },
    track(evtName, opts = {}, userproperty = {}, useBaseProps = true, callback) {
      opts = { ...this.$store.getters.loginBaseTrackOpts, ...opts }
      this.$track(evtName, opts, userproperty, useBaseProps, callback)
    },
  },
  created() {
    this.init()
  },
}
</script>

<style lang="scss" scoped>
.order-list {
  width: 100vw;
  min-height: 100vh;
  background: #f3f3f3;
  padding: 0 16px 16px;
}
</style>
