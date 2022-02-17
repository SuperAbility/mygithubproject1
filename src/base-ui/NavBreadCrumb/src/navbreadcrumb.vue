<template>
  <div class="breadcrumb">
    <!--后台头部页面的导航面包屑的封装-->
    <el-breadcrumb separator="/">
      <template v-for="item in breadcrumbs" :key="item.name">
        <el-breadcrumb-item :to="{ path: item.path }">{{
          item.name
        }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IBreadCrumb } from '../types'
export default defineComponent({
  //这个封装的面包屑组件里面的具体内容展示应该是用它的外界组件传递进来的数组
  //决定的，最终会遍历展示里面的内容对吧
  //所以这个里面要用props
  porps: {
    breadcrumbs: {
      //凡是props里面传递的是数组类型必须用propType类型动态的由外界传递进来的
      //类型进行推断
      type: Array as PropType<IBreadCrumb[]>,
      deafult: () => []
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped></style>
