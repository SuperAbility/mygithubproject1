<!--loginPhone这个组件是手机登录选项卡下面的内容抽取-->
<template>
  <div class="phone">
    <el-form label-width="60px">
      <el-form-item label="手机号" prop="phoneId">
        <el-input v-model="phone.phoneId"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode" class="verifyCode">
        <el-input v-model="phone.verifyCode"></el-input>
        <el-button type="primary">验证码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const phone = reactive({
      phoneId: '',
      //验证码
      verifyCode: ''
    })
    return {
      phone
    }
  }
})
</script>

<style scoped>
.verifyCode .el-form-item__content {
  display: flex;
}
</style>
