/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-11-20 15:30:00
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-12 14:10:31
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'
export default defineConfig(async ({ command, mode }) => {
	await loadEnv(mode, __dirname)
	return {
		base: './',
		plugins: [
			vue(),
			VueSetupExtend(),
			AutoImport({
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				resolvers: [ElementPlusResolver()]
			})
		],
		optimizeDeps: {
			include: ['schart.js']
		},
		envDir: "config",
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
			},
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
		},
		server: {
			open: true,
			host: '0.0.0.0',
			hmr: true,
			port: 1002,
		},
	}
});
