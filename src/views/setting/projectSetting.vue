<template>
  <div class="content-main">
    <div class="handle-box">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增项目</el-button>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane :label="envMapShow.TEST" name="TEST"></el-tab-pane>
      <el-tab-pane :label="envMapShow.PROD" name="PROD"></el-tab-pane>
    </el-tabs>
    <div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" width="50" />
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="sampleName" label="项目简称" width="150"></el-table-column>
        <el-table-column prop="serverType" label="服务类型" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.serverType === 'web'">web</el-tag>
            <el-tag v-else type="success">server</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="项目描述"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <!-- <el-dropdown-item> -->
              <el-button text :icon="Setting" @click="handleSetting(scope.row)" type="warning">
                服务配置
              </el-button>
            <!-- </el-dropdown-item> -->
            <!-- <el-dropdown-item> -->
              <el-button text :icon="Delete" @click="handleDelete(scope.row)" type="danger">
                删除
              </el-button>
            <!-- </el-dropdown-item> -->
            <!-- <span class="el-dropdown-link">
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="scope.row.serverType === 'server'" text :icon="Refresh" type="success"
                    @click="handleRefresh(scope.row)">重启</el-button>
                </el-dropdown-item>
                <el-dropdown-item><el-button text :icon="Document" @click="handleRecord(scope.row)">
                    发版记录
                  </el-button></el-dropdown-item>
                <el-dropdown-item><el-button text :icon="Setting" @click="handleSetting(scope.row)" type="warning">
                    服务配置
                  </el-button></el-dropdown-item>
                <el-dropdown-item><el-button text :icon="Delete" @click="handleDelete(scope.row)" type="danger">
                    删除
                  </el-button></el-dropdown-item>
              </el-dropdown-menu>
            </template>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
          :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 发版详情弹框 -->
    <el-dialog :title="currentData?.projectName +
      currentData?.serverType +
      envMapShow[activeName]
      " v-model="editVisible" width="750px">
      <el-form :model="formValue" :rules="rules" ref="formRuleRef" label-width="100px" class="demo-ruleForm"
        :inline="false" label-position="top">
        <div>
          <el-form-item label="上传包文件" prop="uploadFile">
            <el-upload ref="elUploadRef" class="upload-demo" drag action="http://10.156.5.86:8080/publish/upload"
              :headers="headers" multiple :on-change="handle" :on-success="handleSuccess" :before-upload="beforeUpload"
              drag-text="将文件拖到此处，或点击上传">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="版本设置" prop="major">
            <div class="flex">
              <el-input-number class="mr-1" v-model="formValue.major" :min="0" :max="999" :controls="false" />
              <el-input-number class="mr-1" v-model="formValue.minor" :min="0" :max="999" :controls="false" />
              <el-input-number v-model="formValue.revision" :min="0" :max="999" :controls="false" />
            </div>
          </el-form-item>
          <el-form-item label="发版备注" prop="remark">
            <el-input v-model="formValue.remark" :rows="5" type="textarea" placeholder="请输入发版备注" maxlength="200"
              show-word-limit />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确定发版</el-button>
        </span>
      </template>
    </el-dialog>

    <addProject ref="addProjectRef" @refresh="getData"></addProject>
    <projectSet ref="projectSetRef" @refresh="getData"></projectSet>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Setting, Edit, Document, Refresh, Plus, Delete } from "@element-plus/icons-vue";
import deployApi from "@/api/deploy";
import { useRouter } from "vue-router";
import { envMap } from "@/utils/map";
import { USERINFO } from "@/utils/localStorageKey";
import addProject from "@/views/project/addProject.vue";
import projectSet from "@/views/project/projectSet.vue";

const isClickSubmit = ref(false);
const formValue: any = ref({});
const formRuleRef = ref();
const elUploadRef = ref();
const envMapShow = ref(envMap);
const addProjectRef = ref();
const projectSetRef = ref();
const router = useRouter();
const activeName = ref<"TEST" | "PROD">("TEST");
const currentData = ref();
const userinfo: any = JSON.parse(localStorage.getItem(USERINFO) || "");
const headers = ref({
  "p-token": userinfo.token,
});
const remark = ref();

const handle = (rawFile: any) => {
  console.log(rawFile);
};

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
const handleClick = (name: any) => {
  activeName.value = name;
  getData();
};

// 获取表格数据
const getData = () => {
  deployApi
    .project_list({
      env: activeName.value,
      current: query.pageIndex,
      size: query.pageSize
    })
    .then((res: any) => {
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
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData();
};

// 删除操作
const handleRecord = (row: any) => {
  router.push({
    path: "/recordTable",
    query: { env: activeName.value, id: row.id },
  });
};

// 配置操作
const handleSetting = (row: any) => {
  projectSetRef.value.showDialog(row, activeName.value)
};

const handleDelete = (row: any) => {
  // projectSetRef.value.showDialog(row, activeName.value)
  // 二次确认删除
  ElMessageBox.confirm('确定删除项目吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deployApi.project_delete(row.id).then((res: any) => {
      if (res.code == 0) {
        ElMessage.success('项目删除成功');
        getData()
      }
    }).catch((err: any) => {
      console.log(err);
    })
  }).catch(() => { });
};

const handleAdd = () => {
  addProjectRef.value.showDialog()
}

const handleRefresh = (row: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定重启吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deployApi.publish_reboot({
      id: row.id,
      env: activeName.value,
    }).then((res: any) => {
      if (res.code === 0) {
        ElMessage.success('操作成功，重启可能会有延迟，请关注实际更新状态');
        getData()
      }
    });
  }).catch(() => { });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  name: "",
  address: "",
});
let idx: number = -1;
const oldVersion = ref("");
const newVersion = ref("");
const handleEdit = (index: number, row: any) => {
  oldVersion.value = row.lastPublishRecord?.version || '0.0.0';
  let versionNums: any = oldVersion.value.split(".");
  idx = index;
  // form.name = row.name;
  // form.address = row.address;
  currentData.value = row;
  editVisible.value = true;
  uploadedFiles.value = [];
  let major = versionNums[0] * 1;
  let minor = versionNums[1] * 1;
  let revision = versionNums[2] * 1 + 1;
  if (revision > 999) {
    formValue.value.revision = 0;
    minor++;
  } else {
    formValue.value.revision = revision;
  }
  if (revision === 1000) {
    if (minor < 1000) {
      formValue.value.minor = minor;
    } else {
      formValue.value.minor = 0;
      major++;
    }
  } else {
    formValue.value.minor = minor;
  }
  if (minor < 1000) {
    formValue.value.major = major;
  } else {
    formValue.value.major = major;
  }
  remark.value = undefined;

  elUploadRef.value?.clearFiles();
};

const uploadedFiles = ref<Array<string>>([]);
const handleSuccess = (response: any) => {
  // 处理上传成功的回调
  uploadedFiles.value.push(response.result);
  if (isClickSubmit.value) formRuleRef.value?.validate();
};

const beforeUpload = (file: any) => {
  // 预处理上传的文件，例如限制文件类型和大小
  // const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
  // const isLt2M = file.size / 1024 / 1024 < 2;

  // if (!isJPGorPNG) {
  // 使用 this.$message.error 提示错误信息
  // showMessageError('只能上传 JPG/PNG 格式的图片');
  // ElMessage.success('删除成功');
  // }
  // if (!isLt2M) {
  // showMessageError('上传图片大小不能超过 2MB');
  // }

  // return isJPGorPNG && isLt2M;
  return true;
};

const rules = {
  uploadFile: [
    {
      required: true,
      trigger: "change",
      validator(rule: any, value: string) {
        if (uploadedFiles.value.length === 0) {
          return new Error("请上传包文件");
        }
        return true;
      },
    },
  ],
  major: [
    {
      required: true,
      trigger: "blur",
      validator(rule: any, value: string) {
        let newV =
          formValue.value.major +
          "." +
          formValue.value.minor +
          "." +
          formValue.value.revision;
        let isflag = ComparativeVersion(oldVersion.value, newV);
        if (!isflag) {
          return new Error("版本号重复，请重新设置版本号！");
        }
        return true;
      },
    },
  ],
  remark: [{ required: true, message: "请输入发版备注", trigger: "blur" }],
};
function saveEdit() {
  isClickSubmit.value = true;
  formRuleRef.value?.validate((success: any) => {
    if (success) {
      let newVersion = `${formValue.value.major}.${formValue.value.minor}.${formValue.value.revision}`;
      const params = {
        env: activeName.value,
        version: newVersion,
        projectId: currentData.value.id,
        uniqueKeyList: uploadedFiles.value,
        remark: formValue.value.remark,
      };
      ElMessageBox.confirm("是否确定发版？", "提示", {
        type: "warning",
      }).then(() => {
        deployApi.publish_project(params).then((res: any) => {
          if (res.code == 0) {
            ElMessage.success(`操作成功，发版可能会有延迟，请关注实际更新状态`);
            editVisible.value = false;
            getData();
          }
        });
      }).catch(() => { });
    }
  });
}
// 校验版本号
function ComparativeVersion(oldV: string, newV: string) {
  // 先把版本切成数组
  let oldArr = oldV.split(".");
  let newArr = newV.split(".");
  // 循环对比每一位，发现新版本比较大，就 返回 true，新版本小就返回 false；
  for (let index = 0; index < oldArr.length; index++) {
    const oldItem = Number(oldArr[index]);
    const newItem = Number(newArr[index]);
    if (newItem > oldItem) {
      return true;
    } else if (newItem < oldItem) {
      return false;
    }
  }
  // 若循环对比结束，说明版本一致，就返回false;
  return false;
}

onMounted(() => {
  getData();
});
</script>

<style scoped>
:deep(.is-active) {
  font-size: 18px;
}

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
