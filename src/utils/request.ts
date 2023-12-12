/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: axios 请求封装
 * @Date: 2023-05-04 11:45:58
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-12 15:19:53
 */
import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus';
import router from '../router';
import { USERINFO } from './localStorageKey';

export const baseURL: any = import.meta.env.VITE_BASE_URL;
export const baseENV: any = import.meta.env.MODE

let isIgnoreError = false // 忽略统一错误处理
const service = Axios.create({
  baseURL:'',
  timeout: 10 * 60 * 1000,
  withCredentials: true // 跨域请求时发送cookie
})

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    const userinfo: any = JSON.parse(localStorage.getItem(USERINFO) || '{}');
    userinfo?.token && (config.headers['p-token'] = userinfo.token)
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  }
)

// 过期不再请求
let cancelHttp = false;

// 错误码对应处理方法
const codeMap:any = {
  401: (msg: string) => { // token异常
    if (!cancelHttp) {
      cancelHttp = true
      ElMessage.warning(msg);
      localStorage.removeItem(USERINFO);
		  router.push('/login');
      return
    }
    cancelHttp = false
  },
  120: (msg: string) => { // 单点登录：登录失效
    if (!cancelHttp) {
      cancelHttp = true
      return
    }
    cancelHttp = false
  },
  130: (msg: string) => { // 单点登录：无权访问
    if (!cancelHttp) {
      cancelHttp = true
      return
    }
    cancelHttp = false
  },
  100: (msg: string) => { // 一般错误
    ElMessage.error(msg);
  },
}

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // 中烟环境登录过期302重定向的问题
    if(typeof(response.data) == "string") {
      router.push({ path: '/' })
      return false as any
    }

    const { code, msg } = response.data
    if(!isIgnoreError){
      codeMap[code] && codeMap[code](msg)
    }
    return response.data
    // return response
  },
  (error) => {
    // messageCount()
    return Promise.reject(error.response)
  }
)

// 请求类型配置
const axiosConfig: any = {
  get: (url: string, params: object) => {
    return service.get(url, { params })
  },
  post: (url: string, data: object, config: object) => {
    return service.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...config
    })
  },
  put: (url: string, data: object, config: object) => {
    return service.put(url, data, {
      ...config
    })
  },
  delete: (url: string, data: object) => {
    return service.delete(url, { params: data })
  }
}

/**
 * @description: 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @param {string} method 请求方式
 * @param {any} params 请求config数据
 * @param {boolean} ignoreError 是否忽略全局错误处理，默认使用全局错误处理
 * @return {*}
 */
export const request = (url: string, data: object, method: string, config:object = {}, ignoreError:boolean = false) => {
  isIgnoreError = ignoreError
  return axiosConfig[method](url, data, config)
}
