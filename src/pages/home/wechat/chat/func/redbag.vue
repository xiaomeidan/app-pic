<template>
  <view class="red-bag-page">
    <view class="u-flex u-row-between u-col-center">
      <view>
        <span class="icon icon-return" @tap="closePage" />
      </view>
      <view class="flex-1 tc"> 发红包 </view>
      <view>
        <span class="icon icon-more" />
      </view>
    </view>
    <!--    <u-navbar-->
    <!--      back-icon-name="close"-->
    <!--      :back-icon-size="36"-->
    <!--      back-icon-color="#333333"-->
    <!--      :border-bottom="false"-->
    <!--      title="发红包"-->
    <!--      ticlosePagetle-color="#000000"-->
    <!--      :title-size="36"-->
    <!--      :title-bold="true"-->
    <!--    >-->
    <!--      <view slot="right">-->
    <!--        <view class="u-m-r-20">-->
    <!--          <u-icon name="more-dot-fill" color="#333333" :size="36"></u-icon>-->
    <!--        </view>-->
    <!--      </view>-->
    <!--    </u-navbar>-->
    <!--    <u-top-tips-->
    <!--      ref="uTips"-->
    <!--      :navbar-height="statusBarHeight + navbarHeight"-->
    <!--      type="error"-->
    <!--    ></u-top-tips>-->
    <view
      class="u-m-30"
      style="
        background-color: #ffffff;
        color: #000000;
        font-size: 34rpx;
        border-radius: 10rpx;
      "
    >
      <view
        class="u-flex u-row-between u-col-center u-p-20"
        :style="redBagValue > 200 ? 'color:#fa3534' : ''"
      >
        <view>
          <text>金额</text>
        </view>
        <view>
          <u-input
            input-align="right"
            v-model="redBagValue"
            type="digit"
            border="none"
            :custom-style="{
              color: redBagValue > 200 ? '#fa3534' : '#000000',
              fontSize: '34rpx',
            }"
            placeholder="¥0.00"
            placeholder-style="color:#cccccc;font-size:34rpx;"
            :clearable="false"
          />
        </view>
      </view>
    </view>

    <view
      class="u-m-30"
      style="
        background-color: #ffffff;
        color: #000000;
        font-size: 34rpx;
        border-radius: 10rpx;
      "
    >
      <view
        class="u-flex u-row-between u-col-center"
        style="width: 100%; padding: 30rpx 20rpx"
      >
        <view>
          <u-input
            input-align="left"
            v-model="redBagRemark"
            type="text"
            border="none"
            :custom-style="{ color: '#000000', fontSize: '34rpx' }"
            placeholder="恭喜发财,大吉大利"
            placeholder-style="color:#c0c0c0;font-size:34rpx;"
            :clearable="false"
          />
        </view>
        <view>
          <u-icon
            name="/static/image/weixin/biaoqingadd.png"
            size="48"
            label-color="#515151"
            label="+"
            label-pos="right"
            margin-left="0"
          ></u-icon>
        </view>
      </view>
    </view>

    <view
      class="u-m-30"
      style="
        background-color: #ffffff;
        color: #000000;
        font-size: 34rpx;
        border-radius: 10rpx;
      "
    >
      <view
        class="u-flex u-row-between u-col-center"
        style="width: 100%; padding: 30rpx 20rpx"
      >
        <view>
          <text>红包封面</text>
        </view>
        <view>
          <u-icon color="#ccc" name="arrow-right"></u-icon>
        </view>
      </view>
    </view>

    <view
      :style="
        redBagValue > 200
          ? 'color:#fa3534;text-align: center;margin-top: 120rpx;'
          : 'text-align: center;margin-top: 120rpx;'
      "
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

    <view class="u-flex u-row-center u-col-center u-m-t-30">
      <view
        @tap="addRedbag"
        style="
          font-size: 36rpx;
          background-color: #fc5531;
          color: #ffffff;
          border-radius: 16rpx;
          text-align: center;
          padding: 26rpx 100rpx;
        "
        >塞钱进红包</view
      >
    </view>

    <view
      style="position: absolute; bottom: 10rpx; width: 100%; text-align: center"
    >
      可直接使用收到的零钱发红包
    </view>
  </view>
</template>

<script lang="ts" setup>
import useMessageStore from "@/stores/message";

const props = defineProps<{
  isMe: boolean;
}>();
const emits = defineEmits(["close"]);

const messageStore = useMessageStore();
const redBagValue = ref("");
const redBagRemark = ref("");
// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
// 导航栏内容区域高度，不包括状态栏高度在内
const navbarHeight = 44;

// onLoad((option) => {
//   isFromMe.value = option.isMe;
// });

function closePage() {
  emits("close");
}

function addRedbag() {
  let msg = {
    meFlag: props.isMe,
    userName: "me",
    userAvatar: "",
    msgType: 1, //信息类型0:系统信息   1表示用户信息
    contentType: "redpocket", //信息内容类型   1-文本 2-图片 3-视频  4-语音信息 5-文件 6-其他
    content: {
      receiveAllFlag: false,
      isReceive: false,
      redBagRemark: redBagRemark.value,
    },
  };
  messageStore.addMsg(msg);
  emits("close");
}
function valueFormat() {
  if (redBagValue.value.length < 1) {
    return "0.00";
  }
  if (redBagValue.value.toString().indexOf(".") == -1) {
    return redBagValue.value + ".00";
  } else {
    return redBagValue.value;
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
