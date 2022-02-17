//这个里面是把项目中所有组件请求网络放到这个里面
/* 比如把axiosRequest()这个axios封装的网络请求拿到这个里面来
创建实例

如果还有ajax,其他一些异步请求也放到里面--------------这个index.ts作用
就是所有网络请求的入口

*/
import axiosRquest from "./request/axiosRequest";
import { BASE_URL, TIME_OUT } from "./request/config";
//在vuex中登录模块里面保存token本地缓存
//那在网络服务里面就利用缓存工具里面的getCache获取本地缓存
//这样token就不会随着网页刷新消失了
import  LocalCache from '@/utils/cache'
//接下来才是创建axios网络请求的实例化
//记住各个不同组件的网络请求不是用的类型，而是用这个类实例化之后的网络请求配置
const MYAxiosRequest = new axiosRquest({
    baseURL:BASE_URL,
  timeout: TIME_OUT,
  /* 注意凡是接口类型里面的那些属性都是必传的否则报错 */
  interceptors: {
    //比如这个接口里面有2个拦截器你传了一个也会报错
    //属于单个实例的请求拦截携带token就在实例对象里面去设置
    requestInterceptor: (config) => {
      // console.log("请求成功前的拦截");
//token要先保存到本地 真实从服务器里面获取token 或者vuex中获取
      //记住凡是接口里面网络请求需要携带token授权的
      //统一在这个里面处理，之前token是空的，现在要去拿token
      //一种去vuex中拿token放进来
      //第二种方案：token要进行本地保存的
      let token = LocalCache.getCache('token')
      if (token) {
        // config.headers.Authorization = `Bearer ${token}`
      }
      return config

    },
    requestInterceptorCatch: (err) => {
    //  console.log("请求失败就是发config配置给服务器失败前的拦截");
      return err
    },
    responseInterceptor: (res) => {
          //  console.log("响应成功就是服务器返回数据成功前的拦截");
     return res
    },
    responseInterceptorCatch: (err) => {
      // console.log("响应失败就是服务器返回数据失败前的拦截");
      return err
    }

    }

})



export default MYAxiosRequest
