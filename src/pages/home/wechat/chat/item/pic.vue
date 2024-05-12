<template>
  <view class="content contentType3">
    <!--    :width="parseImgSize(item, 'w')"-->
    <!--    :height="parseImgSize(item, 'h')"-->
    <u-image
      :lazy-load="false"
      class="img"
      mode="aspectFit"
      :src="parseContent()"
    >
      <!--      <u-loading slot="loading"></u-loading>-->
    </u-image>
  </view>
</template>

<script setup lang="ts">
import type { TypeMsg, Img, TypeMsgBase } from "@/pages/home/wechat/chat/msg";
// import unknownAvatar from "@/static/image/weixin/unknown.png";

// {
//   id: 9,
//       meFlag: false,
//     userName: "other",
//     userAvatar: unknownAvatar,
//     msgType: 1,
//     contentType: "loc",
//     content: {
//   name: "故宫博物院",
//       address: "北京市东城区景山前街4号",
// },
// },

const props = defineProps<{
  item: TypeMsgBase & { content: Img };
}>();

function parseImgSize(item: TypeMsg, type) {
  if (type == "h") {
    let height = JSON.parse(item.content).height;
    if (item.contentType == 11 || item.contentType == 12) {
      height = JSON.parse(item.content).fileInfo.height;
      //console.log("附件高度",height);
    }
    if (height == null || height == undefined) {
      return "auto";
    } else {
      return height * 2;
    }
  } else {
    let width = JSON.parse(item.content).width;
    if (item.contentType == 11 || item.contentType == 12) {
      width = JSON.parse(item.content).fileInfo.width;
      //console.log("附件宽度",width);
    }
    if (width == null || width == undefined) {
      return 300;
    } else {
      return width * 2;
    }
  }
}

function parseContent() {
  let msgId = props.item.id;
  let localSrc = uni.getStorageSync("image" + msgId);
  if (localSrc) {
    return localSrc;
  }
  let url = props.item.content.url;
  return url;
}
</script>

<style>
.msg-item__right .bubble {
  background-color: #9fe759;
  border-color: #87cd51;
}
</style>

<style lang="scss" scoped>
.contentType3 {
  padding: 0;
  border-radius: 2rpx;
  background-color: transparent !important;
  border: 1rpx solid #e4e7ed;

  .img {
    width: 200rpx;
    height: auto;
    max-width: 300rpx;
    max-height: 400rpx;
  }
}

.contentType3::after {
  border: none !important;
  display: none !important;
}
</style>
