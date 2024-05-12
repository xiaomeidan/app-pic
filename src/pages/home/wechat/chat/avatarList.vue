<template>
  <view>
    <view class="dangantabs_wai">
      <view class="dangantabs">
        <view
          v-for="(item, index) in tabList"
          :key="index"
          :class="index == activeIndex ? 'active1' : ''"
          style="
            margin: 0 20rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          "
          @click="selectMenu(item, index)"
        >
          <text>{{ item.dictLabel }}</text>
        </view>
      </view>
    </view>
    <view class="img-box">
      <scroll-view :scroll-y="true" style="height: 300px">
        <img
          class="img"
          v-for="(i, index) of imgList"
          :key="index"
          :src="i"
          alt="index"
          @click="selectAvatar(i)"
        />
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getDict } from "@/api/dict";
import { getPhotoByDict } from "@/api/photo";
import type { Photo } from "@/types/photo";

interface Menu {
  dictType: "photo_head_sort";
  dictValue: string;
  dictLabel: string;
}

const emits = defineEmits(["select"]);

const activeIndex = ref(0);
const tabList = ref<Menu[]>([]);
const imgList = ref<Photo[]>([]);
initData();

async function initData() {
  const { data } = await getDict({
    dictType: "photo_head_sort",
    pageNumber: 1,
    pageSize: 10,
  });
  tabList.value = data;
  selectMenu(data[0], 0);
}

async function selectMenu(menu: Menu, index: number) {
  activeIndex.value = index;
  const { data } = await getPhotoByDict({
    imgSortDateil: menu.dictValue,
    imgType: 2, // 1系统图片2头像图片
    pageNumber: 1,
    pageSize: 100,
  });
  imgList.value = data.map((i) => i.imgUrl);
}

function selectAvatar(url: string) {
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
