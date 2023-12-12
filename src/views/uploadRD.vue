<!--
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-11-20 15:30:00
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-11-27 14:29:04
-->
<template>
    <div class="container">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="中烟测试" name="first"></el-tab-pane>
            <el-tab-pane label="中烟生产" name="second"></el-tab-pane>
        </el-tabs>
        <div class="container">
            <div class="content-title">支持拖拽</div>
            <el-upload class="upload-demo" drag action="http://jsonplaceholder.typicode.com/api/posts/" multiple
                :on-change="handle">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
            </el-upload>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeName = ref('first')

const handleClick = () => {

}
const handle = (rawFile: any) => {
    console.log(rawFile);
};
</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}

.upload-demo {
    width: 360px;
}
</style>
