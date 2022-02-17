<template>
  <div class="user">
    <!--h2元素自带上下margin-->

    <!--:formItems="formItems"
        :labelWidth="labelWidth"
        :itemStyle="itemStyle"
        :collLayOut="collLayOut"
        现在做的就是把多个配置项变成一个配置项，以后外界传值只在一个配置项里面-->

    <!-- 还是一样的，就是还是在公共表单组件里面props一个个表单上面值
由外界父组件传递
只不过现在在外界用这个表单组件的父组件里面把所有表单上面的
所有输入框里面值事先定义到一个对象reactive对象里面去了

然后再表单接收这个对象--------就是一个是单个管理一个是集中管理而已
 :formData="formData"
这个是第一种方式不管数据单向流操作原则
直接在子组件中修改父组件传递过去数据

第二种方式考虑Vue数据单向流设计原则：
不是直接在子组件中修改父组件里面传递数据值
    v-model="formData"组件的双向绑定
-->
    <!--这个user.vue中这块表单这块可能在多个组件里面都相似所以抽出去-->

    <!--里面全是表单的组件快速搭建是用elmenet组件库去搭建-->
    <page-search
      :searchFormConfig="searchFormConfig"
      @resetBtnClick="handleResetClick"
      @queryBtnClick="handleQueryClick"
    />
    <!--3--------表格展示数据处
      @selectionChangeToParent="selectionChangeToParent"---意思
      子组件表格里面监听到用户勾选哪一行的数据应该是在调用表格组件的父组件
      上面拿数据，所以表格里面勾选哪一行数据是要传到父组件里面来的-->
    <!-- 到时候这块表格组件里面的所有插槽和事件以及图标导入的代码要抽到
   pageWholeContent.vue这个新的大表格组件里面 表格组件里面写 -->
    <!--
    <back-stage-page-table
      :userData="userData"
      :title="title"
      :propList="propList"
      :showIndexColumn="showIndexColumn"
      :showSelectColumn="showIndexColumn"
      @selectionChangeToParent="selectionChangeToParent"
    >
    </back-stage-page-table> -->

    <!-- 上面所有原来小表格组件现在变成组合之后的pageWholeCotent.vue这个符合
   组件展示----即可达到抽取的是一个整体表格并且把所有配置项从user.vue中
   抽走目的 -->
    <pageWholeContent
      ref="pageContentRef"
      :TableContentConfig="TableContentConfig"
      systemDataName="userList"
    >
    </pageWholeContent>
    <!--公共table组件下面footer组件插槽结构定义-->

    <div class="content"></div>
  </div>
</template>

<script lang="ts">
/* 那怎么实现表单上面标签v-model里面值由外界传递
老是不是在表单组件定义props
而是在用它的父组件user.vue里面写代码-----奇怪 */
import { defineComponent, ref } from 'vue'
/* import myBackstageForm from '@/base-ui/BackstageForm/index' */
import { searchFormConfig } from './config/search.config'
/* 把抽取出去搜索表单那块公共的组件在不同的页面通过组件导入进来接口
这样在每个页面虽然导入的都是page-search组件
但是通过配置项和里面设置不同
头部展示出来效果也不一样 */
import PageSearch from '@/components/page-search'
//在user.vue中去请求数据通过useStore
// import { useStore } from '@/store'

/* 把公共展示网络请求数据的表格组件导入进来
注意table这个表格在很多项目中都是一样用所以应该放到
base-ui文件夹中 */
// import BackStagePageTable from '@/base-ui/table'

/* 1------关于这个大组件的表单组件构成的那些配置项JS代码全部抽取到search.config.ts文件中
那么这个组件其他组成部分的各自配置项有关JS代码----也应该抽到各自的
config.ts配置文件中-----才能保持整体步调一致

*/
import { TableContentConfig } from './config/content.config'
/* 导入复合表格组成三部分之后的表格组件 */
import pageWholeContent from '@/components/page-tablewholecontent'

import { AllPageSearch } from '@/hooks/allPageSearch'
export default defineComponent({
  name: 'user',
  //同时还要注册图标组件
  components: {
    // myBackstageForm,
    PageSearch,
    pageWholeContent
  },
  //写配置文件
  // const formItems: IFormItem[] =
  //在所有表单公共组件要展示的父组件那个路由组件定义一下labelwidth不同的值
  //由这个里面控制不同的表单项里面的lael宽度，这样label值可以由外界决定
  // const labelWidth = '120px'
  //在父组件里面就可以动态的传值决定el-form-item上面的这个间距属性大小
  //这样外界可以动态决定封装的任何属性和间距的扩展
  /*    const itemStyle = {
      padding: '10px 35px'
    } */
  //外界决定响应式布局的设计
  /*   const collLayOut = {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4
    } */
  //既然这个是一个配置项了不需要写到user.vue中
  //因为配置项是全局的不是一个外界组件的
  //注意reactive
  //注意这个里面原来有 const formData = ref但现在里面form表单那块抽到
  //page-serach文件夹里面封装去了，这一块也要抽走

  setup() {
    /* 现在都是三层结构封装，网络请求的代码也不写到父组件里面
    还要抽出去封装
    这段代码最后放在中间层page-search/pag-content里面
    他们根据父组件传递不同名称请求不同网络
    */
    //把hooks里面函数解构出来
    const [pageContentRef, handleResetClick, handleQueryClick] = AllPageSearch()

    const selectionChangeToParent = (value: any) => {
      console.log('父组件里面的value勾选值', value)
    }
    //page-search里面重置按钮和搜索按钮转移到他们父组件里面来

    /* 记住凡是在最外层组件里面写的逻辑代码

在所有页面都重复写使用

比如菜单里面的搜索和重置交互功能代码就是每个外层组件里面都是一样的

凡是最外层组件里面重复的逻辑抽取-----抽到到src文件夹下的hooks文件夹里面

  */

    return {
      // title,
      searchFormConfig,
      selectionChangeToParent,
      TableContentConfig,
      handleResetClick,
      handleQueryClick,
      pageContentRef
      /*  store,
      userData,
      totalCount */
      // propList,
      // showIndexColumn,
      // showSelectColumn,
    }
  }
})
</script>

<style scoped>
.el-form-item__label-wrap {
  margin-left: 0 !important;
}
</style>
