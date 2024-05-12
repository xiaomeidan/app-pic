<template>
  <view
    :style="msg.isReceive ? 'opacity: 0.5;' : ''"
    class="content contentType6"
  >
    <view class="u-flex u-row-between u-col-center">
      <view class="u-m-r-20">
        <span
          :class="[
            'icon',
            msg.isReceive ? 'icon-circle-right' : 'icon-transfer',
          ]"
        />
      </view>
      <view style="font-size: 36rpx; min-width: 320rpx">
        <view class="u-line-1">￥{{ msg.transferAmount }}</view>
        <view>
          <view style="font-size: 12px; margin-top: 10rpx">
            <text>{{ remark }}</text>
          </view>
        </view>
      </view>
    </view>
    <view style="font-size: 24rpx; margin-top: 20rpx; padding-top: 10rpx">
      微信转账
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Transfer, TypeMsgBase } from "@/pages/home/wechat/chat/msg";
import { computed } from "vue";

const props = defineProps<{
  item: TypeMsgBase & { content: Transfer };
}>();

const msg = computed(() => props.item.content);
const remark = computed(() => {
  if (msg.value.transferRemark) {
    return msg.value.transferRemark;
  }
  if (props.item.meFlag) {
    return msg.value.isReceive ? "已被接收" : "你发起了一笔转账";
  }
  return msg.value.isReceive ? "请查收" : "已收款";
});
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
.icon {
  font-size: 40px;
  &:before {
    color: white;
  }
}
</style>
