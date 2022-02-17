<template>
  <!--后台首页组件的搭建

对于后台管理系统这种布局
一种方案是自己用div弹性布局慢慢去搭建
第二种就是到网上找一些后台管理系统模板下来直接复制粘贴改改即可
第三种：就是利用elementPlus组件库里面的container布局容器快速搭建一个布局
页面
然后往这个布局页面各块区域里面去填充其他的element组件库中组件就完成了后台首页
-->
  <div class="main">
    <!--采用elementPlus第六个布局没效果是应该手动按需引入
中没有el-container el-aside el-main这三个组件的导入
所以现在要在global全局的文件夹里面把这些组件库的按需引入导入一下-->
    <el-container class="main-content">
      <!--菜单折叠展开收缩不光是事件传递而且这个宽度也是随着变量改变
所以子组件最好传递给main.vue父组件，再由父组件传递给另一个子组件
这样main.vue中方便拿width属性
isCollapse就是isFold那2个图标切换状态
如果是收缩这个侧边栏就是60px宽度
如果是展开图标就是210px----这样点击图标同步变化
    -->
      <el-aside :width="isCollapse ? '55px' : '210px'">
        <!--左侧菜单栏是用elementplus里面的menu菜单组件搭建的
因为这个菜单不是这一处用多处用所以抽出去封装成一个独立的组件
nav-menu
   -->
        <nav-menu :collapse="isCollapse" />
      </el-aside>
      <el-container class="page">
        <!--这一块就是后台上面看到的那个面包屑按钮可以折叠左侧导航菜单地方-->
        <el-header class="page-header">
          <nav-header @foldChange="handleFoldChange" />
        </el-header>
        <!--这一块是设置主菜单路由跳转显示的-->
        <el-main class="page-content">
        <!--给所有跳转的路由组件视图包裹一层div是为了方便以后每个组件的
        背景色调控-->
          <div class="page-info">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import NavMenu from 'components/nav-menu/src/nav-menu.vue'
import NavHeader from 'components/nav-header/src/nav-header.vue'
export default defineComponent({
  components: {
    NavMenu,
    NavHeader
  },
  setup() {
    //上面宽度是用到这个isFold状态同步变化的
    //换一个单词记录状态
    const isCollapse = ref(false)

    //这个就是main.vue接收nav-header中那个折叠展开图标状态参数的事件
    const handleFoldChange = (isFold: boolean,FirstLevelMenu:string,twoLevelMenu:string) => {
      console.log(isFold)
      isCollapse.value = isFold
    }
    return { handleFoldChange, isCollapse }
  }
})
</script>

<style scoped lang="less">
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.main-content,
.page {
  height: 100%;
}

.page-content {
  height: calc(100% - 48px);

  .page-info {
    background-color: #fff;
    border-radius: 5px;
  }
}

.el-header,
.el-footer {
  display: flex;
  color: #333;
  text-align: center;
  align-items: center;
}

.el-header {
  height: 48px !important;
}

.el-aside {
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 200px;
  text-align: left;
  cursor: pointer;
  background-color: #001529;
  transition: width 0.3s linear;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none;
  }
}

.el-main {
  color: #333;
  text-align: center;
  background-color: #f0f2f5;
}
</style>
