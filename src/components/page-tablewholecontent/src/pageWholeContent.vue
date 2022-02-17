<template>
  <!--这个组件文件夹是用来把表格组件和上下2个组件合成一个组件整体抽成去
到这个组件封装的-->
  <div class="tableContent">
    <!-- 就是像一个公共的组件，多个组件都在使用这同一个组件进行
    传递配置项和网络要求
    一个公共的组件结构上面绑定相同的配置项名字怎么能实现，不同的页面
    点击显示不同的配置项效果v-bind="TableContentConfig"
    v-bind="TableContentConfig"就这一句话：
1------------记住在编程里面如果多个页面都运用一个页面结构在里面进行不同的体验
那么这个页面上面的数据肯定是动态的，不是写成固定的，而且这一个变量值
应该是由外界用它的组件里面传递不同的数据进来显示不同的配置


----------------------记住上面这个是实现在同一组件上面绑定同一个值，显示
不同功效的思路-----所以这个公共组件上面配置项TableContentConfig
本来就是外界父组件传递进来得动态值-----所以配置项是动态的不需要考虑了


2------------但是网络请求的代码不是放到父组件里面，放到的是当前组件里面
网络请求userData怎么随着外界父组件变化了----显然要对userData
进行分不同的网络请求情况进行判断---switch

但是如果有100个接口那要枚举100个这样效率肯定低下
所以就要找这些网络请求之间公共的部分，把不同的进行抽取

如果是接口的话-----就是根据请求的url:/url/list规律做发展
因为每个网络请求是url不一样而已
如果url是由外界父组件传递进来的对应值得话那不是网络请求也是动态的吗？
/urlName/list


如果你是用本地数据不是用服务器接口数据：那么久根据请求本地数据代码进行修改
和url无关了
store.state.systemModule.usrList
store.state.systemModule.RoleList
store.state.systemModule.MenuList
你看上面可以合成一句代码store.state.systemModule[systemDataName1]
不用点语法原因点语法后面值必须是常量，而现在这个值是变量
所以用选择元素的数组语法

到时候ystemDataName1值放到props里面由父组件传递userList,RoleList,MenUliST
不够大功告成了
     -->
    <!--分页器里面的total总数应该是由分页器摆放的组件标签上面动态传递的-->
    <Wholetable
      v-bind="TableContentConfig"
      :userData="systemDataNameData"
      :totalCount1="totalCount"
      v-model:page="pageInfo"
    >
      <!--表格里面数据用slotName进行动态区分要修改的几列之后
就可以在这个里面任意修改你想改的那个插槽了
我知道原理了-----就是el-table-column里面的数据是用插槽行来个性化设置
之后在这些数据里面放一个插槽

这个插槽是一个具名插槽----其实就是名字是根据配置项里面要修改的那几个对象绑定
上去进行数据范围缩小
这样有了这个动态slotName选择之后
那么你在源头里面即可以用slotName.a slotName.b slotName.c进行小范围
区分那几个修改的插槽任意取出来修改了----就达到了大范围数据里面
只修改几个，其他是默认情况
这几个通过动态插槽名字进行区分单独设置的效果

-->
      <!--只会改整个数据状态一栏
插槽里面的子插槽可以把数据传递给父插槽
也就是全程用一个scope.row这个行数据传递来传递去的去实现
      -->
      <template #status="scope">
        <!-- scope.row.enable ? '启用':'禁用'这个意思
scope.row.enable如果这个值有值显示启用
无值显示禁用
原来01数字控制文本的转换是这样形成的
      -->
        <!-- 对作用域插槽里面的单列样式进行优化
 :type="scope.row.enable?'success':'danger'
 这一句话意思就是启用和禁用按钮是2种不同的类型
 不能写成固定类型----这个按钮样式类型应该应该根据
 scope.row.enable?值判断
 -->
        <el-button
          size="mini"
          :type="scope.row.enable == 1 ? 'success' : 'danger'"
          >{{ scope.row.enable == 1 ? '启用' : '禁用' }}</el-button
        >
      </template>
      <!--只会改整个数据中创建时间一栏格式-->
      <template #creatAt="scope">
        <!-- 把后台服务器返回的UTC时间格式化成用户能够看得懂
        的时间格式在页面展示
用app.config.globalProperties定义的属性在组件里面
怎么使用
就是要把格式化的服务器返回的时间当做参数传递到全局这个属性里面来
即可
        -->
        <span>{{ $TimeFilters.formatTime(scope.row.creatAt) }}</span>
      </template>
      <template #updateAt="scope">
        <span>{{ $TimeFilters.formatTime(scope.row.updateAt) }}</span>
      </template>
      <!--最右侧操作列的插槽这个里面不需要使用作用域插槽不需要拿到这一行数据
       所以#operation="scope"----变成#operation-->
      <template #operation>
        <div class="operation">
          <el-button type="text">
            <el-icon>
              <edit></edit>
            </el-icon>
            编辑</el-button
          >
          <el-button type="text">
            <el-icon>
              <delete-filled />
            </el-icon>
            删除</el-button
          >
        </div>
      </template>
      <!--公共table组件上面header组件插槽结构定义
      这个插槽里面有2块一块是左侧标题，一块是右侧handle处理数据的部分
      底下这个插槽不是拿的上面头部整个插槽，而是拿的里面右侧部分的插槽-->
      <template #headerHandler>
        <el-button @click="addNewUser" type="primary" size="medium"
          >新建用户</el-button
        >
        <el-button @click="EditNewUser" type="success" size="medium"
          >编辑用户</el-button
        >
        <el-button>
          <el-icon><refresh /></el-icon>
        </el-button>
      </template>
      <!--公共table组件上面header组件插槽结构定义-->
    </Wholetable>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import Wholetable from '@/base-ui/table'
//要想使用elementPlus3新版本icon图标必须导入组件
//记住elmentPLus组件库里面的图标新版本只是把旧版本的图标升级成组件了
//以组件的方式引入，至于这些图标路径放到哪里怎么看
//npm install @element-plus/icons-vue---你用这个
//安装路径就是@element-plus/icons-vue
//npm install @element-plus/icon---你用这个
//安装路径就是@element-plus/icons-vue
import systemModule from '@/store/main/system/system'
import { Edit, DeleteFilled, Refresh } from '@element-plus/icons-vue'
import { useStore } from '@/store'

export default defineComponent({
  components: {
    Wholetable,
    Edit,
    DeleteFilled,
    Refresh
  },

  /* 就是user.vue里面的那个表格table.vue公共组件现在要进行扩展了
  要把这个组件变成一个包含table+table-header+table+footer三部分合成的
  公共组件-----因为这三块才是整体多个后台页面重复的表格最大区域使用
  所以要把这里面有关的配置全部拿过来

  不光要拿到而且还要由使用他们的父组件动态的传值决定
  所以这个里面用props去接收各个父组件拿到的TableContentConfig对象
  绑定组件标签上接口*/
  /* 这边要搞一个pageName属性标记传递进来的接口到底显示哪一个 */
  /*     pageName: {
      type: String,
      require: true
    } */
  props: {
    TableContentConfig: {
      type: Object,
      require: true
    },
    //这个就是一个网络请求可以动态的切换数据，至于请求什么数据由外界
    //传递进来属性值动态决定，就解决了多个页面同时像一个组件网络请求
    //可以产生不同数据的方法
    systemDataName: {
      type: String,
      require: true
    }
  },
  //这个里面请求的是页面对应模块菜单组件的url
  //这个是用来请求接口url的---你这边没有接口这个不需要
  /* 这个里面参数是后台数据库设置返回用户数据并且
   提供了一些用户查询条件的参数
    */
  /* 注意事项：-------这个外界接口传进来的url名字千变万化
所以要达到灵活性的变化--------就是这个里面不是传的url
而是传递进来的是pageName
到时候根据外面传递进来的pageName动态值决定要显示那个接口
是应该由外界props属性上面传递的pageName动态决定的值
*/
  setup(props) {
    /* 记住后台三层结构封装的网络请求代码都放到这种最终成型的大的复合
    表格或者表单或者其他网络请求的复合组件-----这个中间层里面来 */
    /* 一般组件里面提交事件到vuex中通过axiospromise回调拿到数据 */
    const store = useStore()

    /* 2-------分页器里面的数据实现---------------------------------------------
双向绑定pageInfo
*/
    const pageInfo = ref({
      currentPage: 1,
      pageSize: 10
    })
    //对上面值pageInfo监听，发生改变发送网络请
    watch(pageInfo, (newVlue: any) => {
      //当值改变重新调用网络请求，注意哦我是用的假数据
      //接口里面对分页点击页码跳转和选择多少条的逻辑代码后端都封装好了，调属性即可
      //但是我这边不是用的接口在网络请求里面，要实现上面页码点击跳转和选择页码条数的
      //前端逻辑功能
      getPageData()
    })

    /* 2-------分页器里面的数据实现--------------------------------------------- */
    //发射事件到mutations里面去---注意有模块必须加模块名去筛选
    //一般网络请求的代码不抽到配置项对象里面
    //在公司里面接口规则的还好你请求的路径和你文件夹名字都对应好请求
    //但是如果接口做的不规范，名字随便起的情况下这些代码就要开始修改；

    /* ---------------------------------------------------------------- */
    //这个变量是所有:userData="systemDataName"页面像同一个组件标签上绑定一个
    //变量数据可以遍历出根据外界值不同的数据关键
    let systemDataName1 = ''
    let systemDataName: any = props.systemDataName
    if (typeof systemDataName === 'string') {
      systemDataName1 = systemDataName.replace(/\"/g, '')
    }
    /* 现在就是把page-content中间层里面网络请求
   代码不是只能请求一次吗

   现在把这个网络请求代码放到一个getPageData 函数中

   */
    //那边一点击搜索这边要把搜索对象查询条件传进来
    /* 假数据要把 queryInfo里面对象里面每个值进行模糊查询功能做出来
    再返回出去-----现在没这个功能
    */
    const getPageData = (queryInfo: any = {}) => {
      console.log('这个queryInfo是什么东西', queryInfo)

      //用假数据模拟网络请求发送
      store.commit('systemModule/getSystemData', {
        userUrl: '/users/list',
        // pageName:props.pageName,
        queryInfo: {
          //这个里面值不能写成固定的要写成分页器里面绑定的那个页码还是选择条数属性
          //它这边有接口传这两个值就实现点击分页，和选择页码功能
          //但是你要在system.ts网络请求里面去实现分页和页码用这两个变量
          currentPage: pageInfo.value.currentPage,
          Offset: pageInfo.value.currentPage * pageInfo.value.pageSize, //一般做分页用的,
          size: pageInfo.value.pageSize //每个页面请求到的数据显示多少条
        }
      })
    }
    //再把上面这个函数调用一下----这样网络请求就可以多次了不是一次了
    //其实就是兄弟组件之间怎么通信，其实可以把page-search里面时间发给他们
    //共同的父组件，由他们父组件函数里面调用page-content里面网络请求方法
    //不就哦了
    getPageData()
    //只是把网络请求用一个函数包裹，在setup里面调用一下
    //怎么一次的网络请求变成多次了：
    /*
如果setup()函数类似生命周期中的create()函数的话
那么在create()组件才创建的时候，里面调用的函数
是不是一直会调用


*/

    /* 前面搞了在vuex分一个sysytem系统模块里面去请求用户数据，把数据保存到
state里面绕了这么一大圈，只为了在用户管理界面use.vue中
可以获取到后台用户数据进行展示
*/
    //拿的用户数据列表网络请求数据
    //放到computed计算属性里面的目的：哪天数据改变了重新获取一下
    /* 这个用户列表里面数据获取到了怎么展示出来
用户数据后台都是一般用一个table进行展示----用elemnetplus里面的table组件
*/
    const systemDataNameData = computed(
      //这块有个优化方案就是我们以前在模板上面{{state.abc.systemModule[systemDataName1]}}
      //这样在模板里面写那么长代码是不是不好---所以会把这些代码
      //逻辑放到一个计算属性里面
      //拿这里面也是一样store.state.systemModule[systemDataName1]
      //上面这些应该放到getters里面函数里面返回
      //最后() => store.getters[system/systemDataName1]---利用的是计算属性
      () => store.state.systemModule[systemDataName1]
    )

    console.log(store.state.systemModule[systemDataName1])
    console.log(systemDataNameData)
    console.log(systemDataName)
    console.log(
      /* 在JS中对一个字符串里面任意位置截取的方法：slice
怎么从字符串后几位截取扔掉，留下前面的字符串整体方法如下
      */
      systemDataName.slice(0, systemDataName.length - 4),
      '拿到的是什么名字'
    )
    let dataCount = `${systemDataName.slice(
      0,
      systemDataName.length - 4
    )}Count`.replace(/\"/g, '')
    //拿的用户数据列表总数

    const totalCount = computed(() => store.state.systemModule[dataCount])

    /* 这块本来是表格元素生成的一个配置对象，这些配置都抽到对应组件文件夹里面去了 */
    //父组件去拿到table组件里面用户勾选表格哪一行的数据
    /* 表格上面header头部右侧handle插槽里面的新建用户按钮的点击事件 */

    /* ---------------------------------------------------------------- */

    const addNewUser = () => {}
    const EditNewUser = () => {}
    return {
      addNewUser,
      EditNewUser,
      systemDataNameData,
      totalCount,
      getPageData,
      pageInfo
    }
  }
})
</script>

<style scoped></style>
