/* 整个项目部署的结构无论是store,router,view,service
这几大块里面都分很多模块
所以这几个文件夹里面模块名以及结构全部起一样的
这样下次比如login页面出来了问题，就去找文件夹下所有login文件去修改
这样很快解决问题

如果每个文件夹设计结构不一样名字不一样修改起来很麻烦

*/
import MYAxiosRequest from '../../index'
/* 这些代码现在没用都是异步请求接口中用户数据
我现在都没有接口用的本地数据userInfo,这个请求先写在这里面
不把这个函数导入到user.vue中 */
export function getUserData(url: string, queryInfo: any) {
  return MYAxiosRequest.post({
    url: url,
    data: queryInfo
  })
}
