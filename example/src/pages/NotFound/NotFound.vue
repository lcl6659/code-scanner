<template>
  <div class="not-found-page">
    <div class="inner">
      <img
        class="not-found-img"
        src="https://qiniucdn.jiliguala.com/dev/promo/108f870824df4e56afa033243ee520a3.png"
        alt="404"
      />
      <h2>
        {{ $route.query.msg || (/L\dXX/.test(this.itemid) ? '来晚啦' : '404') }}
      </h2>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['itemid']),
  },
}
</script>

<style lang="scss">
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #666;

  .inner {
    padding-top: 130px;
  }

  .not-found-img {
    width: 60%;
    display: inline-block;
    margin: 20px auto;
  }
}
</style>
