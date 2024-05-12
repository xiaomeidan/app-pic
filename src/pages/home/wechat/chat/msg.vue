<template>
  <view class="bubble">
    {{ item.content }}
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: object;
}>();
</script>

<style>
.msg-item__right .bubble {
  background-color: #9fe759;
  border-color: #87cd51;
}
</style>

<style scoped>
.bubble {
  border: 1px solid #ddd;
  padding: 7px 10px;
  border-radius: 3px;
  max-width: 500rpx;
  position: relative;
}
</style>
