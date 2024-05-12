<template>
  <red-bag v-if="view === 'redbag'" :is-me="isMe" @close="onClose" />
  <transfer v-else-if="view === 'transfer'" :is-me="isMe" @close="onClose" />
</template>

<script setup lang="ts">
import RedBag from "@/pages/home/wechat/chat/func/redbag.vue";
import Transfer from "@/pages/home/wechat/chat/func/transfer.vue";

const props = defineProps<{
  view: string;
  isMe: boolean;
}>();
const emits = defineEmits(["close"]);

function onClose() {
  emits("close");
}
</script>

<style scoped></style>
