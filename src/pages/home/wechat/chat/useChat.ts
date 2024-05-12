// 聊天相关操作
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import useEmojiStore from "@/stores/emoji";
import useMessageStore from "@/stores/message";
import globalUtil from "@/util/util";

export default () => {
  const emojiStore = useEmojiStore();
  const messageStore = useMessageStore();
  const { emojiMenuList } = storeToRefs(emojiStore);
  const { msgList } = storeToRefs(messageStore);

  const sendStr = ref(""); //发送的文字信息
  const funHeight = ref(0); // 底部菜单高度
  const chatType = ref("voice"); // 图标类型 'voice'语音 'keyboard'键盘
  const showFunBtn = ref(false); //是否展示功能型按钮
  const showEmojiBox = ref(false); //是否显示表情弹窗
  const inputFocusFlag = ref(false);
  const autoBackToBottom = ref(true); //有信息的时候是否回到底部位置
  const faceList = ref(globalUtil.faceUtils.emojiList());

  const from = ref("left");

  const fun1List = [
    {
      id: 1,
      icon: "photo-fill",
      title: "照片",
      uploadType: ["album"],
    },
    {
      id: 2,
      icon: "camera-fill",
      title: "视频",
      uploadType: ["camera"],
    },
    {
      id: 3,
      icon: "/static/image/weixin/grid/video.png",
      title: "视频通话",
    },
    {
      id: 4,
      icon: "map-fill",
      title: "位置",
    },
    {
      id: 5,
      icon: "/static/image/weixin/grid/redbag.png",
      title: "红包",
    },
    {
      id: 6,
      icon: "/static/image/weixin/grid/zhuanzhang.png",
      title: "转账",
    },
    {
      id: 7,
      icon: "/static/image/weixin/grid/voiceInput.png",
      title: "语音输入",
    },
    {
      id: 8,
      icon: "/static/image/weixin/grid/collcetion.png",
      title: "收藏",
    },
  ];
  const fun2List = [
    {
      id: 9,
      icon: "/static/image/weixin/grid/call.png",
      title: "个人名片",
    },
    {
      id: 10,
      icon: "/static/image/weixin/grid/dir.png",
      title: "文件",
      uploadType: ["camera"],
    },
    {
      id: 11,
      icon: "/static/image/weixin/grid/call.png",
      title: "卡券",
    },
    {
      id: 12,
      icon: "/static/image/weixin/grid/call.png",
      title: "音乐",
    },
  ];
  const funList = ref([fun1List, fun2List]);
  const funcView = ref("");
  const showChat = computed(() => funcView.value === "");

  function switchChatType(type: string) {
    chatType.value = type;
    //底部菜单隐藏
    if (showFunBtn.value === true) {
      showFunBtn.value = false;
      funHeight.value = 0;
    }
    //表情弹窗
    if (showEmojiBox.value == true) {
      showEmojiBox.value = false;
      funHeight.value = 0;
    }

    if (type === "voice") {
      inputFocusFlag.value = true;
    } else {
    }
  }

  function sendText() {
    if (sendStr.value.length < 1) {
      uni.hideKeyboard();
      globalUtil.utilAlert("不能发送空字符串");
      return;
    }
    //如果文字中有表情,需要转换处理
    let formatStr = replaceEmoji(sendStr.value);
    let content = { text: formatStr }; //文本内容;
    //判断是不是图文结合的
    // let showFlag = this.fileRemarkObj.showFlag;
    // let fileInfo = this.fileRemarkObj.fileInfo;
    // if (showFlag && fileInfo) {
    //   that.sendComponentMsg(formatStr);
    // } else {
    sendMsg(1, "msg", content);
    // }
  }

  //发送消息
  function sendMsg(msgType, contentType, contentObj) {
    autoBackToBottom.value = true;
    //console.log("登录状态",res);
    let msg = {
      id: msgList.value.length + 1,
      meFlag: from.value === "right",
      userName: "me",
      msgType: msgType, //信息类型0:系统信息   1表示用户信息
      contentType: contentType, //信息内容类型   1-文本 2-图片 3-视频  4-语音信息 5-文件 6-其他
      content: contentObj,
    };
    messageStore.addMsg(msg);
    sendStr.value = "";
  }

  function replaceEmoji(str: string) {
    let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
      const emoji = faceList.value.find((e) => e.alt === item);
      if (emoji) {
        let imgstr = "face" + emoji.alt;
        return imgstr;
      }
    });
    return replacedStr;
  }

  function replaceReseverEmoji(str: string) {
    let replacedStr = str.replace(/face\[([^\s\[\]]+?)]/g, function (face) {
      let alt = face.replace(/^face/g, "");
      return alt;
    });
    console.log("replacedStr", replacedStr);
    return replacedStr;
  }

  //切换功能性按钮
  function changeDrawer() {
    showEmojiBox.value = false;
    showFunBtn.value = !showFunBtn.value;
    uni.hideKeyboard();
    if (showFunBtn.value) {
      funHeight.value = 200;
      // that.scrollViewHeight = that.$u.sys().windowHeight - 350;
    } else {
      funHeight.value = 0;
      // that.scrollViewHeight = that.$u.sys().windowHeight - 150;
    }
  }

  //表情弹窗
  function changeEmojiBox() {
    showFunBtn.value = false;
    showEmojiBox.value = !showEmojiBox.value;
    uni.hideKeyboard();
    if (showEmojiBox.value) {
      chatType.value = "voice";
      funHeight.value = 200;
      // that.scrollViewHeight = that.$u.sys().windowHeight - 350;
    } else {
      funHeight.value = 0;
      // that.scrollViewHeight = that.$u.sys().windowHeight - 150;
    }
  }

  //添加表情
  function addEmoji(em: string) {
    sendStr.value += em;
  }

  // 选择图片
  function selectEmoji(url: string) {
    sendMsg(1, "pic", { url });
  }

  //点击宫格时触发
  function clickGrid(fun) {
    // let id = funList.value[index].id;
    inputFocusFlag.value = false;
    console.log("choose ", fun);
    switch (fun.title) {
      case "红包":
        funcView.value = "redbag";
        break;
      case "转账":
        funcView.value = "transfer";
        break;
      default:
        break;
    }
    //组合方式清楚
    // that.fileRemarkObj.showFlag = false;
    // that.fileRemarkObj.fileInfo = null;
    // that.fileRemarkObj.tag = "";
    // if (id == 1) {
    //   chooseImage();
    // } else if (id == 2) {
    //   this.chooseVideo();
    // } else if (id == 3) {
    //   let chatGroupType = that.currentChatGroup.chatGroupType;
    //   if (chatGroupType == 0) {
    //     that.launchSingleCalling(2);
    //     return;
    //   } else {
    //     this.globalUtil.utilAlert("功能尚未开放!");
    //     return;
    //     /* this.$u.route({
    //         url: '/pages/chattingroom/videoCalling',
    //         params: {
    //             'userId':that.vuex_userInfo.mobile+"_"+that.vuex_userInfo.id,
    //             'userSign':that.vuex_userInfo.userSign
    //         }
    //     }) */
    //   }
    // } else if (id == 4) {
    //   console.log("位置");
    //   //去选择所在位置
    //   let that = this;
    //   uni.chooseLocation({
    //     success: function (res) {
    //       that.addressObj = res;
    //       that.addressObj.chooseFlag = true;
    //       that.sendLocation(that.addressObj);
    //     },
    //     fail: function () {
    //       that.address = {};
    //       that.address.chooseFlag = false;
    //     },
    //   });
    //   return;
    // } else if (id == 5) {
    //   let chatGroupType = that.currentChatGroup.chatGroupType;
    //   if (chatGroupType == 0) {
    //     this.$u.route({
    //       url: "/pages/weixin/redbag/redbag",
    //       params: {
    //         chatGroupId: this.currentChatGroup.id,
    //       },
    //       animationType: "slide-in-bottom",
    //     });
    //   } else {
    //     let userLevel = this.vuex_userInfo.level;
    //     if (userLevel > 0) {
    //       console.log("自定义红包值");
    //       this.$u.route({
    //         url: "/pages/weixin/redbag/custom-redbag-for-group",
    //         params: {
    //           currentChatGroup: JSON.stringify(this.currentChatGroup),
    //         },
    //         animationType: "slide-in-bottom",
    //       });
    //     } else {
    //       this.$u.route({
    //         url: "/pages/weixin/redbag/redbagForGroup",
    //         params: {
    //           currentChatGroup: JSON.stringify(this.currentChatGroup),
    //         },
    //         animationType: "slide-in-bottom",
    //       });
    //     }
    //   }
    //   return;
    // } else if (id == 6) {
    //   //console.log("转账");
    //   //this.globalUtil.utilAlert("功能尚未开放!");
    //   this.$u.route({
    //     url: "/pages/weixin/chatGroup/forwardFriendToGroup",
    //     params: {
    //       currentChatGroupId: this.currentChatGroup.id,
    //     },
    //     animationType: "slide-in-bottom",
    //   });
    //   return;
    // } else if (id == 7) {
    //   console.log("语音通话");
    //   let chatGroupType = that.currentChatGroup.chatGroupType;
    //   if (chatGroupType == 0) {
    //     that.launchSingleCalling(1);
    //     return;
    //   } else {
    //     this.globalUtil.utilAlert("功能尚未开放!");
    //     return;
    //     /* this.$u.route({
    //         url: '/pages/chattingroom/videoCalling',
    //         params: {
    //             'userId':that.vuex_userInfo.mobile+"_"+that.vuex_userInfo.id,
    //             'userSign':that.vuex_userInfo.userSign
    //         }
    //     }) */
    //   }
    // } else if (id == 8) {
    //   this.chooseFile();
    //   return;
    // } else {
    //   this.globalUtil.utilAlert("功能尚未开放!");
    //   return;
    // }
  }

  function onCloseFunc() {
    funcView.value = "";
  }

  function delSendStr() {
    if (sendStr.value.length > 0) {
      sendStr.value = sendStr.value.substring(0, sendStr.value.length - 4);
    }
  }

  return {
    from,
    sendStr,
    msgList,
    faceList,
    funcView,
    showChat,
    emojiMenuList,
    funList,
    funHeight,
    chatType,
    showFunBtn,
    showEmojiBox,
    inputFocusFlag,
    switchChatType,
    sendText,
    changeDrawer,
    changeEmojiBox,
    clickGrid,
    addEmoji,
    selectEmoji,
    delSendStr,
    onCloseFunc,
  };
};
