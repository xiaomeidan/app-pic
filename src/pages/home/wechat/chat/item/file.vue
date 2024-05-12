<template>
  <view class="content contentType5">
    <view
      class="u-flex u-row-between u-col-center"
      style="padding: 20rpx 10rpx 5rpx 20rpx"
    >
      <view style="width: 300rpx">
        <view class="u-line-2 u-p-b-10" style="width: 300rpx; font-size: 30rpx">
          {{ item.content.fileName }}
        </view>
        <view class="u-m-t-10" style="font-size: 24rpx; color: #909399">
          {{ item.content.fileSize }}{{ item.content.sizeUnit }}
        </view>
      </view>
      <view>
        <view style="width: 90rpx">
          <u-image :src="imgSrc" width="80rpx" height="80rpx" mode="aspectFill">
          </u-image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { File, TypeMsgBase } from "@/pages/home/wechat/chat/msg";
import docx from "@/static/image/fileType/docx.png";
import img from "@/static/image/fileType/img.png";
import pdf from "@/static/image/fileType/pdf.png";
import ppt from "@/static/image/fileType/ppt.png";
import txt from "@/static/image/fileType/txt.png";
import unknown from "@/static/image/fileType/unknowfile.png";
import xls from "@/static/image/fileType/xls.png";
import zip from "@/static/image/fileType/zip.png";

// {
//   id: 11,
//       meFlag: true,
//     userName: "other",
//     userAvatar: unknownAvatar,
//     msgType: 1,
//     contentType: "file",
//     content: {
//   fileName: "abc.pdf",
//       fileSize: 324,
//       sizeUnit: "KB",
//       fileType: "pdf",
// },
// },

const props = defineProps<{
  item: TypeMsgBase & { content: File };
}>();

const imgMap = {
  docx,
  img,
  pdf,
  ppt,
  txt,
  xls,
  zip,
};

const fileType = computed(() => props.item.content.fileType);
const imgSrc = computed(() => imgMap[fileType.value] || unknown);
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
