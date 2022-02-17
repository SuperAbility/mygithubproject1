import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//normalize全局css安装好了要在主入口导入进来才能生效
import 'normalize.css'
//这个才是真正最后再项目中用的less文件
import './assets/css/index.less'
// import { setupStore } from './store'
import './assets/icon/iconfont.css'

/* axios安装好了要在入口处导入依赖才会打包 */
/*
import './service/axios_demo'---import直接导入模块就是想打包时候打包
import a from './service/axios_demo' 有名字就是把打包的模块生成一个对象
底下会用跟这个对象做很多事情
*/
// import './service/axios_demo'
// import { BASE_URL, BASE_NAME } from './service/request/config'
// console.log("手动导入环境测试",BASE_URL);
// console.log("手动导入环境测试",BASE_NAME);

/* 把组件库在全局注册导入的代码抽到一个global文件夹下面index.js里面
用一个函数封装，这样每个不同的组件库都引入一个外来文件函数
这个main.ts里面代码就少了
*/
import { registerElementPlusAPP } from './global'

/* elmentPlus是一款pc端的UI组件库2种集成方式在脚手架里面
一种是全局引入----在main.js中直接把JS和css部分全部导入进来
这样所有和main.js产生依赖的vue文件都能直接使用

优点:方便，快速
缺点：打包的时候用不到的也打包上去，体积大
*/
// import ElementPlus from 'element-plus' 全局引用样式  .use(ElementPlus)

//  import 'element-plus/dist/index.css'

/* elmentPlus的局部引用就不能向上面导入全部了 */

import MYAxiosRequest from './service'
/* 验证axios现在实例有没有成功 */
//第一个请求
/* MYAxiosRequest.request({
  url: '/get',
  //request请求需要指定是什么请求类型
  method: 'GET',
  interceptors: {
    requestInterceptor: (config) => {
      console.log('这个里面实例拦截器的实现')

      return config
    },
    responseInterceptor: res => {
        console.log('这个里面响应实例拦截器的实现')
      return res
    }
  }
}) */
interface DataType {
  data: any
  returnCode: string
  success: boolean
}
//第二个请求  上面2个请求可以控制里面有没有拦截器
/* request<DataType>是请求的时候告诉封装的request请求数据是什么类型 */
/* MYAxiosRequest.request<DataType>({
  url: '/home/multidata',
  //request请求需要指定是什么请求类型
  method: 'GET',
  //如果某个请求你不需要有showLoaing效果在这个里面单独改
  showLoading: false //但是这样写无用，因为内部没有对这个false处理
}).then((res) => {
  console.log(res.data)
  console.log(res.returnCode)
  console.log(res.success)
}) */

//可以调get方法不一定request方法
MYAxiosRequest.get<DataType>({
  url: '/home/multidata',
  //request请求需要指定是什么请求类型

  //如果某个请求你不需要有showLoaing效果在这个里面单独改
  showLoading: false //但是这样写无用，因为内部没有对这个false处理
}).then((res) => {
  console.log(res.data)
  // console.log(res.returnCode)
  // console.log(res.success)
})
const app = createApp(App)

//遍历的目的是全局使用按需引入
//这样每个组件里面使用到的时候都可以直接使用
//并且组件不管有多少都会遍历出来进行全局注册

// registerElementPlusAPP(app)
//用插件语法也可以导入函数
/* 因为app.use里面的函数名会自动执行里面函数体，并且传入vue实例app
和上面 registerElementPlusAPP(app)直接调用函数一样
*/

/* 注意哦在实际项目开发中动态路由生成代码一定要放到全局注册路由的代码前面执行：
app.use(router)
setupStore()
如果动态路由代码放到全局注册路由代码后面执行的结果就是:
系统会把路由router对象会根据当前的页面path去routes[]数组中去匹配对应路由
而你当前后台点击的这个页面路径是动态路由里面的，还没注册进来了---所以匹配
到的肯定是not-found

而这个时候系统执行setupStore()，所以在路由里面有动态路由加原有路由都有
但是to跳转到的路由去匹配路由还是上面的not-found


所以匹配
setupStore()
app.use(router)
先等动态路由加载完毕，之后，在去执行注册路由再根据当前页面路由去匹配
你怎么刷新都没问题了
*/
//这个名字起的不精确，这个其实就是调用global文件夹下的所有文件
//刚才时间格式化抽取的函数也在里面被注册了
app.use(registerElementPlusAPP)
app.use(store)
// setupStore()
store.getters['loginModule/loadLocallogin']
app.use(router)
//只要从新运行代码都会调用Vuex初始化函数功能保证vuex数据刷新不丢失

// console.log(BASE_URL,BASE_NAME);
/* 第三种是根据webpack在根目录建立三个环境变量的配置文件
里面利用官网里面指定注入全局不同的变量进行设计的
*/
// console.log(process.env);
// //第三种方案定义的变量必须要加上VUE_APP前缀才能取到
// console.log(process.env.BASE_URL);//undefiend
// console.log(process.env.TIME_OUT);//undefiend
// console.log(process.env.VUE_APP_BASE_URL);//http://httpbin.org/get
// console.log(process.env.VUE_APP_TIME_OUT);//10000
app.mount('#app')
/* 但是你把全局的逻辑放到Mian.ts里面是不合理的
main.ts里面应该只剩下导入的外面函数调用代码和插件使用
无一行是逻辑代码
所以下面这个代码要抽出去再导入进来
写到global文件夹这个是全局配置的里面
*/
