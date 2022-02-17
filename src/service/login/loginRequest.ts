

//各个不同的网络请求建立不同的网络请求文件夹里面去请求axios
//比如登录就在service文件夹下建立一个login文件夹里面写登录网络请求
//如果是注册就在service文件夹下建立一个resgiter文件夹里面注册请求
import MYAxiosRequest from '../index'
//1------把定义好登录网络请求的参数的类型导入进来
//把网络请求接口数据的类型给拿过来
import { accountLogin, IDataType, ILoginResult } from './loginRequestType'
/* 封装一个登录的网络请求accountLoginRequest
里面传递一个account就是用户名和密码字段进来
这个类型是要自己定义接口的
就在这个文件夹下建立types.ts去写
*/
/* 定义枚举的目的是把里面的url一个个列出来，用枚举类型取出放到底下
变成动态的url,以后方便修改 */
enum loginApi {
  AccountLogin = '/login',
  /* 现在开始请求用户信息了，用户信息也是一个接口 */
  LoginUserInfo = '/users/',
  //菜单请求接口URL{{baseURL}}/role/4/menuIds  4/menu这两个是要底下拼的
  MenuData = '/role/'
}
//TS开发项目的时候就是逻辑代码和类型定义代码要分开
//就是一个组件文件夹里面除了组件.ts还有有type.ts文件
export function accountLoginRequest(account: accountLogin) {
  //这个里面就写登录模块的post请求拿到  MYAxiosRequest网络请求
  //去调里面的post方法
  //但是里面的url可能会多个方便以后修改，把url定义到上面去
  //把这个POST请求的类型定义成外界传进来是一个{code,data}
  //这种最外层是IDataType类型而这个data里面的数据类型是ILoginResult类型
 return MYAxiosRequest.post<IDataType<ILoginResult>>({
   url: loginApi.AccountLogin,
   //在进行网络请求的时候BODY里面数据是放到data里面的
   data: account,
   showLoading: false
 })
}
//用户信息既然是一个接口当然要单独再次网络请求，因为这个请求还在login登录请求
//里面所以要在写一个函数
/* 也就是后端把数据分散在不同的接口里面供你前端请求过去渲染
前端要认准接口文档中如果是同一个类型的网络请求放到一起
所谓请求不同的数据-----就是封装不同的函数请求不同的baseUrl接口
*/
export  function userInfoRequest(id:number) {
  return MYAxiosRequest.get<IDataType>({
    //上面枚举类型的那个LoginUserInfo,枚举类型放的是一个个数据接口请求url
    //但是它是一个get请求要把参数进行拼接上来
    url: loginApi.LoginUserInfo + id,
    //网络请求多了会跳，把组件库里面的显示loading关闭
  showLoading:false
  })
}

//用户后台菜单接口数据网络请求的获取
export function MenuRequest(id:number) {
  return MYAxiosRequest.get<IDataType>({
    //{{baseURL}}/role/4/menu接口文档里面getURL怎么拼接
    url: loginApi.MenuData + id + '/menu'
  })
}
