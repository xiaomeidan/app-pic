import { sendQuest } from "@/api/request";

export function getPhotoByDict(params: {
  imgSortDateil: string, // 根据查询的模板列表值返回的ID查询对应分类下的图片信息
  imgType: 1 | 2, // 1系统图片2头像图片
  pageNumber: number,
  pageSize: number
}) {
  return sendQuest({
    url: 'mcs/photoImgInfoController/getPhotoInfoList',
    method: 'post',
    data: params,
    hideLoading: true
  });
}