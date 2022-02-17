//在网络请求根目录文件夹下建立一个type.ts放请求声明的类型代码
import type { AxiosInstance,AxiosRequestConfig,AxiosResponse } from 'axios'
/* 这些类要导出去外面才能拿到 */
//接口上面的类型泛型里面可以指定默认类型<T = AxiosResponse>
export interface axiosRquestInterceptors <T = AxiosResponse>{
  /* this.instance.request.use(requestInterceptor)这个里面封装的是所有的拦截器
因为最后再底下用use()方法。就是回调上面函数，所以上面定义上面request拦截底下就执行
什么request拦截
  */
  /* 请求拦截有成功和失败2种状态，所以2个单独封装 */
requestInterceptor?:(config:AxiosRequestConfig)=>AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  /* 响应拦截有成功和失败2种状态，所以2个单独封装
response类型是AxiosResponse
  */
  //这一块类型有问题所以请求有问题
  //对于接口里面的函数有个不确定的类型一下
  //是要提到接口上面，接口可以接收泛型类型，而接口里面的函数上面是不可以接收泛型的
  responseInterceptor?:(res:T)=>T
  responseInterceptorCatch?: (error: any) => any
}
//定义一个网络请求配置接口继承上面的接口配置类型
//把原来网络请求config后面的类型AxiosRequestConfig变成自己类型，进行里面类型扩展
 export interface axiosRquestConfig<T = AxiosResponse>extends AxiosRequestConfig{
//对原来AxiosRequestConfig类型进行扩展,扩展的类型是上面定义的
  //四个拦截器类型
   interceptors?: axiosRquestInterceptors<T>,
   //这边类型扩展可以决定这个loading参数传递决定不同实例的动画效果
   showLoading?:boolean
}
