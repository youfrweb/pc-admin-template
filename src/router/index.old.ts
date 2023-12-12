import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import { USERINFO } from '../utils/localStorageKey';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/proTable',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            {
                path: '/userTable',
                name: 'userTable',
                meta: {
                    title: '用户列表',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "userTable" */ '../views/userTable.vue'),
            },
            {
                path: '/proTable',
                name: 'proTable',
                meta: {
                    title: '项目发布',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "proTable" */ '../views/proTable.vue'),
            },
            {
                path: '/recordTable',
                name: 'recordTable',
                meta: {
                    title: '',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "recordTable" */ '../views/recordTable.vue'),
            },
            {
                path: '/exception',
                name: 'exception',
                meta: {
                    title: '异常监控',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "exception" */ '../views/exception/index.vue'),
            },
            {
                path: '/projectSetting',
                name: 'projectSetting',
                meta: {
                    title: '项目列表',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "projectSetting" */ '../views/setting/projectSetting.vue'),
            },


// -------------------------------------------------------------------------------
            {
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '发版记录',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            },
            
            {
                path: '/charts',
                name: 'basecharts',
                meta: {
                    title: '图表',
                    permiss: '11',
                },
                component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            },
            {
                path: '/form',
                name: 'baseform',
                meta: {
                    title: '表单',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            },
            {
                path: '/tabs',
                name: 'tabs',
                meta: {
                    title: 'tab标签',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            },
            {
                path: '/donate',
                name: 'donate',
                meta: {
                    title: '鼓励作者',
                    permiss: '14',
                },
                component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '13',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },
            {
                path: '/uploadFE',
                name: 'uploadFE',
                meta: {
                    title: '发版管理',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "uploadFE" */ '../views/uploadFE.vue'),
            },
            
            {
                path: '/uploadRD',
                name: 'uploadRD',
                meta: {
                    title: '上传插件',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "uploadRD" */ '../views/uploadRD.vue'),
            },
            {
                path: '/icon',
                name: 'icon',
                meta: {
                    title: '自定义图标',
                    permiss: '10',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            },
            {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            },
            {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '9',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            },
            {
                path: '/export',
                name: 'export',
                meta: {
                    title: '导出Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "export" */ '../views/export.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '导入Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `中烟项目工具箱 | ${to.meta.title}`;
    const role = localStorage.getItem(USERINFO);
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } 
    // else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
    //     // 如果没有权限，则进入403
    //     next('/403');
    // } 
    else {
        next();
    }
});

// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | vue-manage-system`;
//     const role = localStorage.getItem('ms_username');
//     const permiss = usePermissStore();
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
//         // 如果没有权限，则进入403
//         next('/403');
//     } else {
//         next();
//     }
// });

export default router;
