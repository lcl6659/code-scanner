<template>
  <div class="login-comp">
    <InsideLogin
      :mobile="mobile"
      :env="env"
      :source="source"
      :crm_source="crm_source"
      @emitEvent="emitEvent"
    />
  </div>
</template>

<script>
import { InsideLogin } from 'components'
import { SOURCE } from '@/config/query'
import { getCrmSource } from '@/utils'

const ENV_MAP = {
  local: 'dev',
  development: 'dev',
  fat: 'fat',
  prerelease: 'rc',
  production: 'prod',
}

export default {
  props: {
    mobile: String,
  },
  data() {
    return {
      buyGoods: false,
      source: SOURCE,
    }
  },
  computed: {
    env() {
      return ENV_MAP[process.env.VUE_APP_ENV]
    },
    crm_source() {
      return getCrmSource(this.$store.state.itemid)
    },
  },
  components: {
    InsideLogin,
  },
  methods: {
    emitEvent(info) {
      this.$emit('emitEvent', info)
    },
  },
}
</script>

<style lang="scss" scoped></style>
