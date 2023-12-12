/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-11-20 15:30:00
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-04 16:55:00
 */
import { request } from '../utils/request';

export default {
    // 服务端异常日志列表
    log_exception_list: (data: any) => {
        return request('/log/exception/list', data, 'get');
    },
    // 服务端异常日志详情
    log_exception_find: (data: any) => {
        return request(`/log/exception/${data}`, {}, 'get');
    },
}
