<template>
  <div class="loading-wrap" v-if="show">
    <svg class="loading" width="44px" height="44px" viewBox="0 0 44 44">
      <circle
        class="path"
        :style="{ stroke: stroke || '#FF5159' }"
        fill="none"
        stroke-width="4"
        stroke-linecap="round"
        cx="22"
        cy="22"
        r="20"
      ></circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'RoundLoading',
  props: {
    show: Boolean,
    stroke: String,
  },
}
</script>

<style lang="scss" scoped>
.loading-wrap {
  text-align: center;
  height: 44px;
  position: relative;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
}
.loading {
  animation: rotator 1.4s linear infinite;
}
.loading .path {
  // stroke: #FF5159;
  stroke-dasharray: 126;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.4s ease-in-out infinite;
}
@keyframes rotator {
  0% {
    transform: scale(0.5) rotate(0deg);
  }
  100% {
    transform: scale(0.5) rotate(270deg);
  }
}
@keyframes dash {
  0% {
    stroke-dashoffset: 126;
  }
  50% {
    stroke-dashoffset: 63;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 126;
    transform: rotate(450deg);
  }
}
</style>
