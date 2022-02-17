<!--

这个里面是登录面板的组件设计，凡是一个组件的子组件都要在这个组件里面
新建文件夹cpns里面放一个个子组件

1--------凡是和当前项目有关的业务组件就是这个组件多次出现，只在这个项目里面
类似于vue2里面的content文件夹作用-----放到components文件夹中

2--------凡是多个项目多次重复的组件，比如导航组件，这个放公共组件
放到base-ui文件夹中
-->
<template>
  <div class="loginPanel">
    <h1 class="title">后台管理系统</h1>
    <!--用elementPlus搭建一个tabs选项卡登录页面
   因为是按需引入，用到哪个组件才引入它，
   所以你要到elementplus封装的那个里面把
   el-tabs填进去
   其实两个都是要自定义的因为tab选项上面有图片有文字
   自己研究一下结构
   stretch------标签的宽度是否自动撑开
   -->
    <el-tabs type="border-card" stretch v-model="currentTab">
      <el-tab-pane name="account">
        <template #label>
          <span>
            <el-icon><calendar /></el-icon>登录账号
          </span>
        </template>
        <!--由于账号登录选项卡下面的内容和手机登录选项卡下面的内容
这两块逻辑不一样，分别单独封装成2个组件
不然这个login-panel组件里面逻辑太多了
相当于一个组件里面的逻辑太多就要抽取出去
        -->
        <!--这块复杂的逻辑用组件抽取出去完成
父组件拿子组件的数据不一定非要$emit传递事件
其实可以在父组件里面把子组件标签上绑定ref拿到子组件对象去获取里面的值

        -->
        <loginAccount ref="accountRef" />
      </el-tab-pane>
      <el-tab-pane name="phone">
        <template #label>
          <span>
            <!--就是新版的elementPlus里面图标变成组件了要想显示
          必须全局或者局部要导入这个组件，注册才能使用-->
            <el-icon><cellphone /></el-icon>手机账号
          </span>
        </template>
        <!--这块复杂的逻辑用组件抽取出去完成-->
        <loginPhone ref="phoneRef"/>
      </el-tab-pane>
    </el-tabs>
    <!--记住密码勾选这一块是用的checkbox组件
   和一个linK文字链接组成的-->
    <div class="account-control">
      <el-checkbox v-model="isPassword" label="记住密码"></el-checkbox>
      <el-link
        type="primary"
        href="https://element.eleme.io"
        target="_blank"
        :underline="false"
        >忘记密码</el-link
      >
    </div>
    <!--3--------立即登录按钮的实现
监听立即登录点击事件
立即登录按钮会验证loginAccount用户登录这块几个输入框验证规则
   也同时会验证手机登录那几个验证框输入规则
   只有他们通过验证了，立即登录才能跳转
   那立即登录这个所有逻辑应该写到哪里好:
   立即登录里面的逻辑操作----其实都是各自的子组件里面的验证规则逻辑
  不应该把子组件验证规则逻辑写到父组件JS中这样管理不方便--逻辑不清晰

  就是子组件上面表单验证就写到对应子组件里面
  父组件只管理搭建子组件整体结构的功能

  这样层次才能清晰，不是看到立即登录按钮在父组件里面，它的点击事件功能‘
  就要写到父组件里面----这个固化的思维要分析全局



-->
    <el-button type="primary" class="loginbutton" @click="handleLoginClick"
      >立即登录</el-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
//把loginpanel里面抽取的2部分逻辑太多的2个组件导入进来，这两个组件的逻辑就单独
//到外边去写了
import loginAccount from './loginAccount.vue'
import loginPhone from './loginPhone.vue'
//注意哦

export default defineComponent({
  components: { loginAccount, loginPhone },
  setup() {
    //1.定义属性
    const currentTab=ref<string>("account")
    //复选框的选中状态用个值记录下来
    //布尔类型的值是is开头做为和其他类型的变量区分
    const isPassword = ref(true)
    //在setup中怎么获取组件里面的ref绑定对象
    //其实就是在对应组件里面绑定一个ref名字
    //在setup中把上面绑定的ref名字定义一个变量赋值ref(null)就拿到了
/* 怎么在ts中获取一个组件对象的类型
因为ref后面要放的是ref引用的那个组件对象类型才是最合适
<typeof loginAccount>-----这个是固定的语法，泛型里面用typeof加
  <loginAccount组件标签的名字或者是组件里面的name名字
  但是我们获取的不是组件对象类型，这个获取的应该是组件对象实例里面的类型
  那怎么在ts中获取组件对象实例类型<InstanceType<typeof loginAccount>>
  就是在组件对象类型外面包一层泛型里面写InstanceType
*/
   const accountRef = ref<InstanceType<typeof loginAccount>>()
   const phoneRef = ref<InstanceType<typeof loginPhone>>()
    //立即登录按钮点击
    //登录后向服务器请求到的数据token,userInfo这些应该保存到vuex中才对
    //而不是把登录的数据保存到当前组件里面
    //因为登录接口获取到的数据是项目中多处使用，并不是一处使用，应该是全局的
    //应该登录所有的逻辑都应该放到vuex中管理
    const handleLoginClick = () => {
      //在父组件里面点击事件触发子组件里面的方法,
      //就是在父组件方法里面调用子组件方法
      //为什么用any不行因为你这个调用函数名字可以随便写，写的不是子组件里面
      //那个函数名字也不会报错---这就是代码隐患
      //上面获取到组件对象实例类型给accountRef了你现在函数名在乱写就报错了
      //ref<InstanceType<typeof loginAccount>>()但是后面是空的也可能被认为
      //value是undefined值所以value要是可选的
      //账号登录
      if(currentTab.value==='account'){
      accountRef.value?.loginAction(isPassword.value)//在父组件中触发能调子组件那么验证
      //逻辑就到子组件里面写了不用在父组件里面写
      }else{
      console.log("调用loginphone里面对应的方法");
      }
    }

    return {
      isPassword,
      handleLoginClick,
      accountRef,
      currentTab,
      phoneRef
    }
  }
})
</script>

<style scoped lang="less">
.loginPanel {
  width: 320px;
  /* 一般登录主体要在居中的位置往上一点点感觉才好 */
  margin-bottom: 150px;
  .title {
    text-align: center;
  }
  .el-icon {
    margin-right: 10px;
  }
  .account-control {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .loginbutton {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
