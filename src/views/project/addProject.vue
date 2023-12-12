<!--
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-12-01 12:07:49
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-01 15:32:19
-->
<template>
	<div>
		<!-- 新增项目弹框 -->
		<el-dialog title="新增项目" v-model="editVisible" width="750px">
			<el-form :model="formValue" :rules="rules" ref="formRef" class="demo-ruleForm"
				:inline="false" label-position="top">
				<div>
					<el-form-item label="项目名称:" prop="projectName">
						<el-input v-model="formValue.projectName" placeholder="请输入项目名称" maxlength="50" />
					</el-form-item>
					<el-form-item label="项目简称/字母标识:" prop="sampleName">
						<el-input v-model="formValue.sampleName" placeholder="请输入项目简称/字母标识" maxlength="50" />
					</el-form-item>
					<el-form-item label="服务类型:" prop="serverType">
						<el-radio-group v-model="formValue.serverType" class="ml-4">
							<el-radio label="web" size="large">前端</el-radio>
							<el-radio label="server" size="large">后端</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="项目描述:" prop="remark">
						<el-input v-model="formValue.remark" :rows="5" type="textarea" placeholder="请输入项目描述" maxlength="200"
							show-word-limit />
					</el-form-item>
				</div>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitAdd(formRef)">新 增</el-button>
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
	projectName: '',
	sampleName: '',
	serverType: 'web',
	remark: '',
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
const projectId = ref()
const env = ref()

const rules = {
	projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
	sampleName: [{ required: true, message: "请输入项目简称/字母标识", trigger: "blur" }],
	serverType: [{ required: true, message: "请输入服务类型", trigger: "blur" }],
	remark: [{ required: true, message: "请输入发版备注", trigger: "blur" }],
};

const showDialog = () => {
	editVisible.value = true
}

const submitAdd = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			deployApi.project_submit(formValue).then((res: any) => {
				if (res.code == 0) {
					ElMessage.success('项目添加成功');
					editVisible.value = false;
					emits('refresh')
				}
			}).catch((err: any) => {
				console.log(err);
			})
		}
	});
};

defineExpose({
	showDialog
})
</script>

<style scoped></style>
