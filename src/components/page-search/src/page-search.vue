<template>
  <div class="page-search">
    <myBackstageForm v-bind="searchFormConfig" v-model="formData">
      <!--这个用表单的组件里面在表单组件里面传递不同的值显示插槽内容
vue3里面v-slot在模板里面动态决定匿名插槽的时候
v-slot:简写#
怪不得在组件库里面看到#abc这种符号的原来具名插槽
-->
      <template v-slot:header>
        <!--插槽里面的样式在组件内部自己调整即可-->
        <h1 class="title">高级检索</h1>
      </template>
      <!--第二个插槽里面搜索重置按钮的实现
  有组件库按钮尽量用组件库里面的按钮不要用原生的Button-->
      <template #footer>
        <div class="btns">
          <el-button type="primary" @click="queryClick">搜索</el-button>
          <el-button type="primary" @click="resetClick">重置</el-button>
        </div>
      </template>
    </myBackstageForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import myBackstageForm from '@/base-ui/BackstageForm/index'
export default defineComponent({
  /* 上面表单组件上面还有一个v-bind="searchFormConfig"配置项
这个配置应该是外界传递进来的
    */
  props: {
    searchFormConfig: {
      type: Object,
      required: true
    }
  },
  components: {
    myBackstageForm
  },
  //定义重置搜索里面发射事件
  emits: ['resetBtnClick', 'queryBtnClick'],
  setup(props, { emit }) {
    // {
    //把原来写在user.vue里面的抽到这个里面来了就是表单头部带搜索那块内容
    //把表单里面输入框里面的value值根据表单属性一个个枚举出来写到
    //reactive定义的对象不适合用在v-model="formData"双向绑定上OK
    /* 这一块数据结构变量是写成固定的了---存在问题：
      这个里面变量名应该根据searchconfig.ts这个配置
      文件对象里面名字自动修改

      什么意思比如form formItems: [
    {
      field: 'id',现在这个id是和formData id属性名一致的
      好了我现在修改field: 'abc',之后
      两边名字又不一致了
      你现在是不是手动
      formData ={  id: '',去改这个里面id名字为ab才行
      username: '',
      password: '',
      sport: '',
      createTime: ''
      }
      type: 'input',
      label: 'id',
      rules: [],
      placeholder: '请输入id'
    },
    //里面就是一个个配置项就是利用Input标签上面的不同属性传值配置不同的input
    {
      field: 'username',
      type: 'input',
      label: '用户名',
      rules: [],
      placeholder: '请输入用户名'
    },

      */
    //这里面表单上面的获取页面输入值得属性
    //要动态的根据不同页面显示不同属性个数和名字---不能像下面写成固定的
    //
    /*   id: '',
      username: '',
      password: '',
      sport: '',
      createTime: '' */
    //}
    /*1----- 双向绑定的属性应该是由配置文件里面的field属性名字动态决定的
      这边可以拿到 searchFormConfig这个配置项对象
      */
    const formItems = props.searchFormConfig?.formItems ?? []
    /* 2-----遍历 formItems这个对象里面额field取出来动态的放到formData对象中
     */
    //定义一个表单原始数据对象
    const formOriginData: any = {}
    for (const item of formItems) {
      //遍历出来是里面每个input配置对象
      //把item.field的后面的id,name值全部取出动态的取出来属性全部放到一个对象里面
      //
      formOriginData[item.field] = ''
    }
    //把上面具有动态获取filed的对象formOriginData放到这个formData里面来
    //之后就formData 里面表单上面属性就不是写成固定的了，是根据组件动态变化了
    const formData = ref(formOriginData)
    /* 把components写到setup里面来了所以页面上数据解析出来的全是
[objcet,object] */
    //2-----------------------第二个优化当用户点击重置按钮的时候

    /* 把page-search里面的点击事件全部发送到他们父组件里面去

    这样才好由他们父组件去拿page-content里面网络请求方法
    进行重置，重新渲染功能
    */
    //重置按钮点击事件监听
    const resetClick = () => {
      //所谓重置功能就是把formData对象里面的值再
      //设回最初始化没值对象formOriginData即可
      // for (const key in formOriginData) {
      //   formData.value[`${key}`] = formOriginData[key]
      // }

      formData.value = formOriginData
      emit('resetBtnClick')
    }
    //搜索按钮点击事件监听
    const queryClick = () => {
      /* 搜素按钮到底做哪些逻辑事情
其实就是根基用户输入的value值对应的field字段去表格里面
找和field对应的表格行字段
用上面的字段去表格行字段整体数据里面去搜索的功能

*/
      //重置是么有参数，这个查询是有参数的，就是表单上面绑定的数据对象
      emit('queryBtnClick', formData.value)
    }
    return { formData, resetClick, queryClick }
  }
})
</script>

<style scoped>
.title {
  color: blue;
}
.btns {
  text-align: right;
  padding: 0px 20px 10px 0px;
}
</style>
