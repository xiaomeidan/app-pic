<template>
  <view
    class="content contentType2"
    :class="[{ 'content-type-right': item.meFlag }]"
    hover-class="contentType2-hover-class"
    :style="{
      width: `${130 + item.content.duration * 2}rpx`,
    }"
  >
    <view
      class="voice_icon"
      :class="[item.meFlag ? 'voice_icon_right' : 'voice_icon_left']"
    ></view>
    <view class="">{{ item.content.duration }}''</view>
  </view>
</template>

<script setup lang="ts">
import type { TypeMsgBase, Voice } from "@/pages/home/wechat/chat/msg";

const props = defineProps<{
  item: TypeMsgBase & { content: Voice };
}>();
</script>

<style>
.msg-item__right .bubble {
  background-color: #9fe759;
  border-color: #87cd51;
}
</style>

<style lang="scss" scoped>
.contentType2 {
  display: flex;
  flex-direction: row;
  align-items: center;

  .voice_icon {
    height: 34rpx;
    width: 34rpx;
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .voice_icon_right {
    background-image: url(@/static/image/weixin/voice-left-3.png);
    margin-left: 10rpx;
  }

  .voice_icon_left {
    background-image: url(@/static/image/weixin/voice-right-3.png);
    margin-right: 10rpx;
  }

  .voice_icon_right_an {
    animation: voiceAn_right 1s linear alternate infinite;
  }

  .voice_icon_left_an {
    animation: voiceAn_left 1s linear alternate infinite;
  }
}
</style>
