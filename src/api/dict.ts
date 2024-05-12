import { sendQuest } from "@/api/request";

export function getDict(params: {
  dictType: "photo_emoj_sort" | "photo_head_sort"; // emoj|头像
  pageNumber: number;
  pageSize: number;
}) {
  return sendQuest({
    url: "mcs/dictDataController/getDictDataList",
    method: "post",
    data: params,
    hideLoading: true,
  });
}
