import { ref } from "vue";
import { defineStore } from "pinia";
import type { TypeMsg } from "@/pages/home/wechat/chat/msg";
import unknownAvatar from "@/static/image/weixin/unknown.png";

const msgStore = defineStore("message", () => {
  const msgList = ref<TypeMsg[]>([
    {
      id: 1,
      meFlag: true,
      userName: "me",
      userAvatar: unknownAvatar,
      msgType: 1, // 信息类型0:系统信息   1表示用户信息
      contentType: "msg", //信息内容类型   1-文本 2-图片 3-视频  4-语音信息 5-文件 6-其他
      content: { text: "消息1" },
    },
    {
      id: 2,
      meFlag: false,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "msg",
      content: { text: "消息2" },
    },
    {
      id: 3,
      meFlag: false,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "pic",
      content: {
        url: "https://xsf-1258804452.cos.ap-shanghai.myqcloud.com/img/202404/1713961484127.jpg",
      },
    },
    {
      id: 4,
      meFlag: true,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "redpocket",
      content: {
        receiveAllFlag: false,
        isReceive: false,
        redBagRemark: "恭喜发财，大吉大利",
      },
    },
    {
      id: 5,
      meFlag: false,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "redpocket",
      content: {
        receiveAllFlag: false,
        isReceive: true,
        redBagRemark: "恭喜发财，大吉大利",
      },
    },
    {
      id: 6,
      meFlag: true,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "voice",
      content: {
        duration: 15,
      },
    },
    {
      id: 7,
      meFlag: false,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "voice",
      content: {
        duration: 15,
      },
    },
    {
      id: 8,
      meFlag: true,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "transfer",
      content: {
        receiveAllFlag: false,
        isReceive: true,
        transferRemark: "",
        transferAmount: 100,
      },
    },
    {
      id: 9,
      meFlag: false,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "transfer",
      content: {
        receiveAllFlag: false,
        isReceive: true,
        transferRemark: "接着奏乐",
        transferAmount: 10,
      },
    },
    {
      id: 10,
      meFlag: false,
      userName: "other",
      userAvatar: unknownAvatar,
      msgType: 1,
      contentType: "transfer",
      content: {
        receiveAllFlag: false,
        isReceive: false,
        redBagRemark: "接着奏乐",
        redBagAmount: 10,
      },
    },
  ]);

  function addMsg(msg: Omit<TypeMsg, "id">) {
    msgList.value.push({
      id: msgList.value.length + 1,
      ...msg,
    });
  }

  function delMsg(id: number) {
    msgList.value = msgList.value.filter((m) => m.id !== id);
  }

  return {
    msgList,
    addMsg,
    delMsg,
  };
});

export default msgStore;
