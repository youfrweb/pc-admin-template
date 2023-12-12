<template>
  <div class="content-main">
    <div class="handle-box">
      <el-space wrap>
        <el-select v-model="projectId" placeholder="项目" clearable @change="handleSearch">
          <!-- <el-option key="1" label="测试" value="测试"></el-option>
          <el-option key="2" label="生产" value="生产"></el-option> -->
          <el-option v-for="item in projectAllOption" :key="item.id" :label="item.projectName" :value="item.id" />
        </el-select>
        <el-select v-model="env" placeholder="环境" clearable  @change="handleSearch">
          <el-option v-for="item in envLogMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker v-model="timePicker" clearable type="datetimerange" start-placeholder="开始时间"
          end-placeholder="结束时间" :default-time="defaultTime2" value-format="YYYY-MM-DD HH:mm:ss"  @change="handleSearch"/>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset" :icon="RefreshRight">重置</el-button>
      </el-space>
    </div>
    <div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
        @row-click="handleRowClick">
        <el-table-column type="index" width="50" />
        <el-table-column prop="cause" label="异常原因	">
          <template #default="scope">
            <p class='ellipsis'>{{ scope.row.cause }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="exceptionTime" label="出现异常时间" width="200"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" width="200"></el-table-column>
        <el-table-column prop="sampleName" label="项目简称" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.env === 'DEV'">开发</el-tag>
            <el-tag v-else-if="scope.row.env === 'TEST'" type="success">测试</el-tag>
            <el-tag v-else type="success">生产</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="token" label="用户token"></el-table-column>
        <el-table-column prop="ip" label="用户IP"></el-table-column> -->

        <!-- <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button text type="primary" @click="handleEdit(scope.$index, scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
          :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 详情弹框 -->
    <bugDrawer ref="bugDrawerRef"></bugDrawer>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { RefreshRight, Edit, Document, Refresh, Search, Delete } from "@element-plus/icons-vue";
import deployApi from "@/api/deploy";
import logApi from "@/api/log";
import { useRouter } from "vue-router";
import { envLogMap } from "@/utils/map";
import { USERINFO } from "@/utils/localStorageKey";
import bugDrawer from "./component/bugDrawer.vue"

const bugDrawerRef = ref()
const activeName = ref<"TEST" | "PROD">("TEST");
const userinfo: any = JSON.parse(localStorage.getItem(USERINFO) || "");
const projectId = ref();
const env = ref();
const timePicker = ref()
const defaultTime2: [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
] 

interface TableItem {
  id: number;
  name: string;
  money: string;
  state: string;
  date: string;
  address: string;
}

const query = reactive({
  pageIndex: 1,
  pageSize: 10,
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const projectAllOption = ref()

const handleRowClick = (row: any, column: any, event: any) => {
  bugDrawerRef.value.openDrawer(row)
}

// 获取表格数据
const getData = () => {
  logApi.log_exception_list({
    projectId: projectId.value,
    env: env.value,
    startTime: timePicker.value ? timePicker.value[0] : undefined,
    endTime: timePicker.value ? timePicker.value[1] : undefined,
    current: query.pageIndex,
		size: query.pageSize
  }).then((res: any) => {
    if (res.code == 0) {
      tableData.value = res.result.records;
      pageTotal.value = res.result.total;
    }
  });
};

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getData();
};

// 重置
const handleReset = () => {
  query.pageIndex = 1;
  projectId.value = undefined;
  env.value = undefined;
  timePicker.value = undefined;
  getData();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData();
};

// const handleEdit = (index: number, row: any) => {
// };
function getProjectAllList() {
  deployApi.project_all_list({}).then((res:any) => {
    projectAllOption.value = res.result;
  })
}

onMounted(() => {
  getData();
  getProjectAllList()
});
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

:deep(.is-active) {
  font-size: 18px;
}

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 250px;
}

.handle-input {
  width: 300px;
}

.table {
  width: 100%;
  font-size: 14px;
  cursor: pointer;
}

.red {
  color: #f56c6c;
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

:deep(.el-upload-list__item-name) {
  font-size: 18px !important;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.upload-demo {
  width: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-success);
  display: flex;
  align-items: center;
  padding: 10px
}
</style>
