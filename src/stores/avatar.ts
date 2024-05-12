import { ref } from "vue";
import { defineStore } from "pinia";
import { getDict } from "@/api/dict";
import { getPhotoByDict } from "@/api/photo";
import type { Photo } from "@/types/photo";
import type { Dict as DictOrig } from "@/types/dict";

type Dict = DictOrig & {
  list: Photo[];
};
const avatarStore = defineStore("avatar", () => {
  const avatarMenuList = ref<Dict[]>([]);

  getAvatarMenu();

  async function getAvatarMenu() {
    const { data } = await getDict({
      dictType: "photo_head_sort",
      pageNumber: 1,
      pageSize: 10,
    });
    data.forEach(async (menu: Dict) => {
      const { data: listData } = await getPhotoByDict({
        imgSortDateil: menu.dictValue,
        imgType: 2, // 1系统图片2头像图片
        pageNumber: 1,
        pageSize: 100,
      });
      menu.list = listData;
    });
    avatarMenuList.value = data;
  }

  return {
    avatarMenuList,
  };
});

export default avatarStore;
