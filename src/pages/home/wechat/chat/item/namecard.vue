<template>
  <view class="content contentType5">
    <view
      class="u-flex u-row-between u-col-center"
      style="padding: 20rpx 10rpx 10rpx 20rpx"
    >
      <view style="width: 300rpx">
        <view class="u-line-2" style="width: 300rpx; font-size: 32rpx">
          {{ formatForwardUserInfo(item) }}
        </view>
      </view>
      <view>
        <view style="width: 90rpx">
          <u-image
            v-if="item.content.avatar != null"
            :src="item.content.avatar"
            width="80rpx"
            height="80rpx"
            mode="aspectFill"
          >
            <view slot="error">
              <u-image
                src="@/static/image/weixin/defaultAvatar.png"
                mode="aspectFill"
                width="80"
                height="80"
                border-radius="12"
              >
              </u-image>
            </view>
          </u-image>
        </view>
      </view>
    </view>
    <view
      style="font-size: 12px; padding: 10rpx 20rpx; color: #909399"
      class="u-border-top"
    >
      个人名片
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Namecard, TypeMsgBase } from "@/pages/home/wechat/chat/msg";

// {
//   id: 12,
//       meFlag: false,
//     userName: "other",
//     userAvatar: unknownAvatar,
//     msgType: 1,
//     contentType: "namecard",
//     content: {
//   avatar:
//       "https://xsf-1258804452.cos.ap-shanghai.myqcloud.com/img/202404/1713961088074.jpg",
//           userName: "金在中",
// },
// },

const props = defineProps<{
  item: TypeMsgBase & { content: Namecard };
}>();

function formatForwardUserInfo() {
  let forwardUser = props.item.content;
  return forwardUser.userName;
}
</script>

<style>
.msg-item__right .bubble {
  background-color: #9fe759;
  border-color: #87cd51;
}
</style>

<style lang="scss" scoped>
.contentType5 {
  width: 450rpx;
  padding: 0;
  border-radius: 10rpx;
  //background-color: transparent !important;
  border: 1rpx solid #e4e7ed;
  background-color: #ffffff !important;
}
</style>
