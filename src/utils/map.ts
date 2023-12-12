/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-11-28 16:23:03
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-08 17:38:59
 */

export interface EnvMap {
  TEST: string;
  PROD: string;
};

export interface EnvLogMap {
  label: string;
  value: string;
};

export const envMap:any = {
	TEST: '测试环境',
	PROD: '正式环境'
}

export const envLogMap:Array<EnvLogMap> = [
  { label: '开发环境', value: 'DEV' },
  { label: '测试环境', value: 'TEST' },
  { label: '正式环境', value: 'PROD' }
]