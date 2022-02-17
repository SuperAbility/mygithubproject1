import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
//先从缓存里面看token
import LocalCache from '@/utils/cache'
import { mapMenusToRoutes } from '@/utils/map-menus'
//去获取userMenus
import store from '@/store/index'
import loginModule from '@/store/login/login'
import { firstMenu } from '@/utils/map-menus'

//这个后台登录的页面首页里面
//那些后台页面都是这个路由里面的子路由
//但是每个用户登录进来子路由数量不一定这个里面路由写几个还不能确定
/*
关于后台管理系统不同用户登录，菜单显示，和路由控制有三种方案去做：

第一种：只管不同用户进来看到不同的菜单展示，那些没有展示的路由不能点就行
只管菜单，不管路由（弊端--注册所有路由，
用户可以手动输入那些不显示的路由，路由组件照样能够显示出来）


第二种：既管菜单显示效果，又要管不能显示的菜单路由不能通过用户手动输入展示出来
就是实现针对不同角色注册不同的路由数组
然后让不同的用户先登录---拿到他们的userInfo----拿到里面额role属性---再拿到
role.name----角色名
根据这个role.name属性去匹配对应角色的那个数组路由
找到路由数组添加到/main的children子路由里面来----这样就能保证不同角色
路由能够访问的路径有限了（缺陷：就是每次新增加用户，都要添加一个角色和数组的代码匹配
再把数组加到routes里面来）


第三种：
根据左侧菜单动态的生成路由映射
其实就是接口返回的userMenus数据里面的url
因为每个用户登录进去看到的url个数是不一样的
你在接口里面把url--->/main/abc这些全部定义好

然后把每个菜单url----对应一个路由的path---这样展示出一个component组件

这样张三，李四王五进来看到的菜单url项不同，所能展示的组件也不同
并且这些组件的路径都是根据url个数显示的，所以输入没有额url路径是不会展示组件的

上面三种方案不管哪一种最后都要把自己配置生成的路径数组动态的放到
/main--->chilidren子路由中才行

  */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main'
  },
  //路由映射关系对象里面建立都加个name属性方便操作
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/main.vue')
    // children: [] -> 根据userMenus来决定 -> children
  },
  //当用户随便输入一个不存在的路径应该跳到Not found组件
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/components/pages/NotFound.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})
/*跳转到后台首页要进行判断，用户有没有登录，登录跳转到首页
没登录跳转到login页面
*/

router.beforeEach((to) => {
  //即将跳转到的那个路劲url如果不是专门去登录页面

  if (to.path !== '/login') {
    //如果不是登录页，其他任何页面先看下有没有token
    //从缓存中去拿token
    const token = LocalCache.getCache('token')
    //没有token   if (！token)---这个才对为了跳转改的
    if (!token) {
      //跳转登录页面 return '/login'因为接口没有所以为了方便直接跳转后台
      return '/login'
    }

    console.log(router.getRoutes())
    console.log(to) //router对象即将跳转到的对象
    if (to.path === '/main') {
   //当路径要跳转到/main的时候要进行重定向
      return firstMenu.url


    }
  }
})

export default router
