<template>
	<div style="width: 100%">
		<div class="content-main">
			<div class="handle-box">
				<!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
				</el-select> -->
				<!-- <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button> -->
				<el-button type="primary" :icon="Plus" @click="handleUserAdd">新增用户</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column type="index" width="50" />
				<el-table-column prop="userName" label="用户名" align="center"></el-table-column>
				<el-table-column prop="account" label="登录账号" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<!-- <el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.state === '启用' ? 'success' : scope.row.state === '禁用' ? 'danger' : ''">
							{{ scope.row.state }}
						</el-tag>
					</template>
				</el-table-column> -->
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<!-- <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button> -->
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.row)" v-permiss="16">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 添加用户弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="600px">
			<el-form label-width="100px" :rules="rules" ref="formRef" :model="form">
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="登录账号" prop="account">
					<el-input v-model="form.account" placeholder="请输入手机号码"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
				</el-form-item>
				<!-- <el-form-item label="确认密码">
					<el-input type="password" v-model="form.confirmPassword"></el-input>
				</el-form-item> -->
				<!-- <el-form-item label="状态">
          <el-select v-model="query.address" placeholder="请选择" class="handle-select mr10">
            <el-option key="1" label="启用" value="启用"></el-option>
            <el-option key="2" label="禁用" value="禁用"></el-option>
          </el-select>
				</el-form-item> -->
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitAdd(formRef)">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import loginApi from '../api/login';
import CryptoJS from "crypto-js";

interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	address: string;
}

const query = reactive({
	address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});

let form = reactive({
	account: '',
	password: '',
	userName: '',
	// confirmPassword: '',
});
function validPhoneNum(phoneStr: string): boolean {
	//var mobile = /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/
	const mobile = /^1[3456789]\d{9}$/
	return mobile.test(phoneStr)
}
const rules: FormRules = {
	userName: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	account: [
		{
			required: true,
			// message: '请输入登录账号',
			trigger: 'blur',
			validator: (rule: any, value: any, callback: any) => {
				if (value === '') {
					callback(new Error('请输入手机号码'))
				} else {
					if (validPhoneNum(value)) {
						callback()
					} else {
						callback(new Error('请输入正确的手机号'))
					}
				}
			}
		}
	],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let idx: number = -1;
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const formRef = ref<FormInstance>();

const handleUserAdd = (index: number, row: any) => {
	editVisible.value = true;
};
// 获取表格数据
const getData = () => {
	loginApi.user_list({}).then((res: any) => {
		tableData.value = res.result.records;
		pageTotal.value = res.result.total;
	});
};

// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (row: any) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
		type: 'warning'
	}).then(() => {
		loginApi.user_remove(row.id).then((res: any) => {
			if (res.code == 0) {
				ElMessage.success('删除成功');
				getData();
			}
		}).catch((err: any) => {
			console.log(err);
		})
	}).catch(() => { });
};

const submitAdd = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			loginApi.user_submit({
				userName: form.userName,
				account: form.account,
				password: CryptoJS.SHA256(form.password).toString(CryptoJS.enc.Hex)
			}).then((res: any) => {
				if (res.code == 0) {
					ElMessage.success('用户添加成功');
					editVisible.value = false;
					getData();
				}
			}).catch((err: any) => {
				console.log(err);
			})
		}
	});
};

onMounted(() => {
	getData();
})

</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}

.table {
	width: 100%;
	font-size: 14px;
}

.red {
	color: #F56C6C;
}

.mr10 {
	margin-right: 10px;
}

.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
