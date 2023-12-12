/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-11-20 15:30:00
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-12 15:45:11
 */
import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import { USERINFO } from '../utils/localStorageKey';
import Home from '../views/home.vue';
import { menu } from './menu';

function loadComponents() {
    return import.meta.glob('@/views/**/*.vue')
}
  
const asynComponents = loadComponents()
  

function menuToRouter() {
    let routerList: RouteRecordRaw[] = []
    const routerSubs = menu.reduce((accumulator:any, currentValue) => {
        if(currentValue.subs){
            return accumulator.concat(currentValue.subs)
        }else{
            return accumulator.concat(currentValue)
        }
    }, [])

    routerSubs.forEach((item: any) => {
        routerList.push({
            path: item.path,
            name: item.name,
            meta: {
                title: item.title,
                permiss: item.permiss,
            },
            component: asynComponents['/src' + item.component]
        })
    })
    return routerList
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            ...menuToRouter()
        ]
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

console.log('routes', routes);


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
