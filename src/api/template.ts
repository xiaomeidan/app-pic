import { sendQuest } from "@/api/request";

// 获取用户的模板列表
export function getTemplateList(params: {
  pageNumber: number,
  pageSize: number,
  templetType: number, // 1单聊模板。。其他待定
  unionId: string
}) {
  return sendQuest({
    url: 'mcs/templetInfo/getTempletList',
    method: 'post',
    data: params,
    hideLoading: true
  });
}

// 根据ID删除模板信息
export function delTemplateById(
  messageId: number,
) {
  return sendQuest({
    url: `mcs/templetInfo/deleteTempletInfo/${messageId}`,
    method: 'get',
    data: undefined,
    hideLoading: true
  });
}