<template>
  <view class="">
    <view class="u-flex u-row-between u-col-center">
      <view>
        <span class="icon icon-return" @tap="closePage" />
      </view>
    </view>
    <view class="u-flex-y-center">
      <view>
        <view> 转账给 文件传输助手（**皓） </view>
        <view> 微信皓： YWH-8-8 </view>
      </view>
      <view>
        <u-image
          :src="getAvatar(props.isMe)"
          :width="40"
          :height="40"
          :border-radius="4"
          :lazy-load="true"
        >
          <view slot="error">
            <u-icon name="chat-fill" color="#19be6b" size="64"></u-icon>
          </view>
        </u-image>
      </view>
    </view>

    <view
      style="text-align: center; margin-top: 120rpx"
      class="u-flex u-row-center u-col-center"
    >
      <view
        style="
          font-size: 36px;
          margin-right: 10rpx;
          font-weight: 500;
          margin-bottom: 10rpx;
        "
        >¥</view
      >
      <view style="font-size: 50px; font-weight: 400">{{ valueFormat() }}</view>
    </view>
    <view>
      {{ transferRemark }}
      <span @tap="openRemark">
        {{ transferRemark ? "修改" : "添加转账说明" }}
      </span>
    </view>

    <view class="u-flex u-row-center u-col-center u-m-t-30">
      <view
        @tap="addTransfer"
        style="
          font-size: 36rpx;
          background-color: #fc5531;
          color: #ffffff;
          border-radius: 16rpx;
          text-align: center;
          padding: 26rpx 100rpx;
        "
        >转账</view
      >
    </view>
    <up-popup
      :show="showRemark"
      mode="bottom"
      :closeOnClickOverlay="true"
      @close="onCloseRemark"
    >
      <u-input
        type="textarea"
        v-model="remark"
        placeholder="收付款双方可见，最多60个字"
        :maxlength="60"
        showWordLimit
      />
      <u-button
        type="primary"
        :plain="true"
        text="取消"
        @tap="onCloseRemark"
      ></u-button>
      <u-button type="primary" text="确定" @tap="submitRemark"></u-button>
    </up-popup>
  </view>
</template>

<script lang="ts" setup>
import useMessageStore from "@/stores/message";
import useAvatar from "@/pages/home/wechat/chat/useAvatar";

const props = defineProps<{
  isMe: boolean;
}>();
const emits = defineEmits(["close"]);

const messageStore = useMessageStore();
const showRemark = ref(false);
const remark = ref("");
const transferValue = ref("");
const transferRemark = ref("");
// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
// 导航栏内容区域高度，不包括状态栏高度在内
const navbarHeight = 44;

// onLoad((option) => {
//   isFromMe.value = option.isMe;
// });

const { getAvatar } = useAvatar();

function openRemark() {
  remark.value = transferRemark.value;
  showRemark.value = true;
}
function submitRemark() {
  transferRemark.value = remark.value;
  showRemark.value = false;
}
function onCloseRemark() {
  remark.value = "";
  showRemark.value = false;
}

function closePage() {
  emits("close");
}

function addTransfer() {
  let msg = {
    meFlag: props.isMe,
    userName: "me",
    userAvatar: "",
    msgType: 1, //信息类型0:系统信息   1表示用户信息
    contentType: "transfer", //信息内容类型   1-文本 2-图片 3-视频  4-语音信息 5-文件 6-其他
    content: {
      receiveAllFlag: false,
      isReceive: false,
      transferRemark: transferRemark.value,
      transferAmount: transferValue.value,
    },
  };
  messageStore.addMsg(msg);
  emits("close");
}
function valueFormat() {
  if (transferValue.value.length < 1) {
    return "0.00";
  }
  if (transferValue.value.toString().indexOf(".") == -1) {
    return transferValue.value + ".00";
  } else {
    return transferValue.value;
  }
}
</script>

<style lang="scss" scoped>
.red-bag-page {
  background-color: #f1f1f1;
}
</style>
<style>
page {
  background-color: #f1f1f1;
}
</style>
