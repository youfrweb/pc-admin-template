<template>
	<div class="header">
		<!-- 折叠按钮 -->
		<div class="collapse-btn" @click="collapseChage">
			<el-icon v-if="sidebar.collapse">
				<Expand />
			</el-icon>
			<el-icon v-else>
				<Fold />
			</el-icon>
		</div>
		<div class="logo">中烟项目工具箱</div>
		<div class="header-right">
			<div class="header-user-con">
				<!-- 消息中心 -->
				<!-- <div class="btn-bell" @click="router.push('/tabs')">
					<el-tooltip
						effect="dark"
						:content="message ? `有${message}条未读消息` : `消息中心`"
						placement="bottom"
					>
						<i class="el-icon-lx-notice"></i>
					</el-tooltip>
					<span class="btn-bell-badge" v-if="message"></span>
				</div> -->
				<!-- <div>
					<button @click="grantedPermission">弹出消息</button>
				</div> -->
				<!-- 用户头像 -->
				<el-avatar class="user-avator" :size="30" :src="imgurl" />
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ userinfo.userName }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<!-- <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
								<el-dropdown-item>项目仓库</el-dropdown-item>
							</a> -->
							<el-dropdown-item command="user">个人中心</el-dropdown-item>
							<el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRouter } from 'vue-router';
import imgurl from '../assets/img/img.jpg';
import { USERINFO } from '../utils/localStorageKey';
import intervalWorker from "@/utils/worker";
// import Push from "push.js";
// 新建worker
const workerInstance = new Worker(intervalWorker);

workerInstance.onmessage = () => {
	// 在 worker通知后执行函数
	// fetchList();
	console.log('1s以后');

};

onBeforeUnmount(() => {
	// 在组件卸载后关闭
	workerInstance.terminate();
});

const userinfo = JSON.parse(localStorage.getItem(USERINFO) || '');
const message: number = 2;

const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChage = () => {
	sidebar.handleCollapse();
};

onMounted(() => {
	if (document.body.clientWidth < 1500) {
		collapseChage();
	}

	// Push.Permission.request();

	// 判断浏览器是否支持Notification
	// if (window.Notification) {

	// 	switch (Notification.permission) {
	// 		case 'default':
	// 			defaultPermission();
	// 			break;
	// 		case 'granted':
	// 			// grantedPermission();
	// 			break;
	// 		case 'denied':
	// 			alert('用户拒绝该网站消息通知');
	// 			break;
	// 	}
	// } else {
	// 	alert('暂不支持消息通知');
	// }
});

/**
 * [defaultPermission 当用户拒绝消息通知时，可以询问用户是否开启消息通知]
 * @version  [1.0]
 */
function defaultPermission() {
	Notification.requestPermission().then(permission => {
		switch (permission) {
			case 'default':
				break;
			case 'granted':
				// grantedPermission();
				break;
			case 'denied':
				alert('用户还是拒绝了该网站消息通知');
				break;
		}
	});
}
/**
 * [grantedPermission 运行消息通知状态，可以向发起消息通知]
 */
function grantedPermission() {
	// Push.create('Hello World!', {
	// 	onClick: function () {
	// 		// 当通知被点击时执行的操作
	// 	},
	// 	onClose: function () {
	// 		// 当通知被关闭时执行的操作
	// 	}
	// });


	// const title = '异常监控消息通知';
	// const options: any = {
	// 	body: '消息的主要内容',
	// 	dir: 'auto',
	// 	icon: '/favicon.ico'
	// };
	// const notification = new Notification(title, options);
	// notification.onclick = e => {
	// 	// alert(1);
	// }
	// notification.onclose = e => {
	// 	// alert(2);
	// }
	// notification.onshow = e => {
	// 	console.log('show');

	// 	// alert(3);
	// }
	// notification.onerror = e => {
	// 	// alert(4);
	// }
}

// 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command: string) => {
	if (command == 'loginout') {
		localStorage.removeItem(USERINFO);
		router.push('/login');
	} else if (command == 'user') {
		router.push('/user');
	}
};
</script>
<style scoped>
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 22px;
	color: #fff;
}

.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
}

.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
}

.header-right {
	float: right;
	padding-right: 50px;
}

.header-user-con {
	display: flex;
	height: 70px;
	align-items: center;
}

.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}

.btn-bell .el-icon-lx-notice {
	color: #fff;
}

.user-name {
	margin-left: 10px;
}

.user-avator {
	margin-left: 20px;
}

.el-dropdown-link {
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.el-dropdown-menu__item {
	text-align: center;
}
</style>
