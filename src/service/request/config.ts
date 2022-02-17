/* 放一些网络请求有关的环境变量设置

环境变量--------就是根据生成环境，开发环境和测试环境不同的环境中
会改变值的一个变量
这类变量一般都是网络请求有关配置的属性 比如baseurl,hedaer.......
*/
/* 1------------------环境变量针对三种不同的环境手动切换环境变量 */
//开发环境的环境变化全部写出来
//在哪种环境要执行前先把其他2个注释掉
//比如现在验证开发环境npm run serve
/* export const BASE_URL = 'http://httpbin.org/dev';
export const BASE_NAME = '开发环境的环境变量'; */
//生产环境的环境变化全部写出来

//在运行npm run build前要把这个打开其他2个注释
/* export const BASE_URL = 'http://httpbin.org/prod';
export const BASE_NAME = '生产环境的环境变量'; */

//测试环境的环境变化全部写出来
/* const BASE_URL = 'http://httpbin.org/test';
const BASE_NAEM = '测试环境的环境变量'; */
//要测试把这两个变量导出去在打包入口main.ts中测试
//手动的去调式环境变量每次换变量之前都要注释万一忘记了就一大堆BUG这种不推荐

//自动调式环境变量----利用webpack DefinePlugin插件里面的process.env.NODE_path
//这个变量会根据环境变量自动变化做个判断
console.log(process.env.NODE_ENV);
let BASE_URL = '';
let TIME_OUT = 10000;
/*
devServer:{
  proxy: {
    '^/api': {
      //接口地址
      target: 'http://152.136.185.210:7878/api/hy66',
      pathRewrite: {
        '^/api':''
      },
      changeOrign:true
  }
}
因为上面baseurl跨域做了一层代码所以baseURL这边要设置成/api
*/
if (process.env.NODE_ENV === 'development') {
  BASE_URL = '/api'//要写成proxy代码的服务器地址这样才能跨域


} else if (process.env.NODE_ENV === 'production') {

    BASE_URL = 'http://httpbin.org/prod';

} else {
   BASE_URL = 'http://httpbin.org/test';

}
export {BASE_URL,TIME_OUT}

