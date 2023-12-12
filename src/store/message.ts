/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-12-05 15:30:24
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-05 15:31:51
 */
import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('message', {
	state: () => {
		return {
			// collapse: false
		};
	},
	getters: {},
	actions: {
		openMessage() {
			// this.collapse = !this.collapse;
		}
	}
});
