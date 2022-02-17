<template>
  <!--后台管理系统左侧菜单栏就三部分最外面一层
上面一个logo图标
下面一个menu菜单
-->
  <div class="nav-menu">
    <div class="logo">
      <img class="img" src="~@/assets/img/logo.svg" alt="logo" />
      <!--<span v-if="collapse"这个v-if的意思就是在折叠菜单的时候文字也跟着
      隐藏和显示的效果否则文字不能完全收进去-->
      <span v-if="!collapse" class="title">后台权限菜单栏</span>
    </div>
    <!--下面的menu菜单导航用组件库中的Menu去搭建
    使用的是elementplus里面第一个menu菜单组件就是可折叠的菜单上面一个
    但是现在默认情况下应该是可以折叠的关闭的，但是没这个功能-->
    <!-- :default-active="defaultValue"是为了使得默认的路由跳转菜单激活
是根据路径跳转对应的菜单项-->
    <el-menu
      :default-active="defaultValue"
      class="el-menu-vertical"
      :collapse="collapse"
      background-color="#0c2135"
      text-color="#b7bdc3"
      active-text-color="#0a60bd"
    >
      <!--用自己做的菜单效果在el-menu里面进行动态布局
     里面全是四个el-sub-menu
    左侧菜单的数据是遍历出来的，里面最好用tempalte进行遍历
    这样少去几个外层壳子了

    接口里面的数据除了给前端提供数据之外
    还可以提供判断条件的数据和权限数据---从而前端根据接口的数据字段
    实现动态的网页-->
      <template v-for="item in userMenus" :key="item.id">
        <!--根据接口里面的type类型1 2 3  判断是几级的菜单-->
        <template v-if="item.type === 1">
          <!--type为1就是里面是可以展开的菜单，这个时候把里面的chiledren二级菜单数据遍历
  出来------->
          <!--这一块二级菜单遍历之前有个可以展开的部分
      这个里面图标可有可无所以前面有个v-if
<el-sub-menu :index="item.id">这个意思就是遍历出来的所有一级菜单项目
都是以他们不同的id区分他们不同的状态
这个绑定了之后
比如一级菜单第一个是展开的
第二个可以是折叠的
第三个可以是展开的
第四个可以是折叠的
否则没有这个index标识上面四个一级菜单都是一样的状态要么全部展开要么全部折叠
      -->
          <el-sub-menu :index="item.id + ''">
            <!--el-sub-menu标签里面对于复杂的结构如果外面一层没有template样式
            会出问题要给个具名插槽-->
            <template #title>
              <i v-if="item.icon" :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <!--这一块是二级菜单-->
            <template v-for="subitem in item.children" :key="subitem.id">
              <!--二级菜单里面的项如果都是点击不展开的这个里面判断就不用写了
如果这个二级菜单里面的项有展开的三级菜单那么这个里面还是要判断
:index="subitem.id+''"为什么标识后面拼接一个空字符串的原因是
你的标识全是整型的
而人家组件库里面的index规定是string类型
所以要把整型转换成string类型
           -->
              <!--动态路由对象根据菜单中的url权限全部匹配好了也加到/main下面
children[]数组中，但是后台点击每个项目上面地址没变
因为整个el-menu-item没有监听点击事件router.push跳转处理

           -->
              <el-menu-item
                :index="subitem.id + ''"
                @click="handleItemClick(subitem)"
              >
                <i v-if="subitem.icon" class="subitem.icon"></i>
                <span>{{ subitem.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <!--就是如果当前菜单type不等于1就是不展开的，就是一级菜单里面的菜单项
  切换按钮等于2就是具体做展示-->
        <template v-else-if="item.type === 2">
          <!--这个组件库里面的那个group组里面的一个个选项-->
          <el-menu-item :index="item.id + ''">
            <!--这个是二级菜单里面的一个个选项卡，可能没有图标可能有图标
v-if="item.icon"这句话意思就是item.icon图标存在才展示
不存在不展示，以后如果在vue模块中一个东西可有可无就要加上v-if
 -->
            <i v-if="item.icon" :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
/* vuex的useStore类型无法确定，自己在vuex根vue文件里面封装了一个
usestore函数
现在准备不用从Vuex中导出useStore
从自己封装的里面导出自己的那个useStore函数

*/
// import {useStore} from 'vuex'
import { useStore } from '@/store/index'
import loginModule from '@/store/login/login'
import { useRouter, useRoute } from 'vue-router'
import { pathMatchedToMenu } from '@/utils/map-menus'
export default defineComponent({
  //接收父组件里面的那个isCollapse才有用,传递一个collapse属性去接收
  /*      props:{
      collapse：{
type:Bolean,
default:false
}
  }, */
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    //这边usestore要写个类型限制里面那些数据可以传参
    //vuex对ts支持度比较差的一个地方就是useStore类型
    /* 有的人就会用pinio库来实现vuex功能
    因为这个库对TS支持度好多了 */
    const store = useStore()
    const router = useRouter()
    //在一个组件里面拿vuex里面模块里面的数据用命名空间的语法
    const userMenus = computed(() => store.state.loginModule.userMenus)
    //定义默认路由跳转变量

    /* 一共分为三步：
第一：拿到当前页面上的路径
第二：根据路径去匹配menu
第三：拿到menu.id作为defaultValue的值

    */
    //第一步怎么拿当前页面路由的路径
    const route = useRoute()
    //拿到当前页面路由的路径---记住用vue-route拿到当前页面的所在路径
    //route.path就是对应路径
    const currentPath = route.path
    /* console.log(router.currentRoute.value.fullPath)//这个也是获取当前路由路径 */
    //2----根据路径去匹配menu怎么去做---这个代码有点复杂抽到utils文件夹下
    //map-menus.ts里面去做、、由于 const userMenus =
    //computed(() => store.state.loginModule.userMenus)拿到的是ref对象要想
    //取里面值用userMenus.value
    const menu = pathMatchedToMenu(userMenus.value, currentPath)
    //  3------把menu里面id赋值给defaultValue,但是这个里面的值要求放的是一个字符串
    const defaultValue = ref(menu.id + '')

    const handleItemClick = (item: any) => {
      console.log(item) //拿到的是二级菜单proxy对象
      router.push(item.url)
    }

    return {
      store,
      userMenus,
      handleItemClick,
      router,
      defaultValue,
      route,
      currentPath
    }
  }
})
</script>

<style scoped lang="less">
.nav-menu {
  height: 100%;
  background-color: #001529;

  .logo {
    display: flex;
    height: 28px;
    padding: 12px 10px 8px 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .img {
      height: 100%;
      margin: 0 10px;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      color: white;
    }
  }

  .el-menu {
    border-right: none;
  }

  // 目录
  .el-sub-menu {
    background-color: #001529 !important;
    // 二级菜单 ( 默认背景 )
    .el-menu-item {
      padding-left: 50px !important;
      background-color: #0c2135 !important;
    }
    i {
      margin-right: 10px;
    }
  }

  ::v-deep .el-submenu__title {
    background-color: #001529 !important;
  }

  // hover 高亮
  .el-menu-item:hover {
    color: #fff !important; // 菜单
  }

  .el-menu-item.is-active {
    color: #fff !important;
    background-color: #0a60bd !important;
  }
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 100%;
  height: calc(100% - 48px);
}
</style>
