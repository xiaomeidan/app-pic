// 系统消息
export type SysMsg = string;
// 文本消息
export interface Text {
  text: string;
}
// 图片
export interface Img {
  url: string;
}
// 红包
export interface RedPocket {
  receiveAllFlag: boolean;
  isReceive: boolean;
  redBagRemark: string;
}
// 转账
export interface Transfer {
  receiveAllFlag: boolean;
  isReceive: boolean;
  transferRemark: string;
  transferAmount: number;
}
// voice
export interface Voice {
  duration: number;
}
// location
export interface Location {
  name: string;
  address: string;
}
// 文件
export interface File {
  fileName: string;
  fileSize: number;
  sizeUnit: string;
  fileType: string;
}
// 名片
export interface Namecard {
  avatar: string;
  userName: string;
}

export interface TypeMsgBase {
  id: number;
  meFlag: boolean; // 是否本人发的
  userName: string; // 用户名称
  userAvatar: string; // 用户头像
  msgType: 1 | 2; //1用户信息 2系统信息
  contentType: string;
  createTime?: string; // 消息时间
}

export type TypeMsg = TypeMsgBase & {
  content:
    | SysMsg
    | Text
    | Img
    | RedPocket
    | Transfer
    | Voice
    | Location
    | File
    | Namecard;
};
