<template>
  <view class="content">
    <view class="richTextImg">
      <!-- <rich-text :nodes="parseContent(item)" :selectable="false" preview="false"></rich-text> -->
      <up-parse
        :content="parseContent()"
        :tag-style="{
          img: 'width:26px;height:26px;position:relative;top: 10rpx;',
        }"
      >
      </up-parse>
    </view>
  </view>
</template>

<script setup lang="ts">
import globalUtil from "@/util/util";
import type { Text, TypeMsgBase } from "@/pages/home/wechat/chat/msg";

const props = defineProps<{
  item: TypeMsgBase & { content: Text };
}>();

function parseContent() {
  let msgStr = props.item.content.text;

  let transText = globalUtil.transform(msgStr, "", "");
  return transText;
}
</script>

<style>
.msg-item__right .bubble {
  background-color: #9fe759;
  border-color: #87cd51;
}
</style>

<style lang="scss" scoped>
.richTextImg {
  .emoji {
    position: relative;
    top: 10rpx;
    width: 26px;
    height: 26px;
  }
}
</style>
