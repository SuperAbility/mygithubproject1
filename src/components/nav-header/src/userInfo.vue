<template>
  <div class="userInfo">
    <el-avatar size="small" :src="circleUrl"></el-avatar>

    <el-dropdown>
      <span class="el-dropdown-link">
        <span>{{ userName }}</span>
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>退出登录</el-dropdown-item>
          <!--这句代码是加分割线-->
          <el-dropdown-item divided>用户信息</el-dropdown-item>
          <el-dropdown-item>系统管理</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, computed } from 'vue'
import { ArrowDown, SwitchButton } from '@element-plus/icons'
import { useStore } from '@/store'
export default defineComponent({
  components: { ArrowDown, SwitchButton },
  setup() {
    //通过vuex去模块里面取数据
    const store = useStore()
    const userName = computed(() => store.state.loginModule.userInfo.list[0].name)
    const state = reactive({
      circleUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      squareUrl:
        'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      sizeList: ['large', 'medium', 'small']
    })
    return { ...toRefs(state), userName }
  }
})
</script>

<style scoped lang="less">
.userInfo {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .el-dropdown-link {
    dispaly: flex;
  }
}
</style>
