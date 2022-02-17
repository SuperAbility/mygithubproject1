//账号登录里面的参数类型
export interface accountLogin{
   name:string
    password:string
}
//定义网络请求数据loginresult.data的类型
//其实这个很简单就是网络请求到的接口是一个JSON对象
/* //JSON对象第一层是一个{
code:
data:{

}//}
那么第一层就根据这个结构定义一个类型export interface IDataType<T = any> {
  code: number
  data: T
}
里面data类型是根据外面传进来数组对象决定的动态类型所以泛型

里面data的数据类型export interface ILoginResult {
  id: number
  name: string
  token: string
}


*/
export interface ILoginResult {
  id: number
  name: string
  token: string
}
//这个是POST请求的类型
export interface IDataType<T = any> {
  code: number
  data: T
}
//底下还要定义get请求的类型
//其实对于复杂的接口数据不用转直接写any
