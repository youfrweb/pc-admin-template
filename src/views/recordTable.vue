<template>
	<div class="content-main">
		<div>
			<!-- <div class="handle-box">
				<el-select v-model="query.address" placeholder="环境" class="handle-select mr10">
					<el-option key="1" label="测试" value="测试"></el-option>
					<el-option key="2" label="生产" value="生产"></el-option>
				</el-select>
				<el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus">新增</el-button>
			</div> -->
			<el-button :icon="ArrowLeft" class="mb-3" type="primary" @click="handleBack">返回</el-button>
			<div v-if="tableData[0]?.projectName && env" class="mb-3">{{ tableData[0]?.projectName }} 项目 {{ envMap[env] }} 发版记录</div>
			<div v-else class="mb-3">暂无上传记录</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column type="index" width="50" />
				<el-table-column prop="projectName" label="项目名称" width="150"></el-table-column>
				<el-table-column prop="sampleName" label="项目简称" width="150"></el-table-column>
				<el-table-column prop="" label="版本号" width="150">
					<template #default="scope">
						<span class="mr-1">{{ scope.row.version }}</span>
						<el-tag v-if="scope.row.operateType === 'ROLLBACK'" type="danger">回滚</el-tag>
						<el-tag v-else-if="scope.row.operateType === 'REBOOT'" type="warning">重启</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="发版时间" width="180"></el-table-column>
				<el-table-column prop="createUserName" label="发版人" width="100"></el-table-column>
				<el-table-column prop="remark" label="发版描述" width="250" show-overflow-tooltip></el-table-column>
				<el-table-column prop="filePath" label="发版文件">
					<template #default="scope">
						<div v-for="item in scope.row.uploadRecordVOList">{{ getPathLast(item.filePath) }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="result" label="发版状态" width="100">
					<template #default="scope">
						<el-tag v-if="scope.row.result === 'SUCCESS'" type="success" effect="dark">成功</el-tag>
						<el-tag v-else-if="scope.row.result === 'FAIL'" type="danger" effect="dark">失败</el-tag>
						<el-tag v-else type="warning" effect="dark">进行中</el-tag>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="shellResult" label="发版结果描述"></el-table-column> -->
				<el-table-column label="操作" width="120" align="center">
					<template #default="scope">
						<el-button :disabled="scope.row.result == 'FAIL'" text type="warning" :icon="Edit"
							@click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							回滚
						</el-button>
						<!-- <el-button text type="warning" :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							回滚
						</el-button> -->
						<!-- <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
									删除
								</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<!-- <el-dialog title="提示" v-model="editVisible" width="30%">
			<div>是否确认回滚？</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog> -->
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft, Edit, Search, Plus } from '@element-plus/icons-vue';
import deployApi from '../api/deploy';
import { useRoute, useRouter } from 'vue-router';
import { envMap } from '../utils/map';

//首先在setup中定义
const route = useRoute()
//query
// const env:<'TEST' | 'PROD'> = route.query.env;
const env:any = route.query.env;
let projectId = route.query.id;

const activeName = ref('first')

interface TableItem {
	id: number;
	projectName: string;
	sampleName: string;
	createTime: string;
	version: string;
	createUserName: string;
	remark: string;
	result: string;
}

const query = reactive({
	address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const router = useRouter();

function getPathLast(path: string) {
	const pathArr = path.split('/')
	return pathArr[pathArr.length - 1]
}

let timer:any = null;
// 获取表格数据
const getData = () => {
	deployApi.publish_list({
		env,
		projectId,
		current: query.pageIndex,
		size: query.pageSize
	}).then((res: any) => {
		tableData.value = res.result.records;
		pageTotal.value = res.result.total;
		
		const hasStarting = tableData.value.find(item => item.result === 'STARTING')
		if(hasStarting){
			clearTimeout(timer)
			timer = setTimeout(() => {
				getData()
			}, 3000)
		}
	});
};

const handleBack = () => {
	router.push('/proTable');
}

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
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	}).then(() => {
		ElMessage.success('删除成功');
		tableData.value.splice(index, 1);
	}).catch(() => { });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	address: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	// idx = index;
	// form.name = row.name;
	// form.address = row.address;
	// editVisible.value = true;
	ElMessageBox.confirm(`确定要回滚到${row.version}版本吗？`, '提示', {
		type: 'warning'
	}).then(() => {
		deployApi.publish_rollback({
			id: row.id
		}).then((res: any) => {
			if (res.code === 0) {
				ElMessage.success('回滚成功');
				handleSearch()
			}
		});
	}).catch(() => { });
};
// const saveEdit = () => {
// 	editVisible.value = false;
// 	ElMessage.success(`修改第 ${idx + 1} 行成功`);
// 	tableData.value[idx].name = form.name;
// 	tableData.value[idx].address = form.address;
// };

onMounted(() => {
	getData();
})
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 220px;
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
