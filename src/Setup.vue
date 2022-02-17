<template>
  <div>
<!-- 这个里面是演示使用最新版本的 <srcipt setup>顶层setup的用法-->
  </div>
</template>
<!--
以前没有用script setup顶层语法之前的写法
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {


    return {}
  }
})
</script>
-->
<!--现在用vue3新特性script setup之后的写法-->
<script lang="ts" setup(props) {}>
//里面写的是以前setup（）函数里面的东西


</script>
<style scoped>

</style>
