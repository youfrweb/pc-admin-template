/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-12-11 16:54:12
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-12 15:43:34
 */

export const menu = [{
  icon: 'Odometer',
  index: '3',
  path: '/dashboard',
  name: 'dashboard',
  title: '系统首页',
  permiss: '1',
  meta: {
    title: '系统首页',
    permiss: '1',
  },
  component: '/views/dashboard.vue',
},
{
  icon: 'Calendar',
  index: '1',
  title: '表格相关',
  permiss: '2',
  subs: [
    {
      path: '/table',
      name: 'table',
      title: '常用表格',
      permiss: '2',
      component: '/views/table/index.vue'
    },
    {
      path: '/import',
      name: 'import',
      title: '导入Excel',
      permiss: '2',
      component: '/views/table/import.vue'
    },
    {
      path: '/export',
      name: 'export',
      title: '导出Excel',
      permiss: '2',
      component: '/views/table/export.vue'
    },
  ],
},
]

// const items = [
//     {
//         icon: 'Odometer',
//         index: '/dashboard',
//         title: '系统首页',
//         permiss: '1',
//     },
//     {
//         icon: 'Calendar',
//         index: '1',
//         title: '表格相关',
//         permiss: '2',
//         subs: [
//             {
//                 index: '/table',
//                 title: '常用表格',
//                 permiss: '2',
//             },
//             {
//                 index: '/import',
//                 title: '导入Excel',
//                 permiss: '2',
//             },
//             {
//                 index: '/export',
//                 title: '导出Excel',
//                 permiss: '2',
//             },
//         ],
//     },
//     {
//         icon: 'DocumentCopy',
//         index: '/tabs',
//         title: 'tab选项卡',
//         permiss: '3',
//     },
//     {
//         icon: 'Edit',
//         index: '3',
//         title: '表单相关',
//         permiss: '4',
//         subs: [
//             {
//                 index: '/form',
//                 title: '基本表单',
//                 permiss: '5',
//             },
//             {
//                 index: '/upload',
//                 title: '文件上传',
//                 permiss: '6',
//             },
//             {
//                 index: '4',
//                 title: '三级菜单',
//                 permiss: '7',
//                 subs: [
//                     {
//                         index: '/editor',
//                         title: '富文本编辑器',
//                         permiss: '8',
//                     },
//                     {
//                         index: '/markdown',
//                         title: 'markdown编辑器',
//                         permiss: '9',
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         icon: 'PieChart',
//         index: '/charts',
//         title: 'schart图表',
//         permiss: '11',
//     }
// ];
