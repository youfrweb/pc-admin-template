<!--
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-11-20 15:30:00
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-11-28 16:02:25
-->
<template>
    <div class="container">
        <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="前端" name="first"></el-tab-pane>
            <el-tab-pane label="后端" name="second"></el-tab-pane>
        </el-tabs> -->


        <div class="container">
            <div class="content-title">发版环境：</div>
            <div class="mb-2 flex items-center text-sm">
                <el-radio-group v-model="radio1" class="ml-4">
                    <el-radio label="1" size="large">测试</el-radio>
                    <el-radio label="2" size="large">生产</el-radio>
                </el-radio-group>
            </div>
            <div class="content-title">上传包文件：</div>
            <el-upload class="upload-demo" drag action="/upload" multiple
                :on-change="handle">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
            </el-upload>
            

            <div class="content-title">版本设置：</div>
            <el-space>
                <el-input-number v-model="major" :min="0" :max="999" :controls="false" @change="majorHandleChange" />
                <el-input-number v-model="minor" :min="0" :max="999" :controls="false" @change="minorHandleChange" />
                <el-input-number v-model="revision" :min="0" :max="999" :controls="false" @change="revisionHandleChange" />
            </el-space>
            <div class="mt-5"><el-button type="primary">确定发版</el-button></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeName = ref('first')
const major = ref(1)
const minor = ref(0)
const revision = ref(0)
const radio1 = ref('1')

const majorHandleChange = () => { }
const minorHandleChange = () => { }
const revisionHandleChange = () => { }
const handleClick = () => { }
const handle = (rawFile: any) => {
    console.log(rawFile);
};
</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 16px;
    color: #1f2f3d;
}

.upload-demo {
    width: 360px;
}
</style>
