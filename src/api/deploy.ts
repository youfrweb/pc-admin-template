/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-11-20 15:30:00
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-05 12:25:53
 */
import { request } from '../utils/request';

// export const fetchData = () => {
//     return request({
//         url: './table.json',
//         method: 'get'
//     });
// };

export default {
    fetchData: () => {
        return request('./table.json', {}, 'get');
    },
    // 项目列表
    project_list: (data: any) => {
        return request('/project/list', data, 'get');
    },
    // 项目列表-下拉框
    project_all_list: (data: any) => {
        return request('/project/all/list', data, 'get');
    },
    // 发版
    publish_project: (data: any) => {
        return request('/publish/project', data, 'post');
    },
    // 发版记录分页列表查询
    publish_list: (data: any) => {
        return request('/publish/list', data, 'get');
    },
    // 回滚
    publish_rollback: (data: any) => {
        return request('/publish/rollback', {}, 'post', { params: data });
    },
    // 重启
    publish_reboot: (data: any) => {
        return request('/publish/reboot', {}, 'post', { params: data });
    },
    // 项目与服务器关联配置列表查询
    publish_server_rel_list: (data: any) => {
        return request('/project/server/rel/list', data, 'get');
    },
    // 添加项目
    project_submit: (data: any) => {
        return request('/project/submit', data, 'post');
    },
    // 删除项目
    project_delete: (data: any) => {
        return request(`/project/${data}`, {}, 'delete');
    },
    // 添加项目与服务器关联配置
    project_server_rel_submit: (data: any) => {
        return request('/project/server/rel/submit', data, 'post');
    },
    // 删除项目与服务器关联配置
    project_server_rel_rel: (data: any) => {
        return request(`/project/server/rel/${data}`, {}, 'delete');
    },
}
