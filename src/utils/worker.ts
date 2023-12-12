/*
 * @Author: youfanrong 737064439@qq.com
 * @Description: 
 * @Date: 2023-12-05 15:46:07
 * @LastEditors: youfanrong 737064439@qq.com
 * @LastEditTime: 2023-12-05 15:46:23
 */
const WorkerCode = () => {
  // const _self = self;
  // setInterval(() => {
  //   _self.postMessage({ time: +new Date() });
  //   // }, 10 * 60 * 1000);
  // }, 5000);
};
// 把脚本代码转为string
let code = WorkerCode.toString();
// 将代码块取出
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
// 转为二进制Blob文件
const blob = new Blob([code], { type: "application/javascript" });
// 生成临时地址
const worker_script = URL.createObjectURL(blob);

export default worker_script;