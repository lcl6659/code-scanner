<template>
  <div class="account">
    <div class="tel">账号 {{ formatAccount }}</div>
    <div class="switch-btn" v-on:click="switchAccount">切换</div>
  </div>
</template>

<script>
export default {
  name: 'account',
  props: {
    account: Number || String,
  },
  computed: {
    formatAccount() {
      const pattern = /(\d{3})(\d{4})(\d{4})/
      return this.account.replace(pattern, '$1****$3')
    },
  },
  methods: {
    switchAccount() {
      this.$emit('switch')
    },
  },
}
</script>

<style lang="scss" scoped>
.account {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  line-height: 3;
  .tel {
    color: #b3b3b3;
  }
  .switch-btn {
    padding-left: 16px;
    color: #ff7b15;
  }
}
</style>
