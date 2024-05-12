import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getDict } from "@/api/dict";
import { getPhotoByDict } from "@/api/photo";
import type { Dict as DictOrig } from "@/types/dict";

export type Dict = DictOrig & {
  list: { url: string; alt: string }[];
};
const emojiStore = defineStore("emoji", () => {
  const emojiMenuList = ref<Dict[]>([]);
  const baseEmoji = computed(() =>
    emojiMenuList.value.length ? emojiMenuList.value[0].list : [],
  );

  getEmojiMenu();

  async function getEmojiByDict(d: Dict) {
    const { data } = await getPhotoByDict({
      imgSortDateil: d.dictValue,
      imgType: 1, // 1系统图片 2头像图片
      pageNumber: 1,
      pageSize: 100,
    });
    d.list = data.map((p) => ({
      url: p.imgUrl,
      alt: `[${p.cname}]`,
    }));
  }

  async function getEmojiMenu() {
    // if (emojiMenuList.value.length) {
    //   return;
    // }

    const { data } = await getDict({
      dictType: "photo_emoj_sort",
      pageNumber: 1,
      pageSize: 10,
    });
    const promises = [];
    data.forEach((menu) => promises.push(getEmojiByDict(menu)));
    await Promise.all(promises);

    // data.forEach(async (menu: Dict) => {
    //   const { data: listData } = await getPhotoByDict({
    //     imgSortDateil: menu.dictValue,
    //     imgType: 1, // 1系统图片 2头像图片
    //     pageNumber: 1,
    //     pageSize: 100,
    //   });
    //   menu.list = listData.map((p) => ({
    //     url: p.imgUrl,
    //     alt: `[${p.cname}]`,
    //   }));
    // });
    emojiMenuList.value = data;
    console.log("list ", emojiMenuList.value);
  }

  return {
    baseEmoji,
    emojiMenuList,
  };
});

export default emojiStore;
