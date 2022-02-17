import { RouteRecordRaw } from 'vue-router'
import { IBreadCrumb } from '@/base-ui/NavBreadCrumb/index'
//这个是把usermenus接口里面的根据权限的url映射关系routes数组中
//这个类型是专门针对routes映射关系而定的
//要把菜单第一项进行保留下来
let firstMenu: any = null
export function mapMenusToRoutes(userMenus: any[]): RouteRecordRaw[] {
  //这个函数返回的是一个routes映射关系数组RouteRecordRaw[]
  const routes: RouteRecordRaw[] = [] //这个是动态的菜单路由数组
  /* 中间是只要userMenus这个菜单项有映射关系就把它映射关系添加到routes数组中
  最后把routes数组加载到/main中子路由里面 */
  //其实就是拿到userMenus去route文件夹下---main文件夹下是所有路由里面每次根据权限
  //去找符合条件的路由加到routes数组中

  //第一步：先去加载默认所有的main里面的路由routes
  const allRoutes: RouteRecordRaw[] = [] //这个是所有路由对象数组
  //加载所有的路由映射关系就是加载route文件夹--中main文件夹中所有导出的路由对象
  /* require.context()---require是一个对象 这个整体可以直接用是因为
 require.context()属于webpack中的一个工具
 这个工具可以帮助我们加载webpack中的某个文件夹,里面是一个相对路径
require.context(第一个参数是目标文件夹相对路径,第二个参数是要不要进行递归的去查找
 ,第三个是一个正则表达式 )

 第二个参数递归的意思：就是文件夹如果只查找一层按照第三个条件是没有ts文件的
 就是找到0
因为ts文件全部在二级文件夹里面，递归就是不管文件夹有多深全部里面的ts找出来

 第三个参数意思是：在第一个参数文件夹里面进行筛选文件
 比如/\.ts/表示找出main文件夹下的所有ts结尾的文件---不就是所有路由映射文件吗
  */
  const routeFiles = require.context('../router/main', true, /\.ts/)
  console.log(routeFiles) //拿到所有TS文件怎么取出文件里面的路径
  //routeFiles这是一个对象，里面keys是一个函数，调用这个函数返回的是string数组
  //这个数组里面是我们真正的文件的路径了
  const filePaths = routeFiles.keys()
  console.log(filePaths)
  //拿到文件路径之后是要进行遍历的
  filePaths.forEach((key) => {
    console.log(key) //就是一个个路径就是一个个ts文件的相对路径
    //把这些路径加载到路由main下面的children【】数组当中
    //这句话就是把./system/user/user.ts这个路径通过下面方式
    //变成/system/user/user-----这个路径
    const route = require('../router/main' + key.split('.')[1])
    /* 因为 route是一个个模块对象，真正的数据在default中
    这样取出来的就是一个个对象了*/
    allRoutes.push(route.default)
  })
  console.log(allRoutes) //拿到了一个个module到这一块是把所有路由映射对象
  //默认加载到allRoutes数组中，接下来就是根据菜单userMenus获取需要添加的routes

  //2再根据菜单获取需要添加的routes
  /* 接下来就是分析userMenus这个接口数据
它里面只要是type=1的都是可以下拉的有数组children
type=2的情况下才是真正的路由
所以要判断type=2的时候才取出路由,type=1继续遍历
recurse----递归
*/
  const recurseGetRoute = (menus: any[]) => {
    //遍历userMenus里面的所有元素
    for (const menu of menus) {
      //type为2才是真正点击之后跳转路由的项
      if (menu.type === 2) {
        //真正菜单项从所有路由数组去查找----用find函数
        const route = allRoutes.find((route) => {
          //就是查找所有对象，把路由对象里面的path根据菜单项多少选出来
          //其实在所有路由里面根据菜单权限筛选对应的路由，就是
          //查找所有路由的路径和菜单权限项中的url一致的路径
          return route.path === menu.url
        })
        //如果找到了对吧，就把上面的路径添加到allroutes数组中
        if (route) {
          routes.push(route)
        }
        //判断一下firstMenu有没有值
        if (!firstMenu) {
          //在没有值的情况下赋值第一个找到的
          firstMenu = menu
        }
      } else {
        //当type不等于2的时候就是要递归,从menu里面children数组里面在找type=1的菜单
        //如果找不到再递归就是一层层的进去找type=1的所有菜单出来
        recurseGetRoute(menu.children)
      }
    }
  }
  recurseGetRoute(userMenus)
  return routes
}

/* 根据页面路径去拿到当前路径菜单menu和上一级菜单对象从而拿他们里面的name */
export function pathMapBreadCrumb(userMenus: any[], currentPath: string): any {
  const breadcrumbs: IBreadCrumb[] = []
  //这个里面直接调用公共函数，把返回的代码写后面OK了
  pathMatchedToMenu(userMenus, currentPath, breadcrumbs)
  return breadcrumbs
  /* 把上下两个函数合并 */
}

/* 根据页面路径去匹配菜单项的逻辑代码封装---把2个函数封装成一个公共的函数 */
export function pathMatchedToMenu(
  userMenus: any[],
  currentPath: string,
  breadcrumbs?: IBreadCrumb[]
): any {
  //两个参数的意思是传递一个菜单过来才好根据路径匹配菜单
  //第二个当前页面的路径也要传进来
  //在userMenus菜单里面查找符合currentPath这个值的路径url取出
  for (const menu of userMenus) {
    //这个里面还是要判断一级二级菜单，因为一级是展开不跳转，只有二级菜单点击才有路径
    if (menu.type === 1) {
      //其实这个时候可以把整个函数流程再执行一次，递归调用查找第二层
      const findMenu = pathMatchedToMenu(menu.children ?? [], currentPath)
      //再根据Menu找到真正的菜单findMenu
      if (findMenu) {
        breadcrumbs?.push({ name: menu.name, path: menu.url })
        breadcrumbs?.push({ name: findMenu.name, path: findMenu.url })
        return findMenu
      }
    } else if (menu.type === 2 && menu.url === currentPath) {
      //如果是二级菜单可以点击的并且menu.url是当前的路径，那么此时menu菜单项
      //就找到

      return menu
    }
  }
}

export { firstMenu }
