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
    <view v-show="showChat">
      <view class="header-wechat">
        <view>
          <span class="icon icon-return" />
        </view>
        <view class="flex-1 tc">
          {{ contentHeight }}_{{ keyboardHeight }}文件传输助手{{
            settingHeight
          }}
        </view>
        <view>
          <span class="icon icon-more" />
        </view>
      </view>

      <!-- 信息盒子 -->
      <view class="msg-container" v-show="msgList.length > 0">
        <scroll-view
          :scroll-y="true"
          class="msg-box-scroller"
          :style="`height: ${contentHeight}px`"
          @touchstart="hideDrawer"
        >
          <view
            class="message"
            v-for="(item, index) in msgList"
            :key="index"
            :id="'msg_' + item.id"
          >
            <!-- 系统信息 -->
            <!-- &&JSON.parse(item.content).optionType!=-2 加上这个判断以后撤回提醒信息就看不到了 -->
            <view v-if="item.msgType == 2" class="sys-msg-box">
              <!-- item.createTime.substring(10,16) -->
              <view style="text-align: center; color: #909399">
                {{ item.content }}
              </view>
            </view>
            <!-- 用户名 -->
            <view
              v-if="item.msgType === 1"
              :class="['message-item', item.meFlag ? 'right' : 'left']"
            >
              <!-- 用户头像 -->
              <!--
              style="
                currentChatGroup.chatGroupType != 0
                  ? 'position: relative;top: -16rpx;'
                  : ''
              "-->
              <u-image
                style="position: relative; top: -16rpx"
                :src="getAvatar(item.meFlag)"
                :width="40"
                :height="40"
                :border-radius="4"
                :lazy-load="true"
                @tap="openAvatar(`${item.meFlag ? 'right' : 'left'}`)"
              >
                <view slot="error">
                  <u-icon name="chat-fill" color="#19be6b" size="64"></u-icon>
                </view>
                <!--              <u-loading slot="loading"></u-loading>-->
              </u-image>
              <!-- contentType = 1 文本信息 -->
              <chat-item :item="item" />
              <!--  图片信息 -->
              <!-- 视频信息 -->
              <!-- 语音信息   -->
              <!-- 文件信息 -->
              <!-- 个人名片信息 -->
              <!-- 位置信息 -->
              <!-- 红包信息 -->
              <!-- 折叠的聊天记录信息 -->
              <!-- 图文或者视频文字 -->
              <!--音视频通话结果-->
            </view>
          </view>
        </scroll-view>
      </view>
      <!--    <view class="content-box1">-->
      <!--      <scroll-view scroll-y="true" :style="{ height: `${contentHeight}px` }">-->
      <!--        <view-->
      <!--          v-for="msg in msgList"-->
      <!--          :key="msg.id"-->
      <!--          :class="['msg-item', { 'msg-item__right': msg.dir === 'right' }]"-->
      <!--        >-->
      <!--          <img-->
      <!--            class="msg-item-avatar"-->
      <!--            :src="getAvatar(msg.dir)"-->
      <!--            @click="openAvatar(msg.dir)"-->
      <!--          />-->
      <!--          <chat-item :item="msg" />-->
      <!--        </view>-->
      <!--      </scroll-view>-->
      <!--    </view>-->

      <!--   底部模块盒子 -->
      <view class="content">
        <view class="input-box">
          <view class="input-box-flex">
            <view>
              <picker
                @change="addVoice"
                :value="durationIndex"
                :range="durationList"
              >
                <span class="icon icon-voice-circle" />
              </picker>
              <!--              <span-->
              <!--                v-if="chatType === 'voice'"-->
              <!--                class="icon icon-voice-circle"-->
              <!--                @click="openShowVoice"-->
              <!--              />-->
              <!--              <span-->
              <!--                class="icon icon-message"-->
              <!--                @click="switchChatType('voice')"-->
              <!--              />-->
            </view>
            <view class="input-box-flex-grow">
              <view class="textArea-box">
                <!--      <view class="textArea-box" v-if="chatType === 'voice'">-->
                <!--            <view-->
                <!--              v-if="fileRemarkObj.showFlag == true && fileRemarkObj.fileInfo"-->
                <!--              style="width: 100rpx; font-size: 28rpx; color: #fa3534"-->
                <!--            >-->
                <!--              <text>[{{ fileRemarkObj.tag }}]</text>-->
                <!--            </view>-->

                <scroll-view
                  :scroll-y="true"
                  :scroll-x="false"
                  class="inputScroll"
                  :show-scrollbar="true"
                >
                  <textarea
                    style="text-indent: 5upx"
                    auto-height="true"
                    placeholder-style="color:#DDDDDD;"
                    :cursor-spacing="10"
                    :confirm-hold="true"
                    confirm-type="send"
                    :show-confirm-bar="false"
                    :focus="inputFocusFlag"
                    :auto-focus="false"
                    :hold-keyboard="true"
                    @confirm="sendText"
                    v-model="sendStr"
                    :cursor="sendStr.length"
                    :maxlength="-1"
                  />
                </scroll-view>
              </view>

              <!--          <view-->
              <!--            class="voice_title"-->
              <!--            v-if="chatType === 'keyboard'"-->
              <!--            @touchstart.stop.prevent="startVoice"-->
              <!--            @touchmove.stop.prevent="moveVoice"-->
              <!--            @touchend.stop="endVoice"-->
              <!--            @touchcancel.stop="cancelVoice"-->
              <!--            :style="{ background: recording ? '#c7c6c6' : '#FFFFFF' }"-->
              <!--          >-->
              <!--            {{ voiceTitle }}-->
              <!--          </view>-->
            </view>
            <!-- 功能性按钮 -->
            <view>
              <span class="icon icon-emoji mr4" @click="changeEmojiBox" />
              <!--          <image-->
              <!--            class="icon_btn_add"-->
              <!--            :src="require('@/static/emoji.png')"-->
              <!--            @click="changeEmojiBox"-->
              <!--          >-->
              <!--          </image>-->
            </view>
            <view>
              <span class="icon icon-addition" @click="changeDrawer" />
              <!--          <image-->
              <!--            class="icon_btn_add"-->
              <!--            :src="require('@/static/add.png')"-->
              <!--            @click="changeDrawer"-->
              <!--          ></image>-->
            </view>
          </view>

          <view
            class="fun-box u-border-top"
            :class="{ 'show-fun-box': showFunBtn }"
          >
            <swiper indicator-dots="true" duration="150">
              <swiper-item v-for="(partFunList, pid) in funList" :key="pid">
                <u-grid
                  :col="4"
                  hover-class="contentType2-hover-class"
                  :border="false"
                >
                  <u-grid-item
                    v-for="(item, index) in partFunList"
                    :index="index"
                    :key="index"
                    :custom-style="{ padding: '20rpx 0' }"
                    bg-color="#f8f8f8"
                  >
                    <view
                      class="u-flex u-row-center u-col-center"
                      style="
                        background-color: #ffffff;
                        width: 110rpx;
                        height: 110rpx;
                        border-radius: 30rpx;
                      "
                      @click="clickGrid(item)"
                    >
                      <!--                <span :class="['icon f60', item.icon]" />-->
                      <u-icon :name="item.icon" :size="60"></u-icon>
                    </view>
                    <view class="grid-text" style="font-size: 24rpx">
                      {{ item.title }}
                    </view>
                  </u-grid-item>
                </u-grid>
              </swiper-item>
            </swiper>
          </view>
          <view
            class="fun-box u-border-top"
            :class="{ 'show-fun-box': showEmojiBox }"
          >
            <emoji-list @emoji="addEmoji" @select="selectEmoji" />
            <view
              v-if="showEmojiBox"
              style="
                padding: 0rpx 20rpx;
                position: absolute;
                bottom: 1rpx;
                right: 10rpx;
                width: 250rpx;
                height: 150rpx;
                z-index: 1000;
                opacity: 0.9;
              "
              class="u-flex u-row-right u-col-center"
            >
              <view
                class="u-flex u-row-center u-col-center"
                style="
                  border: 1px solid #f1f1f1;
                  border-radius: 10rpx;
                  background-color: #82848a;
                  width: 100rpx;
                  padding: 15rpx 20rpx;
                  margin-right: 8rpx;
                "
              >
                <view @click="delSendStr()">
                  <u-icon name="backspace" size="46" color="#ffffff"></u-icon>
                </view>
              </view>
              <view>
                <u-button
                  @click="sendText"
                  type="success"
                  :custom-style="{ padding: '20rpx' }"
                >
                  发送
                </u-button>
              </view>
            </view>
          </view>
          <!-- 头像选择 -->
          <up-action-sheet
            :show="showSelectAvatar"
            :actions="avatarOpt"
            :closeOnClickOverlay="true"
            :closeOnClickAction="true"
            @select="selectAvatarOpt"
            @close="onCloseSelectAvatar"
          />
          <view
            class="fun-box u-border-top"
            :class="{ 'show-fun-box': showAvatarList }"
          >
            <avatar-list @select="onSelectLocalAvatar" />
          </view>
          <!-- 语音发射 -->
          <!--          <picker-->
          <!--            @change="addVoice"-->
          <!--            :value="durationIndex"-->
          <!--            :range="durationList"-->
          <!--          >-->
          <!--            <view class="uni-input">{{ durationList[durationIndex] }}</view>-->
          <!--          </picker>-->
          <!--          <up-action-sheet-->
          <!--            :show="showVoice"-->
          <!--            :actions="voiceList"-->
          <!--            :closeOnClickOverlay="true"-->
          <!--            :closeOnClickAction="true"-->
          <!--            @select="addVoice"-->
          <!--            @close="closeShowVoice"-->
          <!--          />-->
        </view>
      </view>
    </view>
    <func
      v-if="funcView"
      :view="funcView"
      :is-me="from === 'right'"
      @close="onCloseFunView"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import useVoice from "@/pages/home/wechat/chat/useVoice";
import useAvatar from "@/pages/home/wechat/chat/useAvatar";
import useChat from "@/pages/home/wechat/chat/useChat";
import Func from "@/pages/home/wechat/chat/func.vue";
import ChatItem from "@/pages/home/wechat/chat/item.vue";
import PhoneHeader from "@/components/phoneHeader.vue";
import AvatarList from "@/pages/home/wechat/chat/avatarList.vue";
import EmojiList from "@/pages/home/wechat/chat/emojiList.vue";

const text = ref("");
const settingHeight = ref(0);
const deviceHeight = ref(0);
const keyboardHeight = ref(0);

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

const {
  from,
  sendStr,
  msgList,
  funList,
  funHeight,
  funcView,
  showChat,
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
} = useChat();

const isMe = computed(() => from.value === "right");
const { durationIndex, durationList, addVoice } = useVoice(isMe);

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

function onCloseFunView() {
  onCloseFunc();
  hideDrawer();
}

function setSettingHeight(height: number) {
  settingHeight.value = height;
}

function hideDrawer() {
  // this.toolTipFlag = false;
  if (showFunBtn.value == true) {
    uni.hideKeyboard();
    showFunBtn.value = false;
    settingHeight.value = 0;
    // this.scrollViewHeight = this.$u.sys().windowHeight - 150;
  }
  if (showEmojiBox.value == true) {
    uni.hideKeyboard();
    showEmojiBox.value = false;
    settingHeight.value = 0;
    // this.scrollViewHeight = this.$u.sys().windowHeight - 150;
  }
  if (showAvatarList.value == true) {
    showAvatarList.value = false;
    settingHeight.value = 0;
  }
}

function setFrom(val: string) {
  from.value = val;
}
</script>

<style>
page {
  height: 100%;
}
</style>

<style lang="scss">
@import "./chat/chat.scss";
@import "./chat/content.scss";
</style>
<style scoped lang="scss">
.flex-1 {
  flex: 1;
}
.f60 {
  font-size: 60px;
}
.tc {
  text-align: center;
}
.mr4 {
  margin-right: 4px;
}

.content-box1 {
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

.textArea-box {
  width: 100%;
  background-color: #ffffff;
  border-radius: 10upx;
  //padding-left: 30upx;
  min-height: 70upx;
  display: flex;
  align-items: center;

  textarea {
    width: 100%;
  }
}

.inputScroll {
  max-height: 180upx;
}

.bongfang {
  background-color: transparent;
}

.showRedPopScrollView {
  //border: 1px solid red;
  ::-webkit-scrollbar {
    display: none;
    height: 0;
    width: 0;
  }
}
.red-pop-head {
  //border: 1px solid black;
  width: 750rpx;
  height: 280rpx;
  //background-image: url("/static/image/chat/red-bg-1.png");
  background-repeat: no-repeat;
  background-size: 100%;
  padding-top: 88rpx;
}
</style>
