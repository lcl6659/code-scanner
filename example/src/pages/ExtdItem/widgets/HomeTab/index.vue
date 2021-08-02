<template>
  <div class="tabs-page">
    <Sticky>
      <ul class="tabs" v-if="tabDetails.length > 1">
        <li
          v-for="(tab, index) in tabDetails"
          :key="tab.tabTitle"
          @click="switchTab(index)"
        >
          <img
            :src="index === activeIndex ? tab.detailPics[0] : tab.detailPics[1]"
          />
        </li>
      </ul>
    </Sticky>
    <ul>
      <li v-for="(pic, index) in pics.slice(2)" :key="index">
        <img :src="pic" alt="" />
      </li>
    </ul>
  </div>
</template>

<script>
import { Sticky } from 'vcomp'
export default {
  name: 'HomeTab',
  components: {
    Sticky,
  },
  props: {
    tabDetails: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      activeIndex: 0,
    }
  },
  computed: {
    pics() {
      return this.tabDetails[this.activeIndex].detailPics
    },
  },
  methods: {
    switchTab(i) {
      this.$track('Subject_Click', {
        Course: this.tabDetails[i]?.tabTitle || '',
      })
      this.activeIndex = i
    },
  },
}
</script>
<style lang="scss" scoped>
.tabs-page {
  .tabs {
    display: flex;
    li {
      flex-grow: 1;
    }
  }
  img {
    display: inline-block;
    width: 100%;
  }
  li {
    font-size: 0;
  }
}
</style>
