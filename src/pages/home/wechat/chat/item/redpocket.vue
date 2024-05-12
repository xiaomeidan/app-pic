<template>
  <view
    :style="msg.receiveAllFlag || msg.isReceive ? 'opacity: 0.5;' : ''"
    class="content contentType6"
  >
    <view class="u-flex u-row-between u-col-center">
      <view class="u-m-r-20">
        <u-image
          v-if="msg.receiveAllFlag"
          mode="scaleToFill"
          src="/static/image/weixin/redbag-open.png"
          width="70rpx"
          height="80rpx"
        />
        <u-image
          v-else
          mode="scaleToFill"
          src="/static/image/weixin/redbag.png"
          width="70rpx"
          height="80rpx"
        />
      </view>
      <view style="font-size: 36rpx; min-width: 320rpx">
        <view class="u-line-1">{{ msg.redBagRemark }}</view>
        <view
          v-if="msg.receiveAllFlag"
          style="font-size: 12px; margin-top: 10rpx"
        >
          <text>已被领完</text>
        </view>
        <view v-else>
          <view v-if="msg.isReceive" style="font-size: 12px; margin-top: 10rpx">
            <text>已经领取</text>
          </view>
        </view>
      </view>
    </view>
    <view style="font-size: 24rpx; margin-top: 20rpx; padding-top: 10rpx">
      微信红包</view
    >
  </view>
</template>

<script setup lang="ts">
import type { RedPocket, TypeMsgBase } from "@/pages/home/wechat/chat/msg";
import { computed } from "vue";

const props = defineProps<{
  item: TypeMsgBase & { content: RedPocket };
}>();

const msg = computed(() => props.item.content);
</script>

<style>
.msg-item__right .bubble {
  background-color: #9fe759;
  border-color: #87cd51;
}
</style>

<style lang="scss" scoped>
.contentType6 {
  padding: 20rpx 30rpx;
  padding-bottom: 6rpx;
  border-radius: 10rpx;
  background-color: #f29100;
  color: #ffffff;
}
</style>
