<template>
  <view>
    <span
      :class="[
        'float-btn float-btn__left',
        { 'float-btn__active': from === 'left' },
      ]"
      @click="setFrom('left')"
    >
      左
    </span>
    <span
      :class="[
        'float-btn float-btn__right',
        { 'float-btn__active': from === 'right' },
      ]"
      @click="setFrom('right')"
    >
      右
    </span>
    <phone-header />
    <view class="header-wechat">
      <view>
        <span class="icon icon-return" />
      </view>
      <view class="flex-1 tc"
        >{{ keyboardHeight }}文件传输助手{{ settingHeight }}</view
      >
      <view>
        <span class="icon icon-more" />
      </view>
    </view>
    <view class="content">
      <scroll-view scroll-y="true" :style="{ height: `${contentHeight}px` }">
        <view
          v-for="msg in msgList"
          :key="msg.id"
          :class="['msg-item', { 'msg-item__right': msg.dir === 'right' }]"
        >
          <img
            class="msg-item-avatar"
            :src="getAvatar(msg.dir)"
            @click="openAvatar(msg.dir)"
          />
          <chat-item :item="msg" />
        </view>
      </scroll-view>
    </view>
    <view class="footer">
      <view>
        <span class="icon icon-voice-circle" />
      </view>
      <!--			<view class="flex-1"><up-textarea v-model="text" autoHeight @confirm="send"></up-textarea></view>-->
      <view class="flex-1">
        <input class="msg" v-model="text" @confirm="send" />
      </view>
      <view>
        <span class="icon icon-emoji mr4" @click="inputEmoji" />
        <span class="icon icon-addition" />
      </view>
    </view>
    <!--      <view :style="{ height: `${settingHeight}px` }"-->
    <!--        >avatar{{ settingHeight }}</view-->
    <!--      >-->
    <up-action-sheet
      :show="showSelectAvatar"
      :actions="avatarOpt"
      :closeOnClickOverlay="true"
      :closeOnClickAction="true"
      @select="selectAvatarOpt"
      @close="onCloseSelectAvatar"
    />
    <up-popup
      :show="showAvatarList"
      mode="bottom"
      :closeOnClickOverlay="true"
      @close="onCLoseAvatarList"
    >
      <avatar-list @select="onSelectLocalAvatar" />
    </up-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import unknownAvatar from "/static/image/unknown.png";
import ChatItem from "@/pages/home/wechat/chat/item.vue";
import PhoneHeader from "@/components/phoneHeader.vue";
import AvatarList from "@/pages/home/wechat/chat/avatarList.vue";

const from = ref("left");
const text = ref("");
const settingHeight = ref(0);
const deviceHeight = ref(0);
const keyboardHeight = ref(0);

const msgList = ref([
  { id: 1, type: "msg", dir: "left", data: "消息1" },
  { id: 2, type: "msg", dir: "right", data: "消息2" },
  { id: 3, type: "msg", dir: "left", data: "消息1" },
  { id: 4, type: "msg", dir: "left", data: "消息1" },
  { id: 5, type: "msg", dir: "left", data: "消息1" },
  { id: 6, type: "msg", dir: "left", data: "消息1" },
  { id: 7, type: "msg", dir: "left", data: "消息1" },
  { id: 8, type: "msg", dir: "left", data: "消息1" },
  { id: 9, type: "msg", dir: "left", data: "消息1" },
  { id: 10, type: "msg", dir: "left", data: "消息1" },
  { id: 11, type: "msg", dir: "left", data: "消息1" },
  { id: 12, type: "msg", dir: "left", data: "消息1" },
  { id: 13, type: "msg", dir: "left", data: "消息1" },
  { id: 14, type: "msg", dir: "left", data: "消息1" },
  { id: 15, type: "msg", dir: "left", data: "消息1" },
]);

const contentHeight = computed(
  () =>
    deviceHeight.value -
    keyboardHeight.value - // 键盘高度
    20 - // content padding
    21 - // phone header
    64 - // weixin header
    70 - // weixin input
    settingHeight.value, // weixin setting height
);

const {
  avatarOpt,
  showSelectAvatar,
  showAvatarList,
  openAvatar,
  getAvatar,
  selectAvatarOpt,
  onSelectLocalAvatar,
  onCloseSelectAvatar,
  onCLoseAvatarList,
} = useAvatar();

onLoad(() => {
  uni.getSystemInfo({
    success: function (info) {
      deviceHeight.value = info.windowHeight;
    },
  });
  uni.onKeyboardHeightChange((res) => {
    // if (res.height) {
    keyboardHeight.value = res.height;
    // }
  });
});

function inputEmoji() {
  setSettingHeight(60);
}

function setSettingHeight(height: number) {
  settingHeight.value = height;
}

function setFrom(val: string) {
  from.value = val;
}

function send() {
  console.log("send ", text.value);
  msgList.value.push({
    id: msgList.value.length + 1,
    type: "msg",
    dir: from.value,
    data: text.value,
  });
  text.value = "";
}

// 头像相关操作
function useAvatar() {
  let currentEditAvatar = "";
  const avatarOpt = [
    { id: "official", name: "官方头像" },
    { id: "local", name: "本地图片" },
  ];
  const showSelectAvatar = ref(false);
  const showAvatarList = ref(false);
  const leftAvatar = ref("");
  const rightAvatar = ref("");

  function getAvatar(direction: string) {
    const avatar = direction === "left" ? leftAvatar.value : rightAvatar.value;
    return avatar || unknownAvatar;
  }

  function openAvatar(direction: string) {
    currentEditAvatar = direction;
    showSelectAvatar.value = true;
  }

  function onCloseSelectAvatar() {
    showSelectAvatar.value = false;
  }

  function onCLoseAvatarList() {
    showAvatarList.value = false;
  }

  function selectAvatarOpt(opt: { id: string }) {
    onCloseSelectAvatar();
    console.log("select avatar ", opt);
    if (opt.id === "official") {
      showAvatarList.value = true;
      return;
    }
    uni.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        // self.src = res.tempFilePath;
      },
    });
  }

  function onSelectLocalAvatar(url: string) {
    console.log("already select ", url);
    if (currentEditAvatar === "left") {
      leftAvatar.value = url;
    } else {
      rightAvatar.value = url;
    }
    showAvatarList.value = false;
  }

  return {
    avatarOpt,
    leftAvatar,
    rightAvatar,
    showSelectAvatar,
    showAvatarList,
    openAvatar,
    getAvatar,
    selectAvatarOpt,
    onSelectLocalAvatar,
    onCloseSelectAvatar,
    onCLoseAvatarList,
  };
}
</script>

<style>
page {
  height: 100%;
}
</style>

<style scoped lang="scss">
.flex-1 {
  flex: 1;
}
.tc {
  text-align: center;
}
.mr4 {
  margin-right: 4px;
}
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.box {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  padding: 10px;
}
.header-wechat,
.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.header-wechat {
  padding: 8px;
  font-size: 16px;
  background-color: pink;
}
.footer {
  padding: 8px 16px 24px 16px;
  background-color: pink;
}
.msg {
  border-radius: 2px;
  margin: 0 8px;
  padding: 8px;
  background-color: white;
  font-size: 16px;
  line-height: 30px;
}
.icon {
  font-size: 30px;
}
.msg-item {
  width: 100%;
  margin-top: 8px;
  display: flex;
}
.msg-item__right {
  flex-direction: row-reverse;
}
.msg-item-avatar {
  width: 40px;
  height: 40px;
  margin: 0 10px;
}
.float-btn {
  z-index: 2;
  position: fixed;
  bottom: 300px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  line-height: 28px;
  border-radius: 50%;
  text-align: center;
  border: 1px solid $uni-bg-color-grey;
  background-color: white;
}
.float-btn__left {
  left: 0;
}
.float-btn__right {
  right: 0;
}
.float-btn__active {
  color: white;
  background-color: $uni-color-primary;
}
</style>
