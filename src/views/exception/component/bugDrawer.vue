<!--
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-12-05 09:35:27
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-06 11:47:56
-->
<template>
  <el-drawer v-model="drawer2" :with-header="false" :direction="direction" size="1000px">
    <!-- <template #header>
      <h4>异常详情</h4>
    </template> -->

    <template #default>
      <div class="bug-cont">
        <h4>异常详情</h4>
        <div v-if="bugInfo">
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">项目名称</el-col>
            <el-col :span="rightSpan">{{ bugInfo.projectName }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">项目Id</el-col>
            <el-col :span="rightSpan">{{ bugInfo.projectId }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">项目简称</el-col>
            <el-col :span="rightSpan">{{ bugInfo.applicationName }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">异常日志环境</el-col>
            <el-col :span="rightSpan">
              <el-tag v-if="bugInfo.env === 'DEV'">开发</el-tag>
              <el-tag v-else-if="bugInfo.env === 'TEST'" type="success">测试</el-tag>
              <el-tag v-else type="warning">生产</el-tag>
            </el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">出现异常时间</el-col>
            <el-col :span="rightSpan">{{ bugInfo.exceptionTime }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">创建异常时间</el-col>
            <el-col :span="rightSpan">{{ bugInfo.createTime }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">当前操作用户ID</el-col>
            <el-col :span="rightSpan">{{ bugInfo.userId }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">当前操作用户token</el-col>
            <el-col :span="rightSpan">{{ bugInfo.token }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">当前操作用户IP</el-col>
            <el-col :span="rightSpan">{{ bugInfo.ip }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">接口地址</el-col>
            <el-col :span="rightSpan">{{ bugInfo.uri || '-' }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">请求参数</el-col>
            <el-col :span="rightSpan"><pre>{{ handlerRequestParam(bugInfo.requestParam) || '-' }}</pre></el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">链路ID</el-col>
            <el-col :span="rightSpan">{{ bugInfo.traceId || '-' }}</el-col>
          </el-row>
          <el-row :gutter="gutter" class="info-content">
            <el-col :span="leftSpan">异常原因</el-col>
            <el-col :span="rightSpan">
              <p style="word-break: break-all;
    word-wrap: break-word; white-space: pre-wrap">{{ bugInfo.cause }}</p>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关 闭</el-button>
        <!-- <el-button type="primary" @click="confirmClick">确 认</el-button> -->
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="basetable">
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import logApi from "@/api/log";

const leftSpan = ref(4)
const rightSpan = ref(20)
const gutter = ref(20)
const drawer2 = ref(false)
const direction = ref('rtl')
const radio1 = ref('Option 1')
const bugInfo = ref()

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
function cancelClick() {
  drawer2.value = false
  bugInfo.value = undefined
}

function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
    .then(() => {
      drawer2.value = false
    })
    .catch(() => {
      // catch error
    })
}

const getData = (id: any) => {
  logApi.log_exception_find(id).then((res: any) => {
    if (res.code == 0) {
      bugInfo.value = res.result;
    }
  });
};

function handlerRequestParam(params: any) {

  const json = JSON.parse(params);
  let newJson: any = {}
  Object.keys(json).forEach(item => {
    newJson[item] = JSON.parse(json[item])
  })
  // console.log(JSON.stringify(newJson, null, 2));
  return JSON.stringify(newJson, null, 2)

}


function openDrawer(row: any) {
  drawer2.value = true
  getData(row.id)
}

defineExpose({
  openDrawer
})
</script>

<style scoped>
.bug-cont {
  color: var(--el-text-color-regular);
  font-size: 18px;

}

h4 {
  margin-bottom: 20px;
}

pre {
  white-space: pre-wrap;
}
.info-content {
  font-size: 14px;
  margin-bottom: 14px;
}
</style>