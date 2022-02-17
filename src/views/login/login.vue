<template>
  <!--
一个项目才搭建出来是需要用css对项目的一些边距设计进行初始化
第一步你可以去github上面去下载normalize.css文件引入到项目里面来
或者你可以在终端使用 npm install normnalize.css

-->

  <div class="login">
    <!------------------登录面板界面---------------------->
    <loginPanel />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
//1------------导入登录面板组件
import loginPanel from './cpns/loginPanel.vue'
export default defineComponent({
  components: {
    loginPanel
  }
})
</script>

<style scoped lang="less">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('../../assets/img/login-bg.svg');
}
</style>
