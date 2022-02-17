<template>
  <div class="app">
    <!--
 <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  <router-link to='/main'>主页</router-link>
  <router-link to='/login'>登录页</router-link>
  <router-view></router-view>
  <h1>这是一个vuex验证的结果:{{$store.state.data}}</h1>
elementplus局部引入使用
<el-button type="success">局部引入组件库</el-button>
<el-button type="primary">局部引入组件库</el-button>
<el-button type="info">局部引入组件库</el-button>
-->
    <!--elementplus全局引入使用可以显示

但是有个问题就是样式没有
npm install babel-plugin-import -D

-->
    <!--  <h1>这是一个vuex验证的结果:{{$store.state.data}}</h1> -->
    <!-- <router-link to="/login">登录</router-link> -->
    <!--这个国际化组件elementPlus组件
 <template>
  <el-config-provider :locale="locale">
    <app />
  </el-config-provider>
</template>
用法是在APP.VUE里面包裹里面的router-view视图

-->
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
    <demo1/>
  </div>
</template>

<script lang="ts">
/* elementplus这种组件库怎么局部引用 就是在局部的组件JS里面
//按照需求引用对应的组件
//所谓局部导入就是手动导入，记住全局导入UI组件库是在webpack,vite这些构建工具
//打包的入口文件main.ts中导入的是------全局的
UI组件库局部导入----都是在用到组件库的一个个组件，去从elmentplus里面用什么
导入什么
import  {ElButton } from 'elment-plus'用button就导入button
注意局部导入要在组件里面注册
优点:就是打包体积小
缺点;每个组件里面用到重复的组件还要重复的写
*/

import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
//defineComponent在TS里面才有作用
export default defineComponent({
  components: {
    ElConfigProvider,

  },
  setup() {
    return {
      locale: zhCn
    }
  }
})
</script>

<style lang="less">
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
 } */
.app {
  width: 100%;
  height: 100%;
}
</style>
