<template>
  <view class="content contentType9">
    <view style="margin: 16rpx 10rpx 8rpx">
      <view class="u-line-2" style="max-height: 70rpx"
        >{{ item.content.name }}
      </view>
      <view
        class="u-line-2"
        style="font-size: 24rpx; color: #909399; margin-top: 10rpx"
      >
        {{ item.content.address }}
      </view>
    </view>
    <view class="map"></view>
  </view>
</template>

<script setup lang="ts">
import type { TypeMsgBase, Location } from "@/pages/home/wechat/chat/msg";

const props = defineProps<{
  item: TypeMsgBase & { content: Location };
}>();
</script>

<style>
.msg-item__right .bubble {
  background-color: #9fe759;
  border-color: #87cd51;
}
</style>

<style lang="scss" scoped>
.contentType9 {
  width: 500rpx;
  padding: 0rpx;
  border-radius: 10rpx;
  border: 1rpx solid #e4e7ed;
  background-color: #ffffff !important;
}
.map {
  background: url(@/static/image/weixin/map.png) 100% no-repeat;
  background-size: 100% 100%;
  height: 146px;
}
</style>
