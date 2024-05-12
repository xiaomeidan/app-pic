// 语音发送
import { ref, Ref } from "vue";
import useMessageStore from "@/stores/message";

export default (isMe: Ref<boolean>) => {
  const messageStore = useMessageStore();
  const showVoice = ref(false);
  const voiceList = ref(genVoiceArray());
  const durationIndex = ref(0);
  const durationList = ref(genDurationArray());

  function genVoiceArray() {
    return Array(60)
      .toString()
      .split(",")
      .map((item, index) => ({ name: `${index + 1}s` }));
  }
  function genDurationArray() {
    return Array(60)
      .toString()
      .split(",")
      .map((item, index) => `${index + 1}s`);
  }

  function addVoice(select: any) {
    console.log("select ", select);
    let msg = {
      meFlag: isMe.value,
      userName: "me",
      userAvatar: "",
      msgType: 1, //信息类型0:系统信息   1表示用户信息
      contentType: "voice", //信息内容类型   1-文本 2-图片 3-视频  4-语音信息 5-文件 6-其他
      content: {
        duration: Number(select.detail.value) + 1,
      },
    };
    // let msg = {
    //   meFlag: isMe.value,
    //   userName: "me",
    //   userAvatar: "",
    //   msgType: 1, //信息类型0:系统信息   1表示用户信息
    //   contentType: "voice", //信息内容类型   1-文本 2-图片 3-视频  4-语音信息 5-文件 6-其他
    //   content: {
    //     duration: select.name.split("s")[0],
    //   },
    // };
    messageStore.addMsg(msg);
    durationIndex.value = 0;
    // closeShowVoice();
  }

  function openShowVoice() {
    showVoice.value = true;
  }

  function closeShowVoice() {
    showVoice.value = false;
  }

  return {
    showVoice,
    voiceList,
    durationIndex,
    durationList,
    addVoice,
    openShowVoice,
    closeShowVoice,
  };
};
