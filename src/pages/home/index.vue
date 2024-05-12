<template>
  <view class="page-content">
    <view>
      <scroll-view class="scroll-view_H" scroll-x="true" scroll-left="120">
        <button
				  v-for="btn of btnList"
				  :key="btn.id"
					:class="['menu-btn', { 'menu-btn__active': current === btn.id }]"
					@click="setCurrent(btn.id)"
				>
					<span :class="['icon', btn.icon, 'menu-btn-icon']" />
				</button>
      </scroll-view>
    </view>  
		<button
			v-for="btn of menuList"
			:key="btn.id"
			:class="['item-btn']"
			@click="gotoPage(btn.path)"
		>
			<span :class="['icon', btn.icon]" />
			{{ btn.name }}
		</button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const current = ref('wechat');
const btnList = [
  { id: 'wechat', name: '微信', icon: 'icon-wechat-fill' },
  { id: 'alipay', name: '支付宝', icon: 'icon-alipay-circle-fill' }
];
const wechatMenu = [
	{ id: 'chat', name: '聊天生成', icon: 'icon-message', path: '/pages/home/wechat/chat' },
	{ id: 'chat1', name: '聊天生成1', icon: 'icon-message', path: '' },
	{ id: 'chat2', name: '聊天生成2', icon: 'icon-message', path: '' },
];
const menuMap = {
	wechat: wechatMenu,
	alipay: []
};
const menuList = computed(() => menuMap[current.value]);

function setCurrent(menuId: string) {
	current.value = menuId;
}
function gotoPage(path: string) {
	uni.navigateTo({ url: path })
}
</script>

<style>
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}
	.scroll-view-item {
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}
	.scroll-view-item_H {
		display: inline-block;
		width: 100%;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menu-btn {
	border: none;
  margin: 10rpx;
	display: inline-block;
	line-height: 75rpx;
}

.menu-btn__active {
  background-color: #409eff;
}

.menu-btn__active .icon:before {
	color: white;
}
.menu-btn-icon {
	font-size: 60rpx;
	line-height: 90rpx;
}

.item-btn {
	display: inline-block;
	margin:10rpx;
	width: 45%;
	line-height: 90rpx;
}
.item-btn .icon {
	font-size: 60rpx;
	line-height: 90rpx;
}
</style>
