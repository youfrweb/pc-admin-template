<!--
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-12-01 12:07:49
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-01 16:46:18
-->
<template>
	<div>
		<!-- 新增项目弹框 -->
		<el-dialog :title="projectInfo?.projectName + (settingData?.env || '') + '服务配置'" v-model="editVisible" width="750px">
			<el-descriptions v-if="settingData?.env" :column="1" border>
				<el-descriptions-item label="项目名称">{{ projectInfo.projectName }}</el-descriptions-item>
				<el-descriptions-item label="环境">
					<el-tag>{{ settingData.env }}</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="项目部署根路径">{{ settingData.deployPath }}</el-descriptions-item>
				<el-descriptions-item label="服务器ip">{{ settingData.ip }}</el-descriptions-item>
				<el-descriptions-item label="服务器账号">{{ settingData.account }}</el-descriptions-item>
				<el-descriptions-item label="创建人">{{ settingData.createUserName }}</el-descriptions-item>
				<el-descriptions-item label="创建时间">{{ settingData.createTime }}</el-descriptions-item>
			</el-descriptions>

			<div v-else>
				<el-form :model="formValue" :rules="rules" ref="formRef" :inline="false" label-position="top">
					<div>
						<el-form-item label="服务器账号:" prop="account">
							<el-input v-model="formValue.account" placeholder="请输入服务器账号" maxlength="50" />
						</el-form-item>
						<el-form-item label="项目部署根路径:" prop="deployPath">
							<el-input v-model="formValue.deployPath" placeholder="请输入项目部署根路径" maxlength="50" />
						</el-form-item>
						<el-form-item label="服务器ip:" prop="ip">
							<el-input v-model="formValue.ip" placeholder="请输入服务器ip" maxlength="50" />
						</el-form-item>
					</div>
				</el-form>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button v-if="!settingData?.env" type="primary" @click="submitAdd(formRef)">新 增</el-button>
					<el-button v-else type="warning" @click="submitDel">删 除</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import deployApi from '../../api/deploy';

const formValue: any = reactive({
	account: '',
	deployPath: '',
	ip: ''
});

interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}

const emits = defineEmits(['refresh'])
const formRef = ref<FormInstance>();
const editVisible = ref(false);
const projectInfo = ref()
const env = ref()
const settingData = ref()

const rules = {
	account: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
	deployPath: [{ required: true, message: "请输入项目部署根路径", trigger: "blur" }],
	ip: [{ required: true, message: "请输入服务器ip", trigger: "blur" }],
};
const showDialog = (data: number, e: string) => {
	projectInfo.value = data
	env.value = e
	editVisible.value = true
	deployApi.publish_server_rel_list({
		projectId: projectInfo.value.id,
		env: env.value
	}).then((res: any) => {
		if (res.code == 0) {
			console.log(44444, res);
			settingData.value = res.result[0]
		}
	}).catch((err: any) => {
		console.log(err);
	})
}

const submitAdd = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			deployApi.project_server_rel_submit({
				...formValue,
				projectId: projectInfo.value.id,
				env: env.value
			}).then((res: any) => {
				if (res.code == 0) {
					ElMessage.success('配置添加成功');
					editVisible.value = false;
					emits('refresh')
				}
			}).catch((err: any) => {
				console.log(err);
			})
		}
	});
};

const submitDel = (formEl: FormInstance | undefined) => {
	// 二次确认删除
	ElMessageBox.confirm('确定删除配置吗？', '提示', {
		type: 'warning'
	}).then(() => {
		deployApi.project_server_rel_rel(settingData.value.id).then((res: any) => {
			if (res.code == 0) {
				ElMessage.success('配置删除成功');
				editVisible.value = false;
				emits('refresh')
			}
		}).catch((err: any) => {
			console.log(err);
		})
	}).catch(() => { });
};

defineExpose({
	showDialog
})
</script>

<style scoped>
:deep(.is-bordered-label) {
	width: 200px
}
</style>
