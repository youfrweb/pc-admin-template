/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-11-20 15:30:00
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-01 11:28:01
 */
import { request } from '../utils/request';

export default {
    user_login: (data: any) => {
        return request('/user/login', data, 'post');
    },
    user_list: (data: any) => {
        return request('/user/list', data, 'get');
    },
    user_password: (data: any) => {
        return request('/user/password', data, 'put');
    },
    user_submit: (data: any) => {
        return request('/user/submit', data, 'post');
    },
    user_remove: (data: any) => {
        return request(`/user/${data}`, {}, 'delete');
    },
}
