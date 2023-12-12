<!--
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-12-12 11:16:59
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-12 15:09:28
-->
<template>
    <div class="sidebar">
        <!-- <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="sidebar.collapse" background-color="#324157" -->
        <!-- text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router> -->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="sidebar.collapse" background-color="#324157"
            :default-openeds="defaultOpeneds" text-color="#bfcbd9" active-text-color="#20a0ff" :unique-opened="false"
            router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.path" :key="item.path" v-permiss="item.permiss">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-sub-menu v-if="subItem?.subs" :index="subItem.path" :key="subItem.path"
                                v-permiss="subItem.permiss">
                                <template #title>{{ subItem.title }}</template>
                                <template #title v-if="!subItem?.hidden">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem?.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else-if="!subItem?.hidden" :index="subItem.path" v-permiss="subItem.permiss">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.index" v-permiss="item.permiss">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';
import { menu } from '@/router/menu';

const items: any = menu || []

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});
const defaultOpeneds = ref()
const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}

.sidebar>ul {
    height: 100%;
}
</style>
