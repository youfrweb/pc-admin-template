<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>基础信息</span>
						</div>
					</template>
					<div class="info">
						<div class="info-image" @click="showDialog">
							<el-avatar :size="100" :src="avatarImg" />
							<span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
						</div>
						<div class="info-name">{{ userinfo.userName }}</div>
						<!-- <div class="info-desc">不可能！我的代码怎么可能会有bug！</div> -->
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>账户编辑</span>
						</div>
					</template>
					<el-form label-width="120px" :model="form" :rules="rules" ref="formRef">
						<el-form-item label="用户名："> {{ userinfo.userName }} </el-form-item>
						<el-form-item label="原始密码：" prop="originPassword">
							<el-input type="password" v-model="form.originPassword"></el-input>
						</el-form-item>
						<el-form-item label="新密码：" prop="newPassword">
							<el-input type="password" v-model="form.newPassword"></el-input>
						</el-form-item>
						<el-form-item label="确认密码：" prop="confirmPassword">
							<el-input type="password" v-model="form.confirmPassword"></el-input>
						</el-form-item>
						<!-- <el-form-item label="个人简介：">
							<el-input v-model="form.desc"></el-input>
						</el-form-item> -->
						<el-form-item>
							<el-button type="primary" @click="onSubmit(formRef)">保存</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
			<vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
				style="width: 100%; height: 400px"></vue-cropper>

			<template #footer>
				<span class="dialog-footer">
					<el-button class="crop-demo-btn" type="primary">选择图片
						<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
					</el-button>
					<el-button type="primary" @click="saveAvatar">上传并保存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="user">
import { reactive, ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import avatar from '../assets/img/img.jpg';
import { USERINFO } from '../utils/localStorageKey';
import loginApi from '../api/login';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import CryptoJS from "crypto-js";

const rules: FormRules = {
	originPassword: [
		{
			required: true,
			message: '请输入原始密码',
			trigger: 'blur'
		}
	],
	newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
	confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }]
};

const router = useRouter();
const userinfo = JSON.parse(localStorage.getItem(USERINFO) || '');
const form = reactive({
	originPassword: '',
	newPassword: '',
	confirmPassword: ''
});
const formRef = ref<FormInstance>();

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {

			ElMessageBox.confirm('修改成功会自动退出， 需要重新登录，确定要修改吗？', '提示', {
				type: 'warning'
			}).then(() => {
				loginApi.user_password({
					...form,
					originPassword: CryptoJS.SHA256(form.originPassword).toString(CryptoJS.enc.Hex),
					newPassword: CryptoJS.SHA256(form.newPassword).toString(CryptoJS.enc.Hex),
					confirmPassword: CryptoJS.SHA256(form.confirmPassword).toString(CryptoJS.enc.Hex),
					id: userinfo.id,
					account: userinfo.account
				}).then((res: any) => {
					if (res.code == 0) {
						ElMessage.success('修改成功');
						localStorage.removeItem(USERINFO);
						router.push('/login');
					}
				});
			}).catch(() => { });
		}
	});

};

const avatarImg = ref(avatar);
const imgSrc = ref('');
const cropImg = ref('');
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
	dialogVisible.value = true;
	imgSrc.value = avatarImg.value;
};

const setImage = (e: any) => {
	const file = e.target.files[0];
	if (!file.type.includes('image/')) {
		return;
	}
	const reader = new FileReader();
	reader.onload = (event: any) => {
		dialogVisible.value = true;
		imgSrc.value = event.target.result;
		cropper.value && cropper.value.replace(event.target.result);
	};
	reader.readAsDataURL(file);
};

const cropImage = () => {
	cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
	avatarImg.value = cropImg.value;
	dialogVisible.value = false;
};
</script>

<style scoped>
.info {
	text-align: center;
	padding: 45px 0;
}

.info-image {
	position: relative;
	margin: auto;
	width: 100px;
	height: 100px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}

.info-edit {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.info-edit i {
	color: #eee;
	font-size: 25px;
}

.info-image:hover .info-edit {
	opacity: 1;
}

.info-name {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}

.crop-demo-btn {
	position: relative;
}

.crop-input {
	position: absolute;
	width: 100px;
	height: 40px;
	left: 0;
	top: 0;
	opacity: 0;
	cursor: pointer;
}
</style>
