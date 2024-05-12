<template>
  <view>
    <view class="dangantabs_wai">
      <view class="dangantabs">
        <view
          :class="['tab', activeIndex === -1 ? 'active1' : '']"
          @tap="selectMenu(-1)"
        >
          <text>emoji</text>
        </view>
        <view
          v-for="(item, index) in emojiMenuList"
          :key="index"
          :class="['tab', index == activeIndex ? 'active1' : '']"
          @tap="selectMenu(index)"
        >
          <text>{{ item.dictLabel }}</text>
        </view>
      </view>
    </view>
    <view class="img-box">
      <scroll-view
        :scroll-top="scrollTop"
        :scroll-y="true"
        style="height: 300px"
      >
        <!--        <view v-for="(em, eid) of baseList" :key="eid">-->
        <!--          <image-->
        <!--            mode="widthFix"-->
        <!--            :src="`/static/emoji/${em.url}`"-->
        <!--            @tap="selectBase(em)"-->
        <!--          />-->
        <!--        </view>-->
        <template v-if="activeIndex === -1">
          <image
            class="img"
            v-for="(em, eid) of baseList"
            mode="widthFix"
            :key="eid"
            :src="`/static/emoji/${em.url}`"
            @tap="selectBase(em)"
          />
        </template>

        <!--        <image mode="widthFix" :src="'/static/emoji/'+em.url"></image>-->
        <template v-else>
          <img
            class="img"
            v-for="(i, index) of imgList"
            :key="index"
            :src="i.url"
            :alt="i.alt"
            @tap="selectEmoji(i.url)"
          />
        </template>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import globalUtil from "@/util/util";
import useEmojiStore from "@/stores/emoji";

const emits = defineEmits(["emoji", "select"]);

const emojiStore = useEmojiStore();
const { emojiMenuList } = storeToRefs(emojiStore);

const scrollTop = ref(0);
const activeIndex = ref(-1);
const baseList = ref(globalUtil.faceUtils.emojiList());
const imgList = computed(() => {
  if (activeIndex.value < 0) {
    return [];
  }
  return emojiMenuList.value.length
    ? emojiMenuList.value[activeIndex.value].list
    : [];
});

async function selectMenu(index: number) {
  console.log("scrollTop", scrollTop);
  scrollTop.value = 0;
  activeIndex.value = index;
}

function selectBase(i: any) {
  console.log(i.alt);
  emits("emoji", i.alt);
}
function selectEmoji(url: string) {
  emits("select", url);
}
</script>

<style lang="scss" scoped>
.dangantabs_wai {
  height: 90rpx;
  background-color: #f2f2f2;
  display: flex;
  font-size: 32rpx;
  color: #323232;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
}
.dangantabs {
  left: 0px;
  top: 0px;
  position: absolute;
  height: 90rpx;
  white-space: nowrap;
  display: flex;
}
.tab {
  margin: 0 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.active1 {
  color: #00ce88;
  font-size: 36rpx;
  font-weight: bold;
}
.img-box {
  .img {
    width: 40px;
    height: 40px;
  }
}
</style>
