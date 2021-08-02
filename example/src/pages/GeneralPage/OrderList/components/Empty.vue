<template>
  <div class="empty">
    <img class="empty_img" src="./assets/img_emptystatus.png" />
    <div class="info">暂无订单信息哦</div>
  </div>
</template>

<style lang="scss" scoped>
.order-list {
  .empty {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate3d(-50%, -50%, 0);
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 16px;
    .empty_img {
      display: block;
      width: 55vw;
      color: #2e2e2e;
    }
  }
}
</style>
