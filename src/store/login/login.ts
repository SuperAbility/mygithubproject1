import { ILoadingInstance } from 'element-plus/lib/components/loading/src/loading.type'
//里面做Login登录模块的vuex
//就是把vuex模块抽一块出来做login登录

/* 1---首先要把vuex中模块module类型给拿到
因为login相当于vuex中的module属性里面的moduleA的角色
这些vuex的模块也是有对应类型的就是---------Module这个

注意：
vuex中的module:{moduleA,moduleB,moduleC}vuex中的模块ABC
就是把大的vuex抽成几个模块去处理最后合并对吧
当然这些模块都是在Vuex里面抽的----内部vuex模块

《《《《1----------vuex中的模块并不是只适合vuex内部模块的抽取
假如项目中一些逻辑牵涉到Vuex中的几个属性共用作用才能实现
但这些逻辑一个个是单独的也不是vuex里面的逻辑内部模块----外部模块
像这些模块可以当做vuex的一个个模块

就好比项目中不管有几十个,几百个几千个像登录这种逻辑牵涉到vuex中的state,mutaitions
和actions三个属性-----其实login逻辑就可以看成vuex的一个模块

所以才在store文件夹下建立login 文件夹里面写loginvuexmodule模块里面的state...属性

像这些外部的模块直接按照自己名字在Vuex根目录下建立一个个文件夹就是一个个模块
里面还是可以写vuex模块代码






*/

/* 其实菜单面向权限面向路由映射关系的这种第三种方案加载动态路由：
第一步:把所有的路由映射关系在route中分模块去配置
第二步：把上面配置用到的组件对应文件夹名字创建好
第三步：用menu接口里面的url找到对应的路由对象
上面路由对象是根据用户的权限决定菜单项的多少（权限就是指看到左侧菜单项的多少）
而这些菜单项就是一个个url,菜单项点击跳转就是路由映射对象
这一系列路由对象应该是根据权限动态的决定加载多少到/main子路由中

*/

import { Module } from 'vuex'
//2-----loginModule:Module vuex模块绑定类型为什么报错，因为你点Module
//跳转到源码export interface Module<S, R>他后面2个泛型必须要传入指定类型
//没有默认值的------S是指的vuex中额login模块里面的state类型
//R----指的是vuex中login模块的根模块中的state类型
//因为vuex中国的index.ts根模块里面state和login局部模块里面的state类型不一致
//所以要定义这两个类型不然报错
//1------定义login模块里面的state类型------<S---模块里面的类型抽到各模块下的
//types.ts文件中了
// interface ILoginState{
//    token:string
//    userInfo: any

// }
/* Module<S, R>其实在项目中定义的数据后面类型我们发现都是用的泛型包围一个类型
1------变量:<类型>而不是变量：类型
2------而且泛型里面的类型如果原来工具第三方库源码里面有几个参数你就要在外面
注意是用Interface接口去定义号，再放进来才行
 Module<S, R>不是写个 Module<S, R>就是S和R是要在外面定义好放进来的
 否则报错
*/
//2---那么R根模块state里面类型之前定义过了要导出导入

//模块里面抽出去的ts类型代码还是一样导入进来使用
import { ILoginState } from './loginTypes'
import { IRootState } from '../types'
import { mapMenusToRoutes } from '@/utils/map-menus'
//跳转首页就是要路由跳转
import router from '@/router/index'
//service里面login文件夹里面的网络请求loginRequest.ts里面代码写好了’
//之后就要导入进来
import {
  accountLoginRequest,
  userInfoRequest,
  MenuRequest
} from '@/service/login/loginRequest'
//把login网络请求里面的参数account类型取到放到payload类型
import { accountLogin } from '@/service/login/loginRequestType'
//因为网络请求里面的token要本地保存，所以token要放到你之前封装缓存的工具
//里面----用LocalCache里面的setCache()方法去保存
import LocalCache from '@/utils/cache'
const loginModule: Module<any, IRootState> = {
  //像login这种外部vuex模块也要有命名空间跟Vuex模块一样的
  namespaced: true,
  //login登录模块state里面有网络请求的数据,就是传给服务器的东西
  //比如token,userInfo,等等
  //所有项目中关于登录的逻辑全部写到vuex里面去了不是写到组件里面函数里面
  //所谓登录逻辑在vuex中的使用：
  //就是用vuex的actions进行网络请求数据
  //把actions请求到的对应数据通过Mutations进行中转保存到对应state数据里面
  /*  userInfo: [
        //1----一个用户超级管理员
        {
          enable: 1,
          id: 1,
          name: 'zhangsan',
          relname: '张三',
          cellphone: 13652799562,
          creatAt: '2021-10-18T20:09:15.00Z',
          updateAt: '2021-10-20T20:09:15.00Z',
          departmentId: {
            id: 1,
            name: '总裁办',
            parentId: null,
            leader: 'zhangsan',
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          role: {
            id: 1,
            name: '超级管理员',
            intro: '所有权限',
            parentId: null,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          }
        },
        {
          enable: 1,
          id: 1,
          name: 'xuexi',
          relname: '学习',
          cellphone: 13952799562,
          creatAt: '2021-10-18T20:09:15.00Z',
          updateAt: '2021-10-20T20:09:15.00Z',
          departmentId: {
            id: 2,
            name: '运营',
            parentId: null,
            leader: 'xuexi',
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          role: {
            id: 2,
            name: '运营',
            intro: '运营权限',
            parentId: null,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          }
        }
      ] */
  state() {
    return {
      token1: '',
      userMenus1: [],
      userInfo1: [],
      totalCount1: 0,

      //1---写假数据---菜单接口的临时数据
      userMenus: [
        //第一个对象
        {
          //这个是菜单可以展开的二级菜单数据可以遍历的
          children: [
            {
              children: null,
              id: 39,
              name: '核心技术',
              parentId: 38,
              sort: 106,
              type: 2,
              url: '/main/analysis/overview'
            },
            {
              children: null,
              id: 37,
              name: '技术支持',
              parentId: 38,
              sort: 107,
              type: 2,
              url: '/main/analysis/dashboard'
            }
          ],
          icon: 'iconfont icon-xitong1',
          id: 38,
          name: '系统总览',
          sort: 1,
          type: 1,
          url: '/main/analysis'
        },
        //第2个对象
        {
          children: [
            {
              children: null,
              id: 36,
              name: '用户管理',
              parentId: 39,
              sort: 108,
              type: 2,
              url: '/main/system/user'
            },
            {
              children: null,
              id: 42,
              name: '部门管理',
              parentId: 39,
              sort: 109,
              type: 2,
              url: '/main/system/department'
            },
            {
              children: null,
              id: 43,
              name: '菜单管理',
              parentId: 39,
              sort: 109,
              type: 2,
              url: '/main/system/menu'
            },
            {
              children: null,
              id: 44,
              name: '角色管理',
              parentId: 39,
              sort: 109,
              type: 2,
              url: '/main/system/role'
            }
          ],
          icon: 'iconfont icon-xitong',
          id: 39,
          name: '系统管理',
          sort: 1,
          type: 1,
          url: '/main/system'
        },
        //第3个对象
        {
          children: [
            {
              children: null,
              id: 45,
              name: '商品类别',
              parentId: 40,
              sort: 108,
              type: 2,
              url: '/main/product/category'
            },
            {
              children: null,
              id: 46,
              name: '商品信息',
              parentId: 40,
              sort: 109,
              type: 2,
              url: '/main/product/goods'
            }
          ],
          icon: 'iconfont icon-shangpin',
          id: 40,
          name: '商品中心',
          sort: 1,
          type: 1,
          url: '/main/product'
        },
        //第四个对象
        {
          children: [
            {
              children: null,
              id: 47,
              name: '随便聊聊',
              parentId: 41,
              sort: 108,
              type: 2,
              url: '/main/story/chat'
            },
            {
              children: null,
              id: 48,
              name: '菜单页面',
              parentId: 41,
              sort: 109,
              type: 2,
              url: '/main/story/list'
            }
          ],
          icon: 'iconfont icon-chat',
          id: 41,
          name: '随便聊聊',
          sort: 1,
          //其实展开不能展开，有没有二级菜单都是靠这个属性
          //你把它改成2看一下随便聊聊底下就没有展开项了
          type: 1,
          url: '/main/story'
        }
      ],
      //2-------登录接口的临时数据
      loginResult: [
        //第一个对象
        {
          id: 1,
          name: 'myproject',
          token:
            'eyJhbGci0iJSUzI1NiIsInR5cCT6IkpXVC39.eyJpZCI6NSwibmFtZSI6ImNvZGVyd2h5Iiwicm9sZSI6eylpZCI6NSwibmFtZSI6Tui2hee6p-eyJhbGci0iJSUzI1NiIsInR5cCT6IkpXVC39.eyJpZCI6NSwibmFtZSI6ImNvZGVyd2h5Iiwicm9sZSI6eylpZCI6NSwibmFtZSI6Tui2hee6p-euoeeQhuMwRmC39LCJpXQi0jE2NMjc5NTM1NTMsimV4cCI6NTYYNDUMNTU130.ORDCfkzum_bFEZKMA4 x0F3562 f6PC5M91RAotFrekopSn10j YrtUlnZPA- ia-apNVNhofeolRPoR4sT8yNqn4vkZVeg51ICx1uKTzFw_gUu4wRePd1teroIm867D6pDZzzipIcazmHooNz8KNBOcqMYUoa4b4dwkOkP1HN'
        }
      ],
      //3----用户列表userInfo这个接口也要自己做
      /* 就是用户界面请求下来服务器的用户数据一般存放在哪里;
第一种思维：
用户的数据就放到user.vue这个组件里面，放到一个ussrLIst变量
里面用ref接收
按照上面逻辑思维在role.vue中定义一个roleList来接收角色相关的数据
每个页面数据都放在每个对应组件里面定义的ref变量保存
---------一般前后端未分离的项目就是采取这个方法存储数据

第二种思维：

把请求下来的数据放到vuex里面建立对应的模块进行管理
但是后台这种组件很多，可能几百个页面都有自己的数据接口
如果按照这种逻辑------那vuex里面有几百个模块
哇~~~~~~~~~~那是相当难管理几百个模块直接关系

上面模块其实是根据后台可以跳转路由的二级页面进行划分 的
这样太细太多

小码哥-------提出来可以按照后台管理系统菜单一级页面那几个页面进行
划分模块，因为后台管理系统一级页面都是不可以跳转的页面而且较小
如果按照一级页面的菜单进行划分大的模块
那vuex里面几百个刚才的模块有可能就剩下10个
在每个大的模块中-----吧一系列子模块放在一起

其实就是利用了小的模块太多，进行分类管理，按照一类类大的模块
进行划分
      */
      /* 对于接口数据的类型定义：
 userInfo[{},{},{},{},{},{},{},{},{},{},]
  userInfo{abc:[{},{},{},{},{},{},{},{},{},{}],cm:1}
  现在你看到的后台接口数据类型有两种:
  一种接口后面跟的是一个数组
一种是接口后面跟的是一个对象
那到底是写对象还是写数组---这个问题终于找到答案了：
记住：如果接口里面全是一样的对象无其他属性（或者接口里面属性只有一个）
像这种情况下用的是数组

如果接口里面属性很多，或者接口的数据类型有很多层
这个时候数组就不合适了---我们都知道数组是处理一系列没有属性名的数据
如果数据很多必然要属性名区分：------------这个时候用对象


*/
      userInfo: {
        list: [
          //1----一个用户超级管理员
          //1-10条数据
          {
            id: 45,
            name: 'zhangsan',
            relname: '张三',
            cellphone: 13652799562,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //10-20条数据
          {
            id: 45,
            name: 'z第十一条数据开始',
            relname: 'z11',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //20-30条数据
          {
            id: 45,
            name: 'z第21条数据开始',
            relname: 'z21',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //30-40条数据
          {
            id: 45,
            name: 'z第31条数据开始',
            relname: 'z31',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //40-50条数据
          {
            id: 45,
            name: 'z第41条数据开始',
            relname: 'z41',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //50-60条数据
          {
            id: 45,
            name: 'z第51条数据开始',
            relname: 'z51',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //60-70条数据
          {
            id: 45,
            name: 'z第61条数据开始',
            relname: 'z61',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //70-80条数据
          {
            id: 45,
            name: 'z第71条数据开始',
            relname: 'z71',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //80-90条数据
          {
            id: 45,
            name: 'z第81条数据开始',
            relname: 'z81',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          //90-100条数据
          {
            id: 45,
            name: 'z第91条数据开始',
            relname: 'z91',
            cellphone: 1365279908,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 42,
            name: 'xuexi',
            relname: 'xuexi',
            cellphone: 13652799563,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:11:15.00Z',
            updateAt: '2021-10-20T20:11:15.00Z'
          },
          {
            id: 9,
            name: 'better',
            relname: '比特',
            cellphone: 13652799565,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:10:15.00Z',
            updateAt: '2021-10-20T20:10:15.00Z'
          },
          {
            id: 8,
            name: 'zjl',
            relname: '周杰伦',
            cellphone: 13652799576,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:12:15.00Z',
            updateAt: '2021-10-20T20:12:15.00Z'
          },
          {
            id: 7,
            name: 'zhouhuajian',
            relname: '周华健',
            cellphone: 13652799597,
            enable: 1,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          {
            id: 6,
            name: 'luck',
            relname: 'luck',
            cellphone: 15652799563,
            enable: 0,
            departmentId: 2,
            role: 3,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 3,
            name: 'juese',
            relname: '大熊',
            cellphone: 1565279978,
            enable: 1,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 2,
            name: 'gaoshou',
            relname: '高手',
            cellphone: 15652799963,
            enable: 0,
            departmentId: 1,
            role: 1,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          },
          {
            id: 1,
            name: 'gaoshou',
            relname: '高手1',
            cellphone: 15652799965,
            enable: 1,
            departmentId: 2,
            role: 2,
            creatAt: '2021-10-18T20:09:18.00Z',
            updateAt: '2021-10-20T20:09:18.00Z'
          }
        ],
        totalCount1: 5
      },
      //角色接口的定义
      roleInfo: {
        list: [
          //1---id=1是超级管理员
          {
            id: 1,
            name: '超级管理员',
            intro: '所有权限',
            creatAt: '2021-10-18T20:09:15.00Z',
            updateAt: '2021-10-20T20:09:15.00Z'
          },
          //2----id=3是运营
          {
            id: 3,
            name: '运营',
            intro: '日常事务',
            creatAt: '2021-12-18T20:11:15.00Z',
            updateAt: '2021-12-20T20:11:15.00Z'
          },
          //3----id=4是运营
          {
            id: 4,
            name: '人事',
            intro: '人事管理',
            creatAt: '2021-09-18T20:11:15.00Z',
            updateAt: '2021-09-20T20:11:15.00Z'
          }
        ],
        totalCount1: 0
      }
    }
  },
  getters: {
    loadLocallogin(state) {
      const token = LocalCache.getCache('token')
      //这二句的代码是totalCount的值是动态的获取上面list数组的长度

      //判断token有没有值
      if (token) {
        state.token1 = token
      }

      //重新赋值
      const userInfo = LocalCache.getCache('userInfo')
      //判断token有没有值
      if (userInfo) {
        state.userInfo1 = state.userInfo
      }

      const userMenus = LocalCache.getCache('userMenus')
      //判断token有没有值
      if (userMenus) {
        state.userMenus1 = state.userMenus
      }
      // const userMenus1 = (store.state as any).loginModule.userMenus1
      const routes = mapMenusToRoutes(state.userMenus1)
      console.log(routes) //打印出来还是10个路由因为当前账号是管理员拥有所有
      //权限可以看到所有菜单
      //2-----将routes--->添加到main路由子路由childrens[]中
      //动态添加路由

      routes.forEach((route) => {
        //第一个选项是父类路由的名字
        //第二个是每一个路由，所以要把routes数组进行遍历添加
        router.addRoute('main', route)
      })
    }
  },
  //真正的修改状态
  mutations: {
    //把登录里面的那些数据当做状态保存比如token
    //这个不是改变token值是通过异步请求actions把登录发送服务器的token
    //经过mutaitions里面保存token数据给state里面的token
    //为什么action是里面不直接把token赋值给state
    //这是因为vuex官网规定所有修改state必须传递给mutaitions才行
    accountlogin1(state, payload) {
      const loginResult1 = state.loginResult[0]
      const { id, token } = loginResult1

      state.token1 = token
      LocalCache.setCache('token', token)
      console.log(id)

      //把用户请求接口的userinfo数据保存起来

      state.userInfo1 = state.userInfo
      const userInfo1 = state.userInfo

      console.log(userInfo1)
      LocalCache.setCache('userInfo', userInfo1)

      //把用户后台菜单接口请求到的数据也保存起来

      state.userMenus1 = state.userMenus
      const userMenus1 = state.userMenus1
      console.log(userMenus1)
      LocalCache.setCache('userMenus', userMenus1)
      /*
const userMenus1 = store.state.loginModule.userMenus1-----错的
    这样直接拿类型不通过，而且即使换成你封装的类型userstore()
    这个封装的要在compositionApi中才能使用这个里面又不能使用
所以现在要处理类型
(store.state as any)这个用类型断言换成any即可
    */
      // const userMenus1 = (store.state as any).loginModule.userMenus1

      router.push('/main')
      //这个地方用户肯定能拿到路由的映射关系
      //在这个地方做也是比较好的
      //通过userMenus拿到权限对应的routes（里面是不同的路由映射关系）
      //把上面权限对应的不同routes映射关系数组添加到routes中main这个父路由
      //中的children子路由中
      //但是代码写到这个位置比较多，所以要抽取
      //递归函数把对应菜单路由选项动态的按照url--->路由找出来添加到routes数组中
      //1---usermenus---->routes
    }
  },

  //异步请求
  actions: {
    //actions里面的参数是context可以用对象解构出来里面需要的
    //payload就是loginaccount里面输入框传进来用户输入的名字和密码
    //  async  accountLoginAction把当前函数写成异步函数
    // accountLoginAction({ commit, state }, payload: accountLogin) {
    //5---上面数据获取完了保存完了就要开始页面跳转了路由跳转
    // console.log('accountLoginAction', payload)
    //接下来登录所有逻辑在这个里面编写
    /*
      这个里面就是涉及到服务器请求，首先要有个接口做好对应的功能
      老师给了一个接口文档，按照里面接口文档去请求就行了
       它里面接口是用postman做的文档怎么看‘
       就拿用户登录这个接口：
       POST用户登录
{{baseURL}}/login------这句话意思这个登录是一个POST请求
登录接口的请求地址：{{baseURL}}/login-

BODYraw
{
    "name": "coderwhy",
    "password": "123456"
}
这个BODY代表前端发给服务器的数据
      */
    //1-----实现登录逻辑
    /*
不采用这种.then方式去拿网络请求
accountLoginRequest(account).then((res) => {})
写成异步函数知乎---就可以同步代码结构写异步代码了
*/
    //这个payload就是网络请求里面的account，并且它的类型是刚才的网络请求里面的
    //account类型
    /* 由于没有老师的接口这个loginResult首页登录接口就在这个页面做个假数据
请求固定的数据，等以后有网络请求接口做好了再换成在线的数据

就是网络请的数据，和你在页面里面写的数据是一个东西
只不过是一个在线24小时什么人都可以访问的数据
你写的就是本地的数据
就是客服端和服务端之间的差距
也就是说在没有接口的情况下，可以把老师里面的所有接口数据，自己在本地搭建一个个出来
用那些json数据代替你接口也能达到同样的效果

等自己接口做好了再换成接口的
      */
    // const loginResult = await accountLoginRequest(payload)
    // const loginResult1 = state.loginResult[0]
    //取出里面的数据中的id和token
    // const { id, token } = loginResult.data
    // const { id, token } = loginResult1
    //commit提交mutaitions修改状态
    //这个就是异步请求到网络请求数据把token通过mutaitions传递个state里面
    //定义的一个token
    // commit('changeToken', token)
    //把当前中token进行本地缓存
    // LocalCache.setCache('token', token)
    //2-----登录拿到token ,id之后就可以做其他事情请求用户信息的数据
    //像这个get里面数据很多结构直接IDataType里面的数据类型就是any
    // const userInfoResult = await userInfoRequest(id)
    // const userInfo = userInfoResult.data
    // const userInfo1 = state.userInfo
    // commit('storeUserInfo', userInfo1)
    // console.log(userInfo1) //拿不到数据因为接下来这些请求都要携带token
    //要把token传进来
    //既然每个请求都要携带token，那把token封装全局
    /* 一般用户信息也要缓存一下 */
    // LocalCache.setCache('userInfo', userInfo1)
    //3------从登录成功页面跳到首页
    /* 后台首页的展示菜单是根据用户的角色进行不同展示的
      不同身份的用户进去看到菜单展示的效果是不一样的
     所以登录后台左侧菜单是用接口数据对应不同用户权限进行渲染的
     所以菜单也是一个接口

     所以接口：可以理解为凡是动态的数据渲染出来的组件
     都是从接口请求过来的
     接口就是用来实现动态数据的
      */
    // const userMenuResult = await MenuRequest(userInfo.role.id)
    // const userMenus = userMenuResult.data
    // const userMenus1 = state.userMenus
    // console.log(userMenus1) //这个数据也要保存菜单也要保存
    // commit('MenuDataStore', userMenus1)
    //本地也保存一份数据
    // LocalCache.setCache('userMenus', userMenus1)
    // router.push('/main')
    //vuex初始化每次保证刷新数据不丢失的方法
    //就是初始化的把vuex里面的token,userinfo和menu菜单数据重新保存一遍
    /* loadLocallogin({ commit }) {
        const token = LocalCache.getCache('token')
        //判断token有没有值
        if (token) {
          commit('changeToken', token)
        }

        //重新赋值
        const userInfo = LocalCache.getCache('userInfo')
        //判断token有没有值
        if (userInfo) {
          commit('storeUserInfo', userInfo)
        }

        const userMenus = LocalCache.getCache('userMenus')
        //判断token有没有值
        if (userMenus) {
          commit('MenuDataStore', userMenus)
        }
      } */
    // }
  }
}

export default loginModule
