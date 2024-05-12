<template>
  <file v-if="item.contentType === 'file'" :item="item" />
  <loc v-else-if="item.contentType === 'loc'" :item="item" />
  <msg v-else-if="item.contentType === 'msg'" :item="item" />
  <namecard v-else-if="item.contentType === 'namecard'" :item="item" />
  <pic v-else-if="item.contentType === 'pic'" :item="item" />
  <red v-else-if="item.contentType === 'redpocket'" :item="item" />
  <transfer v-else-if="item.contentType === 'transfer'" :item="item" />
  <voice v-else-if="item.contentType === 'voice'" :item="item" />
</template>

<script setup lang="ts">
import file from "@/pages/home/wechat/chat/item/file.vue";
import loc from "@/pages/home/wechat/chat/item/location.vue";
import msg from "@/pages/home/wechat/chat/item/msg.vue";
import namecard from "@/pages/home/wechat/chat/item/namecard.vue";
import pic from "@/pages/home/wechat/chat/item/pic.vue";
import red from "@/pages/home/wechat/chat/item/redpocket.vue";
import voice from "@/pages/home/wechat/chat/item/voice.vue";
import Transfer from "@/pages/home/wechat/chat/item/transfer.vue";
import type { TypeMsg } from "@/pages/home/wechat/chat/msg";

const props = defineProps<{
  item: TypeMsg;
}>();
</script>

<style scoped></style>
