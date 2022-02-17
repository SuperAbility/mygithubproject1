//除了vuex根里面的类型会比较多要抽取到types.ts中
//但vuex中里面的模块里面的类型也会多呀，所以vuex里面模块类型多的情况下
//也是和根vuex一样建立一个(模块名+types).ts文件里面放根模块的类型
/* 注意这个里面state里面数据多了一个里面类型要加一个否则那边写报错 */
export interface ILoginState {
  token?: string
  userInfo: any
  userMenus: any
  loginResult: any
  userMenus1: any
  userInfo1: any
  token1?: string
}
