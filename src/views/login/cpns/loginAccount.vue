<!--loginaccount就是用户登录那个底下的内容逻辑组件-->
<template>
  <div class="loginAccount">
    <!--这个里面是2个输入框，但一些输入框的验证规则
要是自己去写这些JS比较麻烦.elementPlus组件库里面表单里面有这个功能
就去用组件库里面的去搭建
使用的是elForm里面的自定义验证规则这个来搭建的
label="账号"这个属性写到标签是给表单项里面的input输入框前面加入文字
label-width="60px":指的表单里面的input长度
 -->
    <!--规则rules对象定义好了该怎么在组件DOM中使用
就是在el-form上面绑定一个
 :model="account"是为了拿到底下最新的值动态在根据每个item属性就知道

 符合不符合规则了
 -->
    <!--:rules="ruels"
    inline="true"就是把dispaly:flex变成display:inline-flex而已-->
    <el-form
      label-width="60px"
      :rules="rules"
      :model="account"
      :status-icon="true"
      ref="formRef"
    >
      <!--那怎么知道下面那个input是验证用户名还是密码
 是通过在form-item里面写上属性props
prop="name"会自动在作用域里面去找name字段的输入框去验证
 -->

      <el-form-item label="账号" prop="name">
        <!--底下既然把用户姓名和密码保存到字段里面，那么就希望这个输入框输入的值
      绑定到name中
      在vue中输入框里面的值和自定义值响应的话就是通过v-model属性
      那么el-input里面也有v-model属性-->
        <el-input v-model="account.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <!--底下既然把用户姓名和密码保存到字段里面，那么就希望这个输入框输入的值
      绑定到password中-->
        <!--为什么看上去和老师的代码一样为什么验证无效果：
第一：在elementPlus表单组件里面无效果的原因
  <el-form label-width="60px"
    :rules="ruels"  你定义的规则叫rules 你写成ruels那肯定绑定不了规则
    单词字母写错了------------------这个错误很难发现无效果

    第二：   <el-form-item label="账号" prop="name">
    正确的el-from绑定 :rules="ruels"  prop是写到el-form-item标签里面的
     <el-form-item label="账号" prop="name">---这样写才有效


    但是你 <el-input v-model="account.password" prop="password" ></el-input>
    你把prop属性写到的是el-input上面告诉你就无效
-->
        <!--show-password="true" 你输入密码是隐藏的，默认值是true密码看得见-->
        <el-input v-model="account.password" :show-password="true"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent,onMounted } from 'vue'
import { ref, reactive } from 'vue'
//首先缓存的工具封装好了，外面组件想要用就要导入缓存封装函数进来
import localCache from '@/utils/cache'
//这个是为了导入组件库里面组件类型
import { ElForm } from 'element-plus'
//把导出去的配置再导入进来
import { rules } from '../config/account-config'

/* 你要想使的组件和vuex之间建立联系必须要取得store */
import { useStore } from 'vuex'
export default defineComponent({
  //表单里面的值要保存起来
  setup() {
    /* form表单里面的输入框校验规则提示那些也是不是它组件里面自带的功能
是用到了一个 async-validator库 */
    /* 因为账号和密码比较联系紧密
用户姓名和密码
name 和password */

    //1-------表单里面所有输入框的校验规则在这个地方编写
    /* 在开发中规则编写有2个方案：
第一个：把规则写到一个个form-item上，这样每个form-第一个：把规则写到一个个form-item上，这样每个form-item有自己规则在自己作用域里面
第二个就是：在el-form上面绑定一个对象，这个对象里面放着所有规则
这样规则传给el-form自己去找item去验证
*/

    /* 这个rules配置的全是表单里面的一些验证规则的逻辑代码
这个可以抽出去，不然放到这个里面代码太多了
一般像这种逻辑抽出去有2种方案：
一个是抽到hooks文件夹里面去当做函数：一般逻辑里面牵涉到ref/reactive/onmounted
这些响应式组合API的时候最好抽成hooks

而是抽到一个config文件夹下当做一个配置文件（就是没用到那些组合API抽成配置）
在哪个组件里面的逻辑，就在对应组件文件夹里面建立config或者hook
*/
    //在组件里面定义点击登录的方法
    //立即登录用户账号的验证在子组件中写
    /*
      这个验证功能不是组件库里面上面写错了提示那些验证
因为写错了不符合正则那些提示验证，我底下点击立即登录按钮照样可以登录
验证功能----指的是点击立即登录把组件库里面的验证用JS写一遍
  */
    /* 表单验证之前先用ref绑定el-form获取对象接下来才好进行验证
 el-form这个组件类型就是ElForm类型因为是局部引入
 要在这个组件里面导入这个类型
 */

    //就是通过el-form上面的方法validate进行验证
    //如果验证通过valid值是true，否则是个fasle
    //这个是点击登录按钮对表单上面所有东西进行验证
    //所以要判断valid为true或者false下做不同的操作
    //就是立即登录做2件事情：
    /* 就是验证所有的输入框是否输入争取通过检验规则，并且底下复选框记住密码
        是否打钩
然后点立即登录把每次用户名密码给保存到本地或者数据库记录下来
下次你输入会进行对比，不对就不允许进去

        */
    //    const isPassword = ref(true)就是这个变量在loginpanel父组件里面
    //要在这个子组件中拿到父组件这个变量状态用来记录
    /* 既然子传父数据不需要通过$emit 那么父传子数据也可以不需要props属性绑定传递

accountRef.value?.loginAction(isPassword.value)
因为这个在loginpanel父组件里面所以把父组件里面的记录记住密码状态的isPassword.value
传进去
再这个loginaccount函数参数接收过来哦不就拿到父组件里面的数据了

*/
    /* 而且当前我们的项目中很多地方都要缓存loaclstroage
不仅仅是你看到的这里用户名和密码
还有token,和一些其他状态
既然多处用到它，就要把缓存的逻辑写成全局的
那就是在src文件夹下建立一个utils文件夹里面放很多工具函数

     */
    /* 如果选中记住密码的情况下就是调用缓存里面的保存方法
    里面的key是用户名输入框的value
    value就是密码输入框的value

    注意哦localCache.setCache是把表单里面的输入框里面的值一个个的保存
因为一个输入框value对应一组数据
不好同时一个里面写保存密码和用户名分开写
检查就是你在用户名和密码框输入正确的验证值
点击立即登录本地就有缓存了
    */
    /* Loginpanel父组件里面的立即登录按钮点击触发的是子组件loginAccount里面的
这个函数----这个函数----目的是各自子组件验证功能写到各自子组件里面方便管理
     loginAccount-----现在这个子组件里面里面的用户输入和密码一系列登录逻辑
     不是直接写到这个组件里面来的是通过提交commit给vuex触发vuex中的actions管理的
     原因是：登录提交给服务器的信息是多处要用的不是你这个组件里面用
所以不是loginaccount里面功能给vuex做这个函数里面就不写东西了
记住vuex运行图：
上面是组件提交commit和dispacth来触发vuex里面的mutations和actions里面的函数
’修改状态
组件要想和vuex通信必须提交----组件要想和vuex通信必须提交----点立即登录按钮通过这个子组件、
要触发vuex里面的函数------才算达到真正的提交效果
*/
    const store = useStore()
    const loginAction = (isPassword: boolean) => {
      console.log('子组件用户登录开始触发了')
      //1------立即登录按钮验证用户输入信息
      formRef.value?.validate((valid) => {
        if (valid) {
          //1-------验证通过第一步记住密码复选框打钩的判断//是否记住密码

          //判断这个状态是否选中
          if (isPassword) {
            //记住密码里面做一个本地缓存即可

            localCache.setCache('name', account.name)
            localCache.setCache('password', account.password)
          }
          //当然别人点了不要记住密码的情况下是要把页面缓存清除掉的
          //并不是页面上面的输入框缓存数据没了，而是记住密码取消点击登录按钮
          //本地缓存里面的name和password被删除；
          else {
            localCache.deleteCache('name')
            localCache.deleteCache('password')
          }
          //2---登录验证
          //2-----验证通过提交给服务器，就是触发vuex里面的actions
          //第二个参数是账号和密码 对account对象解构
          //注意这个代码是放到验证表单里面的不是外面的
          //是验证通过了提交
          //store.dispatch('loginModule/accountLoginAction' 这个里面提交方法前面
          //加loginModule/目的是因为你这个vuex模块用了命名空间必须通过根模块对象名/
          //加命名空间方法才能访问
          // store.dispatch('loginModule/accountLoginAction', { ...account })
          store.commit('loginModule/accountlogin1', { ...account })
        }
      })
    }
    
    const formRef = ref<InstanceType<typeof ElForm>>()
    //但是上面缓存在页面一刷新页面上就没有缓存数据了
    //因为你底下设置的name和password默认情况下是空的，是清空缓存的‘
    //所以要把这两个值变成缓存里面的获取缓存方法值，这样就有缓存了
    const account = reactive({
      //1---默认空是清空页面缓存数据
      // name: '',
      // password: ''
      //2-----这个缓存里面的获取缓存才是保存上一次缓存数据展示
      //?? ''代码如果获取是空字符串就给一个默认空值
      name: localCache.getCache('name') ?? '',
      password: localCache.getCache('password') ?? ''
    })




    return {
      account,
      //注意哦虽然这个rules导出去了配置但导出去的只是主体逻辑代码
      //还是要这个里面return
      rules,
      loginAction,
      formRef,
      store,

    }
  }
})
</script>

<style scoped></style>
