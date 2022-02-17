/*
这个模块是后台管理系统用户管理数据接收的地方
也就是这个就是用户管理的vuex*/
//下面这句是导入自己定义的vuex里面模块类型
import { Module } from 'vuex'
//1------导入用户管理vuex模块里面state数据类型-----Module<S,R>S
// import { ISystemState } from './systemType'
import loginModule from '@/store/login/login'
//2------导入用户管理根vuex模块里面state数据类型-----Module<S,R>R
import { IRootState } from '../../types'
//Module<S,R>S指的当前模块里面的state数据类型
//R指的是根vuex里面state数据类型
const systemModule: Module<any, IRootState> = {
  namespaced: true,
  state() {
    return {
      //用户列表数据存放变量
      userList: [],
      //用户列表中用户的数量
      userCount: 0,
      roleList: [],
      roleCount: 0,
      userData: [],
      userDataListID: []
    }
  },
  /* 这个里面说明一下正常网络请求的代码是你在什么地方保存网络请求数据
  那网络请求的代码就放到什么地方

  比如你把网络请求的数据放到vuex里面，那么网络请求的代码就写到
  actions---异步网络请求里面
但是我没有接口-------所以还要做出功能就把所有模块网络请求的代码
暂时放到mutations里面同步请求数据
等以后接口自己做出来了-----再把代码移动到ations做异步请求
  */
  //假数据放到这个同步请求里面
  //1----如果公司接口规范的话这个pageUrl动态的是可以根据pageName拼出路径的
  // const pageUrl = `${pageName}/list`
  //2-----如果公司接口不规范的这边要用switch去做
  //我现在这边是假数据根本就不需要这些URL去请求
  //这个对没有接口的项目无效的
  /*   let pageUrl = ''
      switch (pageName) {
        case 'users':
          pageUrl = '/users/list'
          break
        case 'role':
          pageUrl = '/role/list'
          break
        case 'department':
          pageUrl = 'department/list'
          break
      } */

  //2------老师打算才算采用第二种方案拿数据
  //上面从模块state里面拿数据是可以的
  //现在介绍第二种方案是getters拿数据
  /*  getters: {
    /* 老师说封装一些getters属性函数间接的获取上面的数据 */
  //pageListData(state) {
  //getters里面可以返回数据
  // return state.userList
  //但是老师不采用直接在getters直接返回数据这样做，
  //采用的是getters里面返回一个函数
  //     return (payName: string) => {
  //       return state[`${pageName}List`]
  //     }
  //   }
  // }, */
  mutations: {
    //没有接口情况下数据定义到这个ts文件里面是本地的客户端面向客户端
    //请求数据-----记住系统设计的原则是按照一级大的分类菜单进行设计模块
    //也就是说这个system vuex模块看起来是一个模块其实是所有系统管理模块的集合
    //也就是这个里面二级菜单不是只有用户管理这一个，还会有角色管理
    //换句话这个里面请求到的是所有后台系统管理一级菜单下二级菜单的数据
    //这个里面请求的不仅仅是用户数据，还有角色数据，部门数据,菜单数据
    /* 1----用户管理中用户数据的请求 */
    /* user组件里面的定义的一些额外的参数这个可以拿到
      在payload对象里面，比如url,offset,size一起把设置
      告诉服务器，服务器就会按照你的传来得url去请求数据返回
按照offset数量设置几个分页
根据size多少设置最后前端每页显示多少条数据

其实是前端把最终网络请求数据展示的方式通过参数传给服务器
服务器根据前端的一些配置，后端设置这些变量的查询条件
      */
    getSystemData(state, payload: any) {
      //对页面发送网络请求----注意不是用的service中网络请求axios封装的
      //函数是用本地数据---以后有接口再换
      /* 查看里面的参数详情 */

      const loginState = loginModule.state
      const userData = loginState().userInfo

      state.userData = userData
      const roleData = loginState().roleInfo
      console.log(userData, roleData)
      //用户数据请求并且动态获取接口数据里面的长度

      /* 获取id值变成---表格第一行的序号 */
      const userDataList = loginState().userInfo.list

      /*     for (let index = 0; index < userDataList.length; index++) {
        console.log(userDataList[index].id, '8s89das89da89sd89sad890ad89sa')
        console.log(index, '8s89das89da89sd89sad890ad89sa')

        console.log(state.userDataListID, 'hhhas')
        state.userDataListID.push(index)
        const I = Array.prototype.slice.call(userDataList[index])
        I.replace(userDataList[index].id, index)
      }
 */
      // state.userList = userData.list
      userData.totalCount1 = loginState().userInfo.list.length

      state.userCount = userData.totalCount1

      //角色数据请求
      state.roleList = roleData.list
      roleData.totalCount1 = loginState().roleInfo.list.length
      state.roleCount = roleData.totalCount1

      /* 1-------------------- 点击页码进行跳转功能的实现*/
      console.log('页面表格网络请求到底获取到了那行数据:', payload)

      //2------定义页码到底有多少页准备遍历页面
      let pageSize = payload.queryInfo.size
      console.log('每页的数据是:', pageSize, '条')
      console.log('用户页面的总数据:', userData.totalCount1, '条')

      let pageSizeCount = Math.floor(userData.totalCount1 / pageSize)
      console.log('分页器的页码总数是多少:', pageSizeCount)
      let currentPage = payload.queryInfo.currentPage
      console.log('分页器的当前点击的页码是:', currentPage)

      //2------i现在就是0-----pageSizeCount
      console.log('是不是拿到每个分页器遍历出来了:', currentPage)

      state.userList = []
      console.log(
        '截取的数组对不对:',
        userData.list.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
      )
      console.log(
        '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )

      let m = userData.list.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
      console.log('用户列表数据是多少', m)

      state.userList.push(...m)

      console.log('用户列表数据是多少', state.userList)

      //这一块是角色管理里面的数据分开单独处理
      // state.roleList = userData.list
      // state.roleCount = userData.totalCount
      /* 我这边就用自己定义的数据开发了，以后做出接口再把这个里面同步请求
      换成axios异步请求的数据
      老师是从它用户接口里面{list,count}取出来赋给这个systemmodule模块里面的
      userInfo和userCount
      我就直接赋值给两个
       */
      /* 原理就是pageName就是后台菜单的组件名
也是所以commit  发送网络请求里面的url名
到时候凡是url全部替换成动态的pagename
其实所谓的路径动态就是定义一个可以外界传递里面存在的路径值变量
来替换里面的常量而已
      */
      //1------这一块是用户管理接口数据
    }
  },
  //异步请求网络放到这个里面
  actions: {}
}
export default systemModule
