<template>
  <div class="navHeader">
    <i
      :class="isFold ? 'iconfont icon-zhankaimulu' : 'iconfont icon-zhankai21'"
      @click="handleFoldClick"
    ></i>
    <div class="content">
      <div>面包屑</div>
      <!--头部面包屑导航展示不同的菜单选项切换指示面包屑导航这个组件
代码也很多要单独封装一个组件
记住父组件里面不能出现子组件代码结构
父组件里面所有子组件的模板结构代码都应该单独抽出去封装
      -->

      <zgnavbreadcrumb :breadcrumbs="breadcrumbs"></zgnavbreadcrumb>
      <!--头部最右侧那个头像下拉退出登录代码组件抽出去-->
      <userInfo />
    </div>
  </div>
</template>

<script lang="ts">
import userInfo from './userInfo.vue'
import { defineComponent, ref, computed } from 'vue'

import zgnavbreadcrumb, { IBreadCrumb } from '@/base-ui/NavBreadCrumb'

/* 要把封装实现breadcrumbs根据路径找到一级二级菜单函数导入进来 */
//把里面参数当前store和当前路径一起拿到
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { pathMapBreadCrumb } from '@/utils/map-menus'
export default defineComponent({
  components: { userInfo, zgnavbreadcrumb },
  //1-----nav-header传递事件给父组件main.vue 用emits
  //里面是子组件上面的事件名字
  emits: ['foldChange'],
  //2-----把props和emit拿到
  setup(props, { emit }) {
    //面包屑导航外界传递进去的数组值
    const store = useStore()

    const breadcrumbs = computed(() => {
      const route = useRoute()
      const currentPath = route.path
      const userMenus = store.state.loginModule.userMenus
      pathMapBreadCrumb(userMenus, currentPath)
    })
    console.log(breadcrumbs)
    /* 面包屑导航的展示 */
    const FirstLevelMenu = computed(
      () => store.state.loginModule.userMenus[0].name
    )
    const twoLevelMenu = computed(
      () => store.state.loginModule.userMenus[0].children.name
    )
    //默认情况下是不折叠的----默认情况下是不折叠的----
    //这个不是展开左侧菜单折叠收缩是指的折叠和展开两个图标之间的切换
    const isFold = ref(false)
    const handleFoldClick = () => {
      //点击折叠变成展开，展开变成折叠
      isFold.value = !isFold.value
      //子传父发射方法
      emit('foldChange', isFold.value)
    }
    return {
      handleFoldClick,
      isFold,
      FirstLevelMenu,
      twoLevelMenu,
      store,
      breadcrumbs
    }
  }
})
</script>

<style scoped lang="less">
.navHeader {
  display: flex;
  width: 100%;
  i {
    font-size: 26px !important;
    cursor: pointer;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 0 20px;
  }
}
</style>
